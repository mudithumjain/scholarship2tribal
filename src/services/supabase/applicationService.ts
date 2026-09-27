import { supabase } from '../../lib/supabase';

export const getStudentApplications = async (studentProfileId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        scholarship:scholarships(name)
      `)
      .eq('student_profile_id', studentProfileId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getApplicationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        scholarship:scholarships(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createApplication = async (applicationData: any) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateApplicationStatus = async (id: string, status: string, remarks?: string) => {
  try {
    const updateData: any = { status };
    if (remarks) updateData.remarks = remarks;

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const submitApplication = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student:student_profiles(*),
        scholarship:scholarships(*)
      `);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getApplicationsByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student:student_profiles(*),
        scholarship:scholarships(*)
      `)
      .eq('status', status);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getApplicationStats = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status');
      
    if (error) throw error;
    
    const stats: Record<string, number> = {};
    data.forEach((app: any) => {
      stats[app.status] = (stats[app.status] || 0) + 1;
    });
    
    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
