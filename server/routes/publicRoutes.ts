import { Router } from 'express';
import { publicController } from '../controllers/publicController';

const router = Router();

// GET /api/splash
router.get('/splash', (req, res) => publicController.getSplash(req, res));

// GET /api/home
router.get('/home', (req, res) => publicController.getHome(req, res));

// GET /api/home/socials
router.get('/home/socials', (req, res) => publicController.getSocials(req, res));

// GET /api/home/front-images
router.get('/home/front-images', (req, res) => publicController.getFrontImages(req, res));

// GET /api/home/back-images
router.get('/home/back-images', (req, res) => publicController.getBackImages(req, res));

// GET /api/projects
router.get('/projects', (req, res) => publicController.getProjects(req, res));

// GET /api/projects/:id
router.get('/projects/:id', (req, res) => publicController.getProjectById(req, res));

// GET /api/footer
router.get('/footer', (req, res) => publicController.getFooter(req, res));

export default router;
