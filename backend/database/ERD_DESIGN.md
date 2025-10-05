# Thiết kế Cơ sở dữ liệu - Shop Đồ Cổ (Antique Store)

## Tổng quan hệ thống

Hệ thống TMĐT Shop Đồ Cổ bao gồm các module chính:
- **Quản lý người dùng** (Users & Authentication)
- **Quản lý sản phẩm** (Products & Categories)
- **Giỏ hàng** (Shopping Cart)
- **Đơn hàng** (Orders & Order Details)
- **Thanh toán** (Payments)
- **Phân quyền** (Roles: Admin, Customer)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password        │
│ full_name       │
│ phone           │
│ address         │
│ role            │
│ avatar          │
│ is_active       │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────┴────────────┐        ┌─────────────────┐
│    CART_ITEMS       │        │   CATEGORIES    │
├─────────────────────┤        ├─────────────────┤
│ id (PK)             │        │ id (PK)         │
│ user_id (FK)        │        │ name            │
│ product_id (FK)     │   ┌────│ slug            │
│ quantity            │   │    │ description     │
│ created_at          │   │    │ image           │
│ updated_at          │   │    │ parent_id (FK)  │
└──────┬──────────────┘   │    │ created_at      │
       │                  │    │ updated_at      │
       │                  │    └────────┬────────┘
       │                  │             │
       │ N:1              │ N:1         │ 1:N
       │                  │             │
┌──────┴──────────────────┴─────────────┴───┐
│            PRODUCTS                        │
├────────────────────────────────────────────┤
│ id (PK)                                    │
│ category_id (FK)                           │
│ name                                       │
│ slug                                       │
│ description                                │
│ price                                      │
│ sale_price                                 │
│ stock_quantity                             │
│ sku                                        │
│ images (JSON array)                        │
│ condition (excellent/good/fair/poor)       │
│ origin                                     │
│ year_manufactured                          │
│ material                                   │
│ dimensions                                 │
│ weight                                     │
│ is_featured                                │
│ is_active                                  │
│ view_count                                 │
│ created_at                                 │
│ updated_at                                 │
└────────────────┬───────────────────────────┘
                 │
                 │ 1:N
                 │
┌────────────────┴───────────┐
│      ORDER_DETAILS         │
├────────────────────────────┤
│ id (PK)                    │
│ order_id (FK)              │
│ product_id (FK)            │
│ quantity                   │
│ unit_price                 │
│ subtotal                   │
│ created_at                 │
└─────────┬──────────────────┘
          │
          │ N:1
          │
┌─────────┴──────────────┐         ┌─────────────────┐
│       ORDERS           │         │    PAYMENTS     │
├────────────────────────┤         ├─────────────────┤
│ id (PK)                │         │ id (PK)         │
│ user_id (FK)           │────────>│ order_id (FK)   │
│ order_number           │   1:1   │ amount          │
│ total_amount           │         │ payment_method  │
│ shipping_address       │         │ payment_status  │
│ shipping_fee           │         │ transaction_id  │
│ discount               │         │ paid_at         │
│ tax                    │         │ created_at      │
│ status                 │         │ updated_at      │
│ notes                  │         └─────────────────┘
│ created_at             │
│ updated_at             │
└────────────────────────┘
```

---

## Chi tiết các bảng

### 1. **USERS** - Bảng người dùng

| Trường       | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|--------------|----------------|------------------------------------------|----------------------|
| id           | INT/UUID       | ID người dùng                            | PK, AUTO_INCREMENT   |
| email        | VARCHAR(255)   | Email đăng nhập                          | UNIQUE, NOT NULL     |
| password     | VARCHAR(255)   | Mật khẩu đã hash (bcrypt)                | NOT NULL             |
| full_name    | VARCHAR(255)   | Họ và tên                                | NOT NULL             |
| phone        | VARCHAR(20)    | Số điện thoại                            | NULL                 |
| address      | TEXT           | Địa chỉ                                  | NULL                 |
| role         | ENUM           | Vai trò: 'admin', 'customer'             | DEFAULT 'customer'   |
| avatar       | VARCHAR(500)   | URL ảnh đại diện                         | NULL                 |
| is_active    | BOOLEAN        | Trạng thái kích hoạt                     | DEFAULT TRUE         |
| created_at   | TIMESTAMP      | Thời gian tạo                            | DEFAULT NOW()        |
| updated_at   | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

### 2. **CATEGORIES** - Bảng danh mục

| Trường       | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|--------------|----------------|------------------------------------------|----------------------|
| id           | INT            | ID danh mục                              | PK, AUTO_INCREMENT   |
| name         | VARCHAR(255)   | Tên danh mục                             | NOT NULL             |
| slug         | VARCHAR(255)   | URL slug                                 | UNIQUE, NOT NULL     |
| description  | TEXT           | Mô tả danh mục                           | NULL                 |
| image        | VARCHAR(500)   | Ảnh đại diện danh mục                    | NULL                 |
| parent_id    | INT            | ID danh mục cha (hỗ trợ danh mục con)    | FK, NULL             |
| created_at   | TIMESTAMP      | Thời gian tạo                            | DEFAULT NOW()        |
| updated_at   | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

### 3. **PRODUCTS** - Bảng sản phẩm

| Trường            | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|-------------------|----------------|------------------------------------------|----------------------|
| id                | INT/UUID       | ID sản phẩm                              | PK, AUTO_INCREMENT   |
| category_id       | INT            | ID danh mục                              | FK, NOT NULL         |
| name              | VARCHAR(255)   | Tên sản phẩm                             | NOT NULL             |
| slug              | VARCHAR(255)   | URL slug                                 | UNIQUE, NOT NULL     |
| description       | TEXT           | Mô tả chi tiết sản phẩm                  | NULL                 |
| price             | DECIMAL(10,2)  | Giá gốc                                  | NOT NULL             |
| sale_price        | DECIMAL(10,2)  | Giá khuyến mãi                           | NULL                 |
| stock_quantity    | INT            | Số lượng tồn kho                         | DEFAULT 0            |
| sku               | VARCHAR(100)   | Mã SKU sản phẩm                          | UNIQUE, NULL         |
| images            | JSON           | Mảng URL ảnh sản phẩm                    | NULL                 |
| condition         | ENUM           | Tình trạng: excellent/good/fair/poor     | NULL                 |
| origin            | VARCHAR(255)   | Xuất xứ                                  | NULL                 |
| year_manufactured | INT            | Năm sản xuất                             | NULL                 |
| material          | VARCHAR(255)   | Chất liệu                                | NULL                 |
| dimensions        | VARCHAR(255)   | Kích thước (DxRxC)                       | NULL                 |
| weight            | DECIMAL(8,2)   | Trọng lượng (kg)                         | NULL                 |
| is_featured       | BOOLEAN        | Sản phẩm nổi bật                         | DEFAULT FALSE        |
| is_active         | BOOLEAN        | Trạng thái hiển thị                      | DEFAULT TRUE         |
| view_count        | INT            | Số lượt xem                              | DEFAULT 0            |
| created_at        | TIMESTAMP      | Thời gian tạo                            | DEFAULT NOW()        |
| updated_at        | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

### 4. **CART_ITEMS** - Bảng giỏ hàng

| Trường       | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|--------------|----------------|------------------------------------------|----------------------|
| id           | INT            | ID giỏ hàng                              | PK, AUTO_INCREMENT   |
| user_id      | INT/UUID       | ID người dùng                            | FK, NOT NULL         |
| product_id   | INT/UUID       | ID sản phẩm                              | FK, NOT NULL         |
| quantity     | INT            | Số lượng                                 | NOT NULL, DEFAULT 1  |
| created_at   | TIMESTAMP      | Thời gian thêm vào giỏ                   | DEFAULT NOW()        |
| updated_at   | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

**Unique constraint**: (user_id, product_id) - Mỗi user chỉ có 1 item cho mỗi product

### 5. **ORDERS** - Bảng đơn hàng

| Trường           | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|------------------|----------------|------------------------------------------|----------------------|
| id               | INT/UUID       | ID đơn hàng                              | PK, AUTO_INCREMENT   |
| user_id          | INT/UUID       | ID người dùng                            | FK, NOT NULL         |
| order_number     | VARCHAR(50)    | Mã đơn hàng                              | UNIQUE, NOT NULL     |
| total_amount     | DECIMAL(10,2)  | Tổng tiền                                | NOT NULL             |
| shipping_address | TEXT           | Địa chỉ giao hàng                        | NOT NULL             |
| shipping_fee     | DECIMAL(10,2)  | Phí vận chuyển                           | DEFAULT 0            |
| discount         | DECIMAL(10,2)  | Giảm giá                                 | DEFAULT 0            |
| tax              | DECIMAL(10,2)  | Thuế                                     | DEFAULT 0            |
| status           | ENUM           | pending/confirmed/shipping/delivered/cancelled | DEFAULT 'pending' |
| notes            | TEXT           | Ghi chú đơn hàng                         | NULL                 |
| created_at       | TIMESTAMP      | Thời gian đặt hàng                       | DEFAULT NOW()        |
| updated_at       | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

### 6. **ORDER_DETAILS** - Bảng chi tiết đơn hàng

| Trường       | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|--------------|----------------|------------------------------------------|----------------------|
| id           | INT            | ID chi tiết đơn hàng                     | PK, AUTO_INCREMENT   |
| order_id     | INT/UUID       | ID đơn hàng                              | FK, NOT NULL         |
| product_id   | INT/UUID       | ID sản phẩm                              | FK, NOT NULL         |
| quantity     | INT            | Số lượng                                 | NOT NULL             |
| unit_price   | DECIMAL(10,2)  | Đơn giá tại thời điểm đặt                | NOT NULL             |
| subtotal     | DECIMAL(10,2)  | Thành tiền (quantity * unit_price)       | NOT NULL             |
| created_at   | TIMESTAMP      | Thời gian tạo                            | DEFAULT NOW()        |

### 7. **PAYMENTS** - Bảng thanh toán

| Trường         | Kiểu dữ liệu    | Mô tả                                    | Ràng buộc            |
|----------------|----------------|------------------------------------------|----------------------|
| id             | INT            | ID thanh toán                            | PK, AUTO_INCREMENT   |
| order_id       | INT/UUID       | ID đơn hàng                              | FK, UNIQUE, NOT NULL |
| amount         | DECIMAL(10,2)  | Số tiền thanh toán                       | NOT NULL             |
| payment_method | VARCHAR(50)    | COD/VNPay/Momo/PayPal/BankTransfer       | NOT NULL             |
| payment_status | ENUM           | pending/completed/failed/refunded        | DEFAULT 'pending'    |
| transaction_id | VARCHAR(255)   | Mã giao dịch từ cổng thanh toán          | NULL                 |
| paid_at        | TIMESTAMP      | Thời gian thanh toán thành công          | NULL                 |
| created_at     | TIMESTAMP      | Thời gian tạo                            | DEFAULT NOW()        |
| updated_at     | TIMESTAMP      | Thời gian cập nhật                       | DEFAULT NOW()        |

---

## Quan hệ giữa các bảng

1. **Users ↔ Cart_Items**: 1-N (Một user có nhiều cart items)
2. **Users ↔ Orders**: 1-N (Một user có nhiều đơn hàng)
3. **Categories ↔ Products**: 1-N (Một danh mục có nhiều sản phẩm)
4. **Categories ↔ Categories**: Self-referencing (Danh mục cha - con)
5. **Products ↔ Cart_Items**: 1-N (Một sản phẩm có thể nằm trong nhiều giỏ hàng)
6. **Products ↔ Order_Details**: 1-N (Một sản phẩm có thể trong nhiều đơn hàng)
7. **Orders ↔ Order_Details**: 1-N (Một đơn hàng có nhiều sản phẩm)
8. **Orders ↔ Payments**: 1-1 (Một đơn hàng có một thanh toán)

---

## Indexes để tối ưu hiệu suất

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Cart Items
CREATE UNIQUE INDEX idx_cart_user_product ON cart_items(user_id, product_id);

-- Order Details
CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_product ON order_details(product_id);

-- Payments
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
```

---

## Lưu ý thiết kế

1. **Bảo mật**: 
   - Password được hash bằng bcrypt (cost factor >= 10)
   - Sử dụng JWT cho authentication
   - Validate input để tránh SQL Injection

2. **Tính toàn vẹn dữ liệu**:
   - Foreign keys với ON DELETE CASCADE/SET NULL phù hợp
   - Constraints và validations
   - Transactions cho các thao tác quan trọng (đặt hàng, thanh toán)

3. **Khả năng mở rộng**:
   - Hỗ trợ soft delete (is_active, deleted_at)
   - JSON cho dữ liệu linh hoạt (images, metadata)
   - Prepared statements và ORM

4. **Hiệu suất**:
   - Indexes trên các trường thường query
   - Pagination cho danh sách lớn
   - Caching với Redis (optional)



