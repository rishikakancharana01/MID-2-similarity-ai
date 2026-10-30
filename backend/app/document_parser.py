import io
import re
from typing import List, Optional
from dataclasses import dataclass


@dataclass
class DocumentChunk:
    chunk_id: int
    text: str
    page_number: Optional[int]
    char_start: int
    char_end: int
    word_count: int


@dataclass
class ParsedDocument:
    filename: str
    file_type: str
    total_characters: int
    total_words: int
    total_pages: Optional[int]
    chunks: List[DocumentChunk]


def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-printable characters."""
    if not text:
        return ""
    # Replace multiple spaces/newlines with a clean readable spacing
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(
    text: str,
    page_number: Optional[int] = None,
    start_chunk_id: int = 0,
    target_words: int = 90,
    overlap_words: int = 25,
) -> List[DocumentChunk]:
    """
    Split text into overlapping semantic chunks based on sentences and word boundaries.
    Overlapping ensures that context bridging across sentences is not lost during similarity embedding.
    """
    cleaned = clean_text(text)
    if not cleaned:
        return []

    words = cleaned.split()
    if not words:
        return []

    chunks: List[DocumentChunk] = []
    chunk_id = start_chunk_id
    idx = 0
    total_words = len(words)

    # If document is short, treat entire text as a single chunk
    if total_words <= target_words:
        chunk_str = " ".join(words)
        chunks.append(
            DocumentChunk(
                chunk_id=chunk_id,
                text=chunk_str,
                page_number=page_number,
                char_start=0,
                char_end=len(chunk_str),
                word_count=total_words,
            )
        )
        return chunks

    while idx < total_words:
        end_idx = min(idx + target_words, total_words)
        chunk_words = words[idx:end_idx]
        chunk_str = " ".join(chunk_words)

        chunks.append(
            DocumentChunk(
                chunk_id=chunk_id,
                text=chunk_str,
                page_number=page_number,
                char_start=idx,
                char_end=end_idx,
                word_count=len(chunk_words),
            )
        )
        chunk_id += 1

        if end_idx >= total_words:
            break

        idx += target_words - overlap_words

    return chunks


def parse_txt(filename: str, content: bytes) -> ParsedDocument:
    """Extract and chunk plain text files with robust encoding detection."""
    text = ""
    for encoding in ("utf-8", "utf-8-sig", "latin-1", "cp1252"):
        try:
            text = content.decode(encoding)
            break
        except UnicodeDecodeError:
            continue

    cleaned = clean_text(text)
    if not cleaned or len(cleaned.strip()) < 10:
        raise ValueError(
            "The uploaded TXT file is empty or does not contain sufficient text for analysis."
        )

    chunks = chunk_text(cleaned, page_number=None, start_chunk_id=0)
    return ParsedDocument(
        filename=filename,
        file_type="txt",
        total_characters=len(cleaned),
        total_words=len(cleaned.split()),
        total_pages=1,
        chunks=chunks,
    )


def parse_pdf(filename: str, content: bytes) -> ParsedDocument:
    """Extract text from PDF while preserving page numbers using PyMuPDF (fitz)."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise RuntimeError("PyMuPDF is required to process PDF files. Please install 'PyMuPDF'.")

    try:
        doc = fitz.open(stream=content, filetype="pdf")
    except Exception as e:
        raise ValueError(f"Unable to read PDF file. The file may be corrupted or encrypted: {str(e)}")

    all_chunks: List[DocumentChunk] = []
    total_text = ""
    chunk_counter = 0

    try:
        page_count = len(doc)
        if page_count == 0:
            raise ValueError("The uploaded PDF file contains zero pages.")

        for page_idx in range(page_count):
            page = doc[page_idx]
            page_num = page_idx + 1
            page_text = clean_text(page.get_text("text"))
            if page_text:
                total_text += f"\n{page_text}"
                page_chunks = chunk_text(
                    page_text,
                    page_number=page_num,
                    start_chunk_id=chunk_counter,
                    target_words=100,
                    overlap_words=25,
                )
                chunk_counter += len(page_chunks)
                all_chunks.extend(page_chunks)

        if not total_text.strip():
            raise ValueError(
                "The PDF contains no extractable digital text. If this is a scanned document or image, "
                "Optical Character Recognition (OCR) is required before semantic analysis."
            )

        if not all_chunks:
            raise ValueError("No meaningful text passages could be extracted from this PDF.")

        return ParsedDocument(
            filename=filename,
            file_type="pdf",
            total_characters=len(total_text),
            total_words=len(total_text.split()),
            total_pages=page_count,
            chunks=all_chunks,
        )
    finally:
        doc.close()


def parse_docx(filename: str, content: bytes) -> ParsedDocument:
    """Extract text and structure from DOCX documents."""
    try:
        import docx
    except ImportError:
        raise RuntimeError("python-docx is required to process DOCX files. Please install 'python-docx'.")

    try:
        file_stream = io.BytesIO(content)
        doc = docx.Document(file_stream)
    except Exception as e:
        raise ValueError(f"Unable to read DOCX file. The file may be corrupt: {str(e)}")

    paragraphs = []
    # Extract body paragraphs
    for p in doc.paragraphs:
        txt = clean_text(p.text)
        if txt:
            paragraphs.append(txt)

    # Also extract any table content
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(clean_text(cell.text) for cell in row.cells if clean_text(cell.text))
            if row_text:
                paragraphs.append(row_text)

    combined_text = "\n\n".join(paragraphs)
    if not combined_text.strip():
        raise ValueError("The uploaded DOCX document contains no readable text content.")

    chunks = chunk_text(combined_text, page_number=None, start_chunk_id=0)

    return ParsedDocument(
        filename=filename,
        file_type="docx",
        total_characters=len(combined_text),
        total_words=len(combined_text.split()),
        total_pages=None,
        chunks=chunks,
    )


def extract_document(filename: str, content: bytes) -> ParsedDocument:
    """
    Dispatcher to route file extraction based on extension.
    Validates file format, ensures safe processing, and returns structured chunks.
    """
    lower_name = filename.lower()

    if lower_name.endswith(".txt"):
        return parse_txt(filename, content)
    elif lower_name.endswith(".pdf"):
        return parse_pdf(filename, content)
    elif lower_name.endswith(".docx"):
        return parse_docx(filename, content)
    else:
        ext = filename.split(".")[-1] if "." in filename else "unknown"
        raise ValueError(
            f"Unsupported file format '.{ext}'. Supported formats are: PDF, DOCX, and TXT."
        )

