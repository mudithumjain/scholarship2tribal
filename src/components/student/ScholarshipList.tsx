import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScholarshipScheme } from '../../types';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  IndianRupee, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface ScholarshipListProps {
  onOpenDetails: (schemeId: string) => void;
  onOpenApply: (schemeCode: string) => void;
}

export const ScholarshipList: React.FC<ScholarshipListProps> = ({ onOpenDetails, onOpenApply }) => {
  const { schemes, applications, isIncomeRenewed } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.targetGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gov-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Ministry of Tribal Affairs
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Five Core Scholarship Schemes
          </h2>
          <p className="text-xs text-slate-500">
            Unified directory covering school education, higher education, premier technical institutes, research, and overseas studies.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search schemes or criteria..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gov-primary font-medium"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme: ScholarshipScheme) => {
          const existingApp = applications.find(a => a.schemeCode === scheme.code);
          const isTopClass = scheme.code === 'TOP_CLASS';
          const isPostMatric = scheme.code === 'POST_MATRIC';

          return (
            <div 
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all space-y-4"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    {scheme.code.replace('_', ' ')}
                  </span>

                  {existingApp ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{existingApp.currentStatus.replace('_', ' ')}</span>
                    </span>
                  ) : isTopClass ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Eligible (NITK)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                      Open for AY 2025-26
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{scheme.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{scheme.shortDescription}</p>

                {/* Key Benefit Banner */}
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-gov-primary font-bold">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{scheme.annualGrantAmountText}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{scheme.benefitsSummary}</p>
                </div>

                {/* Eligibility Summary list */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700 block">Eligibility Summary:</span>
                  {scheme.eligibilitySummary.slice(0, 2).map((e, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-gov-primary font-bold">•</span>
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenDetails(scheme.id)}
                  className="font-bold text-gov-primary hover:underline text-xs"
                >
                  View Scheme Guidelines
                </button>

                {existingApp ? (
                  <button
                    onClick={() => onOpenDetails(scheme.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition-colors"
                  >
                    Track Application
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenApply(scheme.code)}
                    className="px-4 py-1.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg font-bold transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>Apply with 1-Click</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
