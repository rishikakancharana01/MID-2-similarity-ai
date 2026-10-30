import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FileText, 
  Hash, 
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { PassageResult } from '../types';

interface PassageCardProps {
  passage: PassageResult;
}

export const PassageCard: React.FC<PassageCardProps> = ({ passage }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(passage.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine color theme based on similarity score percentage
  const getScoreTheme = (pct: number) => {
    if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (pct >= 50) return { bar: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (pct >= 30) return { bar: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  };

  const theme = getScoreTheme(passage.similarity_percentage);
  const isTruncated = passage.text.length > 220;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-sm transition-all hover:shadow-md overflow-hidden">
      {/* Top Header */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="px-5 py-3.5 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-100 select-none"
      >
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm">
            #{passage.rank}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {passage.source_filename}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
              {passage.page_number ? `Page ${passage.page_number}` : `Passage Block ${passage.passage_id + 1}`}
            </span>
          </div>
        </div>

        {/* Similarity Score Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Similarity</span>
              <span className={`text-sm font-bold font-mono ${theme.text}`}>
                {passage.similarity_percentage}%
              </span>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, passage.similarity_percentage))}%` }}
              />
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Copy passage excerpt"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Toggle Expand Icon */}
          <div className="text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Passage Excerpt Body */}
      <div className="p-5">
        <p className="text-slate-700 text-sm leading-relaxed font-sans">
          {expanded || !isTruncated ? (
            passage.text
          ) : (
            <>
              {passage.text.substring(0, 220)}...
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="ml-1 text-blue-600 hover:underline font-medium text-xs inline-flex items-center"
              >
                Read more
              </button>
            </>
          )}
        </p>

        {/* Bottom meta stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>{passage.word_count} words</span>
            <span>•</span>
            <span>{passage.char_count} chars</span>
            <span>•</span>
            <span className="font-mono">Cosine: {passage.similarity_score.toFixed(4)}</span>
          </div>

          {expanded && isTruncated && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

