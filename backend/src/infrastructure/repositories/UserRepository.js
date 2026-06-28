// backend/src/infrastructure/repositories/UserRepository.js
import { query } from '../db.js';

export class UserRepository {

  async save({ id, name, email, passwordHash, role }) {
    const { rows } = await query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, created_at`,
      [id, name, email, passwordHash, role]
    );
    return this._map(rows[0]);
  }

  async findById(id) {
    const { rows } = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] ? this._map(rows[0]) : null;
  }

  async findByEmail(email) {
    const { rows } = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  async update(id, fields) {
    // Only update allowed profile fields
    const updates = [];
    const values = [];
    let i = 1;

    const allowedFields = [
      'bio', 'phone', 'city', 'skills', 'experience',
      'education', 'linkedin', 'github', 'avatar_base64', 'name'
    ];

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${i}`);
        // For arrays like skills, PostgreSQL pg handles JS arrays natively
        values.push(fields[key]);
        i++;
      }
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${i}
       RETURNING *`,
      values
    );

    return rows[0] ? this._map(rows[0]) : null;
  }

  _map(row) {
    return {
      id:            row.id,
      name:          row.name,
      email:         row.email,
      role:          row.role,
      bio:           row.bio,
      phone:         row.phone,
      city:          row.city,
      skills:        row.skills || [],
      experience:    row.experience,
      education:     row.education,
      linkedin:      row.linkedin,
      github:        row.github,
      avatarBase64:  row.avatar_base64,
      createdAt:     row.created_at,
    };
  }
}
