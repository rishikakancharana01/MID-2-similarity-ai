import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Binary, 
  Compass, 
  FileText, 
  Split, 
  Sliders, 
  BookOpenCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { PipelineDiagram } from '../components/PipelineDiagram';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Educational Guide &amp; Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Semantic Similarity Document Analysis Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Traditional search looks for exact words. Similarity AI uses high-dimensional vector embeddings 
          and mathematical geometry to understand concepts, meanings, and contextual relationships.
        </p>
      </div>

      {/* Interactive Workflow Diagram Component */}
      <PipelineDiagram />

      {/* 8-Step Complete Pipeline In-Depth */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">The 8-Stage Processing Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Step-by-step breakdown of what happens when you click "Analyze Document"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              1
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Submission &amp; Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The user inputs a query and uploads a PDF, DOCX, or TXT file via multipart/form-data. Input length and MIME types are validated against security thresholds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              2
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Text &amp; Structure Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PyMuPDF extracts clean PDF glyphs while indexing page coordinates. Python-docx extracts paragraphs and tables. Corrupt or unextractable scanned files trigger an OCR guidance warning.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              3
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Semantic Chunking with Overlap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The continuous text stream is split into 100-word windows with 25-word overlapping boundaries. Overlapping prevents facts spanning sentence splits from being lost.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              4
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Passage Embeddings Generation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The pretrained SentenceTransformer model (<code className="bg-slate-200 px-1 rounded text-[11px]">all-MiniLM-L6-v2</code>) maps each chunk into a 384-dimensional dense floating-point vector.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              5
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Query Embedding Generation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The user's question is encoded into the identical 384D mathematical space, placing both the query and document passages into a unified coordinate system.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              6
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Cosine Similarity Computation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Using scikit-learn, the cosine angle between the query vector and every passage vector is computed. Values close to 1.0 indicate high semantic alignment.
              </p>
            </div>
          </div>

          {/* Step 7 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              7
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Passage Ranking &amp; Filtering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Results are sorted in strict descending order. Passages falling below the configurable relevance cutoff (e.g. 20%) are eliminated to eliminate noise.
              </p>
            </div>
          </div>

          {/* Step 8 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              8
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Evidence Synthesis &amp; Citations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A deterministic extractive synthesizer compiles key findings and corroborating evidence with page and chunk citations, preventing hallucinated claims.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Deep-Dive Concepts: Semantic vs Keyword & Math */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Semantic vs Keyword Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Semantic Search vs. Keyword Matching
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Standard keyword search (like Ctrl+F or classic BM25) only finds exact matches for the exact letters typed. If you search for <em>"automobile efficiency"</em>, it fails to find sentences discussing <em>"car gas mileage"</em>.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-start gap-2 text-rose-700">
              <span className="font-bold">Keyword Match:</span>
              <span>"automobile" ≠ "car" (0% match, missed information)</span>
            </div>
            <div className="flex items-start gap-2 text-emerald-700">
              <span className="font-bold">Semantic Embedding:</span>
              <span>"automobile" ≈ "car" (94% cosine closeness, captures concept)</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Sentence Transformers learn language patterns from billions of sentence pairs, understanding synonyms, passive voice, and conceptual questions.
          </p>
        </div>

        {/* Cosine Similarity Math Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              The Cosine Similarity Metric
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cosine similarity measures the cosine of the angle $\theta$ between two non-zero vectors in an inner product space. Because document chunk lengths vary, cosine distance evaluates directional orientation rather than Euclidean magnitude.
          </p>

          {/* Formula display */}
          <div className="bg-slate-900 text-white rounded-xl p-4 font-mono text-center text-xs sm:text-sm space-y-1 shadow-inner">
            <p className="text-blue-300 font-semibold">cos(θ) = ( A · B ) / ( ||A|| × ||B|| )</p>
            <p className="text-slate-400 text-[11px]">Normalized dot product of vector A (query) and vector B (passage)</p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Key Academic Principle:</strong> Similarity scores measure <em>semantic relatedness</em>, not factual correctness or answer probability. A document saying "X is false" will have high similarity to the question "Is X true?".
            </p>
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-900/10">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-bold">Ready to see it in action?</h3>
          <p className="text-xs sm:text-sm text-blue-100">
            Upload your own PDF, DOCX, or TXT file and run real semantic queries on the dashboard.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-sm shadow transition-all active:scale-95 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Launch Document Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

