import express from 'express';
import { healthController } from '../controllers/healthController';

const router = express.Router();

// GET /api/health - PUBLIC, intentionally minimal.
// Never expose database host/name/connection status, storage paths, or any
// other internal detail here - this endpoint is reachable by anyone on the
// internet. Detailed diagnostics live behind admin auth instead, at
// /api/admin/diagnostics.
router.get('/', (req, res) => healthController.getPublicHealth(req, res));

export default router;
