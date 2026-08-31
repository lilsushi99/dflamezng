export interface GlobalSeoSettings {
  id: number;
  site_title: string;
  meta_description: string;
  primary_keywords: string;
  secondary_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  google_site_verification: string | null;
  robots_indexing: boolean;
  schema_type: string;
  created_at: Date;
  updated_at: Date;
}

export interface SeoLocation {
  id: number;
  location_name: string;
  state: string;
  url_slug: string;
  seo_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string;
  location_content: string;
  services_offered: string;
  related_projects: number[];
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  canonical_url?: string;
  is_published: boolean;
  is_indexable: boolean;
  sitemap_priority: number;
  created_at: Date;
  updated_at: Date;
}
