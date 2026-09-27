import React from 'react';
import { ScholarshipScheme } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  IndianRupee, 
  Info,
  Clock
} from 'lucide-react';

interface ScholarshipDetailsModalProps {
  scheme: ScholarshipScheme | null;
  onClose: () => void;
  onApply: (schemeCode: string) => void;
}

export const ScholarshipDetailsModal: React.FC<ScholarshipDetailsModalProps> = ({ scheme, onClose, onApply }) => {
  const { applications, isIncomeRenewed } = useApp();

  if (!scheme) return null;

  const existingApp = applications.find(a => a.schemeCode === scheme.code);
  const isPostMatricPendingReview = scheme.code === 'POST_MATRIC' && !isIncomeRenewed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b border-gov-blue">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                MoTA Scheme Details
              </span>
              <h3 className="text-base font-bold">{scheme.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Purpose & Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-1">Scheme Purpose & Scope</h4>
            <p className="text-slate-600 leading-relaxed">{scheme.shortDescription}</p>
            <p className="text-gov-primary font-semibold mt-2">
              <strong>Target Group:</strong> {scheme.targetGroup}
            </p>
          </div>

          {/* Benefit Amount Card */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-xs">Financial Assistance & Entitlements</h4>
              <p className="text-emerald-800 font-semibold mt-0.5">{scheme.annualGrantAmountText}</p>
              <p className="text-slate-600 mt-1 text-[11px]">{scheme.benefitsSummary}</p>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gov-primary" />
              <span>Key Eligibility Conditions</span>
            </h4>
            <ul className="space-y-1.5 bg-white border border-slate-200 rounded-xl p-3.5">
              {scheme.eligibilitySummary.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-gov-primary font-bold">•</span>
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gov-primary" />
              <span>Required Documents (DigiLocker Reusable)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                  {doc}
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5">
            <h4 className="font-bold text-blue-900 text-xs mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-700" />
              <span>Important Schedule for AY 2025-26</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Portal Opening</span>
                <span className="font-bold text-slate-800">{scheme.importantDates.portalOpen}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Application Deadline</span>
                <span className="font-bold text-red-700">{scheme.importantDates.lastDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Verification Deadline</span>
                <span className="font-bold text-slate-800">{scheme.importantDates.verificationDeadline}</span>
              </div>
            </div>
          </div>

          {/* Status Note */}
          {existingApp && (
            <div className="p-3 rounded-lg border border-amber-300 bg-amber-50 text-[11px] text-amber-900 flex items-center justify-between">
              <div>
                <span className="font-bold">Existing Application:</span> {existingApp.id}
                <p className="text-amber-800 mt-0.5">Status: {existingApp.currentStatus}</p>
              </div>
              <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">
                {existingApp.currentStage}
              </span>
            </div>
          )}
        </div>

        {/* Footer with Apply Button */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onApply(scheme.code);
            }}
            className="px-5 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>{existingApp ? 'View / Track Application' : 'Apply for this Scheme'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
