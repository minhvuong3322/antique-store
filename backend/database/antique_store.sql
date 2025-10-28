-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 28, 2025 at 06:39 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `antique_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Đồ gỗ cổ', 'do-go-co', 'Bàn ghế, tủ kệ, đồ thờ bằng gỗ quý', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(2, 'Đồ sứ cổ', 'do-su-co', 'Bình, lọ, chén, đĩa sứ cổ', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(3, 'Đồ đồng cổ', 'do-dong-co', 'Đồ thờ, tượng, đồ trang trí bằng đồng', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(4, 'Tranh cổ', 'tranh-co', 'Tranh sơn dầu, tranh khắc gỗ, tranh lụa', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(5, 'Đèn cổ', 'den-co', 'Đèn dầu, đèn chùm, đèn trang trí cổ', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(6, 'Đồ trang sức', 'do-trang-suc', 'Nhẫn, vòng, dây chuyền cổ', NULL, NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(7, 'Đồng hồ cổ', 'dong-ho-co', 'Các loại đồng hồ cổ điển và quý hiếm', NULL, NULL, '2025-10-03 05:15:35', '2025-10-03 05:15:35'),
(9, 'Gốm Sứ', 'gom-su', 'Đồ gốm sứ cổ điển', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(10, 'Đồ Gỗ', 'do-go', 'Đồ gỗ cổ truyền', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(11, 'Đồng Hồ', 'dong-ho', 'Đồng hồ cổ điển', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(12, 'Đèn', 'den', 'Đèn cổ trang trí', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(13, 'Đồ Bạc', 'do-bac', 'Đồ bạc cổ điển', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(14, 'Tranh', 'tranh', 'Tranh cổ điển', NULL, NULL, '2025-10-03 18:08:52', '2025-10-03 18:08:52');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số hóa đơn',
  `invoice_date` date NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(15,2) NOT NULL COMMENT 'Tổng tiền hàng',
  `shipping_fee` decimal(15,2) DEFAULT '0.00',
  `tax` decimal(15,2) DEFAULT '0.00' COMMENT 'Thuế VAT',
  `discount` decimal(15,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL COMMENT 'Tổng cộng',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('unpaid','paid','partially_paid','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `pdf_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Link file PDF hóa đơn',
  `sent_to_email` tinyint(1) DEFAULT '0' COMMENT 'Đã gửi email hay chưa',
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `customer_tax_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã số thuế (nếu là doanh nghiệp)',
  `sent_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `order_id`, `invoice_number`, `invoice_date`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `subtotal`, `shipping_fee`, `tax`, `discount`, `total_amount`, `payment_method`, `payment_status`, `notes`, `pdf_url`, `sent_to_email`, `created_by`, `created_at`, `updated_at`, `customer_tax_code`, `sent_at`) VALUES
(1, 17, 'INV-20251026-5822', '2025-10-26', 'Vương Trương Hồ Minh', 'vminh3321@gmail.com', '0706166053', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '110000000.00', '0.00', '11000000.00', '0.00', '121000000.00', 'COD', 'unpaid', NULL, NULL, 1, 1, '2025-10-26 08:18:35', '2025-10-26 10:52:37', NULL, '2025-10-26 10:52:37'),
(2, 16, 'INV-20251026-1997', '2025-10-26', 'Vương Trương Hồ Minh', 'vminh3321@gmail.com', '0706166053', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '22000000.00', '0.00', '2200000.00', '0.00', '24200000.00', 'COD', 'unpaid', NULL, NULL, 1, 1, '2025-10-26 08:21:11', '2025-10-26 10:52:39', NULL, '2025-10-26 10:52:39'),
(4, 15, 'INV-20251026-6658', '2025-10-26', 'Vương Trương Hồ Minh', 'vminh3321@gmail.com', '0706166053', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '38000000.00', '0.00', '3800000.00', '0.00', '41800000.00', 'COD', 'unpaid', NULL, NULL, 0, 1, '2025-10-26 11:05:06', '2025-10-26 11:05:06', NULL, NULL),
(5, 14, 'INV-20251026-6375', '2025-10-26', 'Vương Trương Hồ Minh', 'vminh3321@gmail.com', '0706166053', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '38000000.00', '0.00', '3800000.00', '0.00', '41800000.00', 'COD', 'unpaid', NULL, NULL, 0, 1, '2025-10-26 11:11:36', '2025-10-26 11:11:36', NULL, NULL),
(6, 18, 'INV-20251027-9334', '2025-10-27', 'Vương Trương Hồ Minh', 'vminh3321@gmail.com', '0706166053', '2 Võ Oanh Quận Bình Thạnh TPHCM, thủ đức, TPHCM', '22000000.00', '0.00', '2200000.00', '0.00', '24200000.00', 'COD', 'unpaid', NULL, NULL, 0, 1, '2025-10-27 16:03:49', '2025-10-27 16:03:49', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(15,2) NOT NULL COMMENT 'Tổng cộng',
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_fee` decimal(15,2) DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `discount` decimal(15,2) DEFAULT '0.00' COMMENT 'Giảm giá',
  `tax` decimal(15,2) DEFAULT '0.00' COMMENT 'Thuế',
  `status` enum('pending','confirmed','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_amount`, `shipping_address`, `shipping_fee`, `discount`, `tax`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 8, 'ORD17608445094510', '22000000.01', '123 Test St, HCMC', '50000.00', '0.00', '2200000.00', 'delivered', NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(2, 8, 'ORD17608445094631', '3500000.01', '123 Test St, HCMC', '50000.00', '0.00', '350000.00', 'pending', NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(3, 8, 'ORD17608445094732', '22000000.01', '123 Test St, HCMC', '50000.00', '0.00', '2200000.00', 'pending', NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(6, 7, 'ORD1761458748106989', '13200000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '1200000.00', 'cancelled', '', '2025-10-26 06:05:48', '2025-10-26 06:34:57'),
(8, 7, 'ORD1761459071167095', '49500000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '4500000.00', 'cancelled', '', '2025-10-26 06:11:11', '2025-10-26 06:11:14'),
(9, 7, 'ORD1761459087710783', '49500000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '4500000.00', 'cancelled', '', '2025-10-26 06:11:27', '2025-10-26 06:11:39'),
(10, 7, 'ORD1761459189831607', '49500000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '4500000.00', 'cancelled', '', '2025-10-26 06:13:09', '2025-10-26 06:13:26'),
(12, 7, 'ORD1761459733796612', '49500000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '4500000.00', 'cancelled', '', '2025-10-26 06:22:13', '2025-10-26 06:22:26'),
(13, 7, 'ORD1761459767433765', '13200000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '1200000.00', 'cancelled', '', '2025-10-26 06:22:47', '2025-10-26 06:27:47'),
(14, 7, 'ORD1761460077541663', '41800000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '3800000.00', 'cancelled', '', '2025-10-26 06:27:57', '2025-10-27 15:09:47'),
(15, 7, 'ORD1761460093026688', '41800000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '3800000.00', 'cancelled', '', '2025-10-26 06:28:13', '2025-10-27 15:09:44'),
(16, 7, 'ORD1761460579088631', '24200000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '2200000.00', 'confirmed', '', '2025-10-26 06:36:19', '2025-10-27 15:53:53'),
(17, 7, 'ORD1761466248787320', '121000000.00', '02 Võ Oanh, Phường 25, Bình Thạnh, Thủ Đức, Hồ Chí Minh', '0.00', '0.00', '11000000.00', 'confirmed', '', '2025-10-26 08:10:48', '2025-10-27 15:42:11'),
(18, 7, 'ORD1761580741781210', '24200000.00', '2 Võ Oanh Quận Bình Thạnh TPHCM, thủ đức, TPHCM', '0.00', '0.00', '2200000.00', 'cancelled', '', '2025-10-27 15:59:01', '2025-10-28 06:22:47');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(15,2) NOT NULL COMMENT 'Giá bán',
  `subtotal` decimal(15,2) NOT NULL COMMENT 'Thành tiền',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 1, '22000000.00', '22000000.00', '2025-10-19 03:28:29'),
(2, 2, 2, 1, '3500000.00', '3500000.00', '2025-10-19 03:28:29'),
(3, 3, 1, 1, '22000000.00', '22000000.00', '2025-10-19 03:28:29'),
(4, 6, 18, 1, '12000000.00', '12000000.00', '2025-10-26 06:05:48'),
(6, 8, 15, 1, '45000000.00', '45000000.00', '2025-10-26 06:11:11'),
(7, 9, 15, 1, '45000000.00', '45000000.00', '2025-10-26 06:11:27'),
(8, 10, 15, 1, '45000000.00', '45000000.00', '2025-10-26 06:13:09'),
(10, 12, 15, 1, '45000000.00', '45000000.00', '2025-10-26 06:22:13'),
(11, 13, 18, 1, '12000000.00', '12000000.00', '2025-10-26 06:22:47'),
(12, 14, 19, 1, '38000000.00', '38000000.00', '2025-10-26 06:27:57'),
(13, 15, 19, 1, '38000000.00', '38000000.00', '2025-10-26 06:28:13'),
(14, 16, 20, 1, '22000000.00', '22000000.00', '2025-10-26 06:36:19'),
(15, 17, 15, 1, '45000000.00', '45000000.00', '2025-10-26 08:10:48'),
(16, 17, 17, 1, '65000000.00', '65000000.00', '2025-10-26 08:10:48'),
(17, 18, 20, 1, '22000000.00', '22000000.00', '2025-10-27 15:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('register','reset_password','verify_email') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'register',
  `is_used` tinyint(1) DEFAULT '0',
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Store OTP codes for authentication and verification';

--
-- Dumping data for table `otps`
--

INSERT INTO `otps` (`id`, `email`, `otp_code`, `type`, `is_used`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'vminh3321@gmail.com', '262130', 'reset_password', 1, '2025-10-04 06:39:22', '2025-10-04 06:34:22', '2025-10-04 06:35:17'),
(2, 'dieuhuong2523@gmail.com', '930252', 'reset_password', 1, '2025-10-04 10:32:13', '2025-10-04 10:27:13', '2025-10-04 10:29:23'),
(3, 'dieuhuong2523@gmail.com', '731817', 'reset_password', 0, '2025-10-04 10:34:23', '2025-10-04 10:29:23', '2025-10-04 10:29:23'),
(4, 'trumdie6@gmail.com', '834715', 'reset_password', 1, '2025-10-04 10:36:37', '2025-10-04 10:31:37', '2025-10-04 10:32:05');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 1, '22000000.01', 'COD', 'completed', NULL, NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(2, 2, '3500000.01', 'COD', 'pending', NULL, NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(3, 3, '22000000.01', 'COD', 'pending', NULL, NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(4, 6, '13200000.00', 'COD', 'pending', NULL, NULL, '2025-10-26 06:05:48', '2025-10-26 06:05:48'),
(5, 8, '49500000.00', 'COD', 'pending', NULL, NULL, '2025-10-26 06:11:11', '2025-10-26 06:11:11'),
(6, 9, '49500000.00', 'COD', 'pending', NULL, NULL, '2025-10-26 06:11:27', '2025-10-26 06:11:27'),
(7, 10, '49500000.00', 'COD', 'pending', NULL, NULL, '2025-10-26 06:13:09', '2025-10-26 06:13:09'),
(8, 12, '49500000.00', 'COD', 'pending', NULL, NULL, '2025-10-26 06:22:13', '2025-10-26 06:22:13'),
(9, 13, '13200000.00', 'BankTransfer', 'pending', NULL, NULL, '2025-10-26 06:22:47', '2025-10-26 06:22:47'),
(10, 14, '41800000.00', 'BankTransfer', 'completed', NULL, '2025-10-26 08:21:45', '2025-10-26 06:27:57', '2025-10-26 08:21:45'),
(11, 15, '41800000.00', 'VNPay', 'completed', NULL, '2025-10-26 08:21:37', '2025-10-26 06:28:13', '2025-10-26 08:21:37'),
(12, 16, '24200000.00', 'BankTransfer', 'pending', NULL, NULL, '2025-10-26 06:36:19', '2025-10-26 06:36:19'),
(13, 17, '121000000.00', 'VNPay', 'completed', NULL, '2025-10-27 15:38:50', '2025-10-26 08:10:48', '2025-10-27 15:38:50'),
(14, 18, '24200000.00', 'COD', 'completed', NULL, '2025-10-28 06:22:40', '2025-10-27 15:59:01', '2025-10-28 06:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(15,2) NOT NULL COMMENT 'Giá gốc',
  `sale_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá khuyến mãi',
  `stock_quantity` int DEFAULT '0',
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `condition` enum('excellent','good','fair','poor') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_manufactured` int DEFAULT NULL,
  `material` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dimensions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` decimal(8,2) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `view_count` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `sale_price`, `stock_quantity`, `sku`, `images`, `condition`, `origin`, `year_manufactured`, `material`, `dimensions`, `weight`, `is_featured`, `is_active`, `view_count`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tủ thờ gỗ Hương', 'tu-tho-go-huong', 'Tủ thờ gỗ hương 3 cấp, chạm trổ tinh xảo', '25000000.00', '22000000.00', 2, 'TGH001', '[\"https://banthotamviet.vn/wp-content/uploads/2023/05/tu-tho-go-ep-3.jpg\"]', 'excellent', 'Việt Nam', 1920, 'Gỗ hương', NULL, NULL, 1, 1, 26, '2025-10-03 03:01:23', '2025-10-04 02:30:07'),
(2, 2, 'Bình hoa sứ Bát Tràng', 'binh-hoa-su-bat-trang', 'Bình hoa sứ men xanh, cao 35cm', '3500000.00', NULL, 5, 'BSB001', '[\"https://quatangbansac.vn/wp-content/uploads/2023/03/6.jpg\"]', 'good', 'Việt Nam', 1950, 'Sứ', NULL, NULL, 1, 1, 111, '2025-10-03 03:01:23', '2025-10-22 12:01:55'),
(3, 3, 'Tượng Phật bằng đồng', 'tuong-phat-bang-dong', 'Tượng Phật Thích Ca cao 40cm', '8000000.00', '7500000.00', 1, 'TPD001', '[\"https://tse1.mm.bing.net/th/id/OIP.jHJaCauxkmGTn6qLJBiBSgHaJ4?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1930, 'Đồng', NULL, NULL, 1, 1, 16, '2025-10-03 03:01:23', '2025-10-03 14:28:23'),
(4, 4, 'Tranh sơn dầu phong cảnh', 'tranh-son-dau-phong-canh', 'Tranh sơn dầu cảnh làng quê Việt Nam', '15000000.00', NULL, 6, 'TSD001', '[\"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400\"]', 'good', 'Việt Nam', 1960, 'Sơn dầu trên canvas', '', NULL, 1, 1, 2, '2025-10-03 03:01:23', '2025-10-28 06:16:47'),
(5, 1, 'Bàn ghế salon gỗ Trắc', 'ban-ghe-salon-go-trac', 'Bộ bàn ghế salon gỗ trắc 6 món', '45000000.00', '42000000.00', 6, 'BGT001', '[\"https://tse3.mm.bing.net/th/id/OIP._IZDGt-nyYdfhYO9yjKYaQHaFi?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1940, 'Gỗ trắc', '', NULL, 1, 1, 30, '2025-10-03 03:01:23', '2025-10-28 06:16:54'),
(6, 5, 'Đèn chùm pha lê cổ', 'den-chum-pha-le-co', 'Đèn chùm pha lê 8 nhánh, phong cách Pháp', '12000000.00', NULL, 1, 'DPL001', '[\"https://noithatdepgiare.vn/upload/images/29den-chum-pha-le-nen-kieu-dang-nghe-thuat-chau-au-029-423-0.jpg\"]', 'good', 'Pháp', 1945, 'Pha lê, đồng', NULL, NULL, 1, 1, 12, '2025-10-03 03:01:23', '2025-10-03 15:10:24'),
(7, 2, 'Đĩa Gốm Chu Đậu', 'dia-com-chu-dau', 'Đĩa cảnh gốm chu đậu', '2000000.00', '1500000.00', 1, 'DPL002', '[\"https://dytbw3ui6vsu6.cloudfront.net/media/catalog/product/resize/914x914/BND/2488-121_1.webp\"]', 'good', 'Việt Nam', 1400, 'Đất sét', NULL, NULL, NULL, 1, 36, '2025-10-03 03:01:23', '2025-10-22 12:20:04'),
(8, 4, 'Tranh Thờ Hàng Trống', 'tranh-tho-hang-trong', 'Những bản tranh in gỗ cổ, màu sắc tự nhiên, thể hiện tín ngưỡng dân gian.', '14000000.00', '12500000.00', 3, 'DPL003', '[\"https://thethaovanhoa.mediacdn.vn/Upload/3uPkfvAxvuOpUQrmKeiDaA/files/2022/01/C/tet6/Duchoa_Fotor.jpg\"]', 'good', 'Việt Nam', 1945, '', NULL, NULL, NULL, 1, 34, '2025-10-03 03:01:23', '2025-10-03 15:39:58'),
(9, 2, 'Gốm Men Ngọc Celadon (Thời Lý - Trần)', 'gom-men-ngoc-celadon', 'Nổi bật với màu men xanh ngọc bích bóng bẩy, là niềm tự hào của gốm sứ Việt Nam.', '25000000.00', '20000000.00', 3, 'DPL004', '[\"https://gomsubaokhanh.vn/media/news/1409_GmmentrngthiL.jpg\"]', 'excellent', 'Việt Nam', 1100, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:25:11'),
(10, 3, 'Trống Đồng Đông Sơn', 'trong-dong-dong-son', 'Là biểu tượng của văn hóa Việt Nam, cực kỳ quý hiếm và có giá trị lịch sử to lớn. Những chiếc trống nguyên bản gần như là vô giá và thuộc sở hữu quốc gia. Các phiên bản nhỏ hoặc mảnh vỡ cũng có giá trị sưu tầm cao.', '99000000.00', '85000000.00', 3, 'DPL005', '[\"https://dongtruyenthong.vn/upload/images/Tin-tuc/Trong-dong-dong-son/trong-dong-dong-son%20(4).jpg\"]', 'excellent', 'Việt Nam', 800, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:27:16'),
(11, 3, 'Ấm bạc chạm khắc cung đình huế', 'am-bac-cham-khac', 'Đồ dùng của vua chúa, quý tộc, thể hiện sự xa hoa và quyền quý.', '85000000.00', '75000000.00', 1, 'DPL006', '[\"https://tse3.mm.bing.net/th/id/OIP.g7rnYc7UK8F_LVGGypAW2gHaI8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1800, '', NULL, NULL, NULL, 1, 34, '2025-10-03 03:01:23', '2025-10-03 16:46:54'),
(12, 3, 'Đèn dầu bằng đồng', 'den-dau-bang-dong', 'Mang phong cách châu Âu cổ điển, vừa có giá trị sử dụng vừa có giá trị trang trí cao.', '7500000.00', '5000000.00', 6, 'DPL008', '[\"https://product.hstatic.net/200000283705/product/2_c386f94cb8a04120a5c5fd4615889aae_master.jpg\"]', 'good', 'Pháp', 1800, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:33:20'),
(15, 9, 'Bình Hoa Gốm Sứ Thanh Hoa', 'binh-hoa-gom-su-thanh-hoa', 'Bình hoa gốm sứ quý hiếm từ thời Thanh Hoa, được trang trí hoa văn rồng phượng tinh xảo.', '45000000.00', NULL, 3, NULL, '[\"https://th.bing.com/th/id/R.4073c43c2d40148e75ace0b5c002f320?rik=z8tr57riJi4rNQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-qDYFY4aBoYU%2fU2UBqPjn4yI%2fAAAAAAAAAO0%2fQDhfveO6jvg%2fs1600%2fcvth201307305f89e131-1892-4dac-89c9-6cc75cc64fb1.JPG&ehk=ztOGEmUWBnkbfu4GEC0cIMaFItpU0ToMFGahuP0QooQ%3d&risl=&pid=ImgRaw&r=0\"]', 'excellent', 'Trung Quốc', 1850, 'Gốm sứ', '35cm x 20cm', '2.50', 1, 1, 53, '2025-10-03 18:08:52', '2025-10-28 06:16:40'),
(16, 11, 'Đồng Hồ Quả Lắc Pháp Cổ', 'dong-ho-qua-lac-phap-co', 'Đồng hồ quả lắc cơ học Pháp từ thập niên 1920, vỏ gỗ sồi nguyên bản.', '28000000.00', NULL, 1, NULL, '[\"https://tse2.mm.bing.net/th/id/OIP.ET24O2RnzG64XNb9sjhANQHaNK?cb=12&w=576&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'good', 'Pháp', 1920, 'Gỗ sồi, Đồng', '80cm x 35cm x 18cm', '15.00', 1, 0, 42, '2025-10-03 18:08:52', '2025-10-25 11:51:51'),
(17, 10, 'Tủ Thuốc Gỗ Xưa', 'tu-thuoc-go-xua', 'Tủ thuốc cổ bằng gỗ lim với 48 ngăn kéo nhỏ, từng được sử dụng trong nhà thuốc Đông y.', '65000000.00', NULL, 4, NULL, '[\"https://dogotruongnhung.com/wp-content/uploads/2022/08/IMG_6281-1536x1536.jpg\"]', 'good', 'Việt Nam', 1900, 'Gỗ lim', '120cm x 90cm x 40cm', '80.00', 1, 1, 6, '2025-10-03 18:08:52', '2025-10-28 06:24:32'),
(18, 12, 'Đèn Dầu Đồng Thời Pháp', 'den-dau-dong-thoi-phap', 'Đèn dầu bằng đồng từ thời Pháp thuộc, thiết kế tinh xảo với hoa văn chạm khắc thủ công.', '12000000.00', NULL, 4, NULL, '[\"https://tse3.mm.bing.net/th/id/OIP.yEciLQRLfW7NkarjCyL5nwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'good', 'Pháp - Đông Dương', 1920, 'Đồng', '45cm x 15cm', '3.00', 0, 1, 0, '2025-10-03 18:08:52', '2025-10-26 09:16:55'),
(19, 10, 'Bàn Trà Gỗ Hương', 'ban-tra-go-huong', 'Bàn trà gỗ hương nguyên khối với họa tiết rồng chạm nổi tinh xảo.', '38000000.00', NULL, 5, NULL, '[\"https://tse2.mm.bing.net/th/id/OIP.JsuIdqufpwn3KfMoarPVfAHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1960, 'Gỗ hương', '45cm x 80cm x 50cm', '25.00', 1, 1, 2, '2025-10-03 18:08:52', '2025-10-26 06:28:13'),
(20, 13, 'Ấm Trà Bạc Hoàng Gia', 'am-tra-bac-hoang-gia', 'Ấm trà bạc nguyên chất với dấu ấn hoàng gia Anh, thiết kế Victorian cổ điển.', '22000000.00', NULL, 2, NULL, '[\"https://hungmoctra.vn/wp-content/uploads/2024/04/bo-an-tra-bac-999.jpg\"]', 'good', 'Anh', 1900, 'Bạc 925', '18cm x 15cm', '0.85', 0, 1, 10, '2025-10-03 18:08:52', '2025-10-27 15:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL COMMENT 'Đơn hàng mà sản phẩm được mua (để xác thực người dùng thực sự mua hàng)',
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL COMMENT 'Mảng URLs ảnh review',
  `is_verified_purchase` tinyint(1) DEFAULT '0' COMMENT 'Đã xác thực mua hàng',
  `helpful_count` int DEFAULT '0' COMMENT 'Số lượt hữu ích',
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_reply` text COLLATE utf8mb4_unicode_ci,
  `admin_reply_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `review_helpful`
--

CREATE TABLE `review_helpful` (
  `id` int NOT NULL,
  `review_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_auths`
--

CREATE TABLE `social_auths` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `provider` enum('google','facebook','apple','github') NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `profile_data` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `social_auths`
--

INSERT INTO `social_auths` (`id`, `user_id`, `provider`, `provider_id`, `profile_data`, `created_at`, `updated_at`, `access_token`, `refresh_token`, `expires_at`) VALUES
(3, 11, 'google', '113427750581114135138', '{\"name\": \"Kien thuc Kenh\", \"email\": \"kienthuckenh583@gmail.com\", \"picture\": \"https://lh3.googleusercontent.com/a/ACg8ocKdbGUPlqxCUVxmHxh9rlSqBIWZkM6YlYkOQyYLQG7_l0GHVg=s96-c\"}', '2025-10-19 08:41:21', '2025-10-22 11:41:56', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiOWY5MzcxZDU3NTVmM2UzODNhNDBhYjNhMTcyY2Q4YmFjYTUxN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDQ5ODc3NTk4NjgzLXFzbmIxdWZuYTk1cG1mNGJtcmM5dmpnaGhnMGI5djU4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA0OTg3NzU5ODY4My1xc25iMXVmbmE5NXBtZjRibXJjOXZqZ2hoZzBiOXY1OC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMzQyNzc1MDU4MTExNDEzNTEzOCIsImVtYWlsIjoia2llbnRodWNrZW5oNTgzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NjExMzI4NDgsIm5hbWUiOiJLaWVuIHRodWMgS2VuaCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLZGJHVVBscXhDVVZ4bUh4aDlybFNxQklXWmtNNllsWWtPUXlZTFFHN19sMEdIVmc9czk2LWMiLCJnaXZlbl9uYW1lIjoiS2llbiB0aHVjIiwiZmFtaWx5X25hbWUiOiJLZW5oIiwiaWF0IjoxNzYxMTMzMTQ4LCJleHAiOjE3NjExMzY3NDgsImp0aSI6IjIxMTljMGM0OGM2ZmUyM2JiN2JmYzhhYTc2ODRkOWRlNmViZGM5OTQifQ.idgczKe484YqBaZEkV1mujhgaynrLEyVYf4nsK4R-DsktBSXsSPQDi17ht6bvC2wiivrUEMr0fp9nrlaR3Z1euXdMk-pkCOb3SI4Ieiad4MtMrT7U-oCIxH7qo2GHt7gMfy6p82iy59qamsOFK4d3AsZAYFxrmvI95S9hAYb0wUEGXVNEExmPJkoe1tYPLkVeWO20TmSNBGYQDq7RhPzC43YLcGq2doYyaUJ5eblh777y93Pn-bS8fILgSRvcOyWFU7rM62D-dXy263TAla53FGfVkHnTNSmPPdtBcITVl5LQ3e3diCADg4vGvBU2eoKLjqO91zH0dJLhNMNLbb3FA', NULL, '2025-10-22 12:39:08'),
(4, 12, 'google', '109124174659756047903', '{\"name\": \"Vương Trương Hồ Minh\", \"email\": \"vuongthm4994@ut.edu.vn\", \"picture\": \"https://lh3.googleusercontent.com/a/ACg8ocKeReaM8vpOmhNm9ngmfLDamUr5ulNLD-Pv2XkK8eCmz3Qytw=s96-c\"}', '2025-10-19 10:48:34', '2025-10-25 11:51:29', 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4NDg5MjEyMmUyOTM5ZmQxZjMxMzc1YjJiMzYzZWM4MTU3MjNiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDQ5ODc3NTk4NjgzLXFzbmIxdWZuYTk1cG1mNGJtcmM5dmpnaGhnMGI5djU4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA0OTg3NzU5ODY4My1xc25iMXVmbmE5NXBtZjRibXJjOXZqZ2hoZzBiOXY1OC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTEyNDE3NDY1OTc1NjA0NzkwMyIsImhkIjoidXQuZWR1LnZuIiwiZW1haWwiOiJ2dW9uZ3RobTQ5OTRAdXQuZWR1LnZuIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc2MTM5MjYxNiwibmFtZSI6IlbGsMahbmcgVHLGsMahbmcgSOG7kyBNaW5oIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tlUmVhTTh2cE9taE5tOW5nbWZMRGFtVXI1dWxOTEQtUHYyWGtLOGVDbXozUXl0dz1zOTYtYyIsImdpdmVuX25hbWUiOiJWxrDGoW5nIiwiZmFtaWx5X25hbWUiOiJUcsawxqFuZyBI4buTIE1pbmgiLCJpYXQiOjE3NjEzOTI5MTYsImV4cCI6MTc2MTM5NjUxNiwianRpIjoiNTI2YmIwZTQ1NWUwMmU1OWZiNTMyMWQxZDliOTNlMTc2MDg5NTU5ZCJ9.Nka3xNGcxe7sN-55hIRXEhQt-ldrFY8tKLIcZOWnz4UXPPGK2vTJEByUZ1REUlLu_mxnio51nK_uZXWfvaSABp-4PTsD7aUaUK8K4Y1YX3ew06BMkdc_hWCgB1BWYA1XVR1W95u0_aLNRopBG_Qq16J21RwahHq-iWxlp4Spit7TBp0NMVtAJ1CvtKfgobhXagG_OaVHBcYrtoinhQrA1jBq09j15VIhqOgpXG8ovdjFm91PZ-5ggaVAnXkax65QSS_fx1dV4TnzdF37p7XAyJcA2_zy6L_ppxtJxyNfx8Sqkj_7enGWLuGPvQzAjq4UEAPKZTtp84RtzwUc2Z1Vhw', NULL, '2025-10-25 12:48:36'),
(5, 7, 'google', '117232342769077206064', '{\"name\": \"Vương Trương Hồ Minh\", \"email\": \"vminh3321@gmail.com\", \"picture\": \"https://lh3.googleusercontent.com/a/ACg8ocI_YYKWuYQ_vGWtjyfkzXGrHecqbjzPauoP62knwvGqs6fzrw=s96-c\"}', '2025-10-22 12:31:40', '2025-10-22 12:40:38', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiOWY5MzcxZDU3NTVmM2UzODNhNDBhYjNhMTcyY2Q4YmFjYTUxN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDQ5ODc3NTk4NjgzLXFzbmIxdWZuYTk1cG1mNGJtcmM5dmpnaGhnMGI5djU4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA0OTg3NzU5ODY4My1xc25iMXVmbmE5NXBtZjRibXJjOXZqZ2hoZzBiOXY1OC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzIzMjM0Mjc2OTA3NzIwNjA2NCIsImVtYWlsIjoidm1pbmgzMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NjExMzYzNzIsIm5hbWUiOiJWxrDGoW5nIFRyxrDGoW5nIEjhu5MgTWluaCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJX1lZS1d1WVFfdkdXdGp5Zmt6WEdySGVjcWJqelBhdW9QNjJrbnd2R3FzNmZ6cnc9czk2LWMiLCJnaXZlbl9uYW1lIjoiVsawxqFuZyIsImZhbWlseV9uYW1lIjoiVHLGsMahbmcgSOG7kyBNaW5oIiwiaWF0IjoxNzYxMTM2NjcyLCJleHAiOjE3NjExNDAyNzIsImp0aSI6IjEyOGI5MzM4ODhiOWQ5NWQ4ZjUxZmVjMGQyYzA2YTVkOGYyMjcxZmUifQ.NcuUj4GOkA8k5voi7REuhT2TBp6hzpdAPaJt05DC51E8DK7wiZzDaNi2DX1Iusfqg6zoaQsBWjOiRhFdofGEJWr6snKt477nH6fPpRbt8k1Dbm69T9vmkvPkmyyfFWz9r3RYEcJI8mNvNHMp7V4Qyvt0ywH_jHCykXRuzSsffYggHL9DyQhT69Mrp2aQiScfC5qzW2fYRdG-YBwxFfv41BPme-8TevZkZnY7ipWcZdo2RvwwmSPNVquj7OtRCuAiD7TYDok_V1N7Mr2zj3cwSEwSmLGdr5wriI1FI636lnKJ0euAXYRS7iI5onTgoSOBegfgJDpGitDfSpqNnQ0Rgg', NULL, '2025-10-22 13:37:52');

-- --------------------------------------------------------

--
-- Table structure for table `support_messages`
--

CREATE TABLE `support_messages` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `guest_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','in_progress','resolved','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `priority` enum('low','normal','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `responded_at` timestamp NULL DEFAULT NULL,
  `responded_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_messages`
--

INSERT INTO `support_messages` (`id`, `user_id`, `guest_name`, `guest_email`, `guest_phone`, `subject`, `message`, `status`, `priority`, `admin_response`, `responded_at`, `responded_by`, `created_at`, `updated_at`) VALUES
(1, 7, NULL, NULL, NULL, 'aaa', 'chào', 'resolved', 'normal', 'chào\n', '2025-10-26 10:52:24', 1, '2025-10-26 08:20:38', '2025-10-26 10:52:24'),
(18, 7, NULL, NULL, NULL, 'hi', 'blabla\n', 'resolved', 'normal', 'chào', '2025-10-27 15:27:52', 7, '2025-10-26 10:51:34', '2025-10-27 15:27:52'),
(19, 7, NULL, NULL, NULL, 'hihi', 'hui', 'resolved', 'normal', 'chào\n', '2025-10-28 06:17:12', 7, '2025-10-27 15:31:08', '2025-10-28 06:17:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `role` enum('admin','customer','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `phone`, `address`, `role`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'admin@antiquestore.com', '$2a$10$NixWeQ3wZok33MqvcUiV1OBClKJa0Hlz54ZMcjhrC16wNNM/P0bza', 'Admin User', NULL, NULL, 'admin', NULL, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(3, 'test@example.com', '$2a$10$dCQVXrqm5xD1nRze5Y6.COL2FGf88fyFTajglgH8SvwheptQe4H1O', 'Test User', NULL, NULL, 'customer', NULL, '2025-10-04 03:08:36', '2025-10-04 03:08:36'),
(7, 'vminh3321@gmail.com', '$2a$10$8aMSg7IkU4XjJTaQM.yEPuSTRV.KJ/pjIDlyCXbCHBJKI36IvmScW', 'Vương Trương Hồ Minh', '0706166053', 'vminh3321@gmail.com', 'staff', NULL, '2025-10-05 05:37:50', '2025-10-28 06:24:25'),
(8, 'test@customer.com', '$2a$10$ARMyXEpFrxLhbR14y8qz.umnsMhV4AiCYrFNYcafvXE8JJvfyaAUm', 'Khách Hàng Test', '0987654321', '123 Test St, HCMC', 'customer', NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29'),
(11, 'kienthuckenh583@gmail.com', '$2a$10$qcEKA4kqldTfU3jyWRvp/ukPTrQexRt5tpUOGVHWUKX49XuBgheUK', 'Kien thuc Kenh', NULL, NULL, 'customer', 'https://lh3.googleusercontent.com/a/ACg8ocKdbGUPlqxCUVxmHxh9rlSqBIWZkM6YlYkOQyYLQG7_l0GHVg=s96-c', '2025-10-19 08:41:21', '2025-10-19 08:41:21'),
(12, 'vuongthm4994@ut.edu.vn', '$2a$10$8KhjICASEEdVL3VZUWHq4.HmxF3o1SIwFOziiZg.1.r/p2lj5fpgi', 'Vương Trương Hồ Minh', NULL, NULL, 'customer', 'https://lh3.googleusercontent.com/a/ACg8ocKeReaM8vpOmhNm9ngmfLDamUr5ulNLD-Pv2XkK8eCmz3Qytw=s96-c', '2025-10-19 10:48:34', '2025-10-19 10:48:34');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã voucher',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `discount_type` enum('percentage','fixed_amount') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `applicable_products` json DEFAULT NULL,
  `applicable_categories` json DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `usage_limit_per_user` int DEFAULT '1',
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `voucher_usage`
--

CREATE TABLE `voucher_usage` (
  `id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(35, 1, 2, '2025-10-27 14:20:37'),
(36, 1, 3, '2025-10-27 14:20:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD UNIQUE KEY `cart_items_user_id_product_id` (`user_id`,`product_id`),
  ADD KEY `idx_cart_user` (`user_id`),
  ADD KEY `idx_cart_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_categories_slug` (`slug`),
  ADD KEY `idx_categories_parent` (`parent_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD UNIQUE KEY `invoices_order_id` (`order_id`),
  ADD UNIQUE KEY `invoices_invoice_number` (`invoice_number`),
  ADD KEY `idx_invoices_order` (`order_id`),
  ADD KEY `idx_invoices_number` (`invoice_number`),
  ADD KEY `idx_invoices_payment_status` (`payment_status`),
  ADD KEY `idx_invoices_date` (`invoice_date`),
  ADD KEY `invoices_invoice_date` (`invoice_date`),
  ADD KEY `invoices_customer_email` (`customer_email`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_created` (`created_at`),
  ADD KEY `idx_orders_number` (`order_number`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_details_order` (`order_id`),
  ADD KEY `idx_order_details_product` (`product_id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otps_email` (`email`),
  ADD KEY `idx_otps_code` (`otp_code`),
  ADD KEY `idx_otps_expires` (`expires_at`),
  ADD KEY `idx_otps_type` (`type`),
  ADD KEY `otps_email` (`email`),
  ADD KEY `otps_otp_code` (`otp_code`),
  ADD KEY `otps_expires_at` (`expires_at`),
  ADD KEY `otps_type` (`type`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_payments_order` (`order_id`),
  ADD KEY `idx_payments_status` (`payment_status`),
  ADD KEY `idx_payments_method` (`payment_method`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_slug` (`slug`),
  ADD KEY `idx_products_price` (`price`),
  ADD KEY `idx_products_featured` (`is_featured`),
  ADD KEY `idx_products_active` (`is_active`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_order` (`user_id`,`product_id`,`order_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_reviews_product_id` (`product_id`),
  ADD KEY `idx_reviews_user_id` (`user_id`),
  ADD KEY `idx_reviews_rating` (`rating`),
  ADD KEY `idx_reviews_status` (`status`),
  ADD KEY `idx_reviews_created_at` (`created_at`);

--
-- Indexes for table `review_helpful`
--
ALTER TABLE `review_helpful`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_review` (`user_id`,`review_id`),
  ADD KEY `idx_review_helpful_review_id` (`review_id`);

--
-- Indexes for table `social_auths`
--
ALTER TABLE `social_auths`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_auths_provider_provider_id` (`provider`,`provider_id`),
  ADD UNIQUE KEY `provider_id` (`provider_id`),
  ADD UNIQUE KEY `social_auths_user_id_provider` (`user_id`,`provider`),
  ADD UNIQUE KEY `provider_id_2` (`provider_id`),
  ADD KEY `social_auths_user_id` (`user_id`);

--
-- Indexes for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_responded_by` (`responded_by`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_support_status_priority` (`status`,`priority` DESC,`created_at` DESC);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_vouchers_code` (`code`),
  ADD KEY `idx_vouchers_is_active` (`is_active`),
  ADD KEY `idx_vouchers_dates` (`start_date`,`end_date`);

--
-- Indexes for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_voucher_usage_voucher_id` (`voucher_id`),
  ADD KEY `idx_voucher_usage_user_id` (`user_id`),
  ADD KEY `idx_voucher_usage_order_id` (`order_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_wishlist_created` (`created_at` DESC);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_helpful`
--
ALTER TABLE `review_helpful`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_auths`
--
ALTER TABLE `social_auths`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `support_messages`
--
ALTER TABLE `support_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_109` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_110` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_77` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoices_ibfk_78` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_109` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_110` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `review_helpful`
--
ALTER TABLE `review_helpful`
  ADD CONSTRAINT `review_helpful_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_helpful_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `social_auths`
--
ALTER TABLE `social_auths`
  ADD CONSTRAINT `social_auths_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD CONSTRAINT `fk_support_responder` FOREIGN KEY (`responded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_support_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD CONSTRAINT `voucher_usage_ibfk_1` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voucher_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voucher_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
