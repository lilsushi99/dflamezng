import { Admin } from '../models/Admin';
import { isDatabaseConnected, query, execute } from '../database/db';

/**
 * Admin credentials are validated ONLY against the `admins` table in the
 * database. There is intentionally NO hardcoded/default admin, and NO
 * in-memory or file-based fallback here: if the database is not reachable,
 * login must fail rather than silently accepting a baked-in credential.
 *
 * To provision the first admin (or change credentials), insert/update a row
 * directly in phpMyAdmin. Use `server/scripts/hashPassword.ts` to generate a
 * bcrypt hash for the `password_hash` column - see that file for usage.
 */
export class AdminRepository {
  async findByUsername(username: string): Promise<Admin | null> {
    if (!isDatabaseConnected()) {
      throw new Error('Database connection unavailable. Admin authentication requires a live database connection.');
    }
    const rows = await query<Admin>(
      'SELECT id, username, password_hash, display_name, created_at, updated_at FROM admins WHERE username = ? LIMIT 1',
      [username]
    );
    return rows[0] || null;
  }

  async findById(id: number): Promise<Admin | null> {
    if (!isDatabaseConnected()) {
      throw new Error('Database connection unavailable. Admin authentication requires a live database connection.');
    }
    const rows = await query<Admin>(
      'SELECT id, username, password_hash, display_name, created_at, updated_at FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  async updatePassword(id: number, newPasswordHash: string): Promise<boolean> {
    if (!isDatabaseConnected()) {
      throw new Error('Database connection unavailable. Cannot update admin password.');
    }
    const result = await execute(
      'UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [newPasswordHash, id]
    );
    return (result?.affectedRows ?? 0) > 0;
  }
}

export const adminRepository = new AdminRepository();
