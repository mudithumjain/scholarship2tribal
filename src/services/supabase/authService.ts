import { supabase } from '../../lib/supabase';

export const signUpStudent = async (email: string, password: string, studentName: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: studentName,
          role: 'STUDENT'
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    // Create user row
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        role: 'STUDENT',
        name: studentName
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create student_profiles row
    const { data: profileData, error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: userData.id
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { data: { auth: authData, user: userData, profile: profileData }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signUpManager = async (email: string, password: string, managerName: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: managerName,
          role: 'MANAGER'
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        role: 'MANAGER',
        name: managerName
      })
      .select()
      .single();

    if (userError) throw userError;

    const { data: profileData, error: profileError } = await supabase
      .from('manager_profiles')
      .insert({
        user_id: userData.id
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { data: { auth: authData, user: userData, profile: profileData }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserRole = async (authId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', authId)
      .single();
    if (error) throw error;
    return { data: data.role, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserProfile = async (authId: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();
      
    if (userError) throw userError;

    let profile = null;
    if (user.role === 'STUDENT') {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!error) profile = data;
    } else if (user.role === 'MANAGER') {
      const { data, error } = await supabase
        .from('manager_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!error) profile = data;
    }

    return { data: { user, profile }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

export const demoStudentLogin = async () => {
  return signInWithEmail('demo.student@tribalscholar.in', 'demo123456');
};

export const demoManagerLogin = async () => {
  return signInWithEmail('demo.manager@tribalscholar.in', 'demo123456');
};
