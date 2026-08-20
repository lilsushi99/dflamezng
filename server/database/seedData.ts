import { Admin } from '../models/Admin';
import { Project, ProjectImage } from '../models/Project';
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

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_title: 'Flames Photography',
  photographer_name: 'Gold Akingbade',
  studio_name: 'Gold Akingbade Studio',
  contact_email: 'inquiry@flamesphotography.com',
  contact_phone: '+234 803 123 4567',
  location_text: 'Lagos, Nigeria',
  is_available: true,
  availability_text: 'Available for Commissions Worldwide',
  created_at: new Date(),
  updated_at: new Date(),
};

export const defaultSplashSettings: SplashSettings = {
  id: 1,
  is_enabled: true,
  photographer_name: 'Gold Akingbade',
  signature_text: 'Flames Photography',
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
  navbar_logo_text: 'God Akinbade',
  navbar_projects_label: 'PROJECTS',
  navbar_contact_label: 'CONTACT',
  theme_toggle_visible: true,
  photographer_name: 'Gold Akingbade',
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
