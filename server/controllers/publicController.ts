import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';
import { projectRepository } from '../repositories/projectRepository';
import { contactRepository } from '../repositories/contactRepository';
import { sendBookingEmails } from '../services/mailService';

export class PublicController {
  // POST /api/inquiries
  async submitInquiry(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, projectLocation, budget, projectBrief } = req.body;
      if (!name || !email || !phone || !projectLocation || !projectBrief) {
        res.status(400).json({
          success: false,
          message: 'Name, email, phone, project location, and project brief are required',
        });
        return;
      }

      const inquiry = await contactRepository.createInquiry({
        name: String(name).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        project_location: String(projectLocation).trim(),
        budget: budget ? String(budget).trim() : undefined,
        project_brief: String(projectBrief).trim(),
      });

      // Never let an email hiccup block or fail the booking itself - the
      // inquiry is already safely stored by this point.
      sendBookingEmails({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        project_location: inquiry.project_location,
        budget: inquiry.budget,
        project_brief: inquiry.project_brief,
      }).catch(() => {});

      res.status(201).json({
        success: true,
        message: 'Booking received successfully',
        inquiry,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit booking'
      });
    }
  }
  // GET /api/splash
  async getSplash(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsRepository.getSplashSettings();
      const images = await settingsRepository.getSplashImages();

      res.status(200).json({
        success: true,
        settings,
        images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve splash screen data'
      });
    }
  }

  // GET /api/home
  async getHome(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsRepository.getHomepageSettings();
      const siteSettings = await settingsRepository.getSiteSettings();
      const frontImages = await settingsRepository.getHomepageImages('FRONT');
      const backImages = await settingsRepository.getHomepageImages('BACK');
      const socialLinks = await settingsRepository.getSocialLinks(false); // active only

      res.status(200).json({
        success: true,
        settings,
        siteSettings,
        frontImages,
        backImages,
        socialLinks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve homepage data'
      });
    }
  }

  // GET /api/home/socials
  async getSocials(_req: Request, res: Response): Promise<void> {
    try {
      const socialLinks = await settingsRepository.getSocialLinks(false);
      res.status(200).json({
        success: true,
        socialLinks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve social links'
      });
    }
  }

  // GET /api/home/front-images
  async getFrontImages(_req: Request, res: Response): Promise<void> {
    try {
      const frontImages = await settingsRepository.getHomepageImages('FRONT');
      res.status(200).json({
        success: true,
        images: frontImages,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve homepage front images'
      });
    }
  }

  // GET /api/home/back-images
  async getBackImages(_req: Request, res: Response): Promise<void> {
    try {
      const backImages = await settingsRepository.getHomepageImages('BACK');
      res.status(200).json({
        success: true,
        images: backImages,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve homepage back images'
      });
    }
  }

  // GET /api/projects
  async getProjects(_req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectRepository.findAll();
      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects'
      });
    }
  }

  // GET /api/projects/:id
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid project ID',
        });
        return;
      }

      const project = await projectRepository.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        project,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve project details'
      });
    }
  }

  // GET /api/footer
  async getFooter(_req: Request, res: Response): Promise<void> {
    try {
      const footer = await settingsRepository.getFooterSettings();
      res.status(200).json({
        success: true,
        footer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve footer settings'
      });
    }
  }
}

export const publicController = new PublicController();
