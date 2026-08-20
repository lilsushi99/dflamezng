import { Router } from 'express';
import authRoutes from './authRoutes';
import healthRoutes from './healthRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// Mount sub-routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/admin', adminRoutes);

export default router;
