import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthRole, CurrentUser } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthScreen = 'role-select' | 'student-login' | 'manager-login' | null;

interface AuthContextType {
  currentUser: CurrentUser | null;
  authScreen: AuthScreen;
  login: (user: CurrentUser) => void;
  logout: () => void;
  goToStudentLogin: () => void;
  goToManagerLogin: () => void;
  goToRoleSelect: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Supabase auth methods
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, role: AuthRole, name: string) => Promise<{ error: string | null }>;
  supabaseUser: User | null;
  supabaseSession: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('role-select');
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);

  const useSupabase = isSupabaseConfigured();

  // Initialize: check for existing Supabase session
  useEffect(() => {
    if (!useSupabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseSession(session);
        setSupabaseUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSupabaseSession(session);
        setSupabaseUser(session?.user ?? null);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setAuthScreen('role-select');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [useSupabase]);

  // Load user profile from Supabase users table
  const loadUserProfile = async (authId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error || !userData) {
        setIsLoading(false);
        return;
      }

      if (userData.role === 'STUDENT') {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        setCurrentUser({
          id: profile?.student_id || userData.id,
          name: profile?.full_name || userData.email || 'Student',
          role: 'STUDENT',
          phone: profile?.mobile_number,
          email: userData.email,
        });
      } else if (userData.role === 'MANAGER') {
        const { data: profile } = await supabase
          .from('manager_profiles')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        setCurrentUser({
          id: profile?.manager_id || userData.id,
          name: profile?.full_name || userData.email || 'Manager',
          role: 'MANAGER',
          officialRole: profile?.designation,
          email: userData.email,
        });
      }

      setAuthScreen(null);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Supabase email/password
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!useSupabase) {
      return { error: 'Supabase not configured' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // If user doesn't exist, provide a helpful message
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Use the Demo Login button for quick access.' };
      }
      return { error: error.message };
    }

    if (data.user) {
      await loadUserProfile(data.user.id);
    }

    return { error: null };
  }, [useSupabase]);

  // Sign up with Supabase
  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    role: AuthRole,
    name: string
  ): Promise<{ error: string | null }> => {
    if (!useSupabase) {
      return { error: 'Supabase not configured' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, name },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // Create user row
      const { error: userError } = await supabase.from('users').insert({
        auth_id: data.user.id,
        email,
        role,
      });

      if (userError) {
        console.error('Failed to create user row:', userError);
      }

      // Create profile
      if (role === 'STUDENT') {
        await supabase.from('student_profiles').insert({
          user_id: data.user.id,
          student_id: `ST${Date.now().toString().slice(-5)}`,
          full_name: name,
          email,
        });
      } else {
        await supabase.from('manager_profiles').insert({
          user_id: data.user.id,
          manager_id: `MGR${Date.now().toString().slice(-5)}`,
          full_name: name,
          email,
        });
      }

      await loadUserProfile(data.user.id);
    }

    return { error: null };
  }, [useSupabase]);

  // Mock login (no Supabase — in-memory only)
  const login = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    setAuthScreen(null);
  }, []);

  // Logout — clears both Supabase session and local state
  const logout = useCallback(async () => {
    if (useSupabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setSupabaseUser(null);
    setSupabaseSession(null);
    setAuthScreen('role-select');
  }, [useSupabase]);

  const goToStudentLogin = useCallback(() => {
    setAuthScreen('student-login');
  }, []);

  const goToManagerLogin = useCallback(() => {
    setAuthScreen('manager-login');
  }, []);

  const goToRoleSelect = useCallback(() => {
    setAuthScreen('role-select');
  }, []);

  const isAuthenticated = currentUser !== null && authScreen === null;

  return (
    <AuthContext.Provider value={{
      currentUser,
      authScreen,
      login,
      logout,
      goToStudentLogin,
      goToManagerLogin,
      goToRoleSelect,
      isAuthenticated,
      isLoading,
      signInWithEmail,
      signUpWithEmail,
      supabaseUser,
      supabaseSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
