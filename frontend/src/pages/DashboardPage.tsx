import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  AlertCircle, 
  Sliders, 
  HelpCircle,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TextInput } from '../components/TextInput';
import { FileUploader } from '../components/FileUploader';
import { ProcessingIndicator } from '../components/ProcessingIndicator';
import { useAnalysis } from '../context/AnalysisContext';
import { submitDocumentAnalysis } from '../services/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentResult,
    setCurrentResult,
    addHistoryItem,
    isAnalyzing,
    setIsAnalyzing,
    queryText,
    setQueryText,
    selectedFile,
    setSelectedFile,
    backendOnline,
  } = useAnalysis();

  const [threshold, setThreshold] = useState<number>(0.20);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAnalyze = queryText.trim().length >= 3 && selectedFile !== null && !isAnalyzing;

  const handleClearQuestion = () => {
    setQueryText('');
  };

  const handleNewAnalysis = () => {
    setQueryText('');
    setSelectedFile(null);
    setCurrentResult(null);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!canAnalyze || !selectedFile) return;

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const response = await submitDocumentAnalysis(
        queryText,
        selectedFile,
        threshold
      );

      // Save to context & history
      setCurrentResult(response);
      addHistoryItem(response);

      // Brief delay to allow the user to see completion before navigation
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/results');
      }, 500);

    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'An unexpected error occurred during document analysis.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Document Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask questions and find semantically relevant information in your documents.
        </p>
      </div>

      {/* Main Layout: Sidebar + Dashboard Center */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <Sidebar onNewAnalysis={handleNewAnalysis} />

        {/* Center Workspace */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Offline Engine Warning Banner */}
          {backendOnline === false && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-amber-950">FastAPI ML Backend Not Detected</p>
                <p className="text-amber-800">
                  The analysis engine runs locally on port 8000. Start it from your terminal using:
                </p>
                <code className="inline-block bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono text-xs">
                  python -m uvicorn app.main:app --reload --port 8000
                </code>
              </div>
            </div>
          )}

          {/* Inline Error Notice if any */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-rose-900">Analysis Error</p>
                  <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Two-Column Input Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Column 1: Question Input */}
            <TextInput
              value={queryText}
              onChange={setQueryText}
              onClear={handleClearQuestion}
              disabled={isAnalyzing}
            />

            {/* Column 2: Document Uploader */}
            <FileUploader
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              disabled={isAnalyzing}
            />
          </div>

          {/* Advanced Controls & Configuration Strip */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Sliders className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700">Minimum Relevance Cutoff</span>
                <span className="text-[11px] text-slate-400">Passages below this score are excluded from results</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                disabled={isAnalyzing}
                className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Primary Action Button Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={!canAnalyze}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-md ${
                canAnalyze
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-900/20 hover:scale-[1.005] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>
                {!selectedFile
                  ? 'Upload a Document to Proceed'
                  : queryText.trim().length < 3
                  ? 'Enter a Question to Proceed'
                  : 'Analyze Document'}
              </span>
            </button>

            {/* Helper Guidance under button */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 px-2">
              <span>Ready for instant semantic embedding &amp; cosine matching</span>
              <span>100% Client-Side Privacy Check</span>
            </div>
          </div>

        </div>
      </div>

      {/* Processing Animation / Modal */}
      <ProcessingIndicator
        isProcessing={isAnalyzing}
        error={errorMessage}
        onRetry={() => {
          setErrorMessage(null);
          handleStartAnalysis();
        }}
      />
    </div>
  );
};

