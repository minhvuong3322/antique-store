# Antique Store Backend API

Backend API cho hệ thống TMĐT Shop Đồ Cổ (Antique Store) được xây dựng bằng Node.js, Express, và Sequelize.

##  Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

##  Tính năng

### Authentication & Authorization
-  Đăng ký tài khoản
-  Đăng nhập (JWT authentication)
-  Quản lý profile người dùng
-  Đổi mật khẩu
-  Phân quyền Admin/Customer

### Quản lý sản phẩm
-  CRUD sản phẩm (Admin)
-  Xem danh sách sản phẩm (Pagination, Search, Filter)
-  Xem chi tiết sản phẩm
-  Sản phẩm nổi bật

### Quản lý danh mục
-  CRUD danh mục (Admin)
-  Danh mục cha - con (nested categories)
-  Xem sản phẩm theo danh mục

### Giỏ hàng
-  Thêm sản phẩm vào giỏ
-  Cập nhật số lượng
-  Xóa sản phẩm khỏi giỏ
-  Xóa toàn bộ giỏ hàng

### Đơn hàng
-  Tạo đơn hàng từ giỏ hàng
-  Xem lịch sử đơn hàng
-  Chi tiết đơn hàng
-  Hủy đơn hàng
-  Cập nhật trạng thái (Admin)
-  Quản lý tồn kho tự động

### Thanh toán
-  COD (Cash on Delivery)
-  Mock VNPay integration
-  Mock Momo integration
-  Thống kê thanh toán (Admin)

##  Công nghệ sử dụng

- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL / PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **File Upload**: multer
- **Logging**: morgan
- **Environment**: dotenv

##  Cài đặt

### Yêu cầu hệ thống

- Node.js v16.0.0 trở lên
- npm v8.0.0 trở lên
- MySQL 8.0+ hoặc PostgreSQL 13+

### Bước 1: Clone repository

```bash
cd backend
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Tạo database

**MySQL:**
```sql
CREATE DATABASE antique_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**PostgreSQL:**
```sql
CREATE DATABASE antique_store;
```

### Bước 4: Import schema

**MySQL:**
```bash
mysql -u root -p antique_store < database/schema.sql
```

**PostgreSQL:**
```bash
psql -U postgres -d antique_store -f database/schema-postgresql.sql
```

##  Cấu hình

### Tạo file `.env`

Copy file `env.example` thành `.env`:

```bash
cp env.example .env
```

### Cấu hình `.env`

```env
# Server
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=antique_store
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Security
BCRYPT_ROUNDS=10
```

** Quan trọng:** Thay đổi `JWT_SECRET` trong môi trường production!

##  Chạy ứng dụng

### Development mode

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

### Production mode

```bash
npm start
```

### Test API

```bash
# Health check
curl http://localhost:5000/api/v1/health
```

## API Endpoints

### Base URL: `/api/v1`

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/auth/login` | Đăng nhập | ❌ |
| GET | `/auth/profile` | Xem thông tin profile | ✅ |
| PUT | `/auth/profile` | Cập nhật profile | ✅ |
| PUT | `/auth/change-password` | Đổi mật khẩu | ✅ |

### Products

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/products` | Danh sách sản phẩm | ❌ |
| GET | `/products/featured` | Sản phẩm nổi bật | ❌ |
| GET | `/products/:id` | Chi tiết sản phẩm | ❌ |
| POST | `/products` | Tạo sản phẩm | 👤 Admin |
| PUT | `/products/:id` | Cập nhật sản phẩm | 👤 Admin |
| DELETE | `/products/:id` | Xóa sản phẩm | 👤 Admin |

**Query Parameters (GET /products):**
- `page`: Trang (default: 1)
- `limit`: Số lượng/trang (default: 20)
- `search`: Tìm kiếm theo tên
- `category_id`: Lọc theo danh mục
- `condition`: excellent/good/fair/poor
- `min_price`, `max_price`: Khoảng giá
- `is_featured`: true/false
- `sort_by`: created_at, price, name
- `order`: ASC/DESC

### Categories

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Danh sách danh mục | ❌ |
| GET | `/categories/:id` | Chi tiết danh mục + sản phẩm | ❌ |
| POST | `/categories` | Tạo danh mục | 👤 Admin |
| PUT | `/categories/:id` | Cập nhật danh mục | 👤 Admin |
| DELETE | `/categories/:id` | Xóa danh mục | 👤 Admin |

### Cart

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/cart` | Xem giỏ hàng | ✅ |
| POST | `/cart` | Thêm vào giỏ | ✅ |
| PUT | `/cart/:id` | Cập nhật số lượng | ✅ |
| DELETE | `/cart/:id` | Xóa khỏi giỏ | ✅ |
| DELETE | `/cart` | Xóa toàn bộ giỏ | ✅ |

### Orders

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/orders` | Tạo đơn hàng | ✅ |
| GET | `/orders` | Lịch sử đơn hàng | ✅ |
| GET | `/orders/:id` | Chi tiết đơn hàng | ✅ |
| PUT | `/orders/:id/cancel` | Hủy đơn hàng | ✅ |
| GET | `/orders/admin/all` | Tất cả đơn hàng | 👤 Admin |
| PUT | `/orders/:id/status` | Cập nhật trạng thái | 👤 Admin |

### Payments

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/payments/process` | Xử lý thanh toán | ✅ |
| GET | `/payments/order/:orderId` | Thông tin thanh toán | ✅ |
| POST | `/payments/vnpay/create` | Tạo link VNPay | ✅ |
| POST | `/payments/momo/create` | Tạo link Momo | ✅ |
| GET | `/payments/callback` | Callback từ gateway | ❌ |
| GET | `/payments/admin/stats` | Thống kê | 👤 Admin |

## 🗄 Database Schema

Xem chi tiết thiết kế database tại:
- [ERD Design](database/ERD_DESIGN.md)
- [MySQL Schema](database/schema.sql)
- [PostgreSQL Schema](database/schema-postgresql.sql)

### Các bảng chính:

1. **users** - Người dùng (khách hàng, admin)
2. **categories** - Danh mục sản phẩm
3. **products** - Sản phẩm đồ cổ
4. **cart_items** - Giỏ hàng
5. **orders** - Đơn hàng
6. **order_details** - Chi tiết đơn hàng
7. **payments** - Thanh toán

##  Ví dụ API Requests

### 1. Đăng ký tài khoản

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "123456",
    "full_name": "Nguyễn Văn A",
    "phone": "0987654321",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  }'
```

### 2. Đăng nhập

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "123456"
  }'
```

### 3. Lấy danh sách sản phẩm

```bash
curl http://localhost:5000/api/v1/products?page=1&limit=10
```

### 4. Thêm vào giỏ hàng

```bash
curl -X POST http://localhost:5000/api/v1/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 5. Tạo đơn hàng

```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shipping_address": "123 Đường ABC, Quận 1, TP.HCM",
    "payment_method": "COD",
    "notes": "Giao hàng giờ hành chính"
  }'
```

##  Deployment

### Deploy trên Heroku

```bash
# Login
heroku login

# Create app
heroku create antique-store-api

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret

# Deploy
git push heroku main
```

### Deploy trên Railway

1. Tạo project mới trên [Railway](https://railway.app)
2. Connect GitHub repository
3. Add MySQL database service
4. Set environment variables
5. Deploy automatically

### Deploy trên Render

1. Tạo Web Service mới trên [Render](https://render.com)
2. Connect repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Docker Deployment

Tạo `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build và run:

```bash
docker build -t antique-store-api .
docker run -p 5000:5000 --env-file .env antique-store-api
```

##  Bảo mật

-  JWT authentication
-  Password hashing với bcrypt
-  Helmet.js cho security headers
-  CORS configuration
-  Input validation với express-validator
-  SQL injection prevention (Sequelize ORM)
-  Rate limiting (recommended for production)

##  License

MIT License

##  Contributors

- Backend Developer: Antique Store Team




