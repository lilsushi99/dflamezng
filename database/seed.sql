-- =============================================================================
-- Flames Photography Seed Data
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / PHPMyAdmin
-- =============================================================================

-- Clear existing data (in dependency order)
DELETE FROM `project_images`;
DELETE FROM `homepage_images`;
DELETE FROM `projects`;
DELETE FROM `splash_images`;
DELETE FROM `social_links`;
DELETE FROM `splash_settings`;
DELETE FROM `homepage_settings`;
DELETE FROM `footer_settings`;
DELETE FROM `site_settings`;
DELETE FROM `admins`;

-- -----------------------------------------------------------------------------
-- 1. Seed Admin Account
-- Default Username: admin12345
-- Default Password: admin12345 (Bcrypt hashed with cost factor 10)
-- -----------------------------------------------------------------------------
INSERT INTO `admins` (`id`, `username`, `password_hash`, `display_name`)
VALUES (
  1,
  'admin12345',
  '$2a$10$QO90rJzFqNlX1Xp4JmG37eKj1nBq2Z9rKqY8yWz7a6b5c4d3e2f1g',
  'Lead Curator'
);

-- -----------------------------------------------------------------------------
-- 2. Seed Site Settings
-- -----------------------------------------------------------------------------
INSERT INTO `site_settings` (`id`, `site_title`, `photographer_name`, `studio_name`, `contact_email`, `contact_phone`, `location_text`, `is_available`, `availability_text`)
VALUES (
  1,
  'Flames Photography',
  'Gold Akingbade',
  'Gold Akingbade Studio',
  'inquiry@flamesphotography.com',
  '+234 803 123 4567',
  'Lagos, Nigeria',
  TRUE,
  'Available for Commissions Worldwide'
);

-- -----------------------------------------------------------------------------
-- 3. Seed Splash Settings
-- -----------------------------------------------------------------------------
INSERT INTO `splash_settings` (`id`, `is_enabled`, `signature_text`, `typing_speed_ms`, `stack_duration_ms`)
VALUES (
  1,
  TRUE,
  'Flames Photography',
  65,
  3200
);

-- -----------------------------------------------------------------------------
-- 4. Seed Splash Images (Configurable image stack)
-- -----------------------------------------------------------------------------
INSERT INTO `splash_images` (`id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(1, '/storage/splash/splash-1.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85', 'local', 1),
(2, '/storage/splash/splash-2.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', 'local', 2),
(3, '/storage/splash/splash-3.jpg', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85', 'local', 3),
(4, '/storage/splash/splash-4.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85', 'local', 4),
(5, '/storage/splash/splash-5.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', 'local', 5),
(6, '/storage/splash/splash-6.jpg', 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1000&q=85', 'local', 6),
(7, '/storage/splash/splash-7.jpg', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85', 'local', 7),
(8, '/storage/splash/splash-8.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85', 'local', 8),
(9, '/storage/splash/splash-9.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85', 'local', 9),
(10, '/storage/splash/splash-10.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85', 'local', 10);

-- -----------------------------------------------------------------------------
-- 5. Seed Homepage Settings
-- -----------------------------------------------------------------------------
INSERT INTO `homepage_settings` (`id`, `top_track_speed`, `bottom_track_speed`, `hero_quote`, `hero_subtext`)
VALUES (
  1,
  1.00,
  1.00,
  'A study of identity, architectural movement and quiet confidence through contemporary Nigerian photography.',
  'Monochrome and pigmented archival studies across West African landscapes.'
);

-- -----------------------------------------------------------------------------
-- 6. Seed Projects (Exactly Five Projects)
-- -----------------------------------------------------------------------------
INSERT INTO `projects` (`id`, `name`, `subtext`, `year`, `category`, `story`) VALUES
(
  1,
  'The Silhouettes of Eko',
  'High-fashion editorial across contemporary Lagos landscapes',
  '2025',
  'FASHION',
  'An exploration of architectural form, fluid draping, and modern West African identity staged against the coastal light and modernist structures of Lagos Island.'
),
(
  2,
  'Indigo Resonance',
  'Sacred hues and handcrafted indigo dyes of Yorubaland',
  '2024',
  'TEXTILE & EDITORIAL',
  'A dedicated visual monograph exploring the organic fermentation of natural indigo vats, hand-resist Adire textiles, and the luminous interplay of sunlight piercing open-air dye pits.'
),
(
  3,
  'Red Earth & Clay',
  'Earth pigments, warm skin tones, and granite monoliths of Ondo',
  '2024',
  'FINE ART & FASHION',
  'Staged across the ancient stone stairways and rich red laterite soil of the historic Idanre mountain settlement.'
),
(
  4,
  'Woven Formations',
  'Ceremonial weaving, contemporary silhouettes, and sculptural volume',
  '2025',
  'SCULPTURAL FASHION',
  'Focusing on heavy hand-loomed Aso-Oke weaves reinterpreted into contemporary geometric coats and monumental silhouettes.'
),
(
  5,
  'Monolith & Shadow',
  'Minimalist chiaroscuro and sacred architectural forms',
  '2025',
  'ARCHITECTURAL CHIAROSCURO',
  'Documenting the spiritual stillness of modernist ecclesiastical architecture and raw stone compounds under coastal sunlight.'
);

-- -----------------------------------------------------------------------------
-- 7. Seed Project Images (5 projects × 6 images = 30 image records)
-- -----------------------------------------------------------------------------
-- Project 1 Images (1..6)
INSERT INTO `project_images` (`project_id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(1, '/storage/projects/PROJ-1.1.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'local', 1),
(1, '/storage/projects/PROJ-1.2.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', 'local', 2),
(1, '/storage/projects/PROJ-1.3.jpg', 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1400&q=85', 'local', 3),
(1, '/storage/projects/PROJ-1.4.jpg', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85', 'local', 4),
(1, '/storage/projects/PROJ-1.5.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'local', 5),
(1, '/storage/projects/PROJ-1.6.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85', 'local', 6);

-- Project 2 Images (1..6)
INSERT INTO `project_images` (`project_id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(2, '/storage/projects/PROJ-2.1.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', 'local', 1),
(2, '/storage/projects/PROJ-2.2.jpg', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', 'local', 2),
(2, '/storage/projects/PROJ-2.3.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85', 'local', 3),
(2, '/storage/projects/PROJ-2.4.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', 'local', 4),
(2, '/storage/projects/PROJ-2.5.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', 'local', 5),
(2, '/storage/projects/PROJ-2.6.jpg', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1400&q=85', 'local', 6);

-- Project 3 Images (1..6)
INSERT INTO `project_images` (`project_id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(3, '/storage/projects/PROJ-3.1.jpg', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85', 'local', 1),
(3, '/storage/projects/PROJ-3.2.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', 'local', 2),
(3, '/storage/projects/PROJ-3.3.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85', 'local', 3),
(3, '/storage/projects/PROJ-3.4.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'local', 4),
(3, '/storage/projects/PROJ-3.5.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'local', 5),
(3, '/storage/projects/PROJ-3.6.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', 'local', 6);

-- Project 4 Images (1..6)
INSERT INTO `project_images` (`project_id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(4, '/storage/projects/PROJ-4.1.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'local', 1),
(4, '/storage/projects/PROJ-4.2.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'local', 2),
(4, '/storage/projects/PROJ-4.3.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85', 'local', 3),
(4, '/storage/projects/PROJ-4.4.jpg', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', 'local', 4),
(4, '/storage/projects/PROJ-4.5.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', 'local', 5),
(4, '/storage/projects/PROJ-4.6.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85', 'local', 6);

-- Project 5 Images (1..6)
INSERT INTO `project_images` (`project_id`, `file_path`, `external_url`, `source_type`, `display_order`) VALUES
(5, '/storage/projects/PROJ-5.1.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', 'local', 1),
(5, '/storage/projects/PROJ-5.2.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'local', 2),
(5, '/storage/projects/PROJ-5.3.jpg', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1400&q=85', 'local', 3),
(5, '/storage/projects/PROJ-5.4.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', 'local', 4),
(5, '/storage/projects/PROJ-5.5.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', 'local', 5),
(5, '/storage/projects/PROJ-5.6.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', 'local', 6);

-- -----------------------------------------------------------------------------
-- 8. Seed Homepage Images (5 FRONT, 5 BACK - support nullable project_id)
-- -----------------------------------------------------------------------------
-- FRONT Track Images
INSERT INTO `homepage_images` (`file_path`, `external_url`, `source_type`, `track`, `project_id`, `display_order`) VALUES
('/storage/homepage/front/front-1.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85', 'local', 'FRONT', 1, 1),
('/storage/homepage/front/front-2.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', 'local', 'FRONT', 2, 2),
('/storage/homepage/front/front-3.jpg', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85', 'local', 'FRONT', 3, 3),
('/storage/homepage/front/front-4.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85', 'local', 'FRONT', 4, 4),
('/storage/homepage/front/front-5.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85', 'local', 'FRONT', 5, 5);

-- BACK Track Images
INSERT INTO `homepage_images` (`file_path`, `external_url`, `source_type`, `track`, `project_id`, `display_order`) VALUES
('/storage/homepage/back/back-1.jpg', 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=1000&q=85', 'local', 'BACK', 1, 1),
('/storage/homepage/back/back-2.jpg', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85', 'local', 'BACK', 2, 2),
('/storage/homepage/back/back-3.jpg', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85', 'local', 'BACK', 3, 3),
('/storage/homepage/back/back-4.jpg', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85', 'local', 'BACK', 4, 4),
('/storage/homepage/back/back-5.jpg', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85', 'local', 'BACK', 5, 5);

-- -----------------------------------------------------------------------------
-- 9. Seed Social Links
-- -----------------------------------------------------------------------------
INSERT INTO `social_links` (`id`, `platform_key`, `label`, `url`, `display_order`, `is_active`) VALUES
(1, 'instagram', 'INSTAGRAM', 'https://instagram.com', 1, TRUE),
(2, 'tiktok', 'TIKTOK', 'https://tiktok.com', 2, TRUE),
(3, 'pixieset', 'PIXIESET', 'https://pixieset.com', 3, TRUE),
(4, 'pinterest', 'PINTEREST', 'https://pinterest.com', 4, TRUE),
(5, 'whatsapp', 'WHATSAPP', 'https://whatsapp.com', 5, TRUE);

-- -----------------------------------------------------------------------------
-- 10. Seed Footer Settings
-- -----------------------------------------------------------------------------
INSERT INTO `footer_settings` (`id`, `copyright_text`, `designer_label`, `designer_name`, `designer_url`)
VALUES (
  1,
  'Flames Photography © 2026',
  'Designed by',
  'Castel Studios',
  'https://castelstudios.com'
);
