import { adminRepository } from '../repositories/adminRepository';
import { comparePassword } from '../utils/password';
import { generateToken, AdminTokenPayload } from '../utils/jwt';
import { AdminSafeProfile } from '../models/Admin';

export interface LoginResult {
  token: string;
  admin: AdminSafeProfile;
}

export class AuthService {
  async login(username: string, plainPassword: string): Promise<LoginResult> {
    const admin = await adminRepository.findByUsername(username);
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(plainPassword, admin.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload: AdminTokenPayload = {
      adminId: admin.id,
      username: admin.username,
      displayName: admin.display_name,
    };

    const token = generateToken(payload);

    const safeProfile: AdminSafeProfile = {
      id: admin.id,
      username: admin.username,
      display_name: admin.display_name,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    };

    return {
      token,
      admin: safeProfile,
    };
  }

  async getAdminById(id: number): Promise<AdminSafeProfile | null> {
    const admin = await adminRepository.findById(id);
    if (!admin) return null;

    return {
      id: admin.id,
      username: admin.username,
      display_name: admin.display_name,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    };
  }
}

export const authService = new AuthService();
