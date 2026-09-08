-- =============================================================================
-- Migration: add text-case controls + favicon support
-- SAFE TO RUN ON YOUR EXISTING LIVE DATABASE.
--
-- This file only ADDS columns with sensible defaults - it does not drop or
-- truncate anything, and existing rows/data are left untouched. Run this
-- once in phpMyAdmin's SQL tab against your live database after this deploy.
--
-- If a column already exists, MySQL will show a "Duplicate column name"
-- error for that one line only - that's safe to ignore; skip that line and
-- run the rest.
-- =============================================================================

ALTER TABLE `homepage_settings`
  ADD COLUMN `main_text_case` ENUM('as_written', 'sentence', 'upper', 'lower') NOT NULL DEFAULT 'as_written' AFTER `photographer_name`;

ALTER TABLE `homepage_settings`
  ADD COLUMN `subtext_case` ENUM('as_written', 'sentence', 'upper', 'lower') NOT NULL DEFAULT 'as_written' AFTER `main_text_case`;

ALTER TABLE `seo_settings`
  ADD COLUMN `favicon_path` VARCHAR(500) NULL COMMENT 'Local storage path only, set via favicon upload' AFTER `og_image_url`;
