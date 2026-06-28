// backend/src/infrastructure/repositories/ApplicationRepository.js
import { query } from '../db.js';

export class ApplicationRepository {
  async save(application) {
    const { rows } = await query(
      `INSERT INTO applications (job_id, candidate_name, candidate_email, candidate_phone, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        application.jobId,
        application.candidateName,
        application.candidateEmail,
        application.candidatePhone ?? null,
        application.message ?? null,
      ]
    );
    return rows[0];
  }

  async findByJobId(jobId) {
    const { rows } = await query(
      `SELECT * FROM applications
       WHERE job_id = $1
       ORDER BY created_at DESC`,
      [jobId]
    );
    return rows;
  }
}
