import { Request, Response } from 'express';
import { settingsRepository } from '../repositories/settingsRepository';
import { contactRepository } from '../repositories/contactRepository';

export class AdminContactController {
  // GET /api/admin/contact-settings
  async getContactSettings(_req: Request, res: Response): Promise<void> {
    try {
      const siteSettings = await settingsRepository.getSiteSettings();
      res.status(200).json({
        success: true,
        settings: siteSettings,
      });
    } catch (error: any) {
      console.error('[adminContactController.ts]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve contact settings',
      });
    }
  }

  // PUT /api/admin/contact-settings
  async updateContactSettings(req: Request, res: Response): Promise<void> {
    try {
      const updated = await settingsRepository.updateSiteSettings(req.body);
      res.status(200).json({
        success: true,
        message: 'Contact & studio availability updated successfully',
        settings: updated,
      });
    } catch (error: any) {
      console.error('[adminContactController.ts]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact settings',
      });
    }
  }

  // GET /api/admin/inquiries
  async getInquiries(_req: Request, res: Response): Promise<void> {
    try {
      const inquiries = await contactRepository.getAllInquiries();
      res.status(200).json({
        success: true,
        inquiries,
      });
    } catch (error: any) {
      console.error('[adminContactController.ts]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inquiries',
      });
    }
  }

  // PUT /api/admin/inquiries/:id
  async updateInquiry(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { status, notes } = req.body;
      const updated = await contactRepository.updateInquiryStatus(id, status, notes);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Inquiry not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Inquiry updated',
        inquiry: updated,
      });
    } catch (error: any) {
      console.error('[adminContactController.ts]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inquiry',
      });
    }
  }

  // DELETE /api/admin/inquiries/:id
  async deleteInquiry(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await contactRepository.deleteInquiry(id);
      res.status(200).json({
        success: true,
        message: deleted ? 'Inquiry deleted' : 'Inquiry not found',
      });
    } catch (error: any) {
      console.error('[adminContactController.ts]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete inquiry',
      });
    }
  }
}

export const adminContactController = new AdminContactController();
