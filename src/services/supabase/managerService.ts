import { supabase } from '../../lib/supabase';

export const getManualReviews = async (managerId?: string) => {
  try {
    let query = supabase.from('manual_reviews').select('*');
    if (managerId) {
      query = query.eq('manager_id', managerId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getManualReviewById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('manual_reviews')
      .select(`
        *,
        application:applications(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateManualReview = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('manual_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const requestCorrection = async (reviewId: string, reason: string, managerId: string) => {
  try {
    const { data: reviewData, error: reviewError } = await supabase
      .from('manual_reviews')
      .update({
        status: 'CORRECTION_REQUESTED',
        remarks: reason,
        manager_id: managerId
      })
      .eq('id', reviewId)
      .select()
      .single();
      
    if (reviewError) throw reviewError;

    if (reviewData?.application_id) {
      await supabase
        .from('applications')
        .update({ status: 'ACTION_REQUIRED' })
        .eq('id', reviewData.application_id);
    }

    return { data: reviewData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const approveReview = async (reviewId: string, remarks: string, managerId: string) => {
  try {
    const { data, error } = await supabase
      .from('manual_reviews')
      .update({
        status: 'APPROVED',
        remarks,
        manager_id: managerId
      })
      .eq('id', reviewId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const rejectReview = async (reviewId: string, reason: string, managerId: string) => {
  try {
    const { data, error } = await supabase
      .from('manual_reviews')
      .update({
        status: 'REJECTED',
        remarks: reason,
        manager_id: managerId
      })
      .eq('id', reviewId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getDashboardStats = async () => {
  try {
    const [
      { count: totalApps },
      { count: verifiedApps },
      { count: pendingApps },
      { count: manualReviews },
      { count: todayApps }
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'VERIFIED'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('manual_reviews').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())
    ]);

    return { 
      data: { 
        totalApplications: totalApps || 0,
        verifiedApplications: verifiedApps || 0,
        pendingApplications: pendingApps || 0,
        manualReviews: manualReviews || 0,
        todayApplications: todayApps || 0
      }, 
      error: null 
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const getOfficerReviewItems = async () => {
  try {
    const { data, error } = await supabase
      .from('manual_reviews')
      .select(`
        *,
        application:applications(
          *,
          student:student_profiles(*)
        )
      `)
      .in('status', ['PENDING_REVIEW', 'OPEN', 'IN_REVIEW', 'CORRECTION_REQUESTED']);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
