import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';
import { projectRepository } from '../repositories/projectRepository';
import { contactRepository } from '../repositories/contactRepository';

export class PublicController {
  // POST /api/inquiries
  async submitInquiry(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, projectType, timeline, message, budget } = req.body;
      if (!name || !email || !message) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and message are required',
        });
        return;
      }

      const inquiry = await contactRepository.createInquiry({
        name: String(name).trim(),
        email: String(email).trim(),
        project_type: String(projectType || 'Editorial & Fashion').trim(),
        timeline: String(timeline || 'Within 1-2 Months').trim(),
        message: String(message).trim(),
        budget: budget ? String(budget).trim() : undefined,
      });

      res.status(201).json({
        success: true,
        message: 'Inquiry received successfully',
        inquiry,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit inquiry',
        error: error?.message,
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
        message: 'Failed to retrieve splash screen data',
        error: error?.message,
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
        message: 'Failed to retrieve homepage data',
        error: error?.message,
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
        message: 'Failed to retrieve social links',
        error: error?.message,
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
        message: 'Failed to retrieve homepage front images',
        error: error?.message,
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
        message: 'Failed to retrieve homepage back images',
        error: error?.message,
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
        message: 'Failed to retrieve projects',
        error: error?.message,
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
        message: 'Failed to retrieve project details',
        error: error?.message,
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
        message: 'Failed to retrieve footer settings',
        error: error?.message,
      });
    }
  }
}

export const publicController = new PublicController();
