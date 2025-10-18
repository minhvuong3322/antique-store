-- =====================================================
-- CREATE NEW TABLES FOR EXTENDED FEATURES
-- Run this SQL script in MySQL Workbench or phpMyAdmin
-- =====================================================

USE antique_store;

-- Drop existing tables if any
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS warranties;
DROP TABLE IF EXISTS warehouse_logs;
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS suppliers;

-- =====================================================
-- TABLE: SUPPLIERS
-- =====================================================
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NULL,
    tax_code VARCHAR(50) NULL COMMENT 'Mã số thuế',
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_suppliers_email (email),
    INDEX idx_suppliers_user_id (user_id),
    INDEX idx_suppliers_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: PRODUCT_SUPPLIERS
-- =====================================================
CREATE TABLE product_suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supplier_id INT NOT NULL,
    supply_date DATE NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10, 2) NULL COMMENT 'Giá nhập',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_supply (product_id, supplier_id, supply_date),
    INDEX idx_product_suppliers_product (product_id),
    INDEX idx_product_suppliers_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: WAREHOUSE_LOGS
-- =====================================================
CREATE TABLE warehouse_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supplier_id INT NULL,
    type ENUM('import', 'export', 'adjustment') NOT NULL COMMENT 'Loại giao dịch',
    quantity INT NOT NULL COMMENT 'Số lượng thay đổi (dương: nhập, âm: xuất)',
    quantity_before INT NOT NULL COMMENT 'Số lượng trước giao dịch',
    quantity_after INT NOT NULL COMMENT 'Số lượng sau giao dịch',
    unit_price DECIMAL(10, 2) NULL COMMENT 'Đơn giá (cho import)',
    reference_type VARCHAR(50) NULL COMMENT 'Loại tham chiếu: order, manual, adjustment',
    reference_id INT NULL COMMENT 'ID của order hoặc tham chiếu khác',
    notes TEXT NULL,
    created_by INT NULL COMMENT 'User thực hiện giao dịch',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_warehouse_logs_product (product_id),
    INDEX idx_warehouse_logs_type (type),
    INDEX idx_warehouse_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: WARRANTIES
-- =====================================================
CREATE TABLE warranties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    warranty_code VARCHAR(100) NOT NULL UNIQUE COMMENT 'Mã bảo hành',
    warranty_date DATE NOT NULL COMMENT 'Ngày bắt đầu bảo hành',
    expiry_date DATE NOT NULL COMMENT 'Ngày hết hạn bảo hành',
    warranty_period INT NOT NULL DEFAULT 12 COMMENT 'Thời gian bảo hành (tháng)',
    issue_description TEXT NULL COMMENT 'Mô tả vấn đề',
    status ENUM('active', 'claimed', 'processing', 'completed', 'expired', 'cancelled') 
        DEFAULT 'active' COMMENT 'Trạng thái bảo hành',
    admin_notes TEXT NULL COMMENT 'Ghi chú của admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_warranties_order (order_id),
    INDEX idx_warranties_product (product_id),
    INDEX idx_warranties_code (warranty_code),
    INDEX idx_warranties_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: INVOICES
-- =====================================================
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE COMMENT 'Số hóa đơn',
    invoice_date DATE NOT NULL COMMENT 'Ngày xuất hóa đơn',
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    customer_address TEXT NULL,
    subtotal DECIMAL(10, 2) NOT NULL COMMENT 'Tổng tiền hàng',
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Tổng cộng',
    payment_method VARCHAR(50) NULL,
    payment_status ENUM('paid', 'unpaid', 'partially_paid', 'refunded') DEFAULT 'unpaid',
    notes TEXT NULL,
    pdf_url VARCHAR(500) NULL COMMENT 'Link đến file PDF',
    sent_to_email BOOLEAN DEFAULT FALSE,
    created_by INT NULL COMMENT 'Admin tạo hóa đơn',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_invoices_order (order_id),
    INDEX idx_invoices_number (invoice_number),
    INDEX idx_invoices_payment_status (payment_status),
    INDEX idx_invoices_date (invoice_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Update users table to support supplier role
-- =====================================================
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'customer', 'supplier') DEFAULT 'customer';

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Tables created successfully!' AS message;

SHOW TABLES;

SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'antique_store' 
  AND TABLE_NAME IN ('suppliers', 'product_suppliers', 'warehouse_logs', 'warranties', 'invoices');

