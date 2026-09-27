import React from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';

export const PaymentDashboard: React.FC = () => {
  const { payments, profile } = useApp();

  const totalCredited = payments
    .filter(p => p.status === 'CREDITED')
    .reduce((sum, p) => sum + p.amount, 0);

  const dbtStages = [
    { label: 'Sanctioned', status: 'COMPLETED' },
    { label: 'Payment Initiated', status: 'COMPLETED' },
    { label: 'Bank Processing', status: 'COMPLETED' },
    { label: 'Credited to Bank', status: 'COMPLETED' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Benefit Transfer (DBT) Bharat • PFMS Synchronized</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              ₹{totalCredited.toLocaleString('en-IN')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              Total Scholarship Disbursed across all MoTA schemes directly into your Aadhaar-seeded bank account.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs text-slate-200 space-y-1">
            <p className="text-[10px] uppercase font-bold text-amber-300">Credited Bank Account</p>
            <p className="font-bold text-white text-sm">State Bank of India</p>
            <p className="font-mono text-slate-300">A/c: {profile.bankAccount.accountNumberMasked}</p>
          </div>
        </div>
      </div>

      {/* DBT Lifecycle Tracker Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Electronic Direct Benefit Transfer (DBT) Pipeline
            </h3>
            <p className="text-[11px] text-slate-500">Government of India Public Financial Management System (PFMS)</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Aadhaar APBS Enabled
          </span>
        </div>

        {/* 4 DBT Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {dbtStages.map((stage, idx) => (
            <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">{stage.label}</span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">Automated Clear</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Disbursement & Credit History
          </h3>
          <span className="text-xs text-slate-500">{payments.length} Transactions</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {payments.map((pay: PaymentRecord) => (
            <div key={pay.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{pay.schemeName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    {pay.installmentNo}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>PFMS Ref: <strong className="text-slate-700">{pay.pfmsReferenceId}</strong></span>
                  <span>UTR: <strong className="text-slate-700">{pay.bankUtrNumber}</strong></span>
                  <span>Sanction Order: <strong className="text-slate-700">{pay.sanctionOrderNumber}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-base font-black text-emerald-700">
                    +₹{pay.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Credited on {pay.creditedDate}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Credited</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Disclaimer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>* Demo payment records for hackathon demonstration. No live banking transaction conducted.</span>
          <button 
            onClick={() => alert('Mock PDF Payment Acknowledgement Receipt downloaded.')}
            className="font-semibold text-gov-primary hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Receipts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
