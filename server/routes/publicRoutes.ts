import { Router } from 'express';
import { publicController } from '../controllers/publicController';
import { publicSeoController } from '../controllers/publicSeoController';

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

// POST /api/inquiries
router.post('/inquiries', (req, res) => publicController.submitInquiry(req, res));

// ==========================================
// SEO & Dynamic Nigerian Location Routes
// ==========================================
// GET /api/seo/global
router.get('/seo/global', (req, res) => publicSeoController.getGlobalSeo(req, res));

// GET /api/seo/locations
router.get('/seo/locations', (req, res) => publicSeoController.getLocations(req, res));

// GET /api/seo/locations/:slug
router.get('/seo/locations/:slug', (req, res) => publicSeoController.getLocationBySlug(req, res));

export default router;
