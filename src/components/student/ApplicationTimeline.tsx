import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScholarshipApplication, TimelineEvent } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Circle, 
  ArrowRight, 
  FileText, 
  CreditCard,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ApplicationTimeline: React.FC = () => {
  const { applications, setActiveTab, isIncomeRenewed, uploadRenewedIncomeCertificate } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications.find(a => a.schemeCode === 'POST_MATRIC')?.id || applications[0]?.id || ''
  );

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6">
      {/* Header with App Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gov-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Lifecycle Tracking
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Application Milestone Timeline
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end audit trail from submission through verification, sanction order, and DBT bank credit.
          </p>
        </div>

        {/* Application Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {applications.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedAppId === app.id
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{app.schemeCode.replace('_', ' ')}</span>
              <span className="ml-1 text-[10px] opacity-75 font-mono">({app.academicSession})</span>
            </button>
          ))}
        </div>
      </div>

      {activeApp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Stepper Timeline (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeApp.schemeName}</h3>
                <p className="text-xs text-slate-500 font-mono">Application ID: {activeApp.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Applied on: {activeApp.appliedDate}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeApp.currentStatus === 'DISBURSED' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : activeApp.currentStatus === 'MANUAL_REVIEW' || activeApp.currentStatus === 'CORRECTION_REQUESTED'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {activeApp.currentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Stepper Vertical Flow */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {activeApp.timeline.map((event: TimelineEvent, idx: number) => {
                const isCompleted = event.status === 'COMPLETED';
                const isFlagged = event.status === 'FLAGGED';
                const isInProgress = event.status === 'IN_PROGRESS';

                return (
                  <div key={idx} className="relative group">
                    {/* Step Icon Indicator */}
                    <div className="absolute -left-6 top-0 flex items-center justify-center">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isFlagged ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs animate-bounce">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                          <Circle className="w-2 h-2 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Step Details Card */}
                    <div className={`p-4 rounded-xl border transition-all text-xs ${
                      isFlagged
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : isCompleted
                        ? 'bg-slate-50/60 border-slate-200'
                        : isInProgress
                        ? 'bg-blue-50/40 border-blue-200'
                        : 'bg-white border-dashed border-slate-200 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{event.label}</h4>
                        {event.completedAt && (
                          <span className="text-[11px] font-mono text-slate-500">{event.completedAt}</span>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed">{event.description}</p>

                      {/* Flagged Deficiency Callout */}
                      {isFlagged && event.actionRequired && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-amber-300 space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Student Action Required:</span>
                          </div>
                          <p className="text-slate-700 text-[11px]">{event.actionRequired}</p>
                          {event.officerNote && (
                            <p className="text-[11px] text-slate-500 italic">
                              <strong>Officer Note:</strong> &quot;{event.officerNote}&quot;
                            </p>
                          )}

                          <button
                            onClick={() => setActiveTab('wallet')}
                            className="mt-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1"
                          >
                            <span>Upload New Certificate in Wallet</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Application Summary Card & DBT Snapshot */}
          <div className="space-y-5 text-xs">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-primary" />
                <span>Application Metadata</span>
              </h4>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheme Code:</span>
                  <span className="font-bold text-slate-800">{activeApp.schemeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Academic Year:</span>
                  <span className="font-semibold text-slate-800">{activeApp.academicSession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Claimed Entitlement:</span>
                  <span className="font-bold text-gov-primary">₹{activeApp.claimedAmount.toLocaleString('en-IN')}</span>
                </div>
                {activeApp.approvedAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approved Amount:</span>
                    <span className="font-bold text-emerald-700">₹{activeApp.approvedAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">DigiLocker Reused:</span>
                  <span className="font-semibold text-emerald-700">Yes (Auto-filled)</span>
                </div>
              </div>
            </div>

            {/* DBT Bank Account Pill */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-2 text-emerald-900">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider">Designated DBT Account</h4>
              </div>
              <p className="font-bold text-sm text-slate-900">State Bank of India (••••4589)</p>
              <p className="text-[11px] text-slate-600">
                Aadhaar Seeding: <span className="font-bold text-emerald-700">Active</span> • Direct Credit via PFMS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
