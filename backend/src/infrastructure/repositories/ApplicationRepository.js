// backend/src/infrastructure/repositories/ApplicationRepository.js
import { query } from '../db.js';

export class ApplicationRepository {
  async save(application) {
    const { rows } = await query(
      `INSERT INTO applications (job_id, candidate_name, candidate_email, candidate_phone, message, cv_name, cv_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        application.jobId,
        application.candidateName,
        application.candidateEmail,
        application.candidatePhone ?? null,
        application.message ?? null,
        application.cvName ?? null,
        application.cvData ?? null,
      ]
    );
    return rows[0];
  }

  async findByJobId(jobId) {
    // Para la lista, no devolvemos cv_data entero a menos que queramos
    // Pero como la DB puede manejar archivos pequeños, lo dejaremos para descargar directo.
    const { rows } = await query(
      `SELECT * FROM applications
       WHERE job_id = $1
       ORDER BY created_at DESC`,
      [jobId]
    );
    return rows;
  }
}

