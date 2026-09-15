import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { loginRateLimiter } from '../middleware/rateLimiters';

const router = Router();

// POST /api/auth/login
router.post('/login', loginRateLimiter, (req, res) => authController.login(req, res));

// GET /api/auth/me (Protected route)
router.get('/me', requireAdminAuth, (req, res) => authController.getMe(req, res));

// POST /api/auth/logout
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
