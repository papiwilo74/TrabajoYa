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
      `SELECT id, name, email, role, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] ? this._map(rows[0]) : null;
  }

  async findByEmail(email) {
    const { rows } = await query(
      `SELECT id, name, email, password_hash, role, created_at
       FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  _map(row) {
    return {
      id:        row.id,
      name:      row.name,
      email:     row.email,
      role:      row.role,
      createdAt: row.created_at,
    };
  }
}
