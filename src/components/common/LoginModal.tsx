import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  User, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setRole, setActiveTab } = useApp();
  const [identifier, setIdentifier] = useState('ST10001');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleStudentDemoLogin = () => {
    setRole('student');
    setActiveTab('dashboard');
    onClose();
  };

  const handleOfficerDemoLogin = () => {
    setRole('officer');
    setActiveTab('manual-review');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      // Complete login
      setRole('student');
      setActiveTab('dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-5 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mb-3">
            TS
          </div>

          <h2 className="text-xl font-bold">TribalScholar</h2>
          <p className="text-amber-300 font-semibold text-sm mt-0.5">Your scholarships. One place.</p>
          <p className="text-slate-300 text-xs mt-1">Ministry of Tribal Affairs, Government of India</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Access Bar */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Direct Evaluator Access (No Password Required)
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleStudentDemoLogin}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo Student Login</span>
              </button>

              <button
                type="button"
                onClick={handleOfficerDemoLogin}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Demo Officer Login</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs font-medium uppercase">Or Standard Login</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number or Demo Student ID
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. ST10001 or 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all font-medium"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-150">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter 6-Digit OTP / Demo Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all font-mono tracking-widest text-center"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Mock OTP simulated: 123456
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{otpSent ? 'Verify & Continue' : 'Continue with OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Synthetic authentication for hackathon evaluation. No real UIDAI biometric check performed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
