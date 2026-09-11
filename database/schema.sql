-- =============================================================================
-- Flames Photography Database Schema
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / PHPMyAdmin
--
-- ⚠️  RUN THIS FILE ONCE, DURING INITIAL DATABASE SETUP ONLY. ⚠️
-- The DROP TABLE statements below are destructive. Re-running this file
-- against an existing database will permanently delete every admin
-- credential, project, image, and setting that has been saved. Regular
-- code deploys (git push -> Hostinger) must NEVER execute this file
-- automatically - schema changes after go-live should be additive
-- (CREATE TABLE IF NOT EXISTS / ALTER TABLE), not a re-run of this script.
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist (in reverse dependency order)
DROP TABLE IF EXISTS `project_images`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `homepage_images`;
DROP TABLE IF EXISTS `homepage_settings`;
DROP TABLE IF EXISTS `splash_images`;
DROP TABLE IF EXISTS `splash_settings`;
DROP TABLE IF EXISTS `social_links`;
DROP TABLE IF EXISTS `seo_locations`;
DROP TABLE IF EXISTS `seo_settings`;
DROP TABLE IF EXISTS `footer_settings`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `admins`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Admins Table
-- -----------------------------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(150) NOT NULL DEFAULT 'Administrator',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Site General Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_title` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography',
  `photographer_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade',
  `studio_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade Studio',
  `contact_email` VARCHAR(255) NOT NULL DEFAULT 'inquiry@flamesphotography.com',
  `contact_phone` VARCHAR(100) DEFAULT '+234 800 000 0000',
  `location_text` VARCHAR(255) NOT NULL DEFAULT 'Lagos, Nigeria',
  `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
  `availability_text` VARCHAR(255) NOT NULL DEFAULT 'Available for Commissions Worldwide',
  `about_title` VARCHAR(255) NULL,
  `about_statement` TEXT NULL,
  `about_story` TEXT NULL,
  `about_services` TEXT NULL,
  `projects_modal_subtitle` VARCHAR(255) NULL COMMENT 'modal_icon_subtitle: small label above the projects modal title',
  `projects_modal_title` VARCHAR(255) NULL COMMENT 'modal_main_title: main heading of the projects modal',
  `projects_modal_archive_label` VARCHAR(255) NULL COMMENT 'bottom_archive_studio_label: footer label inside the projects modal',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Splash Screen Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE `splash_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `signature_text` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography',
  `photographer_name` VARCHAR(255) NULL,
  `splash_subtext` VARCHAR(500) NULL,
  `typewriter_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `typing_speed_ms` INT NOT NULL DEFAULT 65,
  `stack_duration_ms` INT NOT NULL DEFAULT 3200,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Splash Screen Images Table
-- -----------------------------------------------------------------------------
CREATE TABLE `splash_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_path` VARCHAR(500) NULL,
  `external_url` VARCHAR(1000) NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Homepage Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE `homepage_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `logo_type` ENUM('TEXT', 'IMAGE') NOT NULL DEFAULT 'TEXT',
  `navbar_logo_text` VARCHAR(255) NULL,
  `logo_image_path` VARCHAR(500) NULL,
  `navbar_projects_label` VARCHAR(100) NULL,
  `navbar_contact_label` VARCHAR(100) NULL,
  `theme_toggle_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `theme_mode` ENUM('DARK', 'LIGHT') NOT NULL DEFAULT 'LIGHT',
  `photographer_name` VARCHAR(255) NULL,
  `main_text_case` ENUM('as_written', 'sentence', 'upper', 'lower') NOT NULL DEFAULT 'as_written',
  `subtext_case` ENUM('as_written', 'sentence', 'upper', 'lower') NOT NULL DEFAULT 'as_written',
  `top_track_speed` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `bottom_track_speed` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `hero_subtext` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5b. Project Categories Table (dynamic, admin-managed - no hardcoded values)
-- -----------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Projects Table (Five Projects Foundation)
-- -----------------------------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `subtext` VARCHAR(500) NULL,
  `year` VARCHAR(20) NOT NULL DEFAULT '2025',
  `category` VARCHAR(100) NOT NULL DEFAULT 'EDITORIAL',
  `story` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Project Images Table (30 Images Across 5 Projects)
-- -----------------------------------------------------------------------------
CREATE TABLE `project_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `file_path` VARCHAR(500) NULL,
  `external_url` VARCHAR(1000) NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_project_images_project`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Homepage Moving Images Table (FRONT and BACK tracks)
-- -----------------------------------------------------------------------------
CREATE TABLE `homepage_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_path` VARCHAR(500) NULL,
  `external_url` VARCHAR(1000) NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `track` ENUM('FRONT', 'BACK') NOT NULL DEFAULT 'FRONT',
  `project_id` INT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_homepage_images_project`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Social Links Table
-- -----------------------------------------------------------------------------
CREATE TABLE `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform_key` VARCHAR(50) NOT NULL UNIQUE,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `display_mode` ENUM('TEXT', 'ICON') NOT NULL DEFAULT 'TEXT',
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Footer Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE `footer_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `copyright_text` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography © 2026',
  `designer_label` VARCHAR(100) NOT NULL DEFAULT 'Designed by',
  `designer_name` VARCHAR(100) NOT NULL DEFAULT 'Castel Studios',
  `designer_url` VARCHAR(500) NOT NULL DEFAULT 'https://castelstudios.com',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. Global SEO Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE `seo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_title` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography',
  `meta_description` TEXT NULL,
  `primary_keywords` TEXT NULL,
  `secondary_keywords` TEXT NULL,
  `canonical_url` VARCHAR(500) NULL,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image_url` VARCHAR(500) NULL COMMENT 'Local storage path only, set via SEO image upload - never a raw external URL',
  `favicon_path` VARCHAR(500) NULL COMMENT 'Local storage path only, set via favicon upload',
  `google_site_verification` VARCHAR(255) NULL,
  `robots_indexing` BOOLEAN NOT NULL DEFAULT TRUE,
  `schema_type` VARCHAR(100) NOT NULL DEFAULT 'PhotographyBusiness',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. SEO Location Landing Pages Table
-- -----------------------------------------------------------------------------
CREATE TABLE `seo_locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `location_name` VARCHAR(255) NOT NULL,
  `state` VARCHAR(100) NULL,
  `professional_type` VARCHAR(100) NULL,
  `url_slug` VARCHAR(255) NOT NULL UNIQUE,
  `seo_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `primary_keyword` VARCHAR(255) NULL,
  `secondary_keywords` TEXT NULL,
  `location_content` LONGTEXT NULL,
  `services_offered` TEXT NULL,
  `related_projects` TEXT NULL COMMENT 'JSON array of project IDs',
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image_url` VARCHAR(500) NULL,
  `canonical_url` VARCHAR(500) NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_indexable` BOOLEAN NOT NULL DEFAULT TRUE,
  `sitemap_priority` DECIMAL(2,1) NOT NULL DEFAULT 0.5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
