import sys
from pathlib import Path
import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from app.document_parser import clean_text, chunk_text, extract_document
    from app.answer_generator import generate_extractive_answer
    from app.schemas import PassageResult
except ImportError:
    from backend.app.document_parser import clean_text, chunk_text, extract_document
    from backend.app.answer_generator import generate_extractive_answer
    from backend.app.schemas import PassageResult


def test_clean_text():
    raw = "  This   has  weird \r\n whitespace   \n\n\n and tabs\t\t.  "
    cleaned = clean_text(raw)
    assert cleaned == "This has weird \n whitespace \n\n and tabs ."


def test_chunk_text_short():
    short_text = "This is a quick summary with few words."
    chunks = chunk_text(short_text, page_number=1, start_chunk_id=0, target_words=50)
    assert len(chunks) == 1
    assert chunks[0].chunk_id == 0
    assert chunks[0].page_number == 1
    assert "quick summary" in chunks[0].text


def test_chunk_text_overlap():
    words = [f"word{i}" for i in range(150)]
    long_text = " ".join(words)
    chunks = chunk_text(long_text, page_number=2, start_chunk_id=0, target_words=50, overlap_words=10)
    assert len(chunks) > 1
    # Check that subsequent chunk contains overlapping words
    chunk0_words = chunks[0].text.split()
    chunk1_words = chunks[1].text.split()
    # Overlap was 10 words, so chunk0's last 10 words should match chunk1's first 10 words
    assert chunk0_words[-10:] == chunk1_words[:10]


def test_extract_document_txt():
    sample_bytes = b"Hello world! This is a valid document with adequate length for testing."
    doc = extract_document("notes.txt", sample_bytes)
    assert doc.file_type == "txt"
    assert len(doc.chunks) >= 1
    assert "Hello world" in doc.chunks[0].text


def test_extract_document_empty_fails():
    with pytest.raises(ValueError):
        extract_document("empty.txt", b"   ")


def test_extract_unsupported_format_fails():
    with pytest.raises(ValueError) as excinfo:
        extract_document("presentation.pptx", b"fake binary data")
    assert "Unsupported file format" in str(excinfo.value)


def test_answer_generator_empty_passages():
    answer, found = generate_extractive_answer("What is the goal?", [], threshold=0.25)
    assert found is False
    assert "minimum semantic relevance threshold" in answer


def test_answer_generator_with_passages():
    sample_passage = PassageResult(
        rank=1,
        passage_id=0,
        text="The primary research objective is to analyze semantic similarity in documents.",
        similarity_score=0.88,
        similarity_percentage=88.0,
        page_number=1,
        source_filename="research.txt",
        char_count=80,
        word_count=10,
    )
    answer, found = generate_extractive_answer("What is the objective?", [sample_passage], threshold=0.2)
    assert found is True
    assert "Primary Finding" in answer
    assert "The primary research objective" in answer
    assert "88.0%" in answer

