import { Admin } from '../models/Admin';
import { isDatabaseConnected, query, execute } from '../database/db';
import { defaultAdmins } from '../database/seedData';

// Fallback in-memory state
let localAdmins: Admin[] = [...defaultAdmins];

export class AdminRepository {
  async findByUsername(username: string): Promise<Admin | null> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<Admin>(
          'SELECT id, username, password_hash, display_name, created_at, updated_at FROM admins WHERE username = ? LIMIT 1',
          [username]
        );
        return rows[0] || null;
      } catch (e) {
        console.warn('[AdminRepository] Falling back to local store for findByUsername:', e);
      }
    }
    return localAdmins.find((a) => a.username.toLowerCase() === username.toLowerCase()) || null;
  }

  async findById(id: number): Promise<Admin | null> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<Admin>(
          'SELECT id, username, password_hash, display_name, created_at, updated_at FROM admins WHERE id = ? LIMIT 1',
          [id]
        );
        return rows[0] || null;
      } catch (e) {
        console.warn('[AdminRepository] Falling back to local store for findById:', e);
      }
    }
    return localAdmins.find((a) => a.id === id) || null;
  }

  async updatePassword(id: number, newPasswordHash: string): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute(
          'UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE id = ?',
          [newPasswordHash, id]
        );
        return true;
      } catch (e) {
        console.warn('[AdminRepository] Falling back to local store for updatePassword:', e);
      }
    }
    const admin = localAdmins.find((a) => a.id === id);
    if (admin) {
      admin.password_hash = newPasswordHash;
      admin.updated_at = new Date();
      return true;
    }
    return false;
  }
}

export const adminRepository = new AdminRepository();
