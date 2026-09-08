-- =============================================================================
-- Flames Photography Seed Data
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / PHPMyAdmin
--
-- ⚠️  RUN THIS FILE ONCE, DURING INITIAL DATABASE SETUP ONLY. ⚠️
-- Do NOT re-run this file (or any deploy script that calls it) against a
-- database that already has live content. The TRUNCATE statements below are
-- destructive and will wipe every project, image, social link, and setting
-- an admin has already saved. Regular code deploys (git push -> Hostinger)
-- must NEVER execute this file automatically. It is a manual, one-time
-- bootstrap script only.
-- =============================================================================

-- Clear existing data if tables exist (first-time setup only - see warning above)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `project_images`;
TRUNCATE TABLE `homepage_images`;
TRUNCATE TABLE `projects`;
TRUNCATE TABLE `splash_images`;
TRUNCATE TABLE `social_links`;
TRUNCATE TABLE `splash_settings`;
TRUNCATE TABLE `homepage_settings`;
TRUNCATE TABLE `footer_settings`;
TRUNCATE TABLE `site_settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Create Your Admin Account
-- -----------------------------------------------------------------------------
-- There is no default/hardcoded admin account, and this file intentionally
-- does NOT touch the `admins` table. To create your first admin login:
--   1. Run:  npx tsx server/scripts/hashPassword.ts "YourChosenPassword"
--   2. Copy the printed bcrypt hash.
--   3. In phpMyAdmin, run (replacing the placeholders):
--        INSERT INTO `admins` (`username`, `password_hash`, `display_name`)
--        VALUES ('your_username', 'PASTE_BCRYPT_HASH_HERE', 'Lead Curator');
-- To change credentials later, generate a new hash the same way and either
-- UPDATE the existing row or INSERT a new admin row directly in phpMyAdmin -
-- the app reads credentials live from this table on every login attempt.

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
-- 4. Splash Images: Empty by default (Images uploaded via Admin Panel)
-- -----------------------------------------------------------------------------
-- No dummy splash image records.

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
-- 6. Seed Projects (Foundation Projects)
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
-- 7. Project Images: Empty by default (Images uploaded via Admin Panel)
-- -----------------------------------------------------------------------------
-- No dummy project image records.

-- -----------------------------------------------------------------------------
-- 8. Homepage Images: Empty by default (Images uploaded via Admin Panel)
-- -----------------------------------------------------------------------------
-- No dummy homepage image records.

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
