import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';

export class AdminSplashController {
  // GET /api/admin/splash
  async getSplash(req: Request, res: Response): Promise<void> {
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

  // PUT /api/admin/splash/settings
  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const {
        photographer_name,
        signature_text,
        splash_subtext,
        typewriter_enabled,
        is_enabled,
        typing_speed_ms,
        stack_duration_ms,
      } = req.body;

      const updated = await settingsRepository.updateSplashSettings({
        photographer_name: typeof photographer_name === 'string' ? photographer_name : undefined,
        signature_text: typeof signature_text === 'string' ? signature_text : (typeof photographer_name === 'string' ? photographer_name : undefined),
        splash_subtext: splash_subtext !== undefined ? splash_subtext : undefined,
        typewriter_enabled: typewriter_enabled !== undefined ? Boolean(typewriter_enabled) : undefined,
        is_enabled: is_enabled !== undefined ? Boolean(is_enabled) : undefined,
        typing_speed_ms: typing_speed_ms !== undefined ? Number(typing_speed_ms) : undefined,
        stack_duration_ms: stack_duration_ms !== undefined ? Number(stack_duration_ms) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Splash screen settings updated successfully',
        settings: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update splash screen settings',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/splash/images/upload (device upload)
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No image file was uploaded',
        });
        return;
      }

      const filePath = `/storage/splash/${req.file.filename}`;
      const newImage = await settingsRepository.addSplashImage({
        file_path: filePath,
        external_url: null,
        source_type: 'local',
        display_order: req.body.display_order ? Number(req.body.display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: 'Splash image uploaded successfully',
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload splash image',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/splash/images/url (URL upload)
  async addImageUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url, display_order } = req.body;

      if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) {
        res.status(400).json({
          success: false,
          message: 'A valid HTTP or HTTPS image URL is required',
        });
        return;
      }

      const newImage = await settingsRepository.addSplashImage({
        file_path: null,
        external_url: url.trim(),
        source_type: 'external',
        display_order: display_order ? Number(display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: 'Splash image URL added successfully',
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to add splash image URL',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/splash/images/reorder
  async reorderImages(req: Request, res: Response): Promise<void> {
    try {
      const { ordered_ids } = req.body;
      if (!Array.isArray(ordered_ids)) {
        res.status(400).json({
          success: false,
          message: 'ordered_ids must be an array of image IDs',
        });
        return;
      }

      const images = await settingsRepository.reorderSplashImages(ordered_ids.map(Number));

      res.status(200).json({
        success: true,
        message: 'Splash images reordered successfully',
        images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reorder splash images',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/splash/images/:id (update single splash image)
  async updateImage(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid image ID' });
        return;
      }

      const { display_order } = req.body;
      const updated = await settingsRepository.updateSplashImage(id, {
        display_order: display_order !== undefined ? Number(display_order) : undefined,
      });

      if (!updated) {
        res.status(404).json({ success: false, message: 'Image not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Splash image saved successfully',
        image: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update splash image',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/splash/images/:id
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid image ID',
        });
        return;
      }

      const deleted = await settingsRepository.deleteSplashImage(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Image not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Splash image deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete splash image',
        error: error?.message,
      });
    }
  }
}

export const adminSplashController = new AdminSplashController();
