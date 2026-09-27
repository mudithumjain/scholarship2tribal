import { supabase } from '../../lib/supabase';

export const getStudentPayments = async (studentProfileId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_profile_id', studentProfileId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getPaymentsByApplication = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('application_id', applicationId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllPayments = async () => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        application:applications(*),
        student:student_profiles(*)
      `);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updatePaymentStatus = async (id: string, status: string, transactionRef?: string) => {
  try {
    const updateData: any = { status };
    if (transactionRef) updateData.transaction_ref = transactionRef;

    const { data, error } = await supabase
      .from('payments')
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
