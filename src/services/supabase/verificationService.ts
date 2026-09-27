import { supabase } from '../../lib/supabase';

export const getVerificationRecords = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('verification_records')
      .select('*')
      .eq('application_id', applicationId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createVerificationRecord = async (recordData: any) => {
  try {
    const { data, error } = await supabase
      .from('verification_records')
      .insert(recordData)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateVerificationRecord = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('verification_records')
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

export const getVerificationSummary = async (applicationId: string) => {
  try {
    const { data: records, error } = await supabase
      .from('verification_records')
      .select('*')
      .eq('application_id', applicationId);
      
    if (error) throw error;
    
    let pass = 0;
    let fail = 0;
    let pending = 0;
    
    records.forEach((record: any) => {
      if (record.status === 'PASS') pass++;
      else if (record.status === 'FAIL') fail++;
      else pending++;
    });
    
    return { 
      data: { records, summary: { pass, fail, pending } }, 
      error: null 
    };
  } catch (error) {
    return { data: null, error };
  }
};
