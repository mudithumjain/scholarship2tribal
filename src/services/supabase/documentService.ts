import { supabase } from '../../lib/supabase';

export const getStudentDocuments = async (studentProfileId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('student_profile_id', studentProfileId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getApplicationDocuments = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const uploadDocument = async (file: File, studentProfileId: string, documentType: string, metadata: any) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `${studentProfileId}/${documentType}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('scholarship-documents')
      .upload(storagePath, file);
      
    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        student_profile_id: studentProfileId,
        document_type: documentType,
        storage_path: storagePath,
        file_name: file.name,
        ...metadata
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getDocumentUrl = async (storagePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('scholarship-documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry
      
    if (error) throw error;
    return { data: data.signedUrl, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateDocumentVerification = async (docId: string, status: string, remarks?: string) => {
  try {
    const updateData: any = { verification_status: status };
    if (remarks) updateData.remarks = remarks;

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', docId)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
