-- =====================================================
-- DATABASE SCHEMA: Shop Đồ Cổ (Antique Store)
-- DBMS: PostgreSQL 13+
-- =====================================================

-- Create custom types
CREATE TYPE user_role AS ENUM
('admin', 'customer');
CREATE TYPE product_condition AS ENUM
('excellent', 'good', 'fair', 'poor');
CREATE TYPE order_status AS ENUM
('pending', 'confirmed', 'shipping', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM
('pending', 'completed', 'failed', 'refunded');

-- Drop tables if exists (for development)
DROP TABLE IF EXISTS payments
CASCADE;
DROP TABLE IF EXISTS order_details
CASCADE;
DROP TABLE IF EXISTS orders
CASCADE;
DROP TABLE IF EXISTS cart_items
CASCADE;
DROP TABLE IF EXISTS products
CASCADE;
DROP TABLE IF EXISTS categories
CASCADE;
DROP TABLE IF EXISTS users
CASCADE;

-- =====================================================
-- TABLE: USERS
-- =====================================================
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    avatar VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- TABLE: CATEGORIES
-- =====================================================
CREATE TABLE categories
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500),
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- =====================================================
-- TABLE: PRODUCTS
-- =====================================================
CREATE TABLE products
(
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    images JSONB,
    condition product_condition,
    origin VARCHAR(255),
    year_manufactured INT,
    material VARCHAR(255),
    dimensions VARCHAR(255),
    weight DECIMAL(8, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);

-- =====================================================
-- TABLE: CART_ITEMS
-- =====================================================
CREATE TABLE cart_items
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);

-- =====================================================
-- TABLE: ORDERS
-- =====================================================
CREATE TABLE orders
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    status order_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- =====================================================
-- TABLE: ORDER_DETAILS
-- =====================================================
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_product ON order_details(product_id);

-- =====================================================
-- TABLE: PAYMENTS
-- =====================================================
CREATE TABLE payments
(
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_method ON payments(payment_method);

-- =====================================================
-- TRIGGERS: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column
()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_categories_updated_at BEFORE
UPDATE ON categories
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON products
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_cart_items_updated_at BEFORE
UPDATE ON cart_items
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_orders_updated_at BEFORE
UPDATE ON orders
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_payments_updated_at BEFORE
UPDATE ON payments
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

-- =====================================================
-- SEED DATA: Sample Admin User
-- Password: admin123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users
    (email, password, full_name, role)
VALUES
    ('admin@antiquestore.com', '$2b$10$rqYvW8X0Jx5XpYqZJX5XpOqYvW8X0Jx5XpYqZJX5XpOqYvW8X0Jx5X', 'Admin User', 'admin');

-- =====================================================
-- SEED DATA: Sample Categories
-- =====================================================
INSERT INTO categories
    (name, slug, description)
VALUES
    ('Đồ gỗ cổ', 'do-go-co', 'Bàn ghế, tủ kệ, đồ thờ bằng gỗ quý'),
    ('Đồ sứ cổ', 'do-su-co', 'Bình, lọ, chén, đĩa sứ cổ'),
    ('Đồ đồng cổ', 'do-dong-co', 'Đồ thờ, tượng, đồ trang trí bằng đồng'),
    ('Tranh cổ', 'tranh-co', 'Tranh sơn dầu, tranh khắc gỗ, tranh lụa'),
    ('Đèn cổ', 'den-co', 'Đèn dầu, đèn chùm, đèn trang trí cổ'),
    ('Đồ trang sức', 'do-trang-suc', 'Nhẫn, vòng, dây chuyền cổ');

-- =====================================================
-- SEED DATA: Sample Products
-- =====================================================
INSERT INTO products
    (category_id, name, slug, description, price, sale_price, stock_quantity, sku, condition, origin, year_manufactured, material, is_featured)
VALUES
    (1, 'Tủ thờ gỗ Hương', 'tu-tho-go-huong', 'Tủ thờ gỗ hương 3 cấp, chạm trổ tinh xảo', 25000000, 22000000, 2, 'TGH001', 'excellent', 'Việt Nam', 1920, 'Gỗ hương', TRUE),
    (2, 'Bình hoa sứ Bát Tràng', 'binh-hoa-su-bat-trang', 'Bình hoa sứ men xanh, cao 35cm', 3500000, NULL, 5, 'BSB001', 'good', 'Việt Nam', 1950, 'Sứ', TRUE),
    (3, 'Tượng Phật bằng đồng', 'tuong-phat-bang-dong', 'Tượng Phật Thích Ca cao 40cm', 8000000, 7500000, 1, 'TPD001', 'excellent', 'Việt Nam', 1930, 'Đồng', FALSE),
    (4, 'Tranh sơn dầu phong cảnh', 'tranh-son-dau-phong-canh', 'Tranh sơn dầu cảnh làng quê Việt Nam', 15000000, NULL, 1, 'TSD001', 'good', 'Việt Nam', 1960, 'Sơn dầu trên canvas', TRUE),
    (1, 'Bàn ghế salon gỗ Trắc', 'ban-ghe-salon-go-trac', 'Bộ bàn ghế salon gỗ trắc 6 món', 45000000, 42000000, 1, 'BGT001', 'excellent', 'Việt Nam', 1940, 'Gỗ trắc', TRUE),
    (5, 'Đèn chùm pha lê cổ', 'den-chum-pha-le-co', 'Đèn chùm pha lê 8 nhánh, phong cách Pháp', 12000000, NULL, 1, 'DPL001', 'good', 'Pháp', 1945, 'Pha lê, đồng', FALSE);

-- =====================================================
-- END OF SCHEMA
-- =====================================================



