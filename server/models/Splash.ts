import { SourceType } from './Project';

export interface SplashImage {
  id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  display_order: number;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}
