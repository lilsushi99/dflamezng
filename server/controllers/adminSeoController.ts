import { Request, Response } from 'express';
import { seoRepository } from '../repositories/seoRepository';

export class AdminSeoController {
  // GET /api/admin/seo
  async getGlobalSeo(req: Request, res: Response): Promise<void> {
    try {
      const seo = await seoRepository.getGlobalSeo();
      const locations = await seoRepository.getAllLocations();

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
        meta_description,
        primary_keywords,
        secondary_keywords,
        canonical_url,
        og_title,
        og_description,
        og_image_url,
        google_site_verification,
        robots_indexing,
        schema_type,
      } = req.body;

      const updated = await seoRepository.updateGlobalSeo({
        site_title: typeof site_title === 'string' ? site_title : undefined,
        meta_description: typeof meta_description === 'string' ? meta_description : undefined,
        primary_keywords: typeof primary_keywords === 'string' ? primary_keywords : undefined,
        secondary_keywords: typeof secondary_keywords === 'string' ? secondary_keywords : undefined,
        canonical_url: typeof canonical_url === 'string' ? canonical_url : undefined,
        og_title: typeof og_title === 'string' ? og_title : undefined,
        og_description: typeof og_description === 'string' ? og_description : undefined,
        og_image_url: og_image_url !== undefined ? og_image_url : undefined,
        google_site_verification: google_site_verification !== undefined ? google_site_verification : undefined,
        robots_indexing: robots_indexing !== undefined ? Boolean(robots_indexing) : undefined,
        schema_type: typeof schema_type === 'string' ? schema_type : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Global SEO settings updated successfully',
        seo: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update global SEO settings',
        error: error?.message,
      });
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

      const created = await seoRepository.createLocation({
        location_name: location_name.trim(),
        state: state.trim(),
        url_slug: url_slug?.trim(),
        seo_title: seo_title || `Professional Photographer in ${location_name}, ${state} | Flame Photography`,
        meta_description: meta_description || `Award-winning commercial, fashion, portrait, and documentary photography services in ${location_name}, ${state}.`,
        primary_keyword: primary_keyword || `Photographer in ${location_name}`,
        secondary_keywords: secondary_keywords || `${location_name} photography, ${state} wedding photographer, editorial photographer ${location_name}`,
        location_content: location_content || `Premier photography and visual production services across ${location_name}, ${state}. Available for editorial assignments, corporate portraits, and bespoke event coverage.`,
        services_offered: services_offered || ['Editorial & Fashion Photography', 'Executive Portraits & Headshots', 'Documentary & Events', 'Commercial Campaigns'],
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
