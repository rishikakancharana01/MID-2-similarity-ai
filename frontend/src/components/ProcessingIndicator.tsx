import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Binary, 
  Sliders, 
  FileSearch,
  BookOpenCheck
} from 'lucide-react';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const STAGES = [
  { id: 1, title: 'Validating Input', desc: 'Checking query length and document format compatibility', icon: FileText },
  { id: 2, title: 'Extracting Document Text', desc: 'Parsing text and preserving page structure', icon: FileSearch },
  { id: 3, title: 'Dividing into Passages', desc: 'Chunking text into overlapping semantic windows', icon: Sliders },
  { id: 4, title: 'Generating Semantic Embeddings', desc: 'Mapping text into 384-dimensional vector space (SentenceTransformers)', icon: Binary },
  { id: 5, title: 'Calculating Cosine Similarity', desc: 'Computing mathematical angular distance between query and passages', icon: Sparkles },
  { id: 6, title: 'Ranking Relevant Passages', desc: 'Sorting passages strictly by descending cosine score', icon: Sliders },
  { id: 7, title: 'Synthesizing Grounded Answer', desc: 'Formulating evidence-based answer from top excerpts', icon: BookOpenCheck },
];

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  isProcessing,
  error,
  onRetry,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStepIndex(0);
      return;
    }

    // Advance step sequentially to visually guide user through real pipeline stages
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(stepInterval);
  }, [isProcessing]);

  if (!isProcessing && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${error ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
              {error ? <AlertCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {error ? 'Analysis Failed' : 'Analyzing Document'}
              </h3>
              <p className="text-xs text-slate-500">
                {error ? 'An error was encountered during execution' : 'Sentence Transformers & Cosine Similarity Pipeline'}
              </p>
            </div>
          </div>

          {!error && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Stage {currentStepIndex + 1} of {STAGES.length}
            </span>
          )}
        </div>

        {/* Error View */}
        {error ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Backend Response Error
              </p>
              <p className="text-xs text-rose-700 leading-relaxed font-mono bg-white/70 p-2.5 rounded border border-rose-200/60">
                {error}
              </p>
              <p className="text-[11px] text-rose-600">
                Tip: Verify that your FastAPI server is running with <code className="bg-rose-100 px-1 rounded">uvicorn app.main:app --reload</code> on port 8000 and that the uploaded file is valid.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                >
                  Dismiss &amp; Retry
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Processing Steps List */
          <div className="space-y-3">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-50/80 border border-blue-200 shadow-sm'
                      : isCompleted
                      ? 'bg-slate-50/50 opacity-80'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                        {stage.id}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                      {stage.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

