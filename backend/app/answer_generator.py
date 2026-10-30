import os
import sys
import re
import logging
from pathlib import Path
from typing import List, Tuple

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from app.schemas import PassageResult
except ImportError:
    from backend.app.schemas import PassageResult

logger = logging.getLogger("answer_generator")


def generate_extractive_answer(
    query: str,
    passages: List[PassageResult],
    threshold: float
) -> Tuple[str, bool]:
    """
    Constructs a deterministic, evidence-grounded answer directly from the top retrieved passages.
    Zero hallucination risk: strictly references text that was found and scored by the similarity engine.
    """
    if not passages:
        return (
            f"No passages in the uploaded document met the minimum semantic relevance threshold "
            f"({round(threshold * 100, 1)}%). The document does not contain sufficient evidence "
            f"to reliably answer: '{query}'.",
            False
        )

    # Inspect the top passage
    top_p = passages[0]
    top_score_pct = top_p.similarity_percentage

    # Break top passages into sentences to find best focal points
    sentences = re.split(r"(?<=[.!?])\s+", top_p.text)
    primary_sentence = sentences[0] if sentences else top_p.text

    # Build structured synthesis
    page_ref = f" (Page {top_p.page_number})" if top_p.page_number else f" (Passage {top_p.passage_id + 1})"

    paragraphs = []
    paragraphs.append(
        f"**Primary Finding** (Similarity: {top_score_pct}%{page_ref}):\n"
        f"\"{primary_sentence.strip()}\""
    )

    if len(sentences) > 1:
        extended_context = " ".join(sentences[1:4]).strip()
        if extended_context:
            paragraphs.append(f"**Supporting Context**:\n\"{extended_context}\"")

    if len(passages) > 1:
        secondary_p = passages[1]
        sec_page_ref = f"Page {secondary_p.page_number}" if secondary_p.page_number else f"Passage {secondary_p.passage_id + 1}"
        paragraphs.append(
            f"**Corroborating Evidence** ({sec_page_ref}, {secondary_p.similarity_percentage}% match):\n"
            f"\"{secondary_p.text[:220].strip()}...\""
        )

    paragraphs.append(
        "_Note: This answer is strictly extracted from the highest-ranked semantic passages "
        "identified in your document without speculative interpretation._"
    )

    return "\n\n".join(paragraphs), True


def generate_llm_answer(query: str, passages: List[PassageResult]) -> str:
    """
    Optional LLM grounding if an API key is supplied in .env.
    Protects against prompt injection and insists on evidence-grounded responses.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not gemini_key and not openai_key:
        return None

    # Format the retrieved evidence
    context_chunks = []
    for p in passages[:4]:
        loc = f"Page {p.page_number}" if p.page_number else f"Passage {p.passage_id}"
        context_chunks.append(f"[{loc}] {p.text}")
    combined_context = "\n\n".join(context_chunks)

    system_prompt = (
        "You are an evidence-grounded research assistant. Answer the user's question ONLY using the "
        "retrieved document excerpts provided below. If the excerpts do not contain enough information "
        "to answer, clearly state: 'The provided document excerpts do not contain sufficient evidence to answer this question.' "
        "Do not invent facts or extrapolate beyond what is explicitly written."
    )
    user_prompt = f"Question: {query}\n\nRetrieved Document Excerpts:\n{combined_context}"

    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)
            response = model.generate_content(user_prompt)
            if response.text:
                return f"{response.text.strip()}\n\n_(Synthesized by Gemini 1.5 Flash grounded in retrieved passages)_"
        except Exception as e:
            logger.warning(f"Optional Gemini call failed, falling back to extractive: {e}")

    if openai_key:
        try:
            import openai
            client = openai.OpenAI(api_key=openai_key)
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
            )
            ans = completion.choices[0].message.content.strip()
            return f"{ans}\n\n_(Synthesized by GPT-4o-mini grounded in retrieved passages)_"
        except Exception as e:
            logger.warning(f"Optional OpenAI call failed, falling back to extractive: {e}")

    return None


def generate_answer(
    query: str,
    passages: List[PassageResult],
    threshold: float
) -> Tuple[str, bool]:
    """
    Main answer dispatcher. Attempts LLM synthesis if configured, otherwise uses
    deterministic high-precision extractive answer generation.
    """
    if not passages:
        return generate_extractive_answer(query, passages, threshold)

    llm_answer = generate_llm_answer(query, passages)
    if llm_answer:
        return llm_answer, True

    return generate_extractive_answer(query, passages, threshold)

