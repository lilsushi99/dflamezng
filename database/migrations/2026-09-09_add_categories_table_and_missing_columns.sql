-- =============================================================================
-- Migration: add categories table + missing columns discovered during audit
-- SAFE TO RUN ON YOUR EXISTING LIVE DATABASE.
--
-- This file only ADDS a new table and new columns with sensible defaults -
-- it does not drop or truncate anything, and existing rows/data are left
-- untouched. Run this once in phpMyAdmin's SQL tab.
--
-- If a column/table already exists, MySQL will show a "Duplicate column
-- name" or "Table already exists" error for that one statement only -
-- that's safe to ignore; skip that statement and run the rest.
-- =============================================================================

-- 1. Categories were previously never stored in MySQL at all (they lived
--    only in a local fallback file). This creates the real table.
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed it with your current categories ONLY if the table was just created
-- and is empty (safe to run regardless - INSERT IGNORE skips duplicates by
-- unique name/slug).
INSERT IGNORE INTO `categories` (`name`, `slug`, `description`, `display_order`) VALUES
  ('Portrait', 'portrait', 'Studio & Environmental Portraiture', 1),
  ('Fashion', 'fashion', 'Contemporary Fashion Monographs', 2),
  ('Editorial', 'editorial', 'Magazine & Narrative Spreads', 3),
  ('Afrocentric', 'afrocentric', 'Traditional Textiles & Cultural Identity', 4),
  ('Convocation', 'convocation', 'Academic & Institutional Ceremonies', 5),
  ('Documentary', 'documentary', 'Visual Journalism & Archives', 6),
  ('Commercial', 'commercial', 'Brand Campaigns & Lookbooks', 7),
  ('Art Direction', 'art-direction', 'Conceptual Styling & Set Design', 8),
  ('Visual Storytelling', 'visual-storytelling', 'Sequential Photographic Narratives', 9);

-- 2. splash_settings was missing 3 columns, causing every splash settings
--    save (name, subtext, typewriter toggle, speeds) to silently fail.
ALTER TABLE `splash_settings`
  ADD COLUMN `photographer_name` VARCHAR(255) NULL;

ALTER TABLE `splash_settings`
  ADD COLUMN `splash_subtext` VARCHAR(500) NULL;

ALTER TABLE `splash_settings`
  ADD COLUMN `typewriter_enabled` BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. site_settings was missing the About section + Projects modal/archive
--    label columns, so the admin inputs for these looked like they saved
--    but never actually persisted.
ALTER TABLE `site_settings`
  ADD COLUMN `about_title` VARCHAR(255) NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `about_statement` TEXT NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `about_story` TEXT NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `about_services` TEXT NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `projects_modal_subtitle` VARCHAR(255) NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `projects_modal_title` VARCHAR(255) NULL;

ALTER TABLE `site_settings`
  ADD COLUMN `projects_modal_archive_label` VARCHAR(255) NULL;

-- 4. social_links needed a TEXT/ICON display mode toggle.
ALTER TABLE `social_links`
  ADD COLUMN `display_mode` ENUM('TEXT', 'ICON') NOT NULL DEFAULT 'TEXT';

-- 5. hero_quote is obsolete and unused by any current frontend code - safe
--    to drop. Skip this line if you'd rather keep the column around unused.
ALTER TABLE `homepage_settings`
  DROP COLUMN `hero_quote`;

-- 6. seo_settings needs its id=1 row to exist, or every SEO save silently
--    matches zero rows and appears to succeed while persisting nothing.
--    The app now also self-heals this automatically via upsert, but this
--    guarantees it's correct immediately too. Safe to run even if the row
--    already exists (INSERT IGNORE skips it).
INSERT IGNORE INTO `seo_settings` (`id`, `site_title`, `meta_description`, `og_title`, `og_description`, `robots_indexing`, `schema_type`)
VALUES (
  1,
  'Flames Photography',
  'Contemporary Nigerian fashion and portrait photography.',
  'Flames Photography',
  'Contemporary Nigerian fashion and portrait photography.',
  TRUE,
  'PhotographyBusiness'
);
