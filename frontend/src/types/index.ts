export interface PassageResult {
  rank: number;
  passage_id: number;
  text: string;
  similarity_score: number;
  similarity_percentage: number;
  page_number?: number | null;
  source_filename: string;
  char_count: number;
  word_count: number;
}

export interface AnalysisResponse {
  query: string;
  document_name: string;
  document_type: string;
  file_size_bytes: number;
  total_chunks_created: number;
  matched_passages_count: number;
  top_passages: PassageResult[];
  answer: string;
  answer_found: boolean;
  relevance_threshold: number;
  confidence_note: string;
  execution_time_seconds: number;
  timestamp: string;
  warning?: string | null;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  query: string;
  document_name: string;
  document_type: string;
  matched_count: number;
  top_similarity: number;
  result: AnalysisResponse;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
  model_name: string;
  device: string;
  supported_formats: string[];
}

export interface AnalysisProgressStage {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

