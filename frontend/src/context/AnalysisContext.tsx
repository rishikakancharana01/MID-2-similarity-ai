import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisResponse, HistoryItem, HealthStatus } from '../types';
import { checkBackendHealth } from '../services/api';

interface AnalysisContextType {
  currentResult: AnalysisResponse | null;
  setCurrentResult: (result: AnalysisResponse | null) => void;
  history: HistoryItem[];
  addHistoryItem: (result: AnalysisResponse) => void;
  clearHistory: () => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (state: boolean) => void;
  backendOnline: boolean | null;
  backendInfo: HealthStatus | null;
  checkHealth: () => Promise<void>;
  queryText: string;
  setQueryText: (text: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'similarity_ai_history_v1';

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentResult, setCurrentResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [backendInfo, setBackendInfo] = useState<HealthStatus | null>(null);
  const [queryText, setQueryText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize history from sessionStorage/localStorage (non-sensitive analysis metadata only)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = sessionStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const checkHealth = async () => {
    try {
      const status = await checkBackendHealth();
      setBackendOnline(true);
      setBackendInfo(status);
    } catch {
      setBackendOnline(false);
      setBackendInfo(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // periodically ping every 30s
    return () => clearInterval(interval);
  }, []);

  const addHistoryItem = (result: AnalysisResponse) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      query: result.query,
      document_name: result.document_name,
      document_type: result.document_type,
      matched_count: result.matched_passages_count,
      top_similarity: result.top_passages[0]?.similarity_percentage || 0,
      result: result,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 30); // keep up to 30 recent analyses
      try {
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Unable to persist history to sessionStorage:', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      sessionStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Unable to clear sessionStorage:', e);
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentResult,
        setCurrentResult,
        history,
        addHistoryItem,
        clearHistory,
        isAnalyzing,
        setIsAnalyzing,
        backendOnline,
        backendInfo,
        checkHealth,
        queryText,
        setQueryText,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

