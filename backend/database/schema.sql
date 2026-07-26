-- Database Schema for WebGIS Desa Mekarjaya
-- Creates the webgis_mekarjaya database and tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `webgis_mekarjaya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `webgis_mekarjaya`;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `name_id` VARCHAR(100) NOT NULL,
    `name_su` VARCHAR(100) NOT NULL,
    `name_en` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Locations table
CREATE TABLE IF NOT EXISTS `locations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `category_id` INT NOT NULL,
    `name_id` VARCHAR(200) NOT NULL,
    `name_su` VARCHAR(200) NOT NULL,
    `name_en` VARCHAR(200) NOT NULL,
    `description_id` TEXT,
    `description_su` TEXT,
    `description_en` TEXT,
    `coordinates` JSON NOT NULL,
    `images` JSON,
    `featured` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better query performance
CREATE INDEX `idx_locations_category_id` ON `locations` (`category_id`);
CREATE INDEX `idx_locations_featured` ON `locations` (`featured`);
CREATE INDEX `idx_locations_slug` ON `locations` (`slug`);
CREATE INDEX `idx_categories_slug` ON `categories` (`slug`);