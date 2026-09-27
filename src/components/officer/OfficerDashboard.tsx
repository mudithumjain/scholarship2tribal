import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficerReviewItem } from '../../types';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  User, 
  Search, 
  Filter, 
  X, 
  ArrowRight, 
  ShieldCheck,
  Send,
  Building,
  RotateCcw
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { 
    officerReviews, 
    officerRequestCorrection, 
    officerApproveApplication, 
    officerRejectApplication,
    profile,
    isIncomeRenewed
  } = useApp();

  const [selectedReviewId, setSelectedReviewId] = useState<string>('REV-1001');
  const [correctionReason, setCorrectionReason] = useState<string>('Certificate appears to be expired. Please upload renewed FY 2025-26 income certificate.');
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const selectedReview = officerReviews.find(r => r.id === selectedReviewId) || officerReviews[0];

  const handleRequestCorrectionSubmit = () => {
    officerRequestCorrection(selectedReview.id, correctionReason);
    setShowCorrectionModal(false);
  };

  const handleApprove = () => {
    officerApproveApplication(selectedReview.id, 'Officer approved after evaluating updated digital records.');
  };

  const handleReject = () => {
    const reason = prompt('Please enter the mandatory official reason for rejection:');
    if (reason) {
      officerRejectApplication(selectedReview.id, reason);
    }
  };

  const filteredReviews = officerReviews.filter(r => {
    if (filterStatus === 'PENDING') return r.status === 'PENDING_REVIEW' || r.status === 'CORRECTION_REQUESTED';
    if (filterStatus === 'APPROVED') return r.status === 'APPROVED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* MoTA Administration Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-1 border border-amber-200">
            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
            <span>MoTA Scholarship Administration Portal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Officer Verification & Sanctions Desk
          </h2>
          <p className="text-xs text-slate-500">
            Supervising Officer: <strong>Rajesh Meena</strong> • District Tribal Welfare Officer (Mangaluru)
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Academic Session: 2025-26
        </span>
      </div>

      {/* 5 Summary KPI Cards (Section 22 of prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Applications</span>
          <p className="text-2xl font-black text-slate-800 mt-1">12,450</p>
          <span className="text-[10px] text-blue-600 font-semibold">Across all 5 schemes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Auto-Verified</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">8,920</p>
          <span className="text-[10px] text-emerald-600 font-semibold">71.6% 0-touch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Institution</span>
          <p className="text-2xl font-black text-slate-700 mt-1">2,130</p>
          <span className="text-[10px] text-slate-500 font-semibold">Awaiting college</span>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-900">Manual Review Queue</span>
          <p className="text-2xl font-black text-amber-900 mt-1">850</p>
          <span className="text-[10px] text-amber-800 font-bold">Exceptions routed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Sanctioned & Paid</span>
          <p className="text-2xl font-black text-gov-primary mt-1">550</p>
          <span className="text-[10px] text-gov-primary font-semibold">DBT credited</span>
        </div>
      </div>

      {/* Manual Review Queue Table (Section 23 of prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Manual Review Queue (Exceptions Table)
            </h3>
            <p className="text-[11px] text-slate-500">
              Cross-verification discrepancies flagged for officer discretion rather than automatic rejection.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${filterStatus === 'ALL' ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              All ({officerReviews.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${filterStatus === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Needs Attention
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${filterStatus === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Approved
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Discrepancy Issue</th>
                <th className="px-4 py-3">Source Adapter</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((rev: OfficerReviewItem) => {
                const isSelected = selectedReviewId === rev.id;

                return (
                  <tr 
                    key={rev.id} 
                    onClick={() => setSelectedReviewId(rev.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{rev.studentName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{rev.studentId} • {rev.schemeName.split(' ')[0]}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-medium text-amber-900">{rev.submittedValue}</div>
                      <span className="text-[10px] text-slate-500">{rev.sourceValue}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {rev.sourceSystem}
                    </td>
                    <td className="px-4 py-3">
                      {rev.status === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Approved
                        </span>
                      ) : rev.status === 'CORRECTION_REQUESTED' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Correction Requested
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReviewId(rev.id);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Application Inspector (Section 24 of prompt) */}
      {selectedReview && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gov-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Application Inspector: {selectedReview.applicationId}
                </span>
                <span className="text-xs text-slate-500 font-mono">Review ID: {selectedReview.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedReview.studentName} — {selectedReview.schemeName}
              </h3>
            </div>

            {/* Officer Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowCorrectionModal(true)}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors border border-amber-300 flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Correction</span>
              </button>

              <button
                onClick={handleReject}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors border border-red-200"
              >
                Reject with Reason
              </button>

              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Proceed to Sanction</span>
              </button>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Left Column: Student Submission & Documents */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gov-primary" />
                  <span>Student Demographic & Institution Record</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div><span className="text-slate-400">Student ID:</span> <strong>{selectedReview.studentId}</strong></div>
                  <div><span className="text-slate-400">Category:</span> <strong>Scheduled Tribe (Naikda)</strong></div>
                  <div><span className="text-slate-400">Institution:</span> <strong>NITK Surathkal (AISHE C-1284)</strong></div>
                  <div><span className="text-slate-400">Course:</span> <strong>B.Tech CSE (3rd Year)</strong></div>
                  <div><span className="text-slate-400">Claimed Income:</span> <strong>₹1,20,000 / year</strong></div>
                  <div><span className="text-slate-400">Academic Score:</span> <strong className="text-emerald-700">81.5%</strong></div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gov-primary" />
                  <span>Submitted Digital Certificates</span>
                </h4>
                <div className="space-y-1.5 pt-1">
                  {selectedReview.documentsAttached.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-[11px]">
                      <span className="font-mono text-slate-800">{file}</span>
                      <span className="text-[10px] text-gov-primary font-semibold">DigiLocker Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Source Mismatch Comparison & Action Trail */}
            <div className="space-y-4">
              {/* Comparison Box */}
              <div className="p-4 bg-amber-50/60 rounded-xl border-2 border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Discrepancy Source Comparison</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">{selectedReview.sourceSystem}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Submission:</span>
                    <p className="font-bold text-slate-800">{selectedReview.submittedValue}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">State Government Registry Response:</span>
                    <p className="font-bold text-amber-800">{selectedReview.sourceValue}</p>
                  </div>
                </div>

                {selectedReview.officerRemarks && (
                  <div className="p-2.5 bg-white/60 rounded border border-amber-200 text-[11px] text-slate-700">
                    <strong>Officer Log:</strong> {selectedReview.officerRemarks}
                  </div>
                )}
              </div>

              {/* Resolution Note if Student has Uploaded */}
              {isIncomeRenewed && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Student has resolved this deficiency!</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Renewed certificate #KA/RD/INC/2025/9902 authenticated via Nadakacheri. You may now click &quot;Approve &amp; Proceed to Sanction&quot;.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Correction Request Reason Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Request Document Correction</span>
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              This request will immediately appear in the student&apos;s <strong>Notifications</strong> and <strong>Document Wallet</strong> with instructions on what to update.
            </p>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Instruction to Student:</label>
              <textarea
                rows={3}
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCorrectionSubmit}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
