import os
import sys
import logging
from pathlib import Path
from typing import List, Tuple
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from app.document_parser import DocumentChunk
    from app.schemas import PassageResult
except ImportError:
    from backend.app.document_parser import DocumentChunk
    from backend.app.schemas import PassageResult

logger = logging.getLogger("similarity_engine")

# Load model name from environment or default to fast, high-quality standard
MODEL_NAME = os.getenv("SIMILARITY_MODEL", "all-MiniLM-L6-v2")
DEFAULT_THRESHOLD = float(os.getenv("MIN_RELEVANCE_THRESHOLD", "0.20"))


class SemanticSimilarityEngine:
    _instance = None
    _model = None

    def __init__(self, model_name: str = MODEL_NAME):
        self.model_name = model_name

    def load_model(self):
        """Lazy load or initialize the SentenceTransformer model once."""
        if self._model is None:
            logger.info(f"Loading SentenceTransformer model '{self.model_name}'...")
            try:
                self._model = SentenceTransformer(self.model_name)
                logger.info(f"Model '{self.model_name}' loaded successfully on device: {self._model.device}")
            except Exception as e:
                logger.error(f"Failed to load model {self.model_name}: {e}")
                raise RuntimeError(
                    f"Could not load SentenceTransformer model '{self.model_name}'. "
                    f"Ensure internet connectivity for initial download or check model name. Error: {e}"
                )

    @property
    def model(self) -> SentenceTransformer:
        if self._model is None:
            self.load_model()
        return self._model

    @property
    def device_name(self) -> str:
        if self._model is not None:
            return str(self._model.device)
        return "cpu"

    def compute_similarity(
        self,
        query: str,
        chunks: List[DocumentChunk],
        source_filename: str,
        top_k: int = 5,
        threshold: float = DEFAULT_THRESHOLD,
    ) -> Tuple[List[PassageResult], int]:
        """
        Calculates cosine similarity between user query embedding and each chunk embedding.
        Returns:
            - Ranked list of top PassageResult objects that exceed the relevance threshold.
            - Total number of passages that exceeded the threshold.
        """
        if not query.strip():
            raise ValueError("Query string cannot be empty.")

        if not chunks:
            raise ValueError("No text chunks available to calculate similarity against.")

        # 1. Generate dense vector embedding for user query
        # Shape: (1, embedding_dimension)
        query_embedding = self.model.encode(
            [query.strip()],
            convert_to_numpy=True,
            show_progress_bar=False,
            normalize_embeddings=True,
        )

        # 2. Extract passage texts and generate dense embeddings for all document chunks
        passage_texts = [c.text for c in chunks]
        chunk_embeddings = self.model.encode(
            passage_texts,
            convert_to_numpy=True,
            show_progress_bar=False,
            normalize_embeddings=True,
        )

        # 3. Compute cosine similarity matrix between query and all chunks using scikit-learn
        # Since embeddings are normalized, dot product equals cosine similarity
        cosine_matrix = cosine_similarity(query_embedding, chunk_embeddings)
        raw_scores = cosine_matrix[0]  # Array of floats corresponding to each chunk

        # 4. Pair chunks with their scores
        scored_chunks = []
        for i, score in enumerate(raw_scores):
            float_score = float(score)
            # Clip between 0 and 1 for clean interpretation
            normalized_score = max(0.0, min(1.0, float_score))
            scored_chunks.append((chunks[i], normalized_score))

        # 5. Sort strictly in descending order of similarity score
        scored_chunks.sort(key=lambda item: item[1], reverse=True)

        # 6. Filter by threshold
        qualifying_chunks = [item for item in scored_chunks if item[1] >= threshold]
        total_qualifying = len(qualifying_chunks)

        # Take up to top_k
        top_selected = qualifying_chunks[:top_k]

        # 7. Convert to structured PassageResult schemas with rank
        results: List[PassageResult] = []
        for rank_idx, (chunk, score) in enumerate(top_selected, start=1):
            percentage = round(score * 100.0, 1)
            results.append(
                PassageResult(
                    rank=rank_idx,
                    passage_id=chunk.chunk_id,
                    text=chunk.text,
                    similarity_score=round(score, 4),
                    similarity_percentage=percentage,
                    page_number=chunk.page_number,
                    source_filename=source_filename,
                    char_count=len(chunk.text),
                    word_count=chunk.word_count,
                )
            )

        return results, total_qualifying


# Singleton engine instance
_engine_instance: SemanticSimilarityEngine = None


def get_similarity_engine() -> SemanticSimilarityEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = SemanticSimilarityEngine()
    return _engine_instance

