import { AnalysisResponse, HealthStatus } from '../types';

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Backend reported status ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Backend health check error:', error);
    throw new Error(
      error.message || 'Unable to connect to the backend server. Please ensure the FastAPI backend is running on http://localhost:8000.'
    );
  }
}

export async function submitDocumentAnalysis(
  query: string,
  file: File,
  threshold: number = 0.20
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('query', query.trim());
  formData.append('file', file);
  formData.append('threshold', threshold.toString());

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = `Analysis request failed (${res.status})`;
      try {
        const errorJson = await res.json();
        if (errorJson && errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch (parseErr) {
        // Fall back to status text if response is not JSON
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data: AnalysisResponse = await res.json();
    return data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Cannot reach backend server. Please make sure the FastAPI server is running on http://localhost:8000.'
      );
    }
    throw error;
  }
}

