export interface SiteSettings {
  id: number;
  site_title: string;
  photographer_name: string;
  studio_name: string;
  contact_email: string;
  contact_phone: string;
  location_text: string;
  is_available: boolean;
  availability_text: string;
  about_title?: string;
  about_statement?: string;
  about_story?: string;
  about_services?: string;
  projects_modal_subtitle?: string;
  projects_modal_title?: string;
  projects_modal_archive_label?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SocialLink {
  id: number;
  platform_key: string;
  label: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FooterSettings {
  id: number;
  copyright_text: string;
  designer_label: string;
  designer_name: string;
  designer_url: string;
  created_at: Date;
  updated_at: Date;
}
