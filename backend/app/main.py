import os
import sys
import time
from datetime import datetime
import logging
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Automatically add the backend directory to sys.path so imports work from any working directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Load environment variables
load_dotenv()

try:
    from app.schemas import HealthResponse, AnalysisResponse
    from app.document_parser import extract_document
    from app.similarity_engine import get_similarity_engine, DEFAULT_THRESHOLD, MODEL_NAME
    from app.answer_generator import generate_answer
except ImportError:
    from backend.app.schemas import HealthResponse, AnalysisResponse
    from backend.app.document_parser import extract_document
    from backend.app.similarity_engine import get_similarity_engine, DEFAULT_THRESHOLD, MODEL_NAME
    from backend.app.answer_generator import generate_answer

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("similarity_app")

MAX_FILE_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15")) * 1024 * 1024

app = FastAPI(
    title="Similarity AI — Intelligent Document Analysis API",
    description="Real semantic document search and question answering using Sentence Transformers and scikit-learn.",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve full interactive web application directly from the backend
STATIC_DIR = BACKEND_DIR / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", include_in_schema=False)
def serve_home():
    """Serves the complete interactive Similarity AI website directly."""
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"message": "Similarity AI Engine is running. Visit /api/health for status."}


@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Returns engine health, model specifications, and execution environment."""
    engine = get_similarity_engine()
    return HealthResponse(
        status="healthy",
        app_name="Similarity AI Engine",
        version="1.0.0",
        model_name=MODEL_NAME,
        device=engine.device_name,
        supported_formats=["pdf", "docx", "txt"],
    )


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_document(
    query: str = Form(..., description="User question or semantic description to search for"),
    file: UploadFile = File(..., description="Uploaded document (PDF, DOCX, or TXT)"),
    threshold: float = Form(DEFAULT_THRESHOLD, description="Minimum cosine similarity cutoff (0.0 to 1.0)"),
):
    """
    Analyzes an uploaded document:
    1. Validates query and document format/size.
    2. Extracts clean text and chunks while preserving page numbers.
    3. Generates dense embeddings using SentenceTransformers.
    4. Calculates cosine similarity with scikit-learn.
    5. Returns ranked matching passages and an evidence-grounded answer.
    """
    start_time = time.time()

    # 1. Validation: Query
    clean_query = query.strip() if query else ""
    if not clean_query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The question field cannot be empty. Please enter a valid question or topic.",
        )

    if len(clean_query) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The question is too short. Please provide at least 3 characters.",
        )

    # 2. Validation: File presence & format
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No document file was uploaded. Please upload a PDF, DOCX, or TXT file.",
        )

    filename = file.filename
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{ext}'. Supported formats are: PDF (.pdf), Word (.docx), and Plain Text (.txt).",
        )

    # 3. Read file content safely
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file stream: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read the uploaded file. Please verify the file and try again.",
        )

    file_size = len(content)
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes). Please upload a valid document.",
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        mb_limit = MAX_FILE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum upload size of {mb_limit} MB. Please upload a smaller document.",
        )

    # 4. Document Text Extraction & Chunking
    try:
        parsed_doc = extract_document(filename, content)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected parsing error for {filename}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing document content: {str(e)}",
        )

    if not parsed_doc.chunks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any meaningful text passages from the uploaded document.",
        )

    # 5. Semantic Vector Similarity Calculation
    try:
        engine = get_similarity_engine()
        top_passages, matched_count = engine.compute_similarity(
            query=clean_query,
            chunks=parsed_doc.chunks,
            source_filename=filename,
            top_k=5,
            threshold=threshold,
        )
    except Exception as e:
        logger.error(f"Similarity computation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating embeddings or calculating similarity.",
        )

    # 6. Evidence-grounded Answer Generation
    answer_text, has_answer = generate_answer(clean_query, top_passages, threshold)

    elapsed_seconds = round(time.time() - start_time, 3)

    return AnalysisResponse(
        query=clean_query,
        document_name=filename,
        document_type=parsed_doc.file_type.upper(),
        file_size_bytes=file_size,
        total_chunks_created=len(parsed_doc.chunks),
        matched_passages_count=matched_count,
        top_passages=top_passages,
        answer=answer_text,
        answer_found=has_answer,
        relevance_threshold=threshold,
        confidence_note=(
            "Similarity scores reflect semantic vector closeness (cosine angle) between "
            "embeddings and rank relevant passages. They do not denote factual correctness probability."
        ),
        execution_time_seconds=elapsed_seconds,
        timestamp=datetime.utcnow().isoformat() + "Z",
        warning=None if has_answer else "No passages exceeded the relevance threshold. Check your query or document content.",
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port)

