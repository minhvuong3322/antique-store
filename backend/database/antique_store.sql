-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 19, 2025 at 08:33 AM
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
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Tổng tiền hàng',
  `shipping_fee` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00' COMMENT 'Thuế VAT',
  `discount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL COMMENT 'Tổng cộng',
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

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_fee` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00',
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
(3, 8, 'ORD17608445094732', '22000000.01', '123 Test St, HCMC', '50000.00', '0.00', '2200000.00', 'pending', NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 1, '22000000.00', '22000000.00', '2025-10-19 03:28:29'),
(2, 2, 2, 1, '3500000.00', '3500000.00', '2025-10-19 03:28:29'),
(3, 3, 1, 1, '22000000.00', '22000000.00', '2025-10-19 03:28:29');

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
  `amount` decimal(10,2) NOT NULL,
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
(3, 3, '22000000.01', 'COD', 'pending', NULL, NULL, '2025-10-19 03:28:29', '2025-10-19 03:28:29');

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
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
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
(2, 2, 'Bình hoa sứ Bát Tràng', 'binh-hoa-su-bat-trang', 'Bình hoa sứ men xanh, cao 35cm', '3500000.00', NULL, 5, 'BSB001', '[\"https://quatangbansac.vn/wp-content/uploads/2023/03/6.jpg\"]', 'good', 'Việt Nam', 1950, 'Sứ', NULL, NULL, 1, 1, 105, '2025-10-03 03:01:23', '2025-10-03 18:21:47'),
(3, 3, 'Tượng Phật bằng đồng', 'tuong-phat-bang-dong', 'Tượng Phật Thích Ca cao 40cm', '8000000.00', '7500000.00', 1, 'TPD001', '[\"https://tse1.mm.bing.net/th/id/OIP.jHJaCauxkmGTn6qLJBiBSgHaJ4?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1930, 'Đồng', NULL, NULL, 1, 1, 16, '2025-10-03 03:01:23', '2025-10-03 14:28:23'),
(4, 4, 'Tranh sơn dầu phong cảnh', 'tranh-son-dau-phong-canh', 'Tranh sơn dầu cảnh làng quê Việt Nam', '15000000.00', NULL, 1, 'TSD001', '[\"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400\"]', 'good', 'Việt Nam', 1960, 'Sơn dầu trên canvas', NULL, NULL, 1, 1, 2, '2025-10-03 03:01:23', '2025-10-03 04:45:17'),
(5, 1, 'Bàn ghế salon gỗ Trắc', 'ban-ghe-salon-go-trac', 'Bộ bàn ghế salon gỗ trắc 6 món', '45000000.00', '42000000.00', 1, 'BGT001', '[\"https://tse3.mm.bing.net/th/id/OIP._IZDGt-nyYdfhYO9yjKYaQHaFi?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1940, 'Gỗ trắc', NULL, NULL, 1, 1, 30, '2025-10-03 03:01:23', '2025-10-03 16:46:52'),
(6, 5, 'Đèn chùm pha lê cổ', 'den-chum-pha-le-co', 'Đèn chùm pha lê 8 nhánh, phong cách Pháp', '12000000.00', NULL, 1, 'DPL001', '[\"https://noithatdepgiare.vn/upload/images/29den-chum-pha-le-nen-kieu-dang-nghe-thuat-chau-au-029-423-0.jpg\"]', 'good', 'Pháp', 1945, 'Pha lê, đồng', NULL, NULL, 1, 1, 12, '2025-10-03 03:01:23', '2025-10-03 15:10:24'),
(7, 2, 'Đĩa Gốm Chu Đậu', 'dia-com-chu-dau', 'Đĩa cảnh gốm chu đậu', '2000000.00', '1500000.00', 1, 'DPL002', '[\"https://bizweb.dktcdn.net/100/376/052/products/dia-canh-khue-van-cac.jpg?v=1662442548893\"]', 'good', 'Việt Nam', 1400, 'Đất sét', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:24:48'),
(8, 4, 'Tranh Thờ Hàng Trống', 'tranh-tho-hang-trong', 'Những bản tranh in gỗ cổ, màu sắc tự nhiên, thể hiện tín ngưỡng dân gian.', '14000000.00', '12500000.00', 3, 'DPL003', '[\"https://thethaovanhoa.mediacdn.vn/Upload/3uPkfvAxvuOpUQrmKeiDaA/files/2022/01/C/tet6/Duchoa_Fotor.jpg\"]', 'good', 'Việt Nam', 1945, '', NULL, NULL, NULL, 1, 34, '2025-10-03 03:01:23', '2025-10-03 15:39:58'),
(9, 2, 'Gốm Men Ngọc Celadon (Thời Lý - Trần)', 'gom-men-ngoc-celadon', 'Nổi bật với màu men xanh ngọc bích bóng bẩy, là niềm tự hào của gốm sứ Việt Nam.', '25000000.00', '20000000.00', 3, 'DPL004', '[\"https://gomsubaokhanh.vn/media/news/1409_GmmentrngthiL.jpg\"]', 'excellent', 'Việt Nam', 1100, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:25:11'),
(10, 3, 'Trống Đồng Đông Sơn', 'trong-dong-dong-son', 'Là biểu tượng của văn hóa Việt Nam, cực kỳ quý hiếm và có giá trị lịch sử to lớn. Những chiếc trống nguyên bản gần như là vô giá và thuộc sở hữu quốc gia. Các phiên bản nhỏ hoặc mảnh vỡ cũng có giá trị sưu tầm cao.', '99000000.00', '85000000.00', 3, 'DPL005', '[\"https://dongtruyenthong.vn/upload/images/Tin-tuc/Trong-dong-dong-son/trong-dong-dong-son%20(4).jpg\"]', 'excellent', 'Việt Nam', 800, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:27:16'),
(11, 3, 'Ấm bạc chạm khắc cung đình huế', 'am-bac-cham-khac', 'Đồ dùng của vua chúa, quý tộc, thể hiện sự xa hoa và quyền quý.', '85000000.00', '75000000.00', 1, 'DPL006', '[\"https://tse3.mm.bing.net/th/id/OIP.g7rnYc7UK8F_LVGGypAW2gHaI8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1800, '', NULL, NULL, NULL, 1, 34, '2025-10-03 03:01:23', '2025-10-03 16:46:54'),
(12, 3, 'Đèn dầu bằng đồng', 'den-dau-bang-dong', 'Mang phong cách châu Âu cổ điển, vừa có giá trị sử dụng vừa có giá trị trang trí cao.', '7500000.00', '5000000.00', 6, 'DPL008', '[\"https://product.hstatic.net/200000283705/product/2_c386f94cb8a04120a5c5fd4615889aae_master.jpg\"]', 'good', 'Pháp', 1800, '', NULL, NULL, NULL, 1, 32, '2025-10-03 03:01:23', '2025-10-03 15:33:20'),
(15, 9, 'Bình Hoa Gốm Sứ Thanh Hoa', 'binh-hoa-gom-su-thanh-hoa', 'Bình hoa gốm sứ quý hiếm từ thời Thanh Hoa, được trang trí hoa văn rồng phượng tinh xảo.', '45000000.00', NULL, 1, NULL, '[\"https://th.bing.com/th/id/R.4073c43c2d40148e75ace0b5c002f320?rik=z8tr57riJi4rNQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-qDYFY4aBoYU%2fU2UBqPjn4yI%2fAAAAAAAAAO0%2fQDhfveO6jvg%2fs1600%2fcvth201307305f89e131-1892-4dac-89c9-6cc75cc64fb1.JPG&ehk=ztOGEmUWBnkbfu4GEC0cIMaFItpU0ToMFGahuP0QooQ%3d&risl=&pid=ImgRaw&r=0\"]', 'excellent', 'Trung Quốc', 1850, 'Gốm sứ', '35cm x 20cm', '2.50', 1, 1, 18, '2025-10-03 18:08:52', '2025-10-18 12:48:23'),
(16, 11, 'Đồng Hồ Quả Lắc Pháp Cổ', 'dong-ho-qua-lac-phap-co', 'Đồng hồ quả lắc cơ học Pháp từ thập niên 1920, vỏ gỗ sồi nguyên bản.', '28000000.00', NULL, 1, NULL, '[\"https://tse2.mm.bing.net/th/id/OIP.ET24O2RnzG64XNb9sjhANQHaNK?cb=12&w=576&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'good', 'Pháp', 1920, 'Gỗ sồi, Đồng', '80cm x 35cm x 18cm', '15.00', 1, 1, 10, '2025-10-03 18:08:52', '2025-10-05 04:57:14'),
(17, 10, 'Tủ Thuốc Gỗ Xưa', 'tu-thuoc-go-xua', 'Tủ thuốc cổ bằng gỗ lim với 48 ngăn kéo nhỏ, từng được sử dụng trong nhà thuốc Đông y.', '65000000.00', NULL, 1, NULL, '[\"https://dogotruongnhung.com/wp-content/uploads/2022/08/IMG_6281-1536x1536.jpg\"]', 'good', 'Việt Nam', 1900, 'Gỗ lim', '120cm x 90cm x 40cm', '80.00', 1, 1, 2, '2025-10-03 18:08:52', '2025-10-04 05:57:21'),
(18, 12, 'Đèn Dầu Đồng Thời Pháp', 'den-dau-dong-thoi-phap', 'Đèn dầu bằng đồng từ thời Pháp thuộc, thiết kế tinh xảo với hoa văn chạm khắc thủ công.', '12000000.00', NULL, 2, NULL, '[\"https://tse3.mm.bing.net/th/id/OIP.yEciLQRLfW7NkarjCyL5nwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'good', 'Pháp - Đông Dương', 1920, 'Đồng', '45cm x 15cm', '3.00', 0, 1, 0, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(19, 10, 'Bàn Trà Gỗ Hương', 'ban-tra-go-huong', 'Bàn trà gỗ hương nguyên khối với họa tiết rồng chạm nổi tinh xảo.', '38000000.00', NULL, 1, NULL, '[\"https://tse2.mm.bing.net/th/id/OIP.JsuIdqufpwn3KfMoarPVfAHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3\"]', 'excellent', 'Việt Nam', 1960, 'Gỗ hương', '45cm x 80cm x 50cm', '25.00', 1, 1, 0, '2025-10-03 18:08:52', '2025-10-03 18:08:52'),
(20, 13, 'Ấm Trà Bạc Hoàng Gia', 'am-tra-bac-hoang-gia', 'Ấm trà bạc nguyên chất với dấu ấn hoàng gia Anh, thiết kế Victorian cổ điển.', '22000000.00', NULL, 1, NULL, '[\"https://hungmoctra.vn/wp-content/uploads/2024/04/bo-an-tra-bac-999.jpg\"]', 'good', 'Anh', 1900, 'Bạc 925', '18cm x 15cm', '0.85', 0, 1, 8, '2025-10-03 18:08:52', '2025-10-04 02:33:11');

-- --------------------------------------------------------

--
-- Table structure for table `product_suppliers`
--

CREATE TABLE `product_suppliers` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `supply_price` decimal(10,2) NOT NULL COMMENT 'Giá nhập từ nhà cung cấp',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT 'Nhà cung cấp chính',
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tax_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã số thuế',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `role` enum('admin','customer','supplier') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `phone`, `address`, `role`, `avatar`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin@antiquestore.com', '$2a$10$NixWeQ3wZok33MqvcUiV1OBClKJa0Hlz54ZMcjhrC16wNNM/P0bza', 'Admin User', NULL, NULL, 'admin', NULL, 1, '2025-10-03 03:01:23', '2025-10-03 03:01:23'),
(3, 'test@example.com', '$2a$10$dCQVXrqm5xD1nRze5Y6.COL2FGf88fyFTajglgH8SvwheptQe4H1O', 'Test User', NULL, NULL, 'customer', NULL, 1, '2025-10-04 03:08:36', '2025-10-04 03:08:36'),
(7, 'vminh3321@gmail.com', '$2a$10$8aMSg7IkU4XjJTaQM.yEPuSTRV.KJ/pjIDlyCXbCHBJKI36IvmScW', 'Vương Trương Hồ Minh', '0706166053', 'vminh3321@gmail.com', 'customer', NULL, 1, '2025-10-05 05:37:50', '2025-10-05 05:37:50'),
(8, 'test@customer.com', '$2a$10$ARMyXEpFrxLhbR14y8qz.umnsMhV4AiCYrFNYcafvXE8JJvfyaAUm', 'Khách Hàng Test', '0987654321', '123 Test St, HCMC', 'customer', NULL, 1, '2025-10-19 03:28:29', '2025-10-19 03:28:29');

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
-- Table structure for table `warehouse_logs`
--

CREATE TABLE `warehouse_logs` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `supplier_id` int DEFAULT NULL,
  `type` enum('import','export','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại: nhập/xuất/điều chỉnh',
  `quantity` int NOT NULL COMMENT 'Số lượng thay đổi (dương = nhập, âm = xuất)',
  `quantity_before` int NOT NULL COMMENT 'Tồn kho trước khi thay đổi',
  `quantity_after` int NOT NULL COMMENT 'Tồn kho sau khi thay đổi',
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT 'Đơn giá nhập/xuất',
  `reference_type` enum('order','purchase','manual') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tham chiếu: đơn hàng/mua hàng/thủ công',
  `reference_id` int DEFAULT NULL COMMENT 'ID tham chiếu (order_id nếu reference_type = order)',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú',
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL COMMENT 'Tổng giá trị'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warranties`
--

CREATE TABLE `warranties` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warranty_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã bảo hành',
  `warranty_date` date NOT NULL COMMENT 'Ngày bắt đầu bảo hành',
  `expiry_date` date NOT NULL COMMENT 'Ngày hết hạn bảo hành',
  `warranty_period` int NOT NULL COMMENT 'Thời gian bảo hành (tháng)',
  `issue_description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả vấn đề khi khách hàng yêu cầu bảo hành',
  `status` enum('active','claimed','processing','completed','expired','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `admin_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú của admin',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `claimed_at` datetime DEFAULT NULL COMMENT 'Thời gian yêu cầu bảo hành',
  `completed_at` datetime DEFAULT NULL COMMENT 'Thời gian hoàn thành bảo hành'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `product_suppliers`
--
ALTER TABLE `product_suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_supply` (`product_id`,`supplier_id`),
  ADD UNIQUE KEY `unique_product_supplier` (`product_id`,`supplier_id`),
  ADD KEY `idx_product_suppliers_product` (`product_id`),
  ADD KEY `idx_product_suppliers_supplier` (`supplier_id`),
  ADD KEY `product_suppliers_product_id` (`product_id`),
  ADD KEY `product_suppliers_supplier_id` (`supplier_id`);

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
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_suppliers_email` (`email`),
  ADD KEY `idx_suppliers_user_id` (`user_id`),
  ADD KEY `idx_suppliers_is_active` (`is_active`),
  ADD KEY `suppliers_email` (`email`),
  ADD KEY `suppliers_user_id` (`user_id`),
  ADD KEY `suppliers_is_active` (`is_active`);

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
-- Indexes for table `warehouse_logs`
--
ALTER TABLE `warehouse_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_warehouse_logs_product` (`product_id`),
  ADD KEY `idx_warehouse_logs_type` (`type`),
  ADD KEY `idx_warehouse_logs_created_at` (`created_at`),
  ADD KEY `warehouse_logs_product_id` (`product_id`),
  ADD KEY `warehouse_logs_type` (`type`),
  ADD KEY `warehouse_logs_created_at` (`created_at`),
  ADD KEY `warehouse_logs_supplier_id` (`supplier_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `warranties`
--
ALTER TABLE `warranties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `warranty_code` (`warranty_code`),
  ADD UNIQUE KEY `warranties_warranty_code` (`warranty_code`),
  ADD KEY `idx_warranties_order` (`order_id`),
  ADD KEY `idx_warranties_product` (`product_id`),
  ADD KEY `idx_warranties_code` (`warranty_code`),
  ADD KEY `idx_warranties_status` (`status`),
  ADD KEY `warranties_order_id` (`order_id`),
  ADD KEY `warranties_product_id` (`product_id`),
  ADD KEY `warranties_status` (`status`),
  ADD KEY `warranties_expiry_date` (`expiry_date`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `product_suppliers`
--
ALTER TABLE `product_suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
-- AUTO_INCREMENT for table `warehouse_logs`
--
ALTER TABLE `warehouse_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warranties`
--
ALTER TABLE `warranties`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `product_suppliers`
--
ALTER TABLE `product_suppliers`
  ADD CONSTRAINT `product_suppliers_ibfk_77` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_suppliers_ibfk_78` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD CONSTRAINT `voucher_usage_ibfk_1` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voucher_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voucher_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `warehouse_logs`
--
ALTER TABLE `warehouse_logs`
  ADD CONSTRAINT `warehouse_logs_ibfk_115` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `warehouse_logs_ibfk_116` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `warehouse_logs_ibfk_117` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `warranties`
--
ALTER TABLE `warranties`
  ADD CONSTRAINT `warranties_ibfk_77` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `warranties_ibfk_78` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
