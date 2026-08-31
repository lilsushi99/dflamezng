import { SourceType } from './Project';

export type TrackType = 'FRONT' | 'BACK';

export interface HomepageImage {
  id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  track: TrackType;
  project_id: number | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}
