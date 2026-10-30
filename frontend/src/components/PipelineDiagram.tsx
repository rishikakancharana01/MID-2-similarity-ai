import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Binary, 
  Cpu, 
  Split, 
  Compass, 
  Sliders, 
  BookOpenCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const PipelineDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: "Input & Ingestion",
      icon: FileText,
      tag: "Step 1",
      desc: "User inputs a natural language question and uploads a document (PDF, DOCX, or TXT).",
      details: "PyMuPDF and python-docx extract uncorrupted text buffers while indexing page boundaries and discarding document noise.",
    },
    {
      id: 2,
      title: "Semantic Chunking",
      icon: Split,
      tag: "Step 2",
      desc: "Text is broken into overlapping 100-word windows with 25-word overlaps.",
      details: "Overlap prevents fragmented context at paragraph boundaries, ensuring complete thoughts are preserved across chunk splits.",
    },
    {
      id: 3,
      title: "Vector Embeddings",
      icon: Binary,
      tag: "Step 3",
      desc: "Sentence Transformers (all-MiniLM-L6-v2) maps text and question into 384D vectors.",
      details: "Bi-encoder architecture transforms words into dense numerical vectors where semantic meaning is positioned in high-dimensional space.",
    },
    {
      id: 4,
      title: "Cosine Similarity",
      icon: Compass,
      tag: "Step 4",
      desc: "Mathematical dot product calculates angular similarity between query & chunks.",
      details: "Formula: cos(θ) = (A · B) / (||A|| ||B||). Ranges from 0.0 to 1.0. Measures conceptual alignment rather than exact keyword presence.",
    },
    {
      id: 5,
      title: "Ranking & Synthesis",
      icon: BookOpenCheck,
      tag: "Step 5",
      desc: "Passages exceeding threshold are ranked; evidence-grounded answer is produced.",
      details: "Strict deterministic extraction or LLM-summarization grounded exclusively on top retrieved passages with page-level citations.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Architecture &amp; Pipeline
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          How Similarity AI Processes Your Documents
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Click any stage below to inspect the mathematical and architectural mechanisms.
        </p>
      </div>

      {/* Interactive Step Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative mb-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSelected ? 'bg-blue-500/40 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.tag}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <h4 className="font-bold text-xs sm:text-sm leading-tight mb-1">
                  {step.title}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] opacity-80">
                <span>Phase {step.id}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className={`w-3.5 h-3.5 hidden sm:block ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      {(() => {
        const selected = steps.find(s => s.id === activeStep) || steps[0];
        const SelectedIcon = selected.icon;

        return (
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-xl p-6 text-white border border-slate-800 shadow-sm animate-in fade-in duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                <SelectedIcon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-blue-400 font-bold">{selected.tag}:</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">{selected.title}</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selected.desc}
                </p>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 mt-3 text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-blue-300">Under the Hood: </strong>
                  {selected.details}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

