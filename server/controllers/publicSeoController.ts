import { Request, Response } from 'express';
import { seoRepository } from '../repositories/seoRepository';
import { projectRepository } from '../repositories/projectRepository';
import { settingsRepository } from '../repositories/settingsRepository';

export class PublicSeoController {
  // GET /api/seo/global
  async getGlobalSeo(req: Request, res: Response): Promise<void> {
    try {
      const seo = await seoRepository.getGlobalSeo();
      res.status(200).json({ success: true, seo });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve SEO data', error: error?.message });
    }
  }

  // GET /api/seo/locations
  async getLocations(req: Request, res: Response): Promise<void> {
    try {
      const locations = await seoRepository.getPublishedLocations();
      const summary = locations.map((loc) => ({
        id: loc.id,
        location_name: loc.location_name,
        state: loc.state,
        url_slug: loc.url_slug,
        seo_title: loc.seo_title,
        meta_description: loc.meta_description,
        primary_keyword: loc.primary_keyword,
        sitemap_priority: loc.sitemap_priority,
      }));

      res.status(200).json({
        success: true,
        locations: summary,
        total: summary.length,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve locations', error: error?.message });
    }
  }

  // GET /api/seo/locations/:slug
  async getLocationBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const location = await seoRepository.getLocationBySlug(slug);

      if (!location || !location.is_published) {
        res.status(404).json({ success: false, message: 'Location page not found' });
        return;
      }

      // Fetch related projects if available
      const allProjects = await projectRepository.findAll();
      const siteSettings = await settingsRepository.getSiteSettings();
      const socialLinks = await settingsRepository.getSocialLinks();

      const featuredProjects = allProjects.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        slug: String(p.id),
        category: p.category,
        year: p.year,
        primary_image_path: p.images?.[0]?.file_path || p.images?.[0]?.external_url || null,
        thumbnail_image_path: p.images?.[0]?.file_path || p.images?.[0]?.external_url || null,
      }));

      res.status(200).json({
        success: true,
        location,
        featuredProjects,
        siteSettings,
        socialLinks,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch location details', error: error?.message });
    }
  }

  // GET /sitemap.xml
  async getSitemap(req: Request, res: Response): Promise<void> {
    try {
      const globalSeo = await seoRepository.getGlobalSeo();
      const locations = await seoRepository.getPublishedLocations();
      const projects = await projectRepository.findAll();

      const host = req.get('host') || 'localhost:3000';
      const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const baseUrl = globalSeo.canonical_url?.replace(/\/$/, '') || `${protocol}://${host}`;

      const now = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Home Page
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `  </url>\n`;

      // Project Pages
      for (const p of projects) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/gallery/${p.id}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
      }

      // Location Pages
      for (const loc of locations) {
        if (loc.is_indexable) {
          const locSlug = loc.url_slug.startsWith('/') ? loc.url_slug.substring(1) : loc.url_slug;
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/${locSlug}</loc>\n`;
          xml += `    <lastmod>${now}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>${loc.sitemap_priority || 0.8}</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      xml += `</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } catch (error: any) {
      res.status(500).send(`<!-- Error generating sitemap: ${error?.message} -->`);
    }
  }

  // GET /robots.txt
  async getRobots(req: Request, res: Response): Promise<void> {
    try {
      const globalSeo = await seoRepository.getGlobalSeo();
      const host = req.get('host') || 'localhost:3000';
      const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const baseUrl = globalSeo.canonical_url?.replace(/\/$/, '') || `${protocol}://${host}`;

      let content = 'User-agent: *\n';
      if (globalSeo.robots_indexing) {
        content += 'Allow: /\n';
        content += 'Disallow: /fire\n';
        content += 'Disallow: /api/admin/\n';
        content += `Sitemap: ${baseUrl}/sitemap.xml\n`;
      } else {
        content += 'Disallow: /\n';
      }

      res.header('Content-Type', 'text/plain');
      res.status(200).send(content);
    } catch (error: any) {
      res.header('Content-Type', 'text/plain');
      res.status(200).send('User-agent: *\nDisallow: /fire\n');
    }
  }
}

export const publicSeoController = new PublicSeoController();
