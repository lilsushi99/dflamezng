export type SourceType = 'local' | 'external';

export interface ProjectImage {
  id: number;
  project_id: number;
  file_path: string | null;
  external_url: string | null;
  source_type: SourceType;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  subtext: string | null;
  year: string;
  category: string;
  story: string | null;
  created_at: Date;
  updated_at: Date;
  images?: ProjectImage[];
}
