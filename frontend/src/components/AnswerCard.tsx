import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { PassageResult } from '../types';

interface AnswerCardProps {
  answer: string;
  answerFound: boolean;
  topPassages: PassageResult[];
  relevanceThreshold: number;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  answerFound,
  topPassages,
  relevanceThreshold,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Generated Answer</h3>
            <p className="text-xs text-slate-300">
              {answerFound ? 'Extracted & synthesized from document evidence' : 'Insufficient Evidence Notice'}
            </p>
          </div>
        </div>

        {answerFound && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm active:scale-95"
            title="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Answer</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Answer Content */}
      <div className="p-6">
        {!answerFound ? (
          /* Insufficient Evidence Warning */
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-amber-900">Insufficient Evidence Found in Document</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {answer}
              </p>
              <p className="text-[11px] text-amber-600 pt-1">
                Threshold set at {(relevanceThreshold * 100).toFixed(0)}%. Try rephrasing your question or checking whether the uploaded document covers this topic.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Formatted Text */}
            <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {answer}
            </div>

            {/* Source References */}
            {topPassages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-600">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Grounding Source Citations:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topPassages.map((p) => (
                    <div
                      key={p.rank}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900"
                    >
                      <span className="font-bold text-blue-700">Ref #{p.rank}:</span>
                      <span>
                        {p.page_number ? `Page ${p.page_number}` : `Passage ${p.passage_id + 1}`}
                      </span>
                      <span className="text-[11px] font-mono text-blue-600 bg-blue-100/70 px-1.5 py-0.2 rounded font-medium">
                        {p.similarity_percentage}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Grounded strictly on semantic cosine rankings</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified evidence
        </span>
      </div>
    </div>
  );
};

