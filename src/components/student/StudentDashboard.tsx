import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenDetails: (schemeId: string) => void;
  onOpenApply: (schemeCode: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenDetails, onOpenApply }) => {
  const { 
    profile, 
    schemes, 
    applications, 
    payments, 
    setActiveTab, 
    isIncomeRenewed 
  } = useApp();

  const totalReceived = payments
    .filter(p => p.status === 'CREDITED')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeAppsCount = applications.filter(a => a.currentStatus !== 'REJECTED').length;
  
  // Rahul is eligible for Pre-Matric (past), Post-Matric (current), Top Class (NITK student)
  const eligibleCount = 2; // Post-Matric & Top Class
  const pendingActionsCount = isIncomeRenewed ? 0 : 1;

  const postMatricApp = applications.find(a => a.schemeCode === 'POST_MATRIC');
  const isPostMatricPendingReview = postMatricApp?.currentStatus === 'MANUAL_REVIEW' || postMatricApp?.currentStatus === 'CORRECTION_REQUESTED';
  const isPostMatricDisbursed = postMatricApp?.currentStatus === 'DISBURSED';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Student Portal • ST ID: {profile.studentId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {profile.name} 👋
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Your Scholarship Dashboard. Understand all your applications, verification milestones, and Direct Benefit Transfer (DBT) payments from one screen.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('eligibility')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Check New Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs transition-colors border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Open Document Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Applications */}
        <div 
          onClick={() => setActiveTab('applications')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Applications</span>
            <FileText className="w-5 h-5 bg-blue-50 p-1 rounded-md" />
          </div>
          <div className="text-2xl font-black text-slate-800">{activeAppsCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Post-Matric & Pre-Matric</p>
        </div>

        {/* Scholarships Eligible */}
        <div 
          onClick={() => setActiveTab('eligibility')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scholarships Eligible</span>
            <CheckCircle2 className="w-5 h-5 bg-emerald-50 p-1 rounded-md" />
          </div>
          <div className="text-2xl font-black text-slate-800">{eligibleCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Post-Matric & Top Class</p>
        </div>

        {/* Pending Actions */}
        <div 
          onClick={() => setActiveTab(pendingActionsCount > 0 ? 'wallet' : 'dashboard')}
          className={`p-4 rounded-xl border shadow-xs cursor-pointer transition-all ${
            pendingActionsCount > 0 
              ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Actions</span>
            <AlertTriangle className={`w-5 h-5 p-1 rounded-md ${pendingActionsCount > 0 ? 'bg-amber-200 text-amber-900 animate-pulse' : 'bg-slate-100 text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black text-slate-800">{pendingActionsCount}</div>
          <p className={`text-[11px] font-semibold mt-1 ${pendingActionsCount > 0 ? 'text-amber-800' : 'text-slate-500'}`}>
            {pendingActionsCount > 0 ? 'Income Certificate update' : 'All requirements satisfied'}
          </p>
        </div>

        {/* Total Amount Received */}
        <div 
          onClick={() => setActiveTab('payments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total DBT Received</span>
            <CreditCard className="w-5 h-5 bg-indigo-50 p-1 rounded-md" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Direct to SBI ••••4589</p>
        </div>
      </div>

      {/* Pending Actions Alert Card (The Core Demo Attention Grabber) */}
      {!isIncomeRenewed && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Action Required
                </span>
                <span className="text-xs text-slate-500 font-medium">Post-Matric Application #APP-2025-ST-POST-1024</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Upload Updated Family Income Certificate
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                The State e-District database indicates your previous certificate (#KA/RD/INC/2024/7741) expired on 31-03-2025. Please upload the renewed FY 2025-26 certificate to clear the Manual Review flag.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('wallet')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Resolve in Wallet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Five Scholarships Unified Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-gov-primary" />
              <span>Unified Status Across All 5 MoTA Schemes</span>
            </h3>
            <p className="text-xs text-slate-500">
              One view tracking your eligibility, active verifications, and historical completions.
            </p>
          </div>

          <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
            Current Academic Year: 2025-26
          </span>
        </div>

        {/* The 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Pre-Matric */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Classes IX - X</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Completed
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900">Pre-Matric Scholarship</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Successfully disbursed during secondary school studies.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Disbursed: ₹7,000</span>
              <button 
                onClick={() => onOpenDetails('scheme-1')}
                className="font-bold text-gov-primary hover:underline text-[11px]"
              >
                View History
              </button>
            </div>
          </div>

          {/* 2. Post-Matric (Primary Active) */}
          <div className="border-2 border-blue-400 rounded-xl p-4 bg-blue-50/30 flex flex-col justify-between relative shadow-xs">
            <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Active Application
            </span>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-blue-700 uppercase">UG Engineering (B.Tech)</span>
                {isPostMatricDisbursed ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Disbursed (₹34,000)
                  </span>
                ) : isIncomeRenewed ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                    Department Sanction
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    Manual Review
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs text-slate-900">Post-Matric Scholarship for ST</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isPostMatricDisbursed 
                  ? 'Payment credited to SBI ••••4589 via PFMS.'
                  : isIncomeRenewed
                  ? 'Income verified. MoTA Central Sanction Order under generation.'
                  : 'Income certificate expiry flagged by e-District. In Manual Review.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-blue-900">Grant: Up to ₹1.2 LPA</span>
              <button 
                onClick={() => setActiveTab('applications')}
                className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 text-[11px]"
              >
                <span>Track Status</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Top Class Scholarship (Eligible!) */}
          <div className="border border-emerald-300 rounded-xl p-4 bg-emerald-50/20 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Premier Institute (NITK)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Potentially Eligible
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900">Top Class Education Scholarship</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                NITK Surathkal is a notified Premier Institute. Full tuition waiver + ₹86,000 living & laptop allowance.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-emerald-900">100% Fees + Allowances</span>
              <button 
                onClick={() => onOpenApply('TOP_CLASS')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors"
              >
                Apply with 1-Click
              </button>
            </div>
          </div>

          {/* 4. NFST (Fellowship) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Research Scholars</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  Not Eligible
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-800">National Fellowship for ST (NFST)</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Requires enrollment in regular M.Phil / Ph.D. program and UGC-NET/CSIR-NET qualification.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">Rule: Ph.D. enrollment needed</span>
              <button 
                onClick={() => onOpenDetails('scheme-4')}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-medium"
              >
                View Rules
              </button>
            </div>
          </div>

          {/* 5. NOS (Overseas) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Studies Abroad</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  Not Eligible
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-800">National Overseas Scholarship (NOS)</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Requires unconditional admission offer letter from a Top 500 QS ranked foreign university.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">Rule: Foreign offer needed</span>
              <button 
                onClick={() => onOpenDetails('scheme-5')}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-medium"
              >
                View Rules
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Activity & Quick JAGO Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gov-primary" />
            <span>Recent Scholarship Activity & Verification Events</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Institution Verification Completed</p>
                  <span className="text-[10px] text-slate-400">14 Aug 2025</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  NITK Surathkal registrar validated regular enrollment for B.Tech CSE (AISHE Code C-1284).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">ST Caste Certificate Auto-Verified</p>
                  <span className="text-[10px] text-slate-400">15 Aug 2025</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  DigiLocker certificate #KA/ST/2021/88921 matched against Karnataka Revenue database.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">DBT Maintenance Credited: ₹17,000</p>
                  <span className="text-[10px] text-slate-400">20 Oct 2024</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  PFMS transaction #PFMS/2024/MOTA/904128 credited to SBI Account ••••4589.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* JAGO Quick Prompt Box */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm text-slate-900">Ask JAGO Assistant</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have doubts about why your application is flagged, or how to claim Top Class allowances? JAGO knows your live status.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('jago')}
                className="w-full text-left p-2 rounded-lg bg-white/80 hover:bg-white border border-amber-200/60 text-[11px] text-slate-700 font-medium transition-colors"
              >
                💬 &quot;Why is my income certificate flagged?&quot;
              </button>
              <button
                onClick={() => setActiveTab('jago')}
                className="w-full text-left p-2 rounded-lg bg-white/80 hover:bg-white border border-amber-200/60 text-[11px] text-slate-700 font-medium transition-colors"
              >
                💬 &quot;Am I eligible for the Top Class scholarship?&quot;
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('jago')}
            className="w-full mt-4 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-colors text-center"
          >
            Launch JAGO Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
