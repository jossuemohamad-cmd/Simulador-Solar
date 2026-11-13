-- ============================================================
-- LECASU LDA — Esquema Oficial de Banco de Dados MySQL
-- Armazena: Produtos (Painéis, Inversores, Baterias), Imagens (Base64/URL),
-- Credenciais Administrativas, Orçamentos e Metadados do Sistema.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lecasu_solar`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `lecasu_solar`;

-- 1. Tabela de Equipamentos (Painéis, Inversores, Baterias)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(120) NOT NULL,
  `sku` VARCHAR(120) DEFAULT NULL,
  `category` ENUM('panels', 'inverters', 'batteries') NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(120) DEFAULT '',
  `voltage_type` VARCHAR(16) DEFAULT NULL,
  `phase` VARCHAR(24) DEFAULT NULL,
  `subcategory` VARCHAR(64) DEFAULT NULL,
  `power_or_capacity` DECIMAL(12, 3) NOT NULL DEFAULT 0,
  `price` DECIMAL(14, 2) NOT NULL DEFAULT 0,
  `image` LONGTEXT,
  `extra` TEXT,
  `metadata_json` JSON DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_products_category_sort` (`category`, `sort_order`),
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_brand` (`brand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Utilizadores Administrativos
CREATE TABLE IF NOT EXISTS `admin_users` (
  `username` VARCHAR(120) NOT NULL,
  `alias` VARCHAR(64) DEFAULT 'admin',
  `name` VARCHAR(160) NOT NULL DEFAULT 'Administrador LECASU',
  `salt` VARCHAR(128) NOT NULL,
  `password_hash` VARCHAR(256) NOT NULL,
  `updated_at` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Orçamentos / Simulações Guardadas
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` VARCHAR(80) NOT NULL,
  `client_name` VARCHAR(180) DEFAULT NULL,
  `client_phone` VARCHAR(80) DEFAULT NULL,
  `client_email` VARCHAR(160) DEFAULT NULL,
  `total_price` DECIMAL(14, 2) DEFAULT NULL,
  `payload_json` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_quotes_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela de Metadados do Sistema (ex.: data da última atualização do catálogo)
CREATE TABLE IF NOT EXISTS `system_meta` (
  `meta_key` VARCHAR(100) NOT NULL,
  `meta_value` TEXT,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

