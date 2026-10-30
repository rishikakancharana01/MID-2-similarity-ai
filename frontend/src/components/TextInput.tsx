import React from 'react';
import { HelpCircle, X, Sparkles, AlertCircle } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const SAMPLE_QUESTIONS = [
  "What are the primary objectives of this research?",
  "Summarize the key findings and conclusions.",
  "Identify the main methodology and architecture used.",
  "What limitations or future directions are discussed?",
];

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onClear,
  disabled = false,
}) => {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < 3;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs border border-blue-100">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Ask Your Question</h2>
              <p className="text-xs text-slate-500">Formulate your query in natural, semantic language</p>
            </div>
          </div>

          {value && (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              title="Clear question text"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Text Area */}
        <div className="relative mt-2">
          <textarea
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter a question or describe the information you are looking for in the document..."
            className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />

          {/* Validation Error */}
          {isTooShort && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please enter at least 3 characters for a meaningful semantic search.</span>
            </div>
          )}
        </div>

        {/* Counter and status */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>Natural language queries perform best</span>
          <span className={`font-mono ${charCount > 400 ? 'text-amber-600' : 'text-slate-400'}`}>
            {charCount} characters
          </span>
        </div>
      </div>

      {/* Suggested Samples */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Sample Questions (Click to populate):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_QUESTIONS.map((question, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onChange(question)}
              className="text-left text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200/80 transition-all active:scale-[0.98]"
            >
              "{question}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

