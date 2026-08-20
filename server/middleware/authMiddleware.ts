import { Request, Response, NextFunction } from 'express';
import { verifyToken, AdminTokenPayload } from '../utils/jwt';
import { authConfig } from '../config/auth';

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Extract token from Authorization header or cookie
  let token: string | null = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies[authConfig.cookieName]) {
    token = req.cookies[authConfig.cookieName];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication token is required',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
    return;
  }

  req.admin = payload;
  next();
}
