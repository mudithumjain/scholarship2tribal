import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';

export const RoleSelectionScreen: React.FC = () => {
  const { goToStudentLogin, goToManagerLogin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* National Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF6B00]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl mx-auto">
          {/* Branding Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gov-navy flex items-center justify-center text-white font-black text-2xl shadow-md border border-gov-blue/20">
                <span className="text-amber-400">TS</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gov-navy">
              TribalScholar
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              Unified Scholarship Platform for Tribal Students
            </p>

            <div className="mt-6 sm:mt-8">
              <p className="text-sm text-slate-500 font-medium">Welcome to TribalScholar</p>
              <p className="text-amber-600 font-bold text-base sm:text-lg mt-1">
                Your scholarships. One place.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-6 sm:mt-8">
              How would you like to login?
            </h2>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Student Card */}
            <button
              onClick={goToStudentLogin}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Login as Student"
            >
              <div className="text-4xl sm:text-5xl mb-4">🎓</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-gov-primary transition-colors">
                Login as Student
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Apply for scholarships, check your eligibility, manage documents, track applications and view payments.
              </p>
              <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-sm group-hover:shadow-md">
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Manager Card */}
            <button
              onClick={goToManagerLogin}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Login as Manager"
            >
              <div className="text-4xl sm:text-5xl mb-4">🧑‍💼</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Login as Manager
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Review applications, manage verification, handle manual-review cases and monitor scholarship processing.
              </p>
              <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-sm group-hover:shadow-md">
                <span>Continue as Manager</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ministry of Tribal Affairs, Government of India</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Problem Statement 26238 • Prototype / Demo Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
