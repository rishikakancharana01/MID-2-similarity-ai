import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  FileText, 
  Search, 
  Clock, 
  Layers, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  Share2,
  Copy,
  Info
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { AnswerCard } from '../components/AnswerCard';
import { PassageCard } from '../components/PassageCard';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResult, setSelectedFile, setQueryText } = useAnalysis();

  const handleNewAnalysis = () => {
    setSelectedFile(null);
    setQueryText('');
    navigate('/dashboard');
  };

  const handleAnalyzeSameDocument = () => {
    // Keep file, clear question
    setQueryText('');
    navigate('/dashboard');
  };

  // If no result is loaded yet, show empty prompt
  if (!currentResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Analysis Results Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You haven't run a document analysis in this session yet. Upload a document and ask a question to view results here.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Go to Analysis Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs text-slate-400">/ Analysis Results</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAnalyzeSameDocument}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Ask Another Question</span>
          </button>

          <button
            type="button"
            onClick={handleNewAnalysis}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Query & Document Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Question Display */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Original Query</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              "{currentResult.query}"
            </h2>
          </div>

          {/* Document & Pipeline Metadata */}
          <div className="lg:col-span-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Document:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={currentResult.document_name}>
                {currentResult.document_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Document Type:</span>
              <span className="font-mono font-medium text-slate-700">{currentResult.document_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Latency:</span>
              <span className="font-mono text-emerald-700 font-medium">{currentResult.execution_time_seconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chunks Indexed:</span>
              <span className="font-medium text-slate-700">{currentResult.total_chunks_created} passages</span>
            </div>
          </div>

        </div>
      </div>

      {/* ANSWER CARD */}
      <AnswerCard
        answer={currentResult.answer}
        answerFound={currentResult.answer_found}
        topPassages={currentResult.top_passages}
        relevanceThreshold={currentResult.relevance_threshold}
      />

      {/* SIMILARITY RESULTS PASSAGES */}
      <div className="space-y-4">
        
        {/* Section Heading & Educational Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Most Relevant Passages</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {currentResult.top_passages.length} matches
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked in descending order of mathematical cosine similarity
            </p>
          </div>

          {/* Academic Reminder */}
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Scores reflect vector angle, not factual certainty</span>
          </div>
        </div>

        {/* Passage Cards List */}
        {currentResult.top_passages.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No document passages exceeded the minimum relevance threshold of {(currentResult.relevance_threshold * 100).toFixed(0)}%.
          </div>
        ) : (
          <div className="space-y-3.5">
            {currentResult.top_passages.map((passage) => (
              <PassageCard key={passage.rank} passage={passage} />
            ))}
          </div>
        )}

      </div>

      {/* Bottom Educational Banner */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Understanding Similarity vs. Factuality:</strong> Cosine similarity computes semantic closeness between dense high-dimensional vectors. A high score means the passage is conceptually and topically aligned with your query, but always review the extracted evidence directly to corroborate specific factual claims.
        </p>
      </div>

    </div>
  );
};

