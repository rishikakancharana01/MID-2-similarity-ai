import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Cpu, ShieldCheck, Github, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">
                Similarity <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              An intelligent document question answering platform that pairs dense semantic vector embeddings 
              with mathematical cosine similarity to surface high-relevance passages and evidence-grounded answers.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> Sentence Transformers
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cosine Similarity
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> PyMuPDF / docx
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Document Analysis</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-blue-400 transition-colors">Analysis History</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Pipeline Details</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Architecture: Bi-Encoder Dense Retrieval</li>
              <li>• Vector Dim: 384 dimensions</li>
              <li>• Model: all-MiniLM-L6-v2</li>
              <li>• Supported: PDF, DOCX, TXT</li>
              <li>• Backend: FastAPI (Python 3.10+)</li>
              <li>• Frontend: React 18, Vite, Tailwind CSS</li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer & Copyright */}
        <div className="border-t border-slate-900 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Similarity AI. Academic Project for Machine Learning &amp; Document Intelligence.
          </p>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800 text-slate-400 text-center md:text-right">
            <span>Academic Assignment Demonstration — Non-Commercial Research &amp; Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

