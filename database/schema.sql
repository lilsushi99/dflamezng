-- =============================================================================
-- Flames Photography Database Schema
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / PHPMyAdmin
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist (in reverse dependency order)
DROP TABLE IF EXISTS `project_images`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `homepage_images`;
DROP TABLE IF EXISTS `homepage_settings`;
DROP TABLE IF EXISTS `splash_images`;
DROP TABLE IF EXISTS `splash_settings`;
DROP TABLE IF EXISTS `social_links`;
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
  `top_track_speed` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `bottom_track_speed` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `hero_quote` TEXT NULL,
  `hero_subtext` TEXT NULL,
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
