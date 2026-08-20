import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

export interface AdminTokenPayload {
  adminId: number;
  username: string;
  displayName: string;
}

export function generateToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, authConfig.sessionSecret, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, authConfig.sessionSecret) as AdminTokenPayload;
  } catch {
    return null;
  }
}
