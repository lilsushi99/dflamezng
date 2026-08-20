import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';

export class AdminFooterController {
  // GET /api/admin/footer
  async getFooter(req: Request, res: Response): Promise<void> {
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

  // PUT /api/admin/footer
  async updateFooter(req: Request, res: Response): Promise<void> {
    try {
      const { copyright_text, designer_label, designer_name, designer_url } = req.body;

      const updated = await settingsRepository.updateFooterSettings({
        copyright_text: copyright_text !== undefined ? String(copyright_text).trim() : undefined,
        designer_label: designer_label !== undefined ? String(designer_label).trim() : undefined,
        designer_name: designer_name !== undefined ? String(designer_name).trim() : undefined,
        designer_url: designer_url !== undefined ? String(designer_url).trim() : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Footer settings updated successfully',
        footer: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update footer settings',
        error: error?.message,
      });
    }
  }
}

export const adminFooterController = new AdminFooterController();
