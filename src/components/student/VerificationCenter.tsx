import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const VerificationCenter: React.FC = () => {
  const { profile, isIncomeRenewed, uploadRenewedIncomeCertificate, setActiveTab } = useApp();
  const [rechecking, setRechecking] = useState(false);

  const handleRecheck = () => {
    setRechecking(true);
    setTimeout(() => {
      setRechecking(false);
    }, 500);
  };

  const verificationItems = [
    {
      category: 'Identity & Biometrics',
      sourceSystem: 'UIDAI Aadhaar Vault Gateway',
      status: 'VERIFIED',
      submitted: `Aadhaar seeded for ${profile.name}, Pincode: ${profile.pincode}`,
      sourceRecord: 'Cryptographically authenticated with 12-digit UID token',
      latency: '42ms'
    },
    {
      category: 'ST Caste Category',
      sourceSystem: 'DigiLocker National Registry (e-Pramana)',
      status: 'VERIFIED',
      submitted: `Caste Cert #${profile.stCertificateNo} (${profile.tribeName})`,
      sourceRecord: 'Digitally verified with Tahsildar Mangaluru records',
      latency: '65ms'
    },
    {
      category: 'Institution & Course Accreditation',
      sourceSystem: 'AISHE (All India Survey on Higher Education)',
      status: 'VERIFIED',
      submitted: `NITK Surathkal (AISHE Code: ${profile.institutionCode})`,
      sourceRecord: 'Active Institute of National Importance; Course B.Tech CSE valid',
      latency: '38ms'
    },
    {
      category: 'Academic Performance & Credits',
      sourceSystem: 'APAAR / Academic Bank of Credits (ABC)',
      status: 'VERIFIED',
      submitted: `APAAR ID: ${profile.apaarId} • Marks: ${profile.previousYearMarksPercentage}%`,
      sourceRecord: 'Verified across semester credit bank with zero academic backlog',
      latency: '78ms'
    },
    {
      category: 'Annual Family Income Record',
      sourceSystem: 'Karnataka Nadakacheri State e-District',
      status: isIncomeRenewed ? 'VERIFIED' : 'MANUAL_REVIEW',
      submitted: isIncomeRenewed 
        ? 'Renewed FY 2025-26 Cert #KA/RD/INC/2025/9902 (₹1,20,000)' 
        : `Cert #${profile.incomeCertificateNo} (Income: ₹1,20,000)`,
      sourceRecord: isIncomeRenewed
        ? 'Active record verified till 31-03-2026. Annual income ₹1.2L satisfies ceiling.'
        : 'Discrepancy: Certificate lapsed on 31-03-2025. Financial year renewal required.',
      latency: '110ms',
      isMismatch: !isIncomeRenewed
    },
    {
      category: 'Direct Benefit Transfer (DBT) Bank Account',
      sourceSystem: 'NPCI Aadhaar Payment Bridge System (APBS)',
      status: 'VERIFIED',
      submitted: `SBI A/c ••••4589 linked with Aadhaar`,
      sourceRecord: 'Active DBT Mandate verified with PFMS payment gateway',
      latency: '59ms'
    },
    {
      category: 'Domicile & State Residence',
      sourceSystem: 'Karnataka Revenue Department',
      status: 'VERIFIED',
      submitted: `Domicile: Karnataka (Dakshina Kannada District)`,
      sourceRecord: 'State domicile verified via DC Revenue registry',
      latency: '45ms'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-primary" />
            <span>Unified Verification & Integration Layer (7 Adapters)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Real-Time Verification Center
          </h2>
          <p className="text-xs text-slate-500">
            Cross-verifying your eligibility data directly with authoritative national and state registers.
          </p>
        </div>

        <button
          onClick={handleRecheck}
          disabled={rechecking}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rechecking ? 'animate-spin' : ''}`} />
          <span>{rechecking ? 'Syncing Adapters...' : 'Re-check Verification'}</span>
        </button>
      </div>

      {/* Non-punitive Mismatch Highlight Notice (Section 14 of Prompt) */}
      {!isIncomeRenewed ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Manual Review Required
                </span>
                <span className="text-xs text-amber-800 font-semibold">Non-Punitive Exception Handling</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Income Certificate Expiry Mismatch Detected
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                The Ministry of Tribal Affairs does <strong>NOT</strong> reject students for document expiry or technical discrepancies. Your application has been routed to the District Welfare Officer&apos;s manual review queue for fast-track resolution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs bg-white/80 p-3 rounded-xl border border-amber-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Record:</span>
              <p className="font-semibold text-slate-800">Income: ₹1,20,000 (Cert #KA/RD/INC/2024/7741)</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">State e-District Status:</span>
              <p className="font-bold text-amber-800">Lapsed on 31-03-2025 • Renewal Required</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('wallet')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Resolve Issue (Upload Renewed FY 2025-26 Cert)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('jago')}
                className="px-3.5 py-2 bg-white hover:bg-amber-50 text-slate-700 border border-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask JAGO for Help</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              Officer Review ID: <strong>REV-1001</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">All Verification Adapters Cleared Successfully</h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              100% of demographic, caste, academic, income, and bank credentials have been authenticated. Sanction order is approved.
            </p>
          </div>
        </div>
      )}

      {/* 7 Verification Adapters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Government Registry Cross-Verification Telemetry
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {verificationItems.filter(v => v.status === 'VERIFIED').length} of 7 Verified
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {verificationItems.map((item, idx) => (
            <div key={idx} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${item.isMismatch ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'}`}>
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium font-mono">({item.sourceSystem})</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>Submitted:</strong> {item.submitted}
                </p>
                <p className={`text-[11px] ${item.isMismatch ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                  <strong>Registry Response:</strong> {item.sourceRecord}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <span className="text-[10px] font-mono text-slate-400">{item.latency}</span>
                {item.status === 'VERIFIED' ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Manual Review</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
