-- =====================================================
-- DATABASE SCHEMA EXTENDED: Shop Đồ Cổ (Antique Store)
-- Module mở rộng: Warranty, Supplier, Warehouse, Invoice
-- DBMS: MySQL 8.0+
-- =====================================================

-- Drop tables if exists (for development)
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS warehouse_logs;
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS warranties;
DROP TABLE IF EXISTS suppliers;

-- =====================================================
-- TABLE: SUPPLIERS - Nhà cung cấp / Nhà sản xuất
-- =====================================================
CREATE TABLE suppliers
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL COMMENT 'Link to users table if supplier has login account',
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL COMMENT 'Người liên hệ',
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    tax_code VARCHAR(50) COMMENT 'Mã số thuế',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_suppliers_email (email),
    INDEX idx_suppliers_user (user_id),
    INDEX idx_suppliers_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: PRODUCT_SUPPLIERS - Quan hệ nhiều-nhiều
-- Một sản phẩm có thể được cung cấp bởi nhiều nhà cung cấp
-- =====================================================
CREATE TABLE product_suppliers
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supplier_id INT NOT NULL,
    supply_price DECIMAL(10, 2) NOT NULL COMMENT 'Giá nhập từ nhà cung cấp',
    is_primary BOOLEAN DEFAULT FALSE COMMENT 'Nhà cung cấp chính',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_supplier (product_id, supplier_id),
    INDEX idx_product_suppliers_product (product_id),
    INDEX idx_product_suppliers_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: WAREHOUSE_LOGS - Lịch sử nhập xuất kho
-- =====================================================
CREATE TABLE warehouse_logs
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supplier_id INT NULL COMMENT 'Chỉ có khi type = import',
    type ENUM('import', 'export', 'adjustment') NOT NULL COMMENT 'Loại: nhập/xuất/điều chỉnh',
    quantity INT NOT NULL COMMENT 'Số lượng thay đổi (dương = nhập, âm = xuất)',
    quantity_before INT NOT NULL COMMENT 'Tồn kho trước khi thay đổi',
    quantity_after INT NOT NULL COMMENT 'Tồn kho sau khi thay đổi',
    unit_price DECIMAL(10, 2) COMMENT 'Đơn giá nhập/xuất',
    total_amount DECIMAL(10, 2) COMMENT 'Tổng giá trị',
    reference_type ENUM('order', 'purchase', 'manual') COMMENT 'Tham chiếu: đơn hàng/mua hàng/thủ công',
    reference_id INT COMMENT 'ID tham chiếu (order_id nếu reference_type = order)',
    notes TEXT COMMENT 'Ghi chú',
    created_by INT NOT NULL COMMENT 'User thực hiện thao tác',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_warehouse_product (product_id),
    INDEX idx_warehouse_type (type),
    INDEX idx_warehouse_created (created_at),
    INDEX idx_warehouse_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: WARRANTIES - Bảo hành
-- =====================================================
CREATE TABLE warranties
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    warranty_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã bảo hành',
    warranty_date DATE NOT NULL COMMENT 'Ngày bắt đầu bảo hành',
    expiry_date DATE NOT NULL COMMENT 'Ngày hết hạn bảo hành',
    warranty_period INT NOT NULL COMMENT 'Thời gian bảo hành (tháng)',
    issue_description TEXT COMMENT 'Mô tả vấn đề khi khách hàng yêu cầu bảo hành',
    status ENUM('active', 'claimed', 'processing', 'completed', 'expired', 'cancelled') DEFAULT 'active',
    claimed_at TIMESTAMP NULL COMMENT 'Thời gian yêu cầu bảo hành',
    completed_at TIMESTAMP NULL COMMENT 'Thời gian hoàn thành bảo hành',
    admin_notes TEXT COMMENT 'Ghi chú của admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_warranty_order (order_id),
    INDEX idx_warranty_product (product_id),
    INDEX idx_warranty_code (warranty_code),
    INDEX idx_warranty_status (status),
    INDEX idx_warranty_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: INVOICES - Hóa đơn
-- =====================================================
CREATE TABLE invoices
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE COMMENT 'Số hóa đơn',
    invoice_date DATE NOT NULL,
    
    -- Thông tin khách hàng
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_address TEXT NOT NULL,
    customer_tax_code VARCHAR(50) COMMENT 'Mã số thuế (nếu là doanh nghiệp)',
    
    -- Thông tin tài chính
    subtotal DECIMAL(10, 2) NOT NULL COMMENT 'Tổng tiền hàng',
    tax DECIMAL(10, 2) DEFAULT 0 COMMENT 'Thuế VAT',
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Tổng cộng',
    
    -- Metadata
    payment_method VARCHAR(50),
    payment_status ENUM('unpaid', 'paid', 'partially_paid', 'refunded') DEFAULT 'unpaid',
    notes TEXT,
    pdf_url VARCHAR(500) COMMENT 'Link file PDF hóa đơn',
    sent_to_email BOOLEAN DEFAULT FALSE COMMENT 'Đã gửi email hay chưa',
    sent_at TIMESTAMP NULL,
    
    created_by INT NOT NULL COMMENT 'Admin tạo hóa đơn',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_invoice_order (order_id),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_invoice_date (invoice_date),
    INDEX idx_invoice_customer (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ALTER TABLE: USERS - Thêm role 'supplier'
-- =====================================================
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'customer', 'supplier') NOT NULL DEFAULT 'customer';

-- =====================================================
-- SEED DATA: Sample Suppliers
-- =====================================================
INSERT INTO suppliers (company_name, contact_person, email, phone, address, tax_code, description) VALUES
('Công ty Gỗ Minh Phương', 'Nguyễn Văn Minh', 'contact@gominphuong.vn', '0901234567', '123 Đường Láng, Hà Nội', '0123456789', 'Chuyên cung cấp đồ gỗ cổ chất lượng cao'),
('Xưởng Sứ Bát Tràng', 'Trần Thị Hoa', 'info@subattrang.com', '0912345678', '456 Bát Tràng, Gia Lâm, Hà Nội', '0987654321', 'Sản xuất và cung cấp đồ sứ thủ công'),
('Đồ Đồng Cổ Truyền', 'Lê Văn Tùng', 'sales@dodongco.vn', '0923456789', '789 Phố Đúc, Hà Nội', '0112233445', 'Chuyên về đồ đồng thủ công truyền thống'),
('Tranh Nghệ Thuật Việt', 'Phạm Thị Mai', 'art@trahnghethuat.vn', '0934567890', '321 Nguyễn Du, TP.HCM', '0556677889', 'Cung cấp tranh nghệ thuật cổ và hiện đại');

-- =====================================================
-- SEED DATA: Sample Product-Supplier Relations
-- =====================================================
INSERT INTO product_suppliers (product_id, supplier_id, supply_price, is_primary) VALUES
(1, 1, 20000000, TRUE),  -- Tủ thờ gỗ Hương từ Công ty Gỗ Minh Phương
(2, 2, 3000000, TRUE),   -- Bình hoa sứ từ Xưởng Sứ Bát Tràng
(3, 3, 7000000, TRUE),   -- Tượng Phật từ Đồ Đồng Cổ Truyền
(4, 4, 13000000, TRUE),  -- Tranh sơn dầu từ Tranh Nghệ Thuật Việt
(5, 1, 38000000, TRUE),  -- Bàn ghế salon từ Công ty Gỗ Minh Phương
(6, 1, 10000000, FALSE); -- Đèn chùm (supplier thứ 2)

-- =====================================================
-- END OF EXTENDED SCHEMA
-- =====================================================

