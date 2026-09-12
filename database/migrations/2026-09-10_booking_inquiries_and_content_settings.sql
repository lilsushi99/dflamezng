-- =============================================================================
-- Migration: Book Us inquiries table + content settings for the new page.
-- SAFE TO RUN ON YOUR EXISTING LIVE DATABASE - additive only.
--
-- IMPORTANT: if your `inquiries` table already exists with the OLD columns
-- (project_type, timeline, message), run STEP A. If the table doesn't exist
-- at all yet, run STEP B instead. If unsure, check phpMyAdmin's Structure
-- tab for the inquiries table first.
-- =============================================================================

-- STEP A: table already exists with old columns - migrate it in place,
-- preserving existing submitted inquiries.
ALTER TABLE `inquiries` ADD COLUMN `phone` VARCHAR(100) NULL;
ALTER TABLE `inquiries` ADD COLUMN `project_location` VARCHAR(255) NULL;
ALTER TABLE `inquiries` ADD COLUMN `project_brief` TEXT NULL;
UPDATE `inquiries` SET `project_brief` = `message` WHERE `project_brief` IS NULL AND `message` IS NOT NULL;
-- Old columns are left in place rather than dropped, so no historical data
-- is destroyed. They're simply unused by the app going forward.

-- STEP B: table doesn't exist yet - create it fresh with the new schema.
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `project_location` VARCHAR(255) NOT NULL,
  `budget` VARCHAR(100) NULL,
  `project_brief` TEXT NOT NULL,
  `status` ENUM('NEW', 'REVIEWED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Editable content for the new "Book Us" public page, stored on
-- site_settings (safe additive columns, same pattern as everything else).
ALTER TABLE `site_settings` ADD COLUMN `booking_page_subtext` TEXT NULL;
