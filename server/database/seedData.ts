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

export const defaultSplashImages: SplashImage[] = [
  { id: 1, file_path: '/storage/splash/splash-1.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, file_path: '/storage/splash/splash-2.jpg', external_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 3, file_path: '/storage/splash/splash-3.jpg', external_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 4, file_path: '/storage/splash/splash-4.jpg', external_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 5, file_path: '/storage/splash/splash-5.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 6, file_path: '/storage/splash/splash-6.jpg', external_url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },
  { id: 7, file_path: '/storage/splash/splash-7.jpg', external_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 7, created_at: new Date(), updated_at: new Date() },
  { id: 8, file_path: '/storage/splash/splash-8.jpg', external_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 8, created_at: new Date(), updated_at: new Date() },
  { id: 9, file_path: '/storage/splash/splash-9.jpg', external_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 9, created_at: new Date(), updated_at: new Date() },
  { id: 10, file_path: '/storage/splash/splash-10.jpg', external_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85', source_type: 'local', display_order: 10, created_at: new Date(), updated_at: new Date() },
];

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

export const defaultProjectImages: ProjectImage[] = [
  // Project 1 (6 images)
  { id: 1, project_id: 1, file_path: '/storage/projects/PROJ-1.1.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, project_id: 1, file_path: '/storage/projects/PROJ-1.2.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 3, project_id: 1, file_path: '/storage/projects/PROJ-1.3.jpg', external_url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 4, project_id: 1, file_path: '/storage/projects/PROJ-1.4.jpg', external_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 5, project_id: 1, file_path: '/storage/projects/PROJ-1.5.jpg', external_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 6, project_id: 1, file_path: '/storage/projects/PROJ-1.6.jpg', external_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },

  // Project 2 (6 images)
  { id: 7, project_id: 2, file_path: '/storage/projects/PROJ-2.1.jpg', external_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 8, project_id: 2, file_path: '/storage/projects/PROJ-2.2.jpg', external_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 9, project_id: 2, file_path: '/storage/projects/PROJ-2.3.jpg', external_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 10, project_id: 2, file_path: '/storage/projects/PROJ-2.4.jpg', external_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 11, project_id: 2, file_path: '/storage/projects/PROJ-2.5.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 12, project_id: 2, file_path: '/storage/projects/PROJ-2.6.jpg', external_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },

  // Project 3 (6 images)
  { id: 13, project_id: 3, file_path: '/storage/projects/PROJ-3.1.jpg', external_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 14, project_id: 3, file_path: '/storage/projects/PROJ-3.2.jpg', external_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 15, project_id: 3, file_path: '/storage/projects/PROJ-3.3.jpg', external_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 16, project_id: 3, file_path: '/storage/projects/PROJ-3.4.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 17, project_id: 3, file_path: '/storage/projects/PROJ-3.5.jpg', external_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 18, project_id: 3, file_path: '/storage/projects/PROJ-3.6.jpg', external_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },

  // Project 4 (6 images)
  { id: 19, project_id: 4, file_path: '/storage/projects/PROJ-4.1.jpg', external_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 20, project_id: 4, file_path: '/storage/projects/PROJ-4.2.jpg', external_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 21, project_id: 4, file_path: '/storage/projects/PROJ-4.3.jpg', external_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 22, project_id: 4, file_path: '/storage/projects/PROJ-4.4.jpg', external_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 23, project_id: 4, file_path: '/storage/projects/PROJ-4.5.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 24, project_id: 4, file_path: '/storage/projects/PROJ-4.6.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },

  // Project 5 (6 images)
  { id: 25, project_id: 5, file_path: '/storage/projects/PROJ-5.1.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 26, project_id: 5, file_path: '/storage/projects/PROJ-5.2.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 27, project_id: 5, file_path: '/storage/projects/PROJ-5.3.jpg', external_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 28, project_id: 5, file_path: '/storage/projects/PROJ-5.4.jpg', external_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 29, project_id: 5, file_path: '/storage/projects/PROJ-5.5.jpg', external_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', source_type: 'local', display_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 30, project_id: 5, file_path: '/storage/projects/PROJ-5.6.jpg', external_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', source_type: 'local', display_order: 6, created_at: new Date(), updated_at: new Date() },
];

export const defaultHomepageImages: HomepageImage[] = [
  // FRONT Track Images
  { id: 1, file_path: '/storage/homepage/front/front-1.jpg', external_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'FRONT', project_id: 1, display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, file_path: '/storage/homepage/front/front-2.jpg', external_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'FRONT', project_id: 2, display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 3, file_path: '/storage/homepage/front/front-3.jpg', external_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'FRONT', project_id: 3, display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 4, file_path: '/storage/homepage/front/front-4.jpg', external_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'FRONT', project_id: 4, display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 5, file_path: '/storage/homepage/front/front-5.jpg', external_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'FRONT', project_id: 5, display_order: 5, created_at: new Date(), updated_at: new Date() },

  // BACK Track Images
  { id: 6, file_path: '/storage/homepage/back/back-1.jpg', external_url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'BACK', project_id: 1, display_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 7, file_path: '/storage/homepage/back/back-2.jpg', external_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'BACK', project_id: 2, display_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 8, file_path: '/storage/homepage/back/back-3.jpg', external_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'BACK', project_id: 3, display_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 9, file_path: '/storage/homepage/back/back-4.jpg', external_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'BACK', project_id: 4, display_order: 4, created_at: new Date(), updated_at: new Date() },
  { id: 10, file_path: '/storage/homepage/back/back-5.jpg', external_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85', source_type: 'local', track: 'BACK', project_id: 5, display_order: 5, created_at: new Date(), updated_at: new Date() },
];

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
