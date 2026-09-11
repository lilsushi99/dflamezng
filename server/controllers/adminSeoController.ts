import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { seoRepository } from '../repositories/seoRepository';
import { persistentStorageRoot } from '../config/storage';

export class AdminSeoController {
  // GET /api/admin/seo
  async getGlobalSeo(req: Request, res: Response): Promise<void> {
    try {
      const rawSeo = await seoRepository.getGlobalSeo();
      const locations = await seoRepository.getAllLocations();

      const seo = {
        ...rawSeo,
        meta_title: rawSeo.site_title,
        meta_keywords: rawSeo.primary_keywords,
      };

      res.status(200).json({
        success: true,
        seo,
        locationsCount: locations.length,
        publishedCount: locations.filter((l) => l.is_published).length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve SEO settings',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/seo/global
  async updateGlobalSeo(req: Request, res: Response): Promise<void> {
    try {
      const {
        site_title,
        meta_title,
        meta_description,
        primary_keywords,
        meta_keywords,
        secondary_keywords,
        canonical_url,
        og_title,
        og_description,
        google_site_verification,
        robots_indexing,
        schema_type,
      } = req.body;

      // NOTE: og_image_url and favicon_path are intentionally NOT accepted
      // here as raw text - they are local storage paths only, set exclusively
      // via the dedicated upload endpoints below (uploadFavicon / uploadOgImage).

      const resolvedTitle = site_title || meta_title;
      const resolvedKeywords = primary_keywords || meta_keywords;

      const updated = await seoRepository.updateGlobalSeo({
        site_title: typeof resolvedTitle === 'string' ? resolvedTitle.trim() : undefined,
        meta_title: typeof resolvedTitle === 'string' ? resolvedTitle.trim() : undefined,
        meta_description: typeof meta_description === 'string' ? meta_description.trim() : undefined,
        primary_keywords: typeof resolvedKeywords === 'string' ? resolvedKeywords.trim() : undefined,
        meta_keywords: typeof resolvedKeywords === 'string' ? resolvedKeywords.trim() : undefined,
        secondary_keywords: typeof secondary_keywords === 'string' ? secondary_keywords.trim() : undefined,
        canonical_url: typeof canonical_url === 'string' ? canonical_url.trim() : undefined,
        og_title: typeof og_title === 'string' ? og_title.trim() : undefined,
        og_description: typeof og_description === 'string' ? og_description.trim() : undefined,
        google_site_verification: google_site_verification !== undefined ? google_site_verification : undefined,
        robots_indexing: robots_indexing !== undefined ? Boolean(robots_indexing) : undefined,
        schema_type: typeof schema_type === 'string' ? schema_type.trim() : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Global SEO settings updated successfully',
        seo: {
          ...updated,
          meta_title: updated.site_title,
          meta_keywords: updated.primary_keywords,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update global SEO settings',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/seo/favicon/upload (device upload only)
  async uploadFavicon(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No favicon file was uploaded' });
        return;
      }

      const filePath = `/storage/seo/${req.file.filename}`;
      const updated = await seoRepository.updateGlobalSeo({ favicon_path: filePath });

      res.status(200).json({
        success: true,
        message: 'Favicon uploaded successfully',
        favicon_path: updated.favicon_path,
        seo: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload favicon',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/seo/og-image/upload (device upload only)
  async uploadOgImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No image file was uploaded' });
        return;
      }

      const filePath = `/storage/seo/${req.file.filename}`;
      const updated = await seoRepository.updateGlobalSeo({ og_image_url: filePath });

      res.status(200).json({
        success: true,
        message: 'Social sharing image uploaded successfully',
        og_image_url: updated.og_image_url,
        seo: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload social sharing image',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/seo/favicon
  async deleteFavicon(req: Request, res: Response): Promise<void> {
    try {
      const current = await seoRepository.getGlobalSeo();
      if (current.favicon_path) {
        const relativePath = current.favicon_path.replace(/^\/storage\//, '');
        const fullPath = path.join(persistentStorageRoot, relativePath);
        try {
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        } catch (fileErr) {
          console.warn('[AdminSeoController] Failed to delete favicon file from disk:', fileErr);
        }
      }
      const updated = await seoRepository.updateGlobalSeo({ favicon_path: null });
      res.status(200).json({ success: true, message: 'Favicon removed successfully', seo: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to remove favicon', error: error?.message });
    }
  }

  // DELETE /api/admin/seo/og-image
  async deleteOgImage(req: Request, res: Response): Promise<void> {
    try {
      const current = await seoRepository.getGlobalSeo();
      if (current.og_image_url && current.og_image_url.startsWith('/storage/')) {
        const relativePath = current.og_image_url.replace(/^\/storage\//, '');
        const fullPath = path.join(persistentStorageRoot, relativePath);
        try {
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        } catch (fileErr) {
          console.warn('[AdminSeoController] Failed to delete social share image file from disk:', fileErr);
        }
      }
      const updated = await seoRepository.updateGlobalSeo({ og_image_url: null });
      res.status(200).json({ success: true, message: 'Social sharing image removed successfully', seo: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to remove social sharing image', error: error?.message });
    }
  }

  // GET /api/admin/seo/locations
  async getAllLocations(req: Request, res: Response): Promise<void> {
    try {
      const locations = await seoRepository.getAllLocations();
      res.status(200).json({
        success: true,
        locations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch SEO locations',
        error: error?.message,
      });
    }
  }

  // GET /api/admin/seo/locations/:id
  async getLocationById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const location = await seoRepository.getLocationById(id);
      if (!location) {
        res.status(404).json({ success: false, message: 'Location page not found' });
        return;
      }
      res.status(200).json({ success: true, location });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch SEO location',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/seo/locations
  async createLocation(req: Request, res: Response): Promise<void> {
    try {
      const {
        location_name,
        state,
        professional_type,
        url_slug,
        seo_title,
        meta_description,
        primary_keyword,
        secondary_keywords,
        location_content,
        services_offered,
        related_projects,
        og_title,
        og_description,
        og_image_url,
        canonical_url,
        is_published,
        is_indexable,
        sitemap_priority,
      } = req.body;

      if (!location_name || !state) {
        res.status(400).json({
          success: false,
          message: 'Location name and state are required',
        });
        return;
      }

      const profType = professional_type?.trim() || 'Photographer & Art Director';

      const created = await seoRepository.createLocation({
        location_name: location_name.trim(),
        state: state.trim(),
        professional_type: profType,
        url_slug: url_slug?.trim(),
        seo_title: seo_title || `${profType} in ${location_name}, ${state} | Creative Monograph`,
        meta_description: meta_description || `Award-winning ${profType.toLowerCase()} services and visual commissions across ${location_name}, ${state}.`,
        primary_keyword: primary_keyword || `${profType} in ${location_name}`,
        secondary_keywords: secondary_keywords || `${location_name} visual arts, ${state} creative director, editorial commissions ${location_name}`,
        location_content: location_content || `Premier creative visual and portfolio productions across ${location_name}, ${state}. Available for commissioned editorial projects, brand monographs, and artistic collaborations.`,
        services_offered: services_offered || ['Editorial & Creative Direction', 'Fine Art Visual Monographs', 'Brand Campaigns & Lookbooks', 'Commissioned Portfolios'],
        related_projects: related_projects || [1, 2],
        og_title: og_title || seo_title,
        og_description: og_description || meta_description,
        og_image_url: og_image_url || null,
        canonical_url: canonical_url || undefined,
        is_published: is_published !== undefined ? Boolean(is_published) : true,
        is_indexable: is_indexable !== undefined ? Boolean(is_indexable) : true,
        sitemap_priority: sitemap_priority ? Number(sitemap_priority) : 0.8,
      });

      res.status(201).json({
        success: true,
        message: 'Location SEO page created successfully',
        location: created,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create SEO location page',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/seo/locations/:id
  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid location ID' });
        return;
      }

      const updated = await seoRepository.updateLocation(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Location page not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Location SEO page updated successfully',
        location: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update location SEO page',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/seo/locations/:id
  async deleteLocation(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid location ID' });
        return;
      }

      const deleted = await seoRepository.deleteLocation(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Location not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Location SEO page deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete location SEO page',
        error: error?.message,
      });
    }
  }
}

export const adminSeoController = new AdminSeoController();
