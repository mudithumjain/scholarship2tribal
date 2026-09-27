import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { ArrowLeft, Phone, KeyRound, ArrowRight, User, ShieldCheck, Loader2 } from 'lucide-react';

type StudentLoginStep = 'mobile' | 'otp';

export const StudentLoginScreen: React.FC = () => {
  const { login, goToRoleSelect, signInWithEmail } = useAuth();
  const [step, setStep] = useState<StudentLoginStep>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (step !== 'otp') return;
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer, step]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanMobile = mobile.replace(/\s/g, '');
    if (!/^\d{10}$/.test(cleanMobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setStep('otp');
    setResendTimer(30);
    setCanResend(false);
    // Focus first OTP input after render
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setIsVerifying(true);

    // Try Supabase auth first
    if (isSupabaseConfigured()) {
      const { error: authError } = await signInWithEmail('demo.student@tribalscholar.in', 'demo123456');
      if (!authError) {
        setIsVerifying(false);
        return;
      }
      console.warn('Supabase OTP login fallback:', authError);
    }

    // Fallback to mock login
    setTimeout(() => {
      login({
        id: 'ST10001',
        name: 'Rahul Kumar',
        role: 'STUDENT',
        phone: `+91 ${mobile}`,
      });
    }, 800);
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  const handleDemoLogin = async () => {
    if (isSupabaseConfigured()) {
      setIsVerifying(true);
      const { error: authError } = await signInWithEmail('demo.student@tribalscholar.in', 'demo123456');
      setIsVerifying(false);
      if (!authError) return; // Supabase login succeeded, AuthContext handles the rest
      console.warn('Supabase demo login failed, using mock:', authError);
    }
    // Fallback to mock login
    login({
      id: 'ST10001',
      name: 'Rahul Kumar',
      role: 'STUDENT',
      phone: '+91 98765 43210',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* National Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF6B00]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Back button */}
          <button
            onClick={step === 'otp' ? () => { setStep('mobile'); setError(''); setOtp(['','','','','','']); } : goToRoleSelect}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-gov-navy mb-6 transition-colors focus:outline-none focus:underline"
            aria-label={step === 'otp' ? 'Back to mobile number' : 'Back to role selection'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'otp' ? 'Back to mobile number' : '← Back to role selection'}</span>
          </button>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gov-navy text-white px-6 py-6">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mb-3">
                TS
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {step === 'mobile' ? 'Student Login' : 'Verify your mobile number'}
              </h1>
              <p className="text-amber-300 font-semibold text-sm mt-1">
                {step === 'mobile'
                  ? 'Access your scholarship services from one place.'
                  : 'Enter the 6-digit OTP to continue.'}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {step === 'mobile' ? (
                <>
                  {/* Mobile Number Form */}
                  <form onSubmit={handleMobileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="mobile-input" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Mobile Number
                      </label>
                      <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-gov-primary focus-within:bg-white transition-all">
                        <span className="flex items-center px-3 text-sm font-semibold text-slate-500 bg-slate-100 border-r border-slate-200">
                          +91
                        </span>
                        <input
                          id="mobile-input"
                          type="tel"
                          value={mobile}
                          onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                          placeholder="Enter mobile number"
                          className="flex-1 px-3 py-2.5 text-sm font-medium bg-transparent focus:outline-none"
                          maxLength={10}
                          autoComplete="tel"
                          aria-describedby={error ? 'mobile-error' : undefined}
                        />
                      </div>
                      {error && (
                        <p id="mobile-error" className="text-red-600 text-xs font-semibold mt-1.5" role="alert">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-sm font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex py-1 items-center">
                    <div className="grow border-t border-slate-200"></div>
                    <span className="shrink mx-3 text-slate-400 text-xs font-medium uppercase">Or</span>
                    <div className="grow border-t border-slate-200"></div>
                  </div>

                  {/* Demo Login */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      Demo Student Login
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 font-bold text-sm">
                        RK
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Rahul Kumar</p>
                        <p className="text-xs text-slate-500">Student ID: <span className="font-mono font-semibold">ST10001</span></p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login as Demo Student</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Form */}
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        OTP sent to <strong className="text-slate-700">+91 {mobile}</strong>
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mb-4">
                        ✓ Mock OTP: use any 6 digits (e.g. 123456)
                      </p>

                      {/* OTP Input Boxes */}
                      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { otpRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-gov-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-primary transition-all"
                            aria-label={`OTP digit ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {error && (
                        <p className="text-red-600 text-xs font-semibold mt-2 text-center" role="alert">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </button>

                    {/* Resend OTP */}
                    <div className="text-center">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-xs font-semibold text-gov-primary hover:text-blue-700 underline focus:outline-none"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium">
                          Resend OTP in <span className="font-bold text-slate-600">{resendTimer}s</span>
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[10px] text-slate-400 mt-4">
            Prototype authentication • No real data is collected
          </p>
        </div>
      </div>
    </div>
  );
};
