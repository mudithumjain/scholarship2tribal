import React from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOLARSHIP_SCHEMES } from '../../data/mockData';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Bot, 
  Wallet, 
  CreditCard, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Plane, 
  Award,
  HelpCircle,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenArchitecture }) => {
  const { setRole, setActiveTab } = useApp();

  const handleLaunchStudentDemo = () => {
    setRole('student');
    setActiveTab('dashboard');
  };

  const handleLaunchOfficerDemo = () => {
    setRole('officer');
    setActiveTab('manual-review');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gov-navy via-[#0B2545] to-[#133E87] text-white pt-16 pb-20 px-4">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ministry of Tribal Affairs • Problem Statement ID: 26238</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            One Platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
              Every Tribal Scholarship.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            A unified digital scholarship experience for Scheduled Tribe (ST) students. One reusable student profile, automated cross-government verification, non-punitive manual review exceptions, and end-to-end DBT tracking.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={handleLaunchStudentDemo}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLaunchOfficerDemo}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Officer Manual Review Portal</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>View System Architecture</span>
            </button>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Demo Student: <strong>Rahul Kumar (ST10001)</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Officer: <strong>Mr. Rajesh Meena (MoTA)</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Feature Cards */}
      <section className="py-14 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs uppercase tracking-widest text-gov-primary font-bold">Comprehensive Capabilities</h2>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Built as Modern Digital Public Infrastructure</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-primary flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Unified Scholarships</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              All 5 MoTA schemes (Pre-Matric, Post-Matric, Top Class, NFST, NOS) accessible under a single dashboard without visiting multiple portals.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Smart Eligibility</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Rule-based eligibility engine that transparently explains <em>why</em> you qualify or do not qualify for any scholarship, eliminating black-box rejections.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Digital Document Wallet</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Stores verified caste, income, and academic documents linked with DigiLocker. Reusable across multiple academic years with 1-click auto-fill.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Transparent Tracking</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Complete 7-stage application timeline with exact timestamps, institutional verifications, and direct DBT bank disbursement tracking via PFMS.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">JAGO Assistance</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Domain-specific scholarship assistant aware of your live application status, pending deficiencies, and navigation shortcuts with speech synthesis.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Automated Verification</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Seamless orchestration across UIDAI, DigiLocker, UDISE+, APAAR, AISHE, and State e-Districts. Mismatches trigger human review, not automated rejection.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem vs Our Solution Section */}
      <section className="py-14 bg-white border-y border-slate-200 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs uppercase tracking-widest text-gov-primary font-bold">System Transformation</h2>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Replacing Fragmented Portals with One Journey</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-red-700">
                <XCircle className="w-5 h-5" />
                <h4 className="font-bold text-base">The Current Problem</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Multiple disconnected portals:</strong> Separate websites for Pre-Matric, Post-Matric, Top Class, and Fellowships.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Repeated documentation:</strong> Tribal students forced to re-upload caste and income certificates every academic year.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Unclear status & opaque rejections:</strong> Lack of transparency leaves students confused about where their application is stuck.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Auto-rejections on minor mismatches:</strong> Name spelling discrepancies immediately reject needy students without recourse.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Fragmented DBT tracking:</strong> No unified visibility into PFMS transaction IDs or bank credit dates.</span>
                </li>
              </ul>
            </div>

            {/* Our Solution */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="font-bold text-base">TribalScholar Solution</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>One student profile:</strong> Single lifelong student profile with pre-verified ST community and academic identity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>One unified dashboard:</strong> All five scholarships visible, comparable, and trackable in a single responsive screen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Unified Verification Layer:</strong> Real-time orchestration with DigiLocker, UIDAI, AISHE, and State e-Districts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Non-punitive Manual Review:</strong> Data mismatches route to officer review queues with correction requests rather than rejection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>JAGO AI Guidance:</strong> Context-aware multilingual assistant that guides students and explains application status.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 6 Steps */}
      <section className="py-14 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs uppercase tracking-widest text-gov-primary font-bold">Simple Student Journey</h2>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">How TribalScholar Works</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'Create Profile', desc: 'Aadhaar demographic authentication & basic details' },
            { step: '02', title: 'Check Eligibility', desc: 'Instant rule evaluation with clear explanations' },
            { step: '03', title: 'Apply with 1-Click', desc: 'Reuse verified DigiLocker documents' },
            { step: '04', title: 'Auto-Verify', desc: 'Cross-check with AISHE and State e-Districts' },
            { step: '05', title: 'Track Live', desc: 'Visual 7-step timeline with instant notifications' },
            { step: '06', title: 'Receive DBT', desc: 'Direct electronic credit via PFMS into Aadhaar bank' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-mono font-black text-amber-500">{item.step}</span>
              <h5 className="font-bold text-xs text-slate-900 mt-2">{item.title}</h5>
              <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 5 MoTA Schemes Overview */}
      <section className="py-12 bg-slate-100 border-t border-slate-200 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Five MoTA Scholarship Schemes</h3>
              <p className="text-xs text-slate-500">All available under one unified application workflow</p>
            </div>
            <button
              onClick={handleLaunchStudentDemo}
              className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1"
            >
              <span>Explore Schemes in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SCHOLARSHIP_SCHEMES.map(s => (
              <div key={s.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {s.code.replace('_', ' ')}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 mt-2 line-clamp-2">{s.name}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">{s.shortDescription}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Grant Amount</span>
                  <span className="text-[11px] font-bold text-slate-800">{s.annualGrantAmountText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gov-navy text-slate-300 py-8 px-4 border-t border-gov-blue text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white">TribalScholar • Ministry of Tribal Affairs</p>
            <p className="text-[11px] text-slate-400">Problem Statement ID: 26238 • Digital Public Infrastructure Prototype</p>
          </div>
          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            Synthetic demonstration environment. No real Aadhaar or banking data accessed.
          </p>
        </div>
      </footer>
    </div>
  );
};
