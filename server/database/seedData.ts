import { Admin } from '../models/Admin';
import { Project, ProjectImage } from '../models/Project';
import { Category } from '../models/Category';
import { HomepageImage, HomepageSettings } from '../models/Homepage';
import { SplashImage, SplashSettings } from '../models/Splash';
import { SiteSettings, SocialLink, FooterSettings } from '../models/Settings';
import bcrypt from 'bcryptjs';

// Pre-hashed password for admin12345
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('admin12345', 10);

export const defaultAdmins: Admin[] = [
  {
    id: 1,
    username: 'admin12345',
    password_hash: DEFAULT_PASSWORD_HASH,
    display_name: 'Lead Curator',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const defaultCategories: Category[] = [
  { id: 1, name: 'Portrait', slug: 'portrait', description: 'Commissioned studio & environmental portraiture', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, name: 'Fashion', slug: 'fashion', description: 'Contemporary high-fashion and runway monographs', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 3, name: 'Editorial', slug: 'editorial', description: 'Magazine spreads and contextual narrative stories', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 4, name: 'Afrocentric', slug: 'afrocentric', description: 'Indigenous textiles, Adire, Aso-Oke and cultural identity', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 5, name: 'Convocation', slug: 'convocation', description: 'Academic milestone & institutional ceremonial portraiture', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 6, name: 'Documentary', slug: 'documentary', description: 'Raw visual journalism and cultural memory archiving', display_order: 6, created_at: new Date(), updated_at: new Date() },
  { id: 7, name: 'Commercial', slug: 'commercial', description: 'Brand campaigns, lookbooks, and luxury advertising', display_order: 7, created_at: new Date(), updated_at: new Date() },
  { id: 8, name: 'Art Direction', slug: 'art-direction', description: 'Complete conceptual styling, set design and visual curation', display_order: 8, created_at: new Date(), updated_at: new Date() },
  { id: 9, name: 'Visual Storytelling', slug: 'visual-storytelling', description: 'Poetic monograph sequences exploring human depth', display_order: 9, created_at: new Date(), updated_at: new Date() },
];

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_title: 'D Flames Photography — Good Akinbade',
  photographer_name: 'Good Akinbade',
  studio_name: 'D Flames Photography Studio',
  contact_email: 'studio@dflamesphotography.com',
  contact_phone: '+234 812 345 6789',
  location_text: 'Akure / Lagos / Nigeria',
  is_available: true,
  availability_text: 'Open to Travel — Worldwide & Commissions',
  about_title: 'Good Akinbade & D Flames Photography',
  about_statement: 'Documenting contemporary West African elegance, high-fashion silhouettes, and fine-art portraiture with intentional light and architectural stillness.',
  about_story: 'Good Akinbade is a Nigerian visual artist, editorial photographer, and art director based between Akure and Lagos. Through D Flames Photography, he crafts thoughtful photographic monographs that celebrate Afrocentric fashion heritage, traditional textiles, modern metropolitan energy, and intimate portrait commissions across Nigeria and globally.',
  about_services: 'Editorial Fashion, Fine Art Portraiture, Lookbook Campaigns, Cultural Documentary, Art & Creative Direction',
  projects_modal_subtitle: 'Selected Body of Work',
  projects_modal_title: 'Projects & Art Direction',
  projects_modal_archive_label: 'Good Akinbade Studio Archive',
  created_at: new Date(),
  updated_at: new Date(),
};

export const defaultSplashSettings: SplashSettings = {
  id: 1,
  is_enabled: true,
  photographer_name: 'Good Akinbade',
  signature_text: 'D Flames Photography',
  splash_subtext: 'A visual archive of contemporary Nigerian fashion and fine art photography.',
  typewriter_enabled: true,
  typing_speed_ms: 65,
  stack_duration_ms: 3200,
  created_at: new Date(),
  updated_at: new Date(),
};

export const defaultSplashImages: SplashImage[] = [];

export const defaultHomepageSettings: HomepageSettings = {
  id: 1,
  navbar_logo_text: 'D FLAMES PHOTOGRAPHY',
  navbar_projects_label: 'PROJECTS',
  navbar_contact_label: 'CONTACT',
  theme_toggle_visible: true,
  theme_mode: 'DARK',
  photographer_name: 'Good Akinbade',
  top_track_speed: 1.00,
  bottom_track_speed: 1.00,
  hero_quote: 'A study of identity, architectural movement and quiet confidence through contemporary Nigerian photography.',
  hero_subtext: 'Monochrome and pigmented archival studies across West African landscapes.',
  created_at: new Date(),
  updated_at: new Date(),
};

export const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'The Silhouettes of Eko',
    subtext: 'High-fashion editorial across contemporary Lagos landscapes',
    year: '2025',
    category: 'FASHION',
    story: 'An exploration of architectural form, fluid draping, and modern West African identity staged against the coastal light and modernist structures of Lagos Island.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Indigo Resonance',
    subtext: 'Sacred hues and handcrafted indigo dyes of Yorubaland',
    year: '2024',
    category: 'TEXTILE & EDITORIAL',
    story: 'A dedicated visual monograph exploring the organic fermentation of natural indigo vats, hand-resist Adire textiles, and the luminous interplay of sunlight piercing open-air dye pits.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Red Earth & Clay',
    subtext: 'Earth pigments, warm skin tones, and granite monoliths of Ondo',
    year: '2024',
    category: 'FINE ART & FASHION',
    story: 'Staged across the ancient stone stairways and rich red laterite soil of the historic Idanre mountain settlement.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'Woven Formations',
    subtext: 'Ceremonial weaving, contemporary silhouettes, and sculptural volume',
    year: '2025',
    category: 'SCULPTURAL FASHION',
    story: 'Focusing on heavy hand-loomed Aso-Oke weaves reinterpreted into contemporary geometric coats and monumental silhouettes.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: 'Monolith & Shadow',
    subtext: 'Minimalist chiaroscuro and sacred architectural forms',
    year: '2025',
    category: 'ARCHITECTURAL CHIAROSCURO',
    story: 'Documenting the spiritual stillness of modernist ecclesiastical architecture and raw stone compounds under coastal sunlight.',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const defaultProjectImages: ProjectImage[] = [];

export const defaultHomepageImages: HomepageImage[] = [];

export const defaultSocialLinks: SocialLink[] = [
  { id: 1, platform_key: 'instagram', label: 'INSTAGRAM', url: 'https://instagram.com', display_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
  { id: 2, platform_key: 'tiktok', label: 'TIKTOK', url: 'https://tiktok.com', display_order: 2, is_active: true, created_at: new Date(), updated_at: new Date() },
  { id: 3, platform_key: 'pixieset', label: 'PIXIESET', url: 'https://pixieset.com', display_order: 3, is_active: true, created_at: new Date(), updated_at: new Date() },
  { id: 4, platform_key: 'pinterest', label: 'PINTEREST', url: 'https://pinterest.com', display_order: 4, is_active: true, created_at: new Date(), updated_at: new Date() },
  { id: 5, platform_key: 'whatsapp', label: 'WHATSAPP', url: 'https://whatsapp.com', display_order: 5, is_active: true, created_at: new Date(), updated_at: new Date() },
];

export const defaultFooterSettings: FooterSettings = {
  id: 1,
  copyright_text: 'Flames Photography © 2026',
  designer_label: 'Designed by',
  designer_name: 'Castel Studios',
  designer_url: 'https://castelstudios.com',
  created_at: new Date(),
  updated_at: new Date(),
};
