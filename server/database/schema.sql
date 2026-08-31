-- ====================================================================
-- FLAMES PHOTOGRAPHY & CMS DATABASE SCHEMA (MySQL 5.7+ / 8.0+ / phpMyAdmin)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `flames_photography` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `flames_photography`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(150) NOT NULL DEFAULT 'Lead Curator',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Site General Settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `site_title` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography',
  `photographer_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade',
  `studio_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade Studio',
  `contact_email` VARCHAR(255) NOT NULL DEFAULT 'inquiry@flamesphotography.com',
  `contact_phone` VARCHAR(100) DEFAULT '+234 803 123 4567',
  `location_text` VARCHAR(255) DEFAULT 'Lagos, Nigeria',
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `availability_text` VARCHAR(255) DEFAULT 'Available for Commissions Worldwide',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Splash Screen Configuration
CREATE TABLE IF NOT EXISTS `splash_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `photographer_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade',
  `signature_text` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography',
  `splash_subtext` TEXT,
  `typewriter_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `typing_speed_ms` INT NOT NULL DEFAULT 65,
  `stack_duration_ms` INT NOT NULL DEFAULT 3200,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Splash Screen Stack Images
CREATE TABLE IF NOT EXISTS `splash_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `file_path` VARCHAR(500) NULL,
  `external_url` TEXT NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_splash_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Homepage Settings
CREATE TABLE IF NOT EXISTS `homepage_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `navbar_logo_text` VARCHAR(255) NOT NULL DEFAULT 'God Akinbade',
  `navbar_projects_label` VARCHAR(100) NOT NULL DEFAULT 'PROJECTS',
  `navbar_contact_label` VARCHAR(100) NOT NULL DEFAULT 'CONTACT',
  `theme_toggle_visible` TINYINT(1) NOT NULL DEFAULT 1,
  `photographer_name` VARCHAR(255) NOT NULL DEFAULT 'Gold Akingbade',
  `top_track_speed` DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
  `bottom_track_speed` DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
  `hero_quote` TEXT,
  `hero_subtext` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `subtext` VARCHAR(500) DEFAULT NULL,
  `year` VARCHAR(20) NOT NULL DEFAULT '2025',
  `category` VARCHAR(100) NOT NULL DEFAULT 'FASHION',
  `story` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Project Gallery Images
CREATE TABLE IF NOT EXISTS `project_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `file_path` VARCHAR(500) NULL,
  `external_url` TEXT NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_project_img_order` (`project_id`, `display_order`),
  CONSTRAINT `fk_project_images_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Homepage Parallax Images (Front & Back Tracks)
CREATE TABLE IF NOT EXISTS `homepage_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `file_path` VARCHAR(500) NULL,
  `external_url` TEXT NULL,
  `source_type` ENUM('local', 'external') NOT NULL DEFAULT 'local',
  `track` ENUM('FRONT', 'BACK') NOT NULL DEFAULT 'FRONT',
  `project_id` INT UNSIGNED NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_homepage_track_order` (`track`, `display_order`),
  CONSTRAINT `fk_homepage_images_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Social & Portfolio Links
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `platform_key` VARCHAR(50) NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_social_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Footer Configuration
CREATE TABLE IF NOT EXISTS `footer_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `copyright_text` VARCHAR(255) NOT NULL DEFAULT 'Flames Photography © 2026',
  `designer_label` VARCHAR(100) NOT NULL DEFAULT 'Designed by',
  `designer_name` VARCHAR(150) NOT NULL DEFAULT 'Castel Studios',
  `designer_url` VARCHAR(500) NOT NULL DEFAULT 'https://castelstudios.com',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- INITIAL SEED RECORDS (Executes safely if tables are empty)
-- ====================================================================

-- Default Admin (admin12345 / admin12345)
INSERT INTO `admins` (`id`, `username`, `password_hash`, `display_name`)
VALUES (1, 'admin12345', '$2a$10$w8T0M4j6lR8k1c5G2P3iNuDqN3bO8hE1f2c4a6e8g0i2k4m6o8q', 'Lead Curator')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- Default Site Settings
INSERT INTO `site_settings` (`id`, `site_title`, `photographer_name`, `studio_name`, `contact_email`, `contact_phone`, `location_text`, `is_available`, `availability_text`)
VALUES (1, 'Flames Photography', 'Gold Akingbade', 'Gold Akingbade Studio', 'inquiry@flamesphotography.com', '+234 803 123 4567', 'Lagos, Nigeria', 1, 'Available for Commissions Worldwide')
ON DUPLICATE KEY UPDATE `site_title` = VALUES(`site_title`);

-- Default Splash Settings
INSERT INTO `splash_settings` (`id`, `is_enabled`, `photographer_name`, `signature_text`, `splash_subtext`, `typewriter_enabled`, `typing_speed_ms`, `stack_duration_ms`)
VALUES (1, 1, 'Gold Akingbade', 'Flames Photography', 'A visual archive of contemporary Nigerian fashion and fine art photography.', 1, 65, 3200)
ON DUPLICATE KEY UPDATE `photographer_name` = VALUES(`photographer_name`);

-- Default Homepage Settings
INSERT INTO `homepage_settings` (`id`, `navbar_logo_text`, `navbar_projects_label`, `navbar_contact_label`, `theme_toggle_visible`, `photographer_name`, `top_track_speed`, `bottom_track_speed`, `hero_quote`, `hero_subtext`)
VALUES (1, 'God Akinbade', 'PROJECTS', 'CONTACT', 1, 'Gold Akingbade', 1.00, 1.00, 'A study of identity, architectural movement and quiet confidence through contemporary Nigerian photography.', 'Monochrome and pigmented archival studies across West African landscapes.')
ON DUPLICATE KEY UPDATE `navbar_logo_text` = VALUES(`navbar_logo_text`);

-- Default Projects
INSERT INTO `projects` (`id`, `name`, `subtext`, `year`, `category`, `story`)
VALUES 
(1, 'The Silhouettes of Eko', 'High-fashion editorial across contemporary Lagos landscapes', '2025', 'FASHION', 'An exploration of architectural form, fluid draping, and modern West African identity staged against the coastal light and modernist structures of Lagos Island.'),
(2, 'Indigo Resonance', 'Sacred hues and handcrafted indigo dyes of Yorubaland', '2024', 'TEXTILE & EDITORIAL', 'A dedicated visual monograph exploring the organic fermentation of natural indigo vats, hand-resist Adire textiles, and the luminous interplay of sunlight piercing open-air dye pits.'),
(3, 'Red Earth & Clay', 'Earth pigments, warm skin tones, and granite monoliths of Ondo', '2024', 'FINE ART & FASHION', 'Staged across the ancient stone stairways and rich red laterite soil of the historic Idanre mountain settlement.'),
(4, 'Woven Formations', 'Ceremonial weaving, contemporary silhouettes, and sculptural volume', '2025', 'SCULPTURAL FASHION', 'Focusing on heavy hand-loomed Aso-Oke weaves reinterpreted into contemporary geometric coats and monumental silhouettes.'),
(5, 'Monolith & Shadow', 'Minimalist chiaroscuro and sacred architectural forms', '2025', 'ARCHITECTURAL CHIAROSCURO', 'Documenting the spiritual stillness of modernist ecclesiastical architecture and raw stone compounds under coastal sunlight.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Default Social Links
INSERT INTO `social_links` (`id`, `platform_key`, `label`, `url`, `display_order`, `is_active`)
VALUES
(1, 'instagram', 'INSTAGRAM', 'https://instagram.com', 1, 1),
(2, 'tiktok', 'TIKTOK', 'https://tiktok.com', 2, 1),
(3, 'pixieset', 'PIXIESET', 'https://pixieset.com', 3, 1),
(4, 'pinterest', 'PINTEREST', 'https://pinterest.com', 4, 1),
(5, 'whatsapp', 'WHATSAPP', 'https://whatsapp.com', 5, 1)
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);

-- Default Footer Settings
INSERT INTO `footer_settings` (`id`, `copyright_text`, `designer_label`, `designer_name`, `designer_url`)
VALUES (1, 'Flames Photography © 2026', 'Designed by', 'Castel Studios', 'https://castelstudios.com')
ON DUPLICATE KEY UPDATE `copyright_text` = VALUES(`copyright_text`);
