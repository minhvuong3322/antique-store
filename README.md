# 🏺 Shop Đồ Cổ - Antique Store

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Minhvuong3322/antique-store/pulls)

Một website thương mại điện tử hoàn chỉnh với thiết kế hoài cổ sang trọng, chuyên bán các sản phẩm đồ cổ độc đáo. Dự án sử dụng công nghệ hiện đại với React 18, Node.js, và PostgreSQL/MySQL, tích hợp đầy đủ các tính năng thương mại điện tử từ giỏ hàng, thanh toán, đến quản lý đơn hàng và admin dashboard.

##  Highlights

-  **Modern UI/UX**: Thiết kế vintage elegant với dark mode support
-  **Full Authentication**: JWT + Social Login (Google, Facebook)
-  **Payment Integration**: VNPay, MoMo, QR Code (VietQR), PayPal, Bank Transfer & COD
-  **Admin Dashboard**: Comprehensive analytics & management
-  **Multilingual**: Vietnamese & English support
-  **Responsive**: Mobile-first design
-  **Docker Ready**: Full containerization support
-  **Cloud Storage**: Cloudinary integration
-  **SEO Friendly**: Slugified URLs & meta optimization

##  Quick Start

### 🚀 Setup Tự Động (Khuyến nghị)

**Windows:**
```bash
# 1. Clone repository
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store

# 2. Chạy setup tự động
setup.bat
```

**Linux/Mac:**
```bash
# 1. Clone repository
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store

# 2. Chạy setup tự động
chmod +x setup.sh
./setup.sh
```

### 📋 Setup Thủ Công

```bash
# 1. Clone repository
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store

# 2. Install dependencies
npm install --legacy-peer-deps  # Frontend dependencies
cd backend && npm install       # Backend dependencies
cd ..

# 3. Setup database
cd backend
node scripts/setup-database.js  # Tự động tạo DB và schema
node scripts/seed-sample-data.js # Tạo dữ liệu mẫu

# 4. Configure environment
cp backend/env.example backend/.env
cp env.frontend.example .env.local
# Chỉnh sửa các file .env với thông tin của bạn

# 5. Run development servers
cd backend
npm run dev                    # Backend: http://localhost:5000

# Terminal mới
npm run dev                    # Frontend: http://localhost:5173

# 6. Login với admin account
# Email: admin@antiquestore.com
# Password: Admin123
```

>  **Tip**: Script setup tự động sẽ xử lý tất cả dependencies và tạo file cấu hình. Xem phần [Cài Đặt & Chạy Dự Án](#cài-đặt--chạy-dự-án) để biết hướng dẫn chi tiết hơn.

##  Table of Contents

- [Tính Năng](#tính-năng)
- [Tech Stack](#tech-stack)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy Dự Án](#cài-đặt--chạy-dự-án)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [Production Deployment](#-production-deployment)
- [Additional Configuration](#-additional-configuration)

## Tính Năng

###  Đã Hoàn Thành

#### Core Features
- **Frontend hoàn chỉnh** với React 18 + Vite + TailwindCSS
- **Backend API đầy đủ** với Node.js + Express + Sequelize
- **Database PostgreSQL/MySQL** với schema hoàn chỉnh và migrations
- **Responsive design** (Mobile-first, tablet, desktop)
- **Dark/Light mode** (Theme switching với persistence)
- **Đa ngôn ngữ** (Tiếng Việt & English với i18next)
- **Docker support** (Full containerization với docker-compose)
- **Comment tiếng Việt** (Toàn bộ codebase và documentation)

#### Authentication & Authorization
- **Xác thực người dùng** (Đăng ký, đăng nhập, JWT)
- **Social Login** (Google OAuth 2.0, Facebook Login)
- **OTP xác thực** (Email verification, reset password)
- **Role-based access control** (Admin, Customer)
- **Protected routes** (Frontend & Backend)

#### Product Management
- **CRUD sản phẩm** (Create, Read, Update, Delete)
- **Phân loại sản phẩm** (14 categories)
- **Upload hình ảnh** (Cloudinary integration)
- **SEO-friendly URLs** (Slugified product URLs)
- **Featured products** (Sản phẩm nổi bật)
- **Product reviews** (Đánh giá sản phẩm với verified purchase)
- **Wishlist** (Danh sách yêu thích với thêm/xóa sản phẩm)

#### Shopping & Orders
- **Giỏ hàng** (Add, update, remove items)
- **Checkout** (Multi-step checkout process)
- **Đơn hàng** (Order creation, tracking, status management)
- **Thanh toán** (VNPay, MoMo, QR Code/VietQR, PayPal, Bank Transfer, COD)
- **Order history** (Lịch sử đơn hàng chi tiết)

#### Admin Dashboard (Hoàn chỉnh)
- **Dashboard Overview** (Tổng quan hệ thống)
  - Thống kê tổng quan (Users, Products, Orders, Revenue)
  - Recent orders & Top products
  - Low stock alerts
- **Analytics** (Phân tích kinh doanh)
  - Revenue statistics (theo ngày, tuần, tháng, năm)
  - Top selling products
  - Orders by status
  - Warehouse statistics
- **Product Management** (Quản lý sản phẩm)
- **Order Management** (Quản lý đơn hàng)
- **User Management** (Quản lý người dùng)
- **Supplier Management** (Quản lý nhà cung cấp)
- **Warehouse Management** (Quản lý kho hàng)
- **Invoice Management** (Quản lý hóa đơn)
- **Warranty Management** (Quản lý bảo hành)
- **Support Management** (Quản lý tin nhắn hỗ trợ, phản hồi khách hàng)

#### Advanced Features
- **Hệ thống bảo hành** (Warranty tracking & claiming)
- **Tra cứu bảo hành công khai** (Public warranty lookup)
- **Hệ thống hóa đơn** (Invoice generation & email)
- **Quản lý kho** (Stock levels, low stock alerts)
- **Hỗ trợ khách hàng** (Support messages với chat widget)
- **Logging system** (Winston với daily rotate files)
- **Error tracking** (Sentry integration)

###  Đang Phát Triển
- **Email notifications** (Order confirmation, shipping updates)
- **PDF generation** (Invoices & warranty certificates)
- **Advanced search** (Filters, sorting, pagination)
- **Payment gateway integration** (Full VNPay, MoMo production setup)
- **Auto payment verification** (Webhook integration)

###  Roadmap Tương Lai
- **SEO optimization** (Meta tags, sitemap, structured data)
- **Real-time chat** (WebSocket live chat với admin)
- **Product comparison** (So sánh sản phẩm)
- **Mobile app** (React Native)
- **Multi-vendor** (Marketplace model)
- **API documentation** (Swagger/OpenAPI)

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS 3 + Custom CSS
- **UI Components**: HeadlessUI + Heroicons
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **i18n**: React-i18next (Multilingual support)
- **Icons**: Lucide React + Heroicons
- **Notifications**: React Hot Toast
- **Authentication**: JWT Decode
- **Social Login**: 
  - Google OAuth (@react-oauth/google)
  - Facebook Login (Facebook SDK)
- **HTTP Client**: Axios
- **Utilities**: clsx, tailwind-merge

### Backend
- **Runtime**: Node.js (>=16.x) + Express.js
- **Database**: PostgreSQL 13+ / MySQL 8.0+
- **ORM**: Sequelize v6
- **Authentication**: JWT + bcryptjs
- **OAuth Integration**:
  - Google Auth Library (OAuth 2.0)
  - Facebook Graph API
- **File Upload**: 
  - Multer (Local storage)
  - Cloudinary (Cloud storage)
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Logging**: Winston + Daily Rotate Files
- **Security**: Helmet + CORS
- **Error Tracking**: Sentry
- **Utilities**: Compression, Morgan, Slugify

### Database Schema
- **Users & Auth**: Users, SocialAuth, OTPs
- **Products**: Categories, Products, ProductSuppliers
- **Orders**: Orders, OrderDetails, Payments
- **Admin**: Suppliers, Invoices, Warranties, WarehouseLogs
- **Engagement**: Reviews, CartItems, Vouchers

### DevOps & Tools
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (Reverse proxy)
- **Environment**: dotenv
- **SSL/TLS**: Let's Encrypt support
- **Scripts**: PowerShell + Bash automation
- **Testing**: Jest + Supertest (configured)
- **API Documentation**: Swagger (planned)

## 📁 Cấu Trúc Dự Án

```
antique-store/
├── 📁 backend/                    # Backend API
│   ├── 📁 src/
│   │   ├── 📁 controllers/        # API Controllers
│   │   ├── 📁 models/            # Database Models
│   │   ├── 📁 routes/            # API Routes
│   │   ├── 📁 middlewares/      # Middleware functions
│   │   ├── 📁 config/           # Configuration files
│   │   ├── 📁 utils/            # Utility functions
│   │   └── 📁 database/         # Database schemas
│   ├── 📁 uploads/              # File uploads
│   ├── 📁 logs/                 # Application logs
│   ├── 📄 Dockerfile            # Docker configuration
│   ├── 📄 docker-compose.yml    # Docker services
│   └── 📄 package.json          # Backend dependencies
├── 📁 src/                       # Frontend React
│   ├── 📁 components/            # Reusable components
│   │   ├── 📁 layout/           # Layout components
│   │   └── 📁 products/         # Product components
│   ├── 📁 pages/                # Page components
│   ├── 📁 context/              # React Context
│   ├── 📁 services/             # API services
│   ├── 📁 utils/                # Utility functions
│   ├── 📁 locales/              # i18n translations
│   └── 📁 data/                 # Mock data
├── 📄 antique_store.sql         # Database export
└── 📄 README.md                # Tài liệu dự án
```

## Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- **Node.js**: >= 18.x
- **npm**: >= 8.x
- **Database**: PostgreSQL 13+ hoặc MySQL 8.0+
- **Docker**: (Tùy chọn)

### Cài Đặt Nhanh

#### 🚀 Cách 1: Setup Tự Động (Khuyến nghị)

**Windows:**
```bash
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store
setup.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store
chmod +x setup.sh
./setup.sh
```

#### 📋 Cách 2: Setup Thủ Công

```bash
# 1. Clone repository
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store

# 2. Cài đặt dependencies
npm install --legacy-peer-deps  # Frontend
cd backend && npm install        # Backend
cd ..

# 3. Setup database tự động
cd backend
node scripts/setup-database.js   # Tạo DB và schema
node scripts/seed-sample-data.js # Tạo dữ liệu mẫu

# 4. Cấu hình environment
cp backend/env.example backend/.env
cp env.frontend.example .env.local
# Chỉnh sửa các file .env với thông tin của bạn

# 5. Chạy dự án
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

#### 🔧 Troubleshooting

**Lỗi "Cannot find module 'dotenv'":**
```bash
cd backend
npm install
```

**Lỗi "Missing required parameter: client_id" (Google OAuth):**
```bash
# Tạo file .env.local
cp env.frontend.example .env.local
# Cập nhật VITE_GOOGLE_CLIENT_ID trong .env.local
```

**Database connection failed:**
```bash
# Kiểm tra MySQL/PostgreSQL đang chạy
# Cập nhật thông tin trong backend/.env
```

### Cài Đặt Với Docker

```bash
# Chạy toàn bộ hệ thống với Docker
docker-compose up -d

# Hoặc chỉ backend
cd backend
docker-compose up -d
```

## API Endpoints

### Authentication
```javascript
POST   /api/auth/register             // Đăng ký tài khoản
POST   /api/auth/login                // Đăng nhập
POST   /api/auth/logout               // Đăng xuất
POST   /api/auth/google               // Đăng nhập Google OAuth
POST   /api/auth/facebook             // Đăng nhập Facebook
GET    /api/auth/profile              // Lấy thông tin user
PUT    /api/auth/profile              // Cập nhật profile
PUT    /api/auth/change-password      // Đổi mật khẩu
POST   /api/auth/forgot-password      // Quên mật khẩu
POST   /api/auth/reset-password       // Reset mật khẩu
```

### Products & Categories
```javascript
GET    /api/products                  // Danh sách sản phẩm
GET    /api/products/:id              // Chi tiết sản phẩm
GET    /api/products/slug/:slug       // Sản phẩm theo slug
GET    /api/products/featured         // Sản phẩm nổi bật
POST   /api/products                  // Tạo sản phẩm (Admin)
PUT    /api/products/:id              // Cập nhật sản phẩm (Admin)
DELETE /api/products/:id              // Xóa sản phẩm (Admin)
POST   /api/products/:id/upload       // Upload hình ảnh (Cloudinary)

GET    /api/categories                // Danh sách danh mục
GET    /api/categories/:id            // Chi tiết danh mục
POST   /api/categories                // Tạo danh mục (Admin)
PUT    /api/categories/:id            // Cập nhật danh mục (Admin)
DELETE /api/categories/:id            // Xóa danh mục (Admin)
```

### Cart & Orders
```javascript
GET    /api/cart                      // Lấy giỏ hàng
POST   /api/cart                      // Thêm vào giỏ hàng
PUT    /api/cart/:itemId              // Cập nhật số lượng
DELETE /api/cart/:itemId              // Xóa khỏi giỏ hàng
DELETE /api/cart                      // Xóa toàn bộ giỏ hàng

POST   /api/orders                    // Tạo đơn hàng
GET    /api/orders                    // Lịch sử đơn hàng
GET    /api/orders/:id                // Chi tiết đơn hàng
PUT    /api/orders/:id/status         // Cập nhật trạng thái (Admin)
DELETE /api/orders/:id                // Hủy đơn hàng
```

### OTP & Verification
```javascript
POST   /api/otp/send                  // Gửi OTP
POST   /api/otp/verify                // Xác thực OTP
POST   /api/otp/resend                // Gửi lại OTP
```

### Warranties
```javascript
GET    /api/warranties                // Danh sách bảo hành (Admin)
GET    /api/warranties/:id            // Chi tiết bảo hành
GET    /api/warranties/code/:code     // Tra cứu bảo hành (Public)
GET    /api/warranties/my-warranties  // Bảo hành của user
POST   /api/warranties                // Tạo bảo hành (Admin)
PUT    /api/warranties/:id            // Cập nhật bảo hành (Admin)
PUT    /api/warranties/:id/claim      // Yêu cầu bảo hành
DELETE /api/warranties/:id            // Xóa bảo hành (Admin)
PUT    /api/warranties/update-expired // Cập nhật hết hạn (Cron)
```

### Invoices
```javascript
GET    /api/invoices                  // Danh sách hóa đơn (Admin)
GET    /api/invoices/:id              // Chi tiết hóa đơn
GET    /api/invoices/order/:orderId   // Hóa đơn theo order
GET    /api/invoices/my-invoices      // Hóa đơn của user
POST   /api/invoices                  // Tạo hóa đơn (Admin)
PUT    /api/invoices/:id              // Cập nhật hóa đơn (Admin)
DELETE /api/invoices/:id              // Xóa hóa đơn (Admin)
POST   /api/invoices/:id/send-email   // Gửi email hóa đơn (Admin)
GET    /api/invoices/pending          // Hóa đơn chưa thanh toán (Admin)
GET    /api/invoices/statistics       // Thống kê hóa đơn (Admin)
```

### Suppliers & Warehouse
```javascript
GET    /api/suppliers                 // Danh sách nhà cung cấp (Admin)
GET    /api/suppliers/:id             // Chi tiết nhà cung cấp
POST   /api/suppliers                 // Tạo nhà cung cấp (Admin)
PUT    /api/suppliers/:id             // Cập nhật nhà cung cấp (Admin)
DELETE /api/suppliers/:id             // Xóa nhà cung cấp (Admin)

GET    /api/warehouse                 // Danh sách kho hàng (Admin)
GET    /api/warehouse/low-stock       // Sản phẩm sắp hết (Admin)
GET    /api/warehouse/logs            // Lịch sử xuất nhập kho (Admin)
POST   /api/warehouse/stock-in        // Nhập kho (Admin)
POST   /api/warehouse/stock-out       // Xuất kho (Admin)
```

### Admin Dashboard & Analytics
```javascript
GET    /api/admin/dashboard/overview            // Tổng quan hệ thống
GET    /api/admin/dashboard/recent-activities   // Hoạt động gần đây
GET    /api/admin/dashboard/top-products        // Sản phẩm bán chạy
GET    /api/admin/analytics/comprehensive       // Thống kê toàn diện
GET    /api/admin/analytics/revenue             // Thống kê doanh thu
GET    /api/admin/analytics/orders-by-status    // Đơn hàng theo trạng thái
GET    /api/admin/users                         // Quản lý user
PUT    /api/admin/users/:id                     // Cập nhật user
DELETE /api/admin/users/:id                     // Xóa user
```

### Payments
```javascript
POST   /api/payments/process          // Xử lý thanh toán (COD, online)
POST   /api/payments/vnpay/create     // Tạo thanh toán VNPay
GET    /api/payments/vnpay/callback   // VNPay callback
POST   /api/payments/momo/create      // Tạo thanh toán MoMo
POST   /api/payments/momo/callback    // MoMo callback
POST   /api/payments/qrcode/create    // Tạo mã QR thanh toán (VietQR)
GET    /api/payments/order/:orderId   // Thông tin thanh toán theo order
GET    /api/payments/status/:identifier // Kiểm tra trạng thái thanh toán
GET    /api/payments/callback         // Callback từ payment gateway
POST   /api/payments/webhook          // Webhook từ payment gateway
GET    /api/payments/admin/stats      // Thống kê thanh toán (Admin)
```

### Wishlist
```javascript
GET    /api/wishlist                   // Lấy danh sách yêu thích (Auth)
GET    /api/wishlist/check/:productId  // Kiểm tra sản phẩm trong wishlist (Auth)
POST   /api/wishlist/:productId        // Thêm vào wishlist (Auth)
DELETE /api/wishlist/:productId        // Xóa khỏi wishlist (Auth)
DELETE /api/wishlist                   // Xóa toàn bộ wishlist (Auth)
```

### Support Messages
```javascript
POST   /api/support                    // Gửi tin nhắn hỗ trợ (Guest/Auth)
GET    /api/support/my-messages        // Lấy tin nhắn của user (Auth)
GET    /api/support/:id                // Chi tiết tin nhắn (Guest/Auth)
GET    /api/admin/support              // Tất cả tin nhắn hỗ trợ (Admin)
PUT    /api/admin/support/:id/respond  // Phản hồi tin nhắn (Admin)
PUT    /api/admin/support/:id/status   // Cập nhật trạng thái (Admin)
```

## Design System

### Color Palette
- **Vintage Gold**: #D4A574 - Màu vàng sang trọng
- **Bronze**: #CD7F32 - Màu đồng cổ điển  
- **Dark Wood**: #3E2723 - Màu gỗ tối
- **Cream**: #F5E6D3 - Màu kem nhẹ nhàng
- **Ivory**: #FFFFF0 - Màu ngà voi

### Typography
- **Headings**: Playfair Display - Font serif cổ điển
- **Body**: Cormorant Garamond - Font dễ đọc, thanh lịch
- **Accent**: Cinzel - Font trang trọng cho tiêu đề đặc biệt

## Database Schema

### Bảng Chính (Tables)

#### Authentication & Users
- **users** - Thông tin người dùng (Admin, Customer)
  - id, email, password (bcrypt), full_name, phone, address, avatar, role, is_active
- **social_auth** - Xác thực mạng xã hội
  - user_id, provider (google/facebook), provider_id, access_token, profile_data, expires_at
- **otps** - Mã OTP xác thực
  - email, otp_code, purpose (email_verification/password_reset), expires_at, is_used

#### Products & Categories
- **categories** - Danh mục sản phẩm
  - id, name, slug, description, image, parent_id, is_active
- **products** - Sản phẩm
  - id, name, slug, sku, description, price, discount_price, stock_quantity, images, category_id, rating, review_count, is_featured, is_active
- **suppliers** - Nhà cung cấp
  - id, name, email, phone, address, contact_person, is_active
- **product_suppliers** - Quan hệ sản phẩm - nhà cung cấp
  - product_id, supplier_id, supply_price, min_order_quantity

#### Orders & Payments
- **orders** - Đơn hàng
  - id, order_number, user_id, total_amount, shipping_fee, discount, tax, shipping_address, status, notes
- **order_details** - Chi tiết đơn hàng
  - id, order_id, product_id, quantity, unit_price, subtotal
- **payments** - Thanh toán
  - id, order_id, payment_method (COD/VNPay/Momo/PayPal/BankTransfer/QRCode), payment_status (pending/completed/failed/refunded), transaction_id, amount, paid_at
- **cart_items** - Giỏ hàng
  - id, user_id, product_id, quantity

#### Admin & Management
- **invoices** - Hóa đơn
  - id, order_id, invoice_number, invoice_date, customer_name, customer_email, customer_tax_code, subtotal, tax, shipping_fee, total_amount, payment_status, pdf_url, created_by
- **warranties** - Bảo hành
  - id, order_id, product_id, warranty_code, warranty_date, expiry_date, warranty_period, status (active/claimed/completed/expired), issue_description, claimed_at, completed_at
- **warehouse_logs** - Lịch sử xuất nhập kho
  - id, product_id, type (stock_in/stock_out), quantity, reference_type, reference_id, notes, performed_by

#### Engagement
- **reviews** - Đánh giá sản phẩm
  - id, product_id, user_id, order_id, rating, comment, images, is_verified_purchase, helpful_count, status, admin_reply
- **vouchers** - Mã giảm giá
  - id, code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to
- **wishlists** - Danh sách yêu thích
  - id, user_id, product_id, created_at
- **support_messages** - Tin nhắn hỗ trợ
  - id, user_id, guest_name, guest_email, guest_phone, subject, message, status (pending/in_progress/resolved/closed), priority (low/normal/high/urgent), admin_response, responded_at, responded_by

### Dữ Liệu Mẫu (Sample Data)
- **14 danh mục** sản phẩm (Đồ gốm sứ, Tranh cổ, Đồ nội thất, ...)
- **20+ sản phẩm** với hình ảnh và mô tả chi tiết
- **Admin account**: admin@antiquestore.com / admin123
- **Sample users** với email verification
- **Sample orders** với nhiều trạng thái khác nhau
- **Sample warranties** và invoices

## Development

### Scripts Available

#### Frontend Scripts
```bash
npm run dev          # Development server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run clean        # Clean cache và dist
npm run dev:clean    # Clean và chạy dev server
npm run build:clean  # Clean và build production
```

#### Backend Scripts
```bash
npm run dev          # Development server với nodemon
npm run start        # Production server
npm run test         # Run Jest tests với coverage
npm run check-migration  # Kiểm tra database migration
npm run logs:error   # Xem error logs (tail -f)
npm run logs:combined # Xem combined logs (tail -f)
```

#### Backend Helper Scripts (trong /backend/scripts)
```bash
node scripts/setup-database.js         # Setup database tự động (MỚI)
node scripts/seed-sample-data.js      # Seed dữ liệu mẫu
node scripts/create-admin.js          # Tạo admin account
node scripts/sync-database.js         # Sync database schema
node scripts/quick-seed.js            # Quick seed cho development
node scripts/fix-social-auth-column.js # Fix social auth columns

# SSL Certificate Generation
powershell scripts/generate-ssl-cert.ps1        # Windows
bash scripts/generate-ssl-cert.sh               # Linux/Mac
bash scripts/setup-letsencrypt.sh               # Let's Encrypt setup
```

#### Setup Scripts (trong root directory)
```bash
setup.bat                            # Windows setup tự động (MỚI)
./setup.sh                            # Linux/Mac setup tự động (MỚI)
```

### Environment Variables

#### Backend (.env trong /backend)
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=antique_store
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql              # hoặc 'postgres'

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=30d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=Antique Store <noreply@antiquestore.com>

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPay Payment
VNPAY_TMN_CODE=your-vnpay-tmn-code
VNPAY_HASH_SECRET=your-vnpay-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/api/payments/vnpay/callback

# MoMo Payment
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:5000/api/payments/momo/callback

# QR Code Payment (VietQR)
QR_BANK_ID=BIDV
QR_BANK_NAME=Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)
QR_ACCOUNT_NUMBER=your-bank-account-number
QR_ACCOUNT_NAME=your-bank-account-name
QR_TEMPLATE=compact2

# Sentry (Error Tracking)
SENTRY_DSN=your-sentry-dsn-url

# Logging
LOG_LEVEL=info
LOG_FILE=true
```

#### Frontend (.env.local trong root directory)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_BASE_URL=http://localhost:5000

# HTTPS Configuration (Development)
VITE_ENABLE_HTTPS=false
# Set to 'true' để enable HTTPS với SSL certificates

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Facebook OAuth
VITE_FACEBOOK_APP_ID=your-facebook-app-id

# App Configuration
VITE_APP_NAME=Antique Store
VITE_APP_URL=http://localhost:5173
```

### 🔒 HTTP vs HTTPS Configuration

**Development (Mặc định):**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Không cần SSL certificates

**Development với HTTPS:**
```bash
# 1. Tạo SSL certificates
cd backend/scripts
powershell ./generate-ssl-cert.ps1  # Windows
bash ./generate-ssl-cert.sh         # Linux/Mac

# 2. Cập nhật backend/.env
ENABLE_SSL=true

# 3. Cập nhật .env.local
VITE_ENABLE_HTTPS=true
VITE_API_URL=https://localhost:5000/api/v1

# 4. Restart servers
```

**Production:**
- Sử dụng Let's Encrypt hoặc valid SSL certificates
- Cấu hình domain và HTTPS trong production environment

##  Production Deployment

### Docker Deployment (Recommended)

```bash
# 1. Cấu hình production environment
cp backend/env.production.example backend/.env.production
# Chỉnh sửa file .env.production với thông tin production

# 2. Build và chạy với docker-compose
docker-compose -f backend/docker-compose.production.yml up -d

# 3. Kiểm tra logs
docker-compose -f backend/docker-compose.production.yml logs -f
```

### Manual Deployment

```bash
# 1. Build Frontend
npm run build
# Output: dist/ folder

# 2. Setup Backend
cd backend
npm install --production
cp env.production.example .env
# Chỉnh sửa .env với production credentials

# 3. Database migration
npm run check-migration

# 4. Chạy production server
npm run start
# hoặc với PM2
pm2 start src/server.js --name antique-store
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/antique-store/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Additional Configuration

### Setup Social Login

#### Google OAuth 2.0
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm Authorized redirect URIs:
   - `http://localhost:5173` (Development)
   - `https://yourdomain.com` (Production)
6. Copy Client ID và Client Secret vào `.env`

#### Facebook Login
1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo app mới
3. Thêm Facebook Login product
4. Cấu hình Valid OAuth Redirect URIs
5. Copy App ID và App Secret vào `.env`

### Setup Cloudinary
1. Đăng ký tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy Cloud Name, API Key, API Secret từ Dashboard
3. Thêm vào `.env` backend
4. Upload images sẽ tự động lưu trên Cloudinary

### Setup Sentry (Error Tracking)
1. Tạo project tại [Sentry.io](https://sentry.io/)
2. Copy DSN URL
3. Thêm `SENTRY_DSN` vào `.env` backend
4. Errors sẽ tự động được track và report

### Setup Email (Gmail)
1. Bật 2-factor authentication cho Gmail
2. Tạo App Password tại [Google Account Security](https://myaccount.google.com/security)
3. Sử dụng App Password trong `SMTP_PASS`

### Setup Payment Gateways

#### VNPay
1. Đăng ký merchant account tại [VNPay](https://vnpay.vn/)
2. Lấy TMN Code và Hash Secret
3. Cấu hình Return URL và IPN URL
4. Thêm vào `.env`:
   ```env
   VNPAY_TMN_CODE=your-vnpay-tmn-code
   VNPAY_HASH_SECRET=your-vnpay-hash-secret
   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   VNPAY_RETURN_URL=http://localhost:5000/api/payments/vnpay/callback
   ```

#### MoMo
1. Đăng ký merchant tại [MoMo Business](https://business.momo.vn/)
2. Lấy Partner Code, Access Key, Secret Key
3. Cấu hình webhook URL
4. Thêm vào `.env`:
   ```env
   MOMO_PARTNER_CODE=your-momo-partner-code
   MOMO_ACCESS_KEY=your-momo-access-key
   MOMO_SECRET_KEY=your-momo-secret-key
   MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
   MOMO_RETURN_URL=http://localhost:5000/api/payments/momo/callback
   ```

#### QR Code Payment (VietQR)
1. QR Code payment sử dụng VietQR Quick Link API
2. Cấu hình thông tin ngân hàng trong `.env`:
   ```env
   # QR Code Payment (VietQR)
   QR_BANK_ID=970415
   QR_ACCOUNT_NUMBER=your-bank-account-number
   QR_ACCOUNT_NAME=your-bank-account-name
   QR_TEMPLATE=compact2
   ```
3. QR Code sẽ tự động được tạo khi khách hàng chọn thanh toán QR
4. Hệ thống hỗ trợ polling để kiểm tra trạng thái thanh toán tự động

##  Features Showcase

### Customer Features
-  Browse & search antique products
-  Add to cart & wishlist
-  Multiple payment methods (COD, VNPay, MoMo, QR Code, PayPal, Bank Transfer)
-  QR Code payment with auto-detection
-  Real-time payment status checking
-  Order tracking
-  Product reviews & ratings
-  Social login (Google, Facebook)
-  Multilingual support (VI/EN)
-  Dark mode support
-  Responsive design
-  Public warranty lookup
-  Customer support chat widget
-  Support message tracking

### Admin Features
-  Comprehensive dashboard & analytics
-  Product management (CRUD)
-  Order management & tracking
-  User management
-  Supplier management
-  Warehouse & inventory tracking
-  Invoice generation & email
-  Warranty management
-  Support message management & responses
-  Revenue statistics & reports
-  Low stock alerts

## Team & Contribution

- **Full-stack Developer**: Minh Vuong
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express + Sequelize
- **Database**: PostgreSQL/MySQL
- **Design**: Vintage/Antique theme
- **Language**: Vietnamese comments & documentation
- **Architecture**: RESTful API, MVC pattern

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - Tự do sử dụng cho mục đích thương mại và học tập.




