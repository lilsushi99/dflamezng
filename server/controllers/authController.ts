import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validateLoginInput } from '../validations/authValidation';
import { authConfig } from '../config/auth';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const validation = validateLoginInput(req.body);
      if (!validation.isValid || !validation.data) {
        res.status(400).json({
          success: false,
          message: validation.error || 'Invalid login payload',
        });
        return;
      }

      const { username, password } = validation.data;
      const result = await authService.login(username, password);

      // Set HTTP-only cookie
      res.cookie(authConfig.cookieName, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Session lives in the httpOnly cookie set above - the raw token is
      // intentionally never included in the JSON body, so it's never
      // readable by client-side JavaScript (and therefore not stealable
      // via XSS the way a token in localStorage would be).
      res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        admin: result.admin,
      });
    } catch (error: any) {
      const message = error?.message === 'Invalid credentials' ? 'Invalid username or password' : 'Authentication failed';
      res.status(401).json({
        success: false,
        message,
      });
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const admin = await authService.getAdminById(req.admin.adminId);
      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Admin user not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        admin,
      });
    } catch (error: any) {
      console.error('[AuthController] getMe failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin profile',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie(authConfig.cookieName);
    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully',
    });
  }
}

export const authController = new AuthController();
