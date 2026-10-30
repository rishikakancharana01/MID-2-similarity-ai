import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  FileText, 
  Clock, 
  Layers, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { HistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearHistory, setCurrentResult } = useAnalysis();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenItem = (item: HistoryItem) => {
    setCurrentResult(item.result);
    navigate('/results');
  };

  const handleConfirmClear = () => {
    clearHistory();
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-blue-600" />
            <span>Analysis History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past document analyses from your current browser session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Privacy & Storage Limitation Notice */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-start gap-3 text-xs text-slate-600">
        <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-700">Client-Side Session Storage Only</p>
          <p className="text-slate-500">
            For academic privacy and data integrity, analysis records are preserved strictly in your temporary browser session. 
            Raw files and sensitive document bodies are never permanently archived in database storage.
          </p>
        </div>
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Analysis History Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Any documents you examine during this session will be indexed here for quick retrieval.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Perform Your First Analysis</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timestamp}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    {item.document_name}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded uppercase text-[10px] font-bold">
                    {item.document_type}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  "{item.query}"
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    {item.matched_count} matching passages
                  </span>
                  <span>•</span>
                  <span className="font-medium text-blue-600">
                    Top Similarity: {item.top_similarity}%
                  </span>
                </div>
              </div>

              {/* View Action */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors shadow-sm"
                >
                  <span>View Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Clear Analysis History?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will remove all {history.length} past query sessions from your temporary browser cache. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Yes, Clear History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

