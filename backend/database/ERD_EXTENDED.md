# Thiết kế Cơ sở dữ liệu MỞ RỘNG - Shop Đồ Cổ (Antique Store)

## 🎯 Module mở rộng

Tài liệu này mô tả các bảng và quan hệ mới được thêm vào để hoàn thiện hệ thống:
- ✅ **Quản lý Bảo hành** (Warranties)
- ✅ **Quản lý Nhà cung cấp** (Suppliers)
- ✅ **Quản lý Kho** (Warehouse Management)
- ✅ **Xuất Hóa đơn** (Invoices)
- ✅ **Phân quyền Nhà sản xuất** (Supplier Role)

---

## 📊 Entity Relationship Diagram (ERD) - Extended

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ANTIQUE STORE - EXTENDED SCHEMA                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     USERS       │◄─────────────────────────────┐
├─────────────────┤                              │
│ id (PK)         │                              │ 1:1 (Optional)
│ email           │                              │
│ password        │                       ┌──────┴────────┐
│ full_name       │                       │   SUPPLIERS   │
│ phone           │                       ├───────────────┤
│ address         │                       │ id (PK)       │
│ role *NEW*      │◄──────┐               │ user_id (FK)  │◄────┐
│ ├─ admin        │       │               │ company_name  │     │
│ ├─ customer     │       │               │ contact_person│     │
│ └─ supplier NEW │       │               │ email         │     │
│ avatar          │       │               │ phone         │     │
│ is_active       │       │               │ address       │     │
│ created_at      │       │               │ tax_code      │     │
│ updated_at      │       │               │ description   │     │
└────────┬────────┘       │               │ is_active     │     │
         │                │               │ created_at    │     │
         │ 1:N            │               │ updated_at    │     │
         │                │               └────────┬──────┘     │
         │                │                        │            │
         │                │                        │ 1:N        │ N:1
         │                │                        │            │
┌────────┴────────┐       │               ┌────────┴────────────┴───────────┐
│     ORDERS      │       │               │    PRODUCT_SUPPLIERS (M:N)     │
├─────────────────┤       │               ├────────────────────────────────┤
│ id (PK)         │◄──────┼───────────────│ id (PK)                        │
│ user_id (FK)    │       │               │ product_id (FK)                │
│ order_number    │       │               │ supplier_id (FK)               │
│ total_amount    │       │               │ supply_price                   │
│ shipping_address│       │               │ is_primary                     │
│ shipping_fee    │       │               │ created_at                     │
│ discount        │       │               │ updated_at                     │
│ tax             │       │               └────────┬───────────────────────┘
│ status          │       │                        │
│ notes           │       │                        │ N:1
│ created_at      │       │                        │
│ updated_at      │       │               ┌────────┴────────┐
└────────┬────────┘       │               │    PRODUCTS     │
         │                │               ├─────────────────┤
         │ 1:1            │               │ id (PK)         │◄────┐
         │                │               │ category_id (FK)│     │
┌────────┴────────┐       │               │ name            │     │
│    INVOICES     │       │               │ slug            │     │
├─────────────────┤       │               │ description     │     │
│ id (PK)         │       │               │ price           │     │
│ order_id (FK)   │◄──────┘               │ sale_price      │     │
│ invoice_number  │                       │ stock_quantity  │     │
│ invoice_date    │                       │ sku             │     │
│ customer_name   │                       │ images          │     │
│ customer_email  │                       │ condition       │     │
│ customer_phone  │                       │ origin          │     │
│ customer_address│                       │ year_manuf      │     │
│ customer_tax_code│                      │ material        │     │
│ subtotal        │                       │ dimensions      │     │
│ tax             │                       │ weight          │     │
│ shipping_fee    │                       │ is_featured     │     │
│ discount        │                       │ is_active       │     │
│ total_amount    │                       │ view_count      │     │
│ payment_method  │                       │ created_at      │     │
│ payment_status  │                       │ updated_at      │     │
│ notes           │                       └────────┬────────┘     │
│ pdf_url         │                                │              │
│ sent_to_email   │                                │ 1:N          │ N:1
│ sent_at         │                                │              │
│ created_by (FK) │◄───────────────────────────────┤              │
│ created_at      │                                │              │
│ updated_at      │                       ┌────────┴──────────────┴───────┐
└─────────────────┘                       │      WAREHOUSE_LOGS           │
                                          ├───────────────────────────────┤
┌─────────────────┐                       │ id (PK)                       │
│   WARRANTIES    │                       │ product_id (FK)               │
├─────────────────┤                       │ supplier_id (FK) - Optional   │
│ id (PK)         │                       │ type (import/export/adjust)   │
│ order_id (FK)   │◄───────┐              │ quantity                      │
│ product_id (FK) │◄───────┼──────────────│ quantity_before               │
│ warranty_code   │        │              │ quantity_after                │
│ warranty_date   │        │              │ unit_price                    │
│ expiry_date     │        │              │ total_amount                  │
│ warranty_period │        │              │ reference_type                │
│ issue_description│       │              │ reference_id                  │
│ status          │        │              │ notes                         │
│ │- active       │        │              │ created_by (FK) ──────────────┘
│ │- claimed      │        │              │ created_at                    
│ │- processing   │        │              └───────────────────────────────┘
│ │- completed    │        │
│ │- expired      │        │
│ └─ cancelled    │        │
│ claimed_at      │        │
│ completed_at    │        │
│ admin_notes     │        │
│ created_at      │        │
│ updated_at      │        │
└─────────────────┘        │
                           │
            Relationships: │
            - 1:N Orders → Warranties
            - 1:N Products → Warranties
```

---

## 📋 Chi tiết các bảng mới

### 1. **SUPPLIERS** - Bảng Nhà cung cấp

| Trường         | Kiểu dữ liệu    | Mô tả                                      | Ràng buộc            |
|----------------|----------------|--------------------------------------------|--------------------- |
| id             | INT            | ID nhà cung cấp                            | PK, AUTO_INCREMENT   |
| user_id        | INT            | Link tới users (nếu supplier có tài khoản) | FK, NULL             |
| company_name   | VARCHAR(255)   | Tên công ty                                | NOT NULL             |
| contact_person | VARCHAR(255)   | Người liên hệ                              | NOT NULL             |
| email          | VARCHAR(255)   | Email                                      | UNIQUE, NOT NULL     |
| phone          | VARCHAR(20)    | Số điện thoại                              | NOT NULL             |
| address        | TEXT           | Địa chỉ                                    | NULL                 |
| tax_code       | VARCHAR(50)    | Mã số thuế                                 | NULL                 |
| description    | TEXT           | Mô tả                                      | NULL                 |
| is_active      | BOOLEAN        | Trạng thái hoạt động                       | DEFAULT TRUE         |
| created_at     | TIMESTAMP      | Thời gian tạo                              | DEFAULT NOW()        |
| updated_at     | TIMESTAMP      | Thời gian cập nhật                         | DEFAULT NOW()        |

**Business Logic:**
- Một supplier có thể có hoặc không có tài khoản đăng nhập (user_id NULL/NOT NULL)
- Nếu có user_id, user đó phải có role = 'supplier'
- Supplier có thể cung cấp nhiều sản phẩm (quan hệ N:N với products)

---

### 2. **PRODUCT_SUPPLIERS** - Bảng quan hệ Sản phẩm - Nhà cung cấp

| Trường        | Kiểu dữ liệu    | Mô tả                                      | Ràng buộc            |
|---------------|----------------|--------------------------------------------|--------------------- |
| id            | INT            | ID                                         | PK, AUTO_INCREMENT   |
| product_id    | INT            | ID sản phẩm                                | FK, NOT NULL         |
| supplier_id   | INT            | ID nhà cung cấp                            | FK, NOT NULL         |
| supply_price  | DECIMAL(10,2)  | Giá nhập từ nhà cung cấp                   | NOT NULL             |
| is_primary    | BOOLEAN        | Nhà cung cấp chính (primary supplier)      | DEFAULT FALSE        |
| created_at    | TIMESTAMP      | Thời gian tạo                              | DEFAULT NOW()        |
| updated_at    | TIMESTAMP      | Thời gian cập nhật                         | DEFAULT NOW()        |

**Business Logic:**
- Một sản phẩm có thể có nhiều nhà cung cấp
- Một nhà cung cấp có thể cung cấp nhiều sản phẩm
- Mỗi sản phẩm nên có ít nhất 1 primary supplier (is_primary = TRUE)
- Giá nhập (supply_price) khác với giá bán (price trong products)

**Unique constraint**: (product_id, supplier_id)

---

### 3. **WAREHOUSE_LOGS** - Bảng Lịch sử Nhập Xuất Kho

| Trường          | Kiểu dữ liệu    | Mô tả                                      | Ràng buộc            |
|-----------------|----------------|--------------------------------------------|--------------------- |
| id              | INT            | ID log                                     | PK, AUTO_INCREMENT   |
| product_id      | INT            | ID sản phẩm                                | FK, NOT NULL         |
| supplier_id     | INT            | ID nhà cung cấp (chỉ khi type = import)    | FK, NULL             |
| type            | ENUM           | Loại: import/export/adjustment             | NOT NULL             |
| quantity        | INT            | Số lượng thay đổi (+/-)                    | NOT NULL             |
| quantity_before | INT            | Tồn kho trước thay đổi                     | NOT NULL             |
| quantity_after  | INT            | Tồn kho sau thay đổi                       | NOT NULL             |
| unit_price      | DECIMAL(10,2)  | Đơn giá nhập/xuất                          | NULL                 |
| total_amount    | DECIMAL(10,2)  | Tổng giá trị                               | NULL                 |
| reference_type  | ENUM           | order/purchase/manual                      | NULL                 |
| reference_id    | INT            | ID tham chiếu                              | NULL                 |
| notes           | TEXT           | Ghi chú                                    | NULL                 |
| created_by      | INT            | User thực hiện                             | FK, NOT NULL         |
| created_at      | TIMESTAMP      | Thời gian                                  | DEFAULT NOW()        |

**Business Logic:**
- **Import**: Nhập hàng từ supplier (quantity > 0)
- **Export**: Xuất hàng khi có đơn (quantity < 0, reference_type = 'order')
- **Adjustment**: Điều chỉnh tồn kho thủ công (kiểm kê, hỏng hóc...)
- Tự động cập nhật `stock_quantity` trong bảng `products`
- Giữ lịch sử đầy đủ để kiểm toán

---

### 4. **WARRANTIES** - Bảng Bảo hành

| Trường            | Kiểu dữ liệu    | Mô tả                                      | Ràng buộc            |
|-------------------|----------------|--------------------------------------------|--------------------- |
| id                | INT            | ID bảo hành                                | PK, AUTO_INCREMENT   |
| order_id          | INT            | ID đơn hàng                                | FK, NOT NULL         |
| product_id        | INT            | ID sản phẩm                                | FK, NOT NULL         |
| warranty_code     | VARCHAR(50)    | Mã bảo hành (unique)                       | UNIQUE, NOT NULL     |
| warranty_date     | DATE           | Ngày bắt đầu bảo hành                      | NOT NULL             |
| expiry_date       | DATE           | Ngày hết hạn                               | NOT NULL             |
| warranty_period   | INT            | Thời gian bảo hành (tháng)                 | NOT NULL             |
| issue_description | TEXT           | Mô tả vấn đề khi claim                     | NULL                 |
| status            | ENUM           | active/claimed/processing/completed/expired/cancelled | DEFAULT 'active' |
| claimed_at        | TIMESTAMP      | Thời gian yêu cầu bảo hành                 | NULL                 |
| completed_at      | TIMESTAMP      | Thời gian hoàn thành                       | NULL                 |
| admin_notes       | TEXT           | Ghi chú của admin                          | NULL                 |
| created_at        | TIMESTAMP      | Thời gian tạo                              | DEFAULT NOW()        |
| updated_at        | TIMESTAMP      | Thời gian cập nhật                         | DEFAULT NOW()        |

**Business Logic:**
- Tự động tạo khi đơn hàng chuyển sang status = 'delivered'
- Warranty_code format: `WR-{order_number}-{product_id}-{timestamp}`
- Trạng thái:
  - **active**: Đang trong thời hạn bảo hành, chưa sử dụng
  - **claimed**: Khách hàng đã yêu cầu bảo hành
  - **processing**: Admin đang xử lý
  - **completed**: Đã hoàn thành bảo hành
  - **expired**: Hết hạn
  - **cancelled**: Đã hủy

---

### 5. **INVOICES** - Bảng Hóa đơn

| Trường            | Kiểu dữ liệu    | Mô tả                                      | Ràng buộc            |
|-------------------|----------------|--------------------------------------------|--------------------- |
| id                | INT            | ID hóa đơn                                 | PK, AUTO_INCREMENT   |
| order_id          | INT            | ID đơn hàng                                | FK, UNIQUE, NOT NULL |
| invoice_number    | VARCHAR(50)    | Số hóa đơn                                 | UNIQUE, NOT NULL     |
| invoice_date      | DATE           | Ngày xuất hóa đơn                          | NOT NULL             |
| customer_name     | VARCHAR(255)   | Tên khách hàng                             | NOT NULL             |
| customer_email    | VARCHAR(255)   | Email khách hàng                           | NOT NULL             |
| customer_phone    | VARCHAR(20)    | Số điện thoại                              | NULL                 |
| customer_address  | TEXT           | Địa chỉ                                    | NOT NULL             |
| customer_tax_code | VARCHAR(50)    | Mã số thuế (nếu là doanh nghiệp)           | NULL                 |
| subtotal          | DECIMAL(10,2)  | Tổng tiền hàng                             | NOT NULL             |
| tax               | DECIMAL(10,2)  | Thuế VAT                                   | DEFAULT 0            |
| shipping_fee      | DECIMAL(10,2)  | Phí vận chuyển                             | DEFAULT 0            |
| discount          | DECIMAL(10,2)  | Giảm giá                                   | DEFAULT 0            |
| total_amount      | DECIMAL(10,2)  | Tổng cộng                                  | NOT NULL             |
| payment_method    | VARCHAR(50)    | Phương thức thanh toán                     | NULL                 |
| payment_status    | ENUM           | unpaid/paid/partially_paid/refunded        | DEFAULT 'unpaid'     |
| notes             | TEXT           | Ghi chú                                    | NULL                 |
| pdf_url           | VARCHAR(500)   | Link file PDF                              | NULL                 |
| sent_to_email     | BOOLEAN        | Đã gửi email                               | DEFAULT FALSE        |
| sent_at           | TIMESTAMP      | Thời gian gửi email                        | NULL                 |
| created_by        | INT            | Admin tạo hóa đơn                          | FK, NOT NULL         |
| created_at        | TIMESTAMP      | Thời gian tạo                              | DEFAULT NOW()        |
| updated_at        | TIMESTAMP      | Thời gian cập nhật                         | DEFAULT NOW()        |

**Business Logic:**
- Tạo hóa đơn sau khi đơn hàng được xác nhận (status = 'confirmed')
- Invoice_number format: `INV-{YYYY}{MM}{DD}-{sequence}` (VD: INV-20250118-001)
- Có thể gửi hóa đơn qua email (PDF attachment)
- Hỗ trợ xuất hóa đơn GTGT cho doanh nghiệp

---

## 🔗 Quan hệ mới

### Bảng USERS - Mở rộng Role
```sql
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'customer', 'supplier') NOT NULL DEFAULT 'customer';
```

**Chi tiết phân quyền:**

| Role     | Quyền hạn                                                                                      |
|----------|-----------------------------------------------------------------------------------------------|
| admin    | Full access: CRUD tất cả, xem thống kê, quản lý user, xuất hóa đơn, quản lý kho              |
| customer | Xem sản phẩm, mua hàng, xem đơn hàng của mình, yêu cầu bảo hành, xem lịch sử                 |
| supplier | Xem/cập nhật sản phẩm của mình, xem đơn nhập hàng, báo cáo tồn kho sản phẩm mình cung cấp    |

---

## 🔄 Luồng hoạt động (Workflows)

### 1️⃣ Luồng Nhập hàng từ Supplier
```
1. Admin/Supplier tạo phiếu nhập hàng
2. Chọn supplier_id, product_id, quantity, unit_price
3. Tạo record trong warehouse_logs (type = 'import')
4. Tự động cập nhật products.stock_quantity
5. Ghi nhận total_amount = quantity * unit_price
```

### 2️⃣ Luồng Xuất hàng (khi có đơn)
```
1. Khách hàng đặt hàng → Order created
2. Admin xác nhận đơn (status = 'confirmed')
3. Tự động tạo warehouse_logs (type = 'export', reference_type = 'order', reference_id = order.id)
4. Giảm products.stock_quantity
5. Tạo Warranty record (nếu sản phẩm có bảo hành)
6. Tạo Invoice
7. Gửi email hóa đơn
```

### 3️⃣ Luồng Bảo hành
```
1. Khách hàng nhận hàng → Warranty auto-created (status = 'active')
2. Khách gặp sự cố → Submit warranty claim
3. Status → 'claimed', điền issue_description
4. Admin xem request → Status → 'processing'
5. Admin xử lý xong → Status → 'completed'
6. Notification gửi cho khách hàng
```

### 4️⃣ Luồng Xuất hóa đơn
```
1. Đơn hàng confirmed → Admin tạo Invoice
2. Điền thông tin khách hàng (từ Order)
3. Tính toán: subtotal, tax, shipping_fee, discount, total_amount
4. Generate PDF (sử dụng thư viện như pdfmake, puppeteer)
5. Lưu pdf_url
6. Gửi email cho khách hàng (sent_to_email = TRUE)
```

---

## 📊 Indexes để tối ưu hiệu suất

```sql
-- SUPPLIERS
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_user ON suppliers(user_id);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

-- PRODUCT_SUPPLIERS
CREATE UNIQUE INDEX idx_product_supplier_unique ON product_suppliers(product_id, supplier_id);
CREATE INDEX idx_ps_product ON product_suppliers(product_id);
CREATE INDEX idx_ps_supplier ON product_suppliers(supplier_id);

-- WAREHOUSE_LOGS
CREATE INDEX idx_warehouse_product ON warehouse_logs(product_id);
CREATE INDEX idx_warehouse_type ON warehouse_logs(type);
CREATE INDEX idx_warehouse_created ON warehouse_logs(created_at);
CREATE INDEX idx_warehouse_supplier ON warehouse_logs(supplier_id);

-- WARRANTIES
CREATE INDEX idx_warranty_order ON warranties(order_id);
CREATE INDEX idx_warranty_product ON warranties(product_id);
CREATE INDEX idx_warranty_code ON warranties(warranty_code);
CREATE INDEX idx_warranty_status ON warranties(status);
CREATE INDEX idx_warranty_expiry ON warranties(expiry_date);

-- INVOICES
CREATE INDEX idx_invoice_order ON invoices(order_id);
CREATE INDEX idx_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoice_customer ON invoices(customer_email);
```

---

## 🛡️ Bảo mật và Validation

### 1. Authentication & Authorization
- JWT token cho tất cả API requests
- Role-based access control (RBAC)
- Middleware kiểm tra quyền trước khi xử lý

### 2. Input Validation
- Validate tất cả input từ client
- Sanitize để tránh SQL Injection, XSS
- Check business rules (VD: quantity > 0, expiry_date > warranty_date)

### 3. Data Integrity
- Foreign key constraints
- Unique constraints
- Transactions cho các thao tác quan trọng (đặt hàng, nhập/xuất kho)

### 4. Audit Trail
- Log tất cả thao tác quan trọng (created_by, created_at, updated_at)
- Warehouse_logs giữ lịch sử đầy đủ

---

## 📈 Mở rộng trong tương lai

Một số tính năng có thể bổ sung:

1. **Reviews & Ratings**: Bảng reviews để khách hàng đánh giá sản phẩm
2. **Notifications**: Bảng notifications cho thông báo realtime
3. **Vouchers/Coupons**: Bảng coupons cho mã giảm giá
4. **Wishlist**: Bảng wishlists (đã có context nhưng chưa có backend)
5. **Product Variants**: Bảng product_variants cho sản phẩm có nhiều biến thể
6. **Shipping Providers**: Bảng shipping_providers để tích hợp vận chuyển
7. **Return/Refund**: Bảng returns để xử lý trả hàng/hoàn tiền

---

## 🎓 Ghi chú cho báo cáo đồ án

### Điểm mạnh của thiết kế này:

✅ **Chuẩn hóa**: Đạt chuẩn 3NF, tránh dư thừa dữ liệu

✅ **Khả năng mở rộng**: Dễ dàng thêm tính năng mới

✅ **Hiệu suất**: Đánh index đầy đủ, query nhanh

✅ **Bảo mật**: Phân quyền rõ ràng, audit trail đầy đủ

✅ **Nghiệp vụ rõ ràng**: Mô phỏng đúng quy trình thực tế

✅ **Tính toàn vẹn**: Foreign keys, constraints, validations

### Công nghệ sử dụng:

- **Database**: MySQL 8.0+ (hoặc PostgreSQL 13+)
- **ORM**: Sequelize v6
- **Backend**: Node.js 16+ + Express 4
- **Frontend**: React 18 + TailwindCSS
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **PDF**: puppeteer / pdfmake (sẽ implement)

---

**Tác giả**: Antique Store Development Team  
**Ngày cập nhật**: 2025-01-18  
**Phiên bản**: 2.0 (Extended)

