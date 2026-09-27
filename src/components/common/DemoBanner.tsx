import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, RotateCcw, ShieldCheck, User, Briefcase, BarChart3, Globe } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { role, setRole, setActiveTab, resetAllDemoData, isIncomeRenewed, applications } = useApp();

  const postMatricApp = applications.find(a => a.schemeCode === 'POST_MATRIC');
  const isPendingReview = postMatricApp?.currentStatus === 'MANUAL_REVIEW' || postMatricApp?.currentStatus === 'CORRECTION_REQUESTED';
  const isApproved = postMatricApp?.currentStatus === 'DISBURSED' || postMatricApp?.currentStatus === 'SANCTIONED';

  return (
    <aside aria-label="Demo mode control bar" className="bg-slate-900 text-white text-xs border-b border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Persona Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-wider text-[11px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Hackathon Demo Bar:
          </span>
          <span className="text-slate-400 font-medium">Switch View:</span>
          
          <div className="inline-flex rounded-md shadow-xs bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => { setRole('student'); setActiveTab('dashboard'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                role === 'student' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Student (Rahul)</span>
              {isPendingReview && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Needs Action" />
              )}
            </button>

            <button
              onClick={() => { setRole('officer'); setActiveTab('manual-review'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                role === 'officer' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Officer (MoTA)</span>
              {isPendingReview && (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1 rounded font-bold">1 Review</span>
              )}
            </button>

            <button
              onClick={() => { setRole('admin'); setActiveTab('analytics'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Admin Analytics</span>
            </button>

            <button
              onClick={() => { setRole('public'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                role === 'public' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Public Portal</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Story Walkthrough & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            <span>Story State:</span>
            {isApproved ? (
              <span className="text-emerald-400 font-semibold">✓ Disbursed (₹34,000 Credited)</span>
            ) : isIncomeRenewed ? (
              <span className="text-sky-300 font-semibold">● Income Verified (Awaiting Officer)</span>
            ) : (
              <span className="text-amber-300 font-semibold">⚠ Income Mismatch (Manual Review)</span>
            )}
          </div>

          <button
            onClick={() => {
              if (role !== 'student') setRole('student');
              setActiveTab('verification');
            }}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition-colors shadow-xs"
            title="Inspect how the Unified Verification layer flags a non-punitive manual review exception"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Walkthrough Demo Flow</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded text-xs border border-slate-700 transition-colors"
            title="Reset student and officer data to initial demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
