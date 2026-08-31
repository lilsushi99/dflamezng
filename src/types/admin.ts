export type SourceType = 'local' | 'external';
export type TrackType = 'FRONT' | 'BACK';

export interface AdminUser {
  id: number;
  username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface SplashSettings {
  id: number;
  is_enabled: boolean;
  photographer_name?: string;
  signature_text: string;
  splash_subtext?: string | null;
  typewriter_enabled?: boolean;
  typing_speed_ms: number;
  stack_duration_ms: number;
  created_at: string;
  updated_at: string;
}

export interface SplashImage {
  id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageSettings {
  id: number;
  logo_type?: 'TEXT' | 'IMAGE';
  navbar_logo_text?: string;
  logo_image_path?: string | null;
  navbar_projects_label?: string;
  navbar_contact_label?: string;
  theme_toggle_visible?: boolean;
  theme_mode?: 'DARK' | 'LIGHT';
  photographer_name?: string;
  top_track_speed: number;
  bottom_track_speed: number;
  hero_quote: string | null;
  hero_subtext: string | null;
  created_at: string;
  updated_at: string;
}

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
  created_at?: string;
  updated_at?: string;
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
  services_offered: string[];
  related_projects?: number[];
  og_title?: string;
  og_description?: string;
  og_image_url?: string | null;
  canonical_url?: string;
  is_published: boolean;
  is_indexable: boolean;
  sitemap_priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageImage {
  id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  track: TrackType;
  project_id: number | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform_key: string;
  label: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  subtext: string | null;
  year: string;
  category: string;
  story: string | null;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface FooterSettings {
  id: number;
  copyright_text: string;
  designer_label: string;
  designer_name: string;
  designer_url: string;
  created_at: string;
  updated_at: string;
}

export interface SiteContactSettings {
  id: number;
  site_title?: string;
  photographer_name?: string;
  studio_name?: string;
  contact_email?: string;
  contact_phone?: string;
  location_text?: string;
  is_available?: boolean;
  availability_text?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  project_type: string;
  timeline: string;
  message: string;
  budget?: string;
  status: 'NEW' | 'REVIEWED' | 'ARCHIVED';
  notes?: string;
  created_at: string;
  updated_at: string;
}

