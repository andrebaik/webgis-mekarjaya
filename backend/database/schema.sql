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
    `icon` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Locations table
CREATE TABLE IF NOT EXISTS `locations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `category_id` INT NOT NULL,
    `name_id` VARCHAR(200) NOT NULL,
    `description_id` TEXT,
    `coordinates` JSON NOT NULL,
    `images` JSON,
    `featured` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_locations_category_id` (`category_id`),
    INDEX `idx_locations_featured` (`featured`),
    INDEX `idx_locations_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin accounts
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Village profile (single row, id=1)
CREATE TABLE IF NOT EXISTS `village_profiles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name_id` VARCHAR(200) NOT NULL,
    `description_id` TEXT,
    `history_id` TEXT,
    `image_url` VARCHAR(500),
    `address` VARCHAR(255),
    `phone` VARCHAR(50),
    `email` VARCHAR(150),
    `vision_id` TEXT,
    -- Satu poin misi per baris; frontend memecahnya dengan split('\n').
    `mission_id` TEXT,
    `area_km2` DECIMAL(10,2),
    `altitude_m` INT,
    `rw_count` INT,
    `rt_count` INT,
    `boundary_north` VARCHAR(150),
    `boundary_south` VARCHAR(150),
    `boundary_east` VARCHAR(150),
    `boundary_west` VARCHAR(150),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rekap penduduk per dusun/RW, mengikuti format "Laporan Penduduk" bulanan desa.
-- Total penduduk sengaja TIDAK disimpan — selalu dihitung `male + female` agar tidak
-- bisa berbeda dari rinciannya (di laporan kertas, kolom jumlahnya pernah salah ketik).
CREATE TABLE IF NOT EXISTS `village_hamlets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `year` INT NOT NULL,
    `month` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `rw` INT NOT NULL,
    `rt_count` INT,
    `kk_count` INT,
    `male` INT NOT NULL DEFAULT 0,
    `female` INT NOT NULL DEFAULT 0,
    `ktp_required` INT,
    `ktp_done` INT,
    `ktp_pending` INT,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_hamlet` (`year`, `month`, `rw`),
    INDEX `idx_hamlet_period` (`year`, `month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APBD items
CREATE TABLE IF NOT EXISTS `apbd_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `year` INT NOT NULL,
    -- 'pelaksanaan' = ringkasan realisasi (Pendapatan/Belanja/Pembiayaan),
    -- 'pendapatan' & 'belanja' = rincian per pos anggaran.
    `type` ENUM('pelaksanaan', 'pendapatan', 'belanja') NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    -- `amount` = pagu anggaran, `realisasi` = dana yang benar-benar terserap.
    -- realisasi nullable: pos yang belum terealisasi berbeda maknanya dari
    -- pos yang terealisasi Rp 0, dan itu harus bisa dibedakan.
    `amount` BIGINT NOT NULL DEFAULT 0,
    `realisasi` BIGINT DEFAULT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_apbd_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Village periods (kepala desa)
CREATE TABLE IF NOT EXISTS `village_periods` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `year_start` INT NOT NULL,
    `year_end` INT NOT NULL,
    `photo_url` VARCHAR(500),
    `description_id` TEXT,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs per period
CREATE TABLE IF NOT EXISTS `period_programs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `period_id` INT NOT NULL,
    `title_id` VARCHAR(200) NOT NULL,
    `description_id` TEXT,
    `year` INT,
    `status` ENUM('selesai', 'berjalan') DEFAULT 'selesai',
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`period_id`) REFERENCES `village_periods`(`id`) ON DELETE CASCADE,
    INDEX `idx_program_period` (`period_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
