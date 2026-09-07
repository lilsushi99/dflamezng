import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { ViteDevServer } from 'vite';
import { seoRepository } from '../repositories/seoRepository';
import { projectRepository } from '../repositories/projectRepository';
import { settingsRepository } from '../repositories/settingsRepository';

function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function handleHtmlRequest(
  req: Request,
  res: Response,
  vite?: ViteDevServer,
  isProduction = false
): Promise<void> {
  const urlPath = req.path;
  const globalSeo = await seoRepository.getGlobalSeo();
  const siteSettings = await settingsRepository.getSiteSettings();
  const creatorName = siteSettings.photographer_name || 'D Flames';

  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = globalSeo.canonical_url?.replace(/\/$/, '') || `${protocol}://${host}`;

  let statusCode = 200;
  let pageTitle = globalSeo.site_title || `${creatorName} — Creative Portfolio`;
  let metaDesc = globalSeo.meta_description || 'Creative Portfolio & Visual Monograph';
  let metaKeywords = globalSeo.primary_keywords || 'creative portfolio, art director, visual artist, photography';
  if (globalSeo.secondary_keywords) {
    metaKeywords += `, ${globalSeo.secondary_keywords}`;
  }
  let canonicalUrl = `${baseUrl}${urlPath === '/' ? '' : urlPath}`;
  let ogTitle = globalSeo.og_title || pageTitle;
  let ogDesc = globalSeo.og_description || metaDesc;
  let ogImage = globalSeo.og_image_url || `${baseUrl}/storage/uploads/cover.jpg`;
  let ogType = 'website';
  let robots = globalSeo.robots_indexing ? 'index, follow' : 'noindex, nofollow';
  let jsonLd: Record<string, any> | null = null;

  // Route matching
  if (urlPath === '/') {
    // Homepage
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': globalSeo.schema_type || 'ProfessionalService',
      name: creatorName,
      url: baseUrl,
      description: metaDesc,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteSettings.location_text || 'Akure / Lagos',
        addressCountry: 'NG',
      },
    };
  } else if (urlPath.startsWith('/fire')) {
    // Admin route
    pageTitle = 'Flames CMS — Admin Portal';
    robots = 'noindex, nofollow';
  } else if (urlPath === '/collaborate' || urlPath === '/inquiry' || urlPath === '/form') {
    // Inquiries
    pageTitle = `Commission & Direct Inquiries — ${creatorName}`;
    metaDesc = `Direct assignment booking and creative monograph inquiries with ${creatorName}.`;
    canonicalUrl = `${baseUrl}/collaborate`;
    ogTitle = pageTitle;
    ogDesc = metaDesc;
  } else if (urlPath.startsWith('/gallery/')) {
    const slug = urlPath.replace(/^\/gallery\//, '').trim();
    const projects = await projectRepository.findAll();
    const normalized = slug.replace(/^0+/, '');
    const foundProject = projects.find(
      (p) =>
        String(p.id) === slug ||
        String(p.id) === normalized ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase())
    );

    if (foundProject) {
      pageTitle = `${foundProject.name} — ${creatorName}`;
      metaDesc = foundProject.subtext || foundProject.story || `Photographic and visual art series: ${foundProject.name} (${foundProject.year}).`;
      metaKeywords = `${foundProject.name}, ${foundProject.category}, ${creatorName}, visual monograph`;
      canonicalUrl = `${baseUrl}/gallery/${foundProject.id}`;
      ogTitle = pageTitle;
      ogDesc = metaDesc;
      ogType = 'article';
      if (foundProject.images && foundProject.images.length > 0) {
        ogImage = foundProject.images[0].file_path || foundProject.images[0].external_url || ogImage;
      }
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        name: foundProject.name,
        creator: {
          '@type': 'Person',
          name: creatorName,
        },
        dateCreated: foundProject.year,
        artform: foundProject.category,
        description: metaDesc,
      };
    } else {
      statusCode = 404;
      pageTitle = `404 — Project Not Located | ${creatorName}`;
      metaDesc = 'The requested photographic monograph could not be located in the studio archive.';
      robots = 'noindex, nofollow';
    }
  } else if (urlPath.startsWith('/location/')) {
    const slug = urlPath.replace(/^\/location\//, '').trim();
    const location = await seoRepository.getLocationBySlug(slug);

    if (location && location.is_published) {
      pageTitle = location.seo_title;
      metaDesc = location.meta_description;
      metaKeywords = location.primary_keyword;
      if (location.secondary_keywords) {
        metaKeywords += `, ${location.secondary_keywords}`;
      }
      canonicalUrl = `${baseUrl}/location/${location.url_slug}`;
      ogTitle = location.og_title || location.seo_title;
      ogDesc = location.og_description || location.meta_description;
      ogImage = location.og_image_url || ogImage;
      robots = location.is_indexable ? 'index, follow' : 'noindex, nofollow';

      const profType = location.professional_type || 'Photographer & Art Director';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: `${creatorName} — ${profType} in ${location.location_name}`,
        url: canonicalUrl,
        description: metaDesc,
        address: {
          '@type': 'PostalAddress',
          addressLocality: location.location_name,
          addressRegion: location.state,
          addressCountry: 'NG',
        },
        areaServed: [location.location_name, location.state, 'Nigeria'],
      };
    } else {
      statusCode = 404;
      pageTitle = `404 — Location Hub Not Located | ${creatorName}`;
      metaDesc = 'The requested regional location hub could not be located.';
      robots = 'noindex, nofollow';
    }
  } else {
    // Any other unrecognized route is a 404
    statusCode = 404;
    pageTitle = `404 — Page Not Found | ${creatorName}`;
    metaDesc = 'The requested archive entry or page does not exist on this platform.';
    robots = 'noindex, nofollow';
  }

  // Load template
  let template = '';
  try {
    if (isProduction) {
      template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
    } else {
      template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      if (vite) {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }
    }
  } catch (err: any) {
    console.error('[HtmlRenderer] Failed to read template:', err);
    res.status(500).send('Internal Server Error loading template');
    return;
  }

  // Build injected tags
  const tags = [
    `<title>${escapeHtml(pageTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`,
    `<meta name="keywords" content="${escapeHtml(metaKeywords)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(ogDesc)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(ogDesc)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
  ];

  if (globalSeo.google_site_verification) {
    tags.push(`<meta name="google-site-verification" content="${escapeHtml(globalSeo.google_site_verification)}" />`);
  }

  if (jsonLd) {
    tags.push(`<script type="application/ld+json" id="portfolio-seo-jsonld">${JSON.stringify(jsonLd, null, 2)}</script>`);
  }

  // Strip existing <title> and meta description from template if present to prevent duplicates
  let html = template
    .replace(/<title>.*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

  const injectionBlock = `\n    ${tags.join('\n    ')}\n  </head>`;
  html = html.replace('</head>', injectionBlock);

  res.status(statusCode).set({ 'Content-Type': 'text/html; charset=UTF-8' }).send(html);
}
