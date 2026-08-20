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
  navbar_logo_text?: string;
  navbar_projects_label?: string;
  navbar_contact_label?: string;
  theme_toggle_visible?: boolean;
  photographer_name?: string;
  top_track_speed: number;
  bottom_track_speed: number;
  hero_quote: string | null;
  hero_subtext: string | null;
  created_at: string;
  updated_at: string;
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
