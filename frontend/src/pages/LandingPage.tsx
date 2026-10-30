import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Search, 
  Sliders, 
  CheckCircle2, 
  BookOpen, 
  Zap, 
  GraduationCap, 
  Microscope, 
  Briefcase, 
  Scale,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { PipelineDiagram } from '../components/PipelineDiagram';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.12),rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Next-Gen NLP Semantic Search Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Find the Answers <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
                  Hidden in Your Documents.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Upload a document, ask a question, and discover the most relevant information using 
                semantic similarity and intelligent document analysis. Powered by Sentence Transformers and cosine similarity.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Analyzing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-sm transition-all hover:text-slate-900"
                >
                  <span>Explore How It Works</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Badges / Guarantees */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Cosine Scores
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Hallucinations
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Local &amp; Private
                </span>
              </div>
            </div>

            {/* Right Column: CSS-based Visual Representation */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md w-full">
                
                {/* Glow backdrop */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl"></div>
                
                {/* Main Interactive Card Mockup */}
                <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl p-5 space-y-4">
                  
                  {/* Top Mock Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      similarity-engine: active
                    </span>
                  </div>

                  {/* Query Box Simulation */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      <span>Natural Language Question</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">
                      "What are the primary research findings and objectives?"
                    </p>
                  </div>

                  {/* Matching Excerpt 1 */}
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-200/80 space-y-1.5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        Rank #1 • Page 2
                      </span>
                      <span className="text-xs font-bold font-mono text-blue-700">89.4% Match</span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      "Our empirical results demonstrate that dense semantic retrieval outperforms traditional keyword methods by 27.4%..."
                    </p>
                  </div>

                  {/* Extracted Answer Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-3.5 space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-blue-300">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>Synthesized Evidence Answer</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug">
                      Dense retrieval achieved higher recall by evaluating semantic angle θ rather than exact lexicon tokens.
                    </p>
                  </div>

                  {/* Document Indicator */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> research_paper_2026.pdf
                    </span>
                    <span className="font-mono text-emerald-600 font-medium">Cosine: 0.8940</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            System Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Engineered for Precision Document Intelligence
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Every feature is backed by real mathematical modeling without simulated mockups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">1. Smart Document Upload</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Handles multi-page PDFs with PyMuPDF, Microsoft Word (.docx), and plain text (.txt). Automatically detects corrupt or empty scans with OCR guidance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">2. Semantic Similarity Search</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Transfers user questions and text blocks into 384-dimensional dense vectors using SentenceTransformers, understanding synonyms, paraphrasing, and context.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">3. Ranked Relevant Passages</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Computes exact scikit-learn cosine similarities. Ranks matching passages in strict descending order with percentage indicators and chunk positions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">4. Evidence-Based Answers</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Formulates answers exclusively from retrieved textual evidence. If content falls below the relevance threshold, it explicitly reports insufficient evidence.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">5. Exact Source References</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Each retrieved excerpt preserves original page numbers (for PDFs) and chunk sequences, providing verifiable citation anchors for academic rigor.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">6. Fast Document Analysis</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              High-throughput CPU inference with normalized vector dot products delivers full document parsing, embedding, and ranking in seconds.
            </p>
          </div>

        </div>
      </section>

      {/* PIPELINE & HOW IT WORKS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PipelineDiagram />
      </section>

      {/* TARGET AUDIENCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Versatile Utility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Who Can Benefit From Similarity AI?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Engineered to accelerate document comprehension across multiple academic and industry domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Persona 1 */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Students</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Extract concise summaries, key definitions, and exam answers from lengthy textbooks and lecture notes.
              </p>
            </div>

            {/* Persona 2 */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                <Microscope className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Researchers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interrogate academic literature, benchmark methodologies, and verify empirical results without manual skimming.
              </p>
            </div>

            {/* Persona 3 */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Professionals</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Analyze financial reports, business proposals, and technical specifications for rapid executive decision-making.
              </p>
            </div>

            {/* Persona 4 */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Legal &amp; Policy Analysts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Locate statutory provisions, contractual clauses, and compliance conditions with grounded source references.
              </p>
            </div>

          </div>

          {/* Bottom Banner Callout */}
          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-sm font-semibold text-white">Ready to test your documents?</p>
              <p className="text-xs text-slate-400">No account required. Instant local semantic analysis.</p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

