from typing import List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "healthy"
    app_name: str = "Similarity AI Engine"
    version: str = "1.0.0"
    model_name: str
    device: str
    supported_formats: List[str] = ["pdf", "docx", "txt"]


class PassageResult(BaseModel):
    rank: int = Field(..., description="Rank in order of descending cosine similarity")
    passage_id: int = Field(..., description="Index of chunk in document")
    text: str = Field(..., description="Excerpt content of the matching passage")
    similarity_score: float = Field(..., description="Raw cosine similarity score (between 0.0 and 1.0)")
    similarity_percentage: float = Field(..., description="Similarity expressed as a percentage")
    page_number: Optional[int] = Field(None, description="PDF page number if available (1-based)")
    source_filename: str = Field(..., description="Original name of the uploaded document")
    char_count: int = Field(..., description="Length of passage in characters")
    word_count: int = Field(..., description="Length of passage in words")


class AnalysisResponse(BaseModel):
    query: str
    document_name: str
    document_type: str
    file_size_bytes: int
    total_chunks_created: int
    matched_passages_count: int
    top_passages: List[PassageResult]
    answer: str
    answer_found: bool
    relevance_threshold: float
    confidence_note: str
    execution_time_seconds: float
    timestamp: str
    warning: Optional[str] = None

