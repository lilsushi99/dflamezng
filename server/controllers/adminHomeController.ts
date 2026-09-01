import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';
import { projectRepository } from '../repositories/projectRepository';

export class AdminHomeController {
  // GET /api/admin/home
  async getHomeData(req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsRepository.getHomepageSettings();
      const frontImages = await settingsRepository.getHomepageImages('FRONT');
      const backImages = await settingsRepository.getHomepageImages('BACK');
      const socialLinks = await settingsRepository.getSocialLinks(true);
      const allProjects = await projectRepository.findAll();

      const simplifiedProjects = allProjects.map((p) => ({
        id: p.id,
        name: p.name,
        year: p.year,
        category: p.category,
      }));

      res.status(200).json({
        success: true,
        settings,
        frontImages,
        backImages,
        socialLinks,
        projects: simplifiedProjects,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve home screen data',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/home/settings
  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const {
        logo_type,
        navbar_logo_text,
        logo_image_path,
        navbar_projects_label,
        navbar_contact_label,
        theme_toggle_visible,
        theme_mode,
        photographer_name,
        top_track_speed,
        bottom_track_speed,
        hero_quote,
        hero_subtext,
      } = req.body;

      const updated = await settingsRepository.updateHomepageSettings({
        logo_type: logo_type === 'IMAGE' ? 'IMAGE' : logo_type === 'TEXT' ? 'TEXT' : undefined,
        navbar_logo_text: typeof navbar_logo_text === 'string' ? navbar_logo_text : undefined,
        logo_image_path: logo_image_path !== undefined ? logo_image_path : undefined,
        navbar_projects_label: typeof navbar_projects_label === 'string' ? navbar_projects_label : undefined,
        navbar_contact_label: typeof navbar_contact_label === 'string' ? navbar_contact_label : undefined,
        theme_toggle_visible: theme_toggle_visible !== undefined ? Boolean(theme_toggle_visible) : undefined,
        theme_mode: theme_mode === 'LIGHT' ? 'LIGHT' : theme_mode === 'DARK' ? 'DARK' : undefined,
        photographer_name: typeof photographer_name === 'string' ? photographer_name : undefined,
        top_track_speed: top_track_speed !== undefined ? Number(top_track_speed) : undefined,
        bottom_track_speed: bottom_track_speed !== undefined ? Number(bottom_track_speed) : undefined,
        hero_quote: hero_quote !== undefined ? hero_quote : undefined,
        hero_subtext: hero_subtext !== undefined ? hero_subtext : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Home screen settings updated successfully',
        settings: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update home screen settings',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/home/logo/upload (Device file upload for Logo)
  async uploadLogo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No logo file was uploaded',
        });
        return;
      }

      const filePath = `/storage/logos/${req.file.filename}`;
      const updated = await settingsRepository.updateHomepageSettings({
        logo_image_path: filePath,
        logo_type: 'IMAGE',
      });

      res.status(200).json({
        success: true,
        message: 'Logo uploaded and published successfully',
        logo_image_path: filePath,
        settings: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload logo',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/home/logo
  async deleteLogo(req: Request, res: Response): Promise<void> {
    try {
      const updated = await settingsRepository.updateHomepageSettings({
        logo_image_path: null,
        logo_type: 'TEXT',
      });

      res.status(200).json({
        success: true,
        message: 'Logo image removed; reverted to text logo',
        settings: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove logo image',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/homepage/images/upload
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No image file was uploaded',
        });
        return;
      }

      const track = (req.body.track || 'FRONT').toUpperCase() === 'BACK' ? 'BACK' : 'FRONT';
      const projectId = req.body.project_id && req.body.project_id !== 'null' && req.body.project_id !== 'none'
        ? Number(req.body.project_id)
        : null;

      const filePath = track === 'BACK'
        ? `/storage/homepage/back/${req.file.filename}`
        : `/storage/homepage/front/${req.file.filename}`;

      const newImage = await settingsRepository.addHomepageImage({
        file_path: filePath,
        external_url: null,
        source_type: 'local',
        track,
        project_id: projectId,
        display_order: req.body.display_order ? Number(req.body.display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: `${track} track image uploaded successfully`,
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload homepage image',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/homepage/images/url
  async addImageUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url, track, project_id, display_order } = req.body;

      if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) {
        res.status(400).json({
          success: false,
          message: 'A valid HTTP or HTTPS image URL is required',
        });
        return;
      }

      const validTrack = (track || 'FRONT').toUpperCase() === 'BACK' ? 'BACK' : 'FRONT';
      const projectId = project_id && project_id !== 'null' && project_id !== 'none'
        ? Number(project_id)
        : null;

      const newImage = await settingsRepository.addHomepageImage({
        file_path: null,
        external_url: url.trim(),
        source_type: 'external',
        track: validTrack,
        project_id: projectId,
        display_order: display_order ? Number(display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: `${validTrack} track image URL added successfully`,
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to add homepage image URL',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/homepage/images/:id
  async updateImage(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { project_id, track, display_order } = req.body;

      const projectId = project_id === null || project_id === 'null' || project_id === 'none' || project_id === ''
        ? null
        : project_id !== undefined
          ? Number(project_id)
          : undefined;

      const updated = await settingsRepository.updateHomepageImage(id, {
        project_id: projectId,
        track,
        display_order: display_order !== undefined ? Number(display_order) : undefined,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Homepage image not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Homepage image updated successfully',
        image: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update homepage image',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/homepage/images/reorder
  async reorderImages(req: Request, res: Response): Promise<void> {
    try {
      const { track, ordered_ids } = req.body;
      const validTrack = (track || 'FRONT').toUpperCase() === 'BACK' ? 'BACK' : 'FRONT';

      if (!Array.isArray(ordered_ids)) {
        res.status(400).json({
          success: false,
          message: 'ordered_ids must be an array of image IDs',
        });
        return;
      }

      const images = await settingsRepository.reorderHomepageImages(validTrack, ordered_ids.map(Number));

      res.status(200).json({
        success: true,
        message: `${validTrack} track images reordered successfully`,
        images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reorder homepage images',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/homepage/images/:id
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await settingsRepository.deleteHomepageImage(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Homepage image not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Homepage image deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete homepage image',
        error: error?.message,
      });
    }
  }

  // ==========================================
  // Social Links Handlers
  // ==========================================
  // POST /api/admin/social-links
  async addSocialLink(req: Request, res: Response): Promise<void> {
    try {
      const { platform_key, label, url, display_order, is_active } = req.body;

      if (!label || !url) {
        res.status(400).json({
          success: false,
          message: 'Label and URL are required for a social link',
        });
        return;
      }

      const key = platform_key || label.toLowerCase().replace(/[^a-z0-9]/g, '');

      const link = await settingsRepository.addSocialLink({
        platform_key: key,
        label: label.trim(),
        url: url.trim(),
        display_order: display_order ? Number(display_order) : 0,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
      });

      res.status(201).json({
        success: true,
        message: 'Social link created successfully',
        link,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create social link',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/social-links/:id
  async updateSocialLink(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { platform_key, label, url, display_order, is_active } = req.body;

      const link = await settingsRepository.updateSocialLink(id, {
        platform_key: platform_key ? String(platform_key).trim() : undefined,
        label: label ? String(label).trim() : undefined,
        url: url ? String(url).trim() : undefined,
        display_order: display_order !== undefined ? Number(display_order) : undefined,
        is_active: is_active !== undefined ? Boolean(is_active) : undefined,
      });

      if (!link) {
        res.status(404).json({
          success: false,
          message: 'Social link not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Social link updated successfully',
        link,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update social link',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/social-links/reorder
  async reorderSocialLinks(req: Request, res: Response): Promise<void> {
    try {
      const { ordered_ids } = req.body;
      if (!Array.isArray(ordered_ids)) {
        res.status(400).json({
          success: false,
          message: 'ordered_ids must be an array of social link IDs',
        });
        return;
      }

      const links = await settingsRepository.reorderSocialLinks(ordered_ids.map(Number));

      res.status(200).json({
        success: true,
        message: 'Social links reordered successfully',
        links,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reorder social links',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/social-links/:id
  async deleteSocialLink(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await settingsRepository.deleteSocialLink(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Social link not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Social link deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete social link',
        error: error?.message,
      });
    }
  }

  // GET /api/admin/site-settings
  async getSiteSettings(req: Request, res: Response): Promise<void> {
    try {
      const siteSettings = await settingsRepository.getSiteSettings();
      res.status(200).json({
        success: true,
        siteSettings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch site settings',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/site-settings
  async updateSiteSettings(req: Request, res: Response): Promise<void> {
    try {
      const updated = await settingsRepository.updateSiteSettings(req.body);
      res.status(200).json({
        success: true,
        message: 'Site settings updated successfully',
        siteSettings: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update site settings',
        error: error?.message,
      });
    }
  }
}

export const adminHomeController = new AdminHomeController();
