import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  HelpCircle, 
  Info, 
  FileSearch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

interface SidebarProps {
  onNewAnalysis?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewAnalysis }) => {
  const { backendOnline, backendInfo, history } = useAnalysis();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis History', path: '/history', icon: History, badge: history.length > 0 ? history.length : undefined },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-white border-r border-slate-200/80 p-4 lg:p-6 flex flex-col justify-between rounded-xl lg:rounded-none shadow-sm lg:shadow-none mb-6 lg:mb-0">
      <div className="space-y-6">
        {/* Quick Action Button */}
        <div>
          <button
            onClick={onNewAnalysis}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Engine Specs Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileSearch className="w-3.5 h-3.5 text-blue-600" />
              Engine Status
            </span>
            {backendOnline ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-600" /> Offline
              </span>
            )}
          </div>
          
          <div className="text-[11px] space-y-1 text-slate-500 border-t border-slate-200 pt-2">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-mono text-slate-700 font-medium truncate max-w-[120px]">
                {backendInfo?.model_name || 'all-MiniLM-L6-v2'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Device:</span>
              <span className="font-mono text-slate-700">{backendInfo?.device || 'CPU'}</span>
            </div>
            <div className="flex justify-between">
              <span>Formats:</span>
              <span className="text-slate-700 font-medium">PDF, DOCX, TXT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Note Footer */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-start gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
          <span>Semantic matching via scikit-learn cosine similarity on dense vectors.</span>
        </div>
      </div>
    </aside>
  );
};

