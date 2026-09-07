export interface SeoTagsConfig {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
  ogType?: string;
  robots?: string;
  jsonLd?: Record<string, any> | null;
}

function upsertMetaTag(name: string, content: string, isProperty = false): void {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLinkTag(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function upsertJsonLd(schema: Record<string, any> | null): void {
  const SCRIPT_ID = 'portfolio-seo-jsonld';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!schema) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schema, null, 2);
}

export function applySeoTags(config: SeoTagsConfig): void {
  if (config.title) {
    document.title = config.title;
  }

  if (config.description) {
    upsertMetaTag('description', config.description);
    upsertMetaTag('og:description', config.ogDescription || config.description, true);
    upsertMetaTag('twitter:description', config.ogDescription || config.description);
  }

  if (config.keywords) {
    upsertMetaTag('keywords', config.keywords);
  }

  const siteUrl = config.canonicalUrl || window.location.href;
  upsertLinkTag('canonical', siteUrl);
  upsertMetaTag('og:url', siteUrl, true);

  const ogTitle = config.ogTitle || config.title;
  upsertMetaTag('og:title', ogTitle, true);
  upsertMetaTag('twitter:title', ogTitle);

  upsertMetaTag('og:type', config.ogType || 'website', true);
  upsertMetaTag('twitter:card', 'summary_large_image');

  if (config.ogImage) {
    upsertMetaTag('og:image', config.ogImage, true);
    upsertMetaTag('twitter:image', config.ogImage);
  }

  if (config.robots) {
    upsertMetaTag('robots', config.robots);
  }

  if (config.jsonLd) {
    upsertJsonLd(config.jsonLd);
  }
}
