import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { ArrowLeft, KeyRound, Briefcase, ArrowRight, ShieldCheck, Loader2, Lock } from 'lucide-react';

export const ManagerLoginScreen: React.FC = () => {
  const { login, goToRoleSelect, signInWithEmail } = useAuth();
  const [officialId, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!officialId.trim()) {
      setError('Please enter your official ID.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);

    // Try Supabase auth first
    if (isSupabaseConfigured()) {
      const { error: authError } = await signInWithEmail('demo.manager@tribalscholar.in', 'demo123456');
      if (!authError) {
        setIsLoggingIn(false);
        return; // Supabase login succeeded
      }
      console.warn('Supabase manager login failed, using mock:', authError);
    }

    // Mock credential check
    if (officialId.toUpperCase() !== 'OFF001' || password !== 'admin123') {
      setError('The official ID or password is incorrect.');
      setIsLoggingIn(false);
      return;
    }

    setTimeout(() => {
      login({
        id: 'OFF001',
        name: 'Demo Officer',
        role: 'MANAGER',
        officialRole: 'Scholarship Verification Manager',
      });
    }, 600);
  };

  const handleDemoLogin = async () => {
    if (isSupabaseConfigured()) {
      setIsLoggingIn(true);
      const { error: authError } = await signInWithEmail('demo.manager@tribalscholar.in', 'demo123456');
      setIsLoggingIn(false);
      if (!authError) return;
      console.warn('Supabase demo manager login failed, using mock:', authError);
    }
    login({
      id: 'OFF001',
      name: 'Demo Officer',
      role: 'MANAGER',
      officialRole: 'Scholarship Verification Manager',
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
            onClick={goToRoleSelect}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-gov-navy mb-6 transition-colors focus:outline-none focus:underline"
            aria-label="Back to role selection"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to role selection</span>
          </button>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-amber-700 text-white px-6 py-6">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mb-3">
                TS
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">Manager Login</h1>
              <p className="text-amber-200 font-semibold text-sm mt-1">
                Manage scholarship applications and verification workflows.
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="official-id" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Official ID
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="official-id"
                      type="text"
                      value={officialId}
                      onChange={(e) => { setOfficialId(e.target.value); setError(''); }}
                      placeholder="Enter official ID"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-xs font-semibold" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-xs font-medium uppercase">Or</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Demo Manager Login */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Demo Manager Login
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold text-sm">
                    DO
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Demo Officer</p>
                    <p className="text-xs text-slate-500">Official ID: <span className="font-mono font-semibold">OFF001</span></p>
                    <p className="text-xs text-slate-500">Role: <span className="font-semibold">Scholarship Verification Manager</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Login as Demo Manager</span>
                </button>
              </div>
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
