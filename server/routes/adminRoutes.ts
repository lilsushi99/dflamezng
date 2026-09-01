import { Router } from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware';
import {
  uploadSplash,
  uploadHomepageFront,
  uploadHomepageBack,
  uploadProject,
  uploadLogo,
} from '../middleware/uploadMiddleware';
import { adminSplashController } from '../controllers/adminSplashController';
import { adminHomeController } from '../controllers/adminHomeController';
import { adminProjectController } from '../controllers/adminProjectController';
import { adminFooterController } from '../controllers/adminFooterController';
import { adminSeoController } from '../controllers/adminSeoController';
import { adminContactController } from '../controllers/adminContactController';

const router = Router();

// All routes in /api/admin/* require authentication
router.use(requireAdminAuth);

// ==========================================
// 1. SPLASH SCREEN ROUTES
// ==========================================
// GET /api/admin/splash - fetch settings & images
router.get('/splash', (req, res) => adminSplashController.getSplash(req, res));

// PUT /api/admin/splash/settings - update settings
router.put('/splash/settings', (req, res) => adminSplashController.updateSettings(req, res));

// POST /api/admin/splash/images/upload - upload from device
router.post('/splash/images/upload', uploadSplash.single('image'), (req, res) =>
  adminSplashController.uploadImage(req, res)
);

// POST /api/admin/splash/images/url - add by URL
router.post('/splash/images/url', (req, res) => adminSplashController.addImageUrl(req, res));

// PUT /api/admin/splash/images/reorder - reorder images
router.put('/splash/images/reorder', (req, res) => adminSplashController.reorderImages(req, res));

// PUT /api/admin/splash/images/:id - update individual splash image
router.put('/splash/images/:id', (req, res) => adminSplashController.updateImage(req, res));

// DELETE /api/admin/splash/images/:id - delete image
router.delete('/splash/images/:id', (req, res) => adminSplashController.deleteImage(req, res));

// ==========================================
// 2. HOME SCREEN & LOGO ROUTES
// ==========================================
// GET /api/admin/site-settings - fetch global site settings
router.get('/site-settings', (req, res) => adminHomeController.getSiteSettings(req, res));

// PUT /api/admin/site-settings - update global site settings
router.put('/site-settings', (req, res) => adminHomeController.updateSiteSettings(req, res));

// GET /api/admin/home - fetch settings, front/back images, social links, project references
router.get('/home', (req, res) => adminHomeController.getHomeData(req, res));

// PUT /api/admin/home/settings - update navbar and home settings
router.put('/home/settings', (req, res) => adminHomeController.updateSettings(req, res));

// POST /api/admin/home/logo/upload - upload custom logo image
router.post('/home/logo/upload', uploadLogo.single('logo'), (req, res) =>
  adminHomeController.uploadLogo(req, res)
);

// DELETE /api/admin/home/logo - remove logo image
router.delete('/home/logo', (req, res) => adminHomeController.deleteLogo(req, res));

// POST /api/admin/homepage/images/upload - upload front/back image from device
router.post(
  '/homepage/images/upload',
  (req, res, next) => {
    const track = (req.query.track || req.body.track || 'FRONT').toString().toUpperCase();
    if (track === 'BACK') {
      uploadHomepageBack.single('image')(req, res, next);
    } else {
      uploadHomepageFront.single('image')(req, res, next);
    }
  },
  (req, res) => adminHomeController.uploadImage(req, res)
);

// POST /api/admin/homepage/images/url - add front/back image by URL
router.post('/homepage/images/url', (req, res) => adminHomeController.addImageUrl(req, res));

// PUT /api/admin/homepage/images/:id - update image (link project, track, order)
router.put('/homepage/images/:id', (req, res) => adminHomeController.updateImage(req, res));

// PUT /api/admin/homepage/images/reorder - reorder track images
router.put('/homepage/images/reorder', (req, res) => adminHomeController.reorderImages(req, res));

// DELETE /api/admin/homepage/images/:id - delete image
router.delete('/homepage/images/:id', (req, res) => adminHomeController.deleteImage(req, res));

// Social links CRUD
router.post('/social-links', (req, res) => adminHomeController.addSocialLink(req, res));
router.put('/social-links/:id', (req, res) => adminHomeController.updateSocialLink(req, res));
router.put('/social-links/reorder/batch', (req, res) => adminHomeController.reorderSocialLinks(req, res));
router.delete('/social-links/:id', (req, res) => adminHomeController.deleteSocialLink(req, res));

// ==========================================
// 3. PROJECTS & CATEGORIES ROUTES
// ==========================================
// GET /api/admin/projects - list all projects
router.get('/projects', (req, res) => adminProjectController.getAllProjects(req, res));

// POST /api/admin/projects - create a new project
router.post('/projects', (req, res) => adminProjectController.createProject(req, res));

// GET /api/admin/projects/:id - single project details
router.get('/projects/:id', (req, res) => adminProjectController.getProjectById(req, res));

// PUT /api/admin/projects/:id - update project details
router.put('/projects/:id', (req, res) => adminProjectController.updateProject(req, res));

// DELETE /api/admin/projects/:id - delete a project
router.delete('/projects/:id', (req, res) => adminProjectController.deleteProject(req, res));

// Categories CRUD
router.get('/categories', (req, res) => adminProjectController.getCategories(req, res));
router.post('/categories', (req, res) => adminProjectController.createCategory(req, res));
router.put('/categories/:id', (req, res) => adminProjectController.updateCategory(req, res));
router.delete('/categories/:id', (req, res) => adminProjectController.deleteCategory(req, res));

// POST /api/admin/projects/:id/images/upload - upload gallery image from device
router.post('/projects/:id/images/upload', uploadProject.single('image'), (req, res) =>
  adminProjectController.uploadImage(req, res)
);

// POST /api/admin/projects/:id/images/url - add gallery image by URL
router.post('/projects/:id/images/url', (req, res) => adminProjectController.addImageUrl(req, res));

// PUT /api/admin/projects/:id/images/reorder - reorder gallery images
router.put('/projects/:id/images/reorder', (req, res) => adminProjectController.reorderImages(req, res));

// DELETE /api/admin/projects/images/:imageId - delete gallery image
router.delete('/projects/images/:imageId', (req, res) => adminProjectController.deleteImage(req, res));

// ==========================================
// 4. FOOTER ROUTES
// ==========================================
// GET /api/admin/footer - get footer settings
router.get('/footer', (req, res) => adminFooterController.getFooter(req, res));

// PUT /api/admin/footer - update footer settings
router.put('/footer', (req, res) => adminFooterController.updateFooter(req, res));

// ==========================================
// 5. SEO & LOCATIONS ROUTES
// ==========================================
// GET /api/admin/seo - get global SEO config & stats
router.get('/seo', (req, res) => adminSeoController.getGlobalSeo(req, res));

// PUT /api/admin/seo/global - update global SEO config
router.put('/seo/global', (req, res) => adminSeoController.updateGlobalSeo(req, res));

// GET /api/admin/seo/locations - get all SEO location landing pages
router.get('/seo/locations', (req, res) => adminSeoController.getAllLocations(req, res));

// GET /api/admin/seo/locations/:id - get location page by ID
router.get('/seo/locations/:id', (req, res) => adminSeoController.getLocationById(req, res));

// POST /api/admin/seo/locations - create new location page
router.post('/seo/locations', (req, res) => adminSeoController.createLocation(req, res));

// PUT /api/admin/seo/locations/:id - update location page
router.put('/seo/locations/:id', (req, res) => adminSeoController.updateLocation(req, res));

// DELETE /api/admin/seo/locations/:id - delete location page
router.delete('/seo/locations/:id', (req, res) => adminSeoController.deleteLocation(req, res));

// ==========================================
// 6. CONTACT & INQUIRIES ROUTES
// ==========================================
// GET /api/admin/contact-settings - get contact settings
router.get('/contact-settings', (req, res) => adminContactController.getContactSettings(req, res));

// PUT /api/admin/contact-settings - update contact settings
router.put('/contact-settings', (req, res) => adminContactController.updateContactSettings(req, res));

// GET /api/admin/inquiries - list all client inquiries
router.get('/inquiries', (req, res) => adminContactController.getInquiries(req, res));

// PUT /api/admin/inquiries/:id - update status / notes
router.put('/inquiries/:id', (req, res) => adminContactController.updateInquiry(req, res));

// DELETE /api/admin/inquiries/:id - delete inquiry
router.delete('/inquiries/:id', (req, res) => adminContactController.deleteInquiry(req, res));

export default router;
