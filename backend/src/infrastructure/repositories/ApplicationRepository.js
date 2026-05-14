// backend/src/infrastructure/repositories/ApplicationRepository.js
import { supabase } from '../supabaseClient.js';

export class ApplicationRepository {
  async save(application) {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: application.jobId,
        candidate_name: application.candidateName,
        candidate_email: application.candidateEmail,
        candidate_phone: application.candidatePhone ?? null,
        message: application.message ?? null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByJobId(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}
