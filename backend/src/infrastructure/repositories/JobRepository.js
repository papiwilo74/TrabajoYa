// backend/src/infrastructure/repositories/JobRepository.js
import { query } from '../db.js';

export class JobRepository {

  async save(job) {
    const { rows } = await query(
      `INSERT INTO jobs (id, employer_id, title, description, type, category, location, salary, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *, 0 AS applications_count`,
      [job.id, job.employerId, job.title, job.description, job.type,
       job.category, job.location, job.salary ?? null, job.status, job.createdAt]
    );
    return this._map(rows[0]);
  }

  async findAll() {
    const { rows } = await query(
      `SELECT j.*,
              COUNT(a.id) AS applications_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.status = 'open'
       GROUP BY j.id
       ORDER BY j.created_at DESC`
    );
    return rows.map(this._map);
  }

  async findByEmployerId(employerId) {
    const { rows } = await query(
      `SELECT j.*,
              COUNT(a.id) AS applications_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.employer_id = $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [employerId]
    );
    return rows.map(this._map);
  }

  async findById(id) {
    const { rows } = await query(
      `SELECT * FROM jobs WHERE id = $1`,
      [id]
    );
    return rows[0] ? this._map(rows[0]) : null;
  }

  async findByLocation(location) {
    const { rows } = await query(
      `SELECT j.*, COUNT(a.id) AS applications_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.status = 'open' AND j.location ILIKE $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [`%${location}%`]
    );
    return rows.map(this._map);
  }

  async findByCategory(category) {
    const { rows } = await query(
      `SELECT j.*, COUNT(a.id) AS applications_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.status = 'open' AND j.category = $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [category.toLowerCase()]
    );
    return rows.map(this._map);
  }

  _map(row) {
    return {
      id:                row.id,
      employerId:        row.employer_id,
      title:             row.title,
      description:       row.description,
      type:              row.type,
      category:          row.category,
      location:          row.location,
      salary:            row.salary,
      status:            row.status,
      createdAt:         row.created_at,
      applicationsCount: parseInt(row.applications_count ?? 0, 10),
    };
  }
}