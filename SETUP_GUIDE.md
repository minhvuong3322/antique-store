# 🚀 Hướng Dẫn Setup Dự Án Antique Store

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Database**: MySQL 8.0+ hoặc PostgreSQL 12+
- **Git**: Để clone repository

## 🔧 Cài Đặt

### 1. Clone Repository
```bash
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store
```

### 2. Cài Đặt Dependencies

#### Frontend:
```bash
npm install
```

#### Backend:
```bash
cd backend
npm install
cd ..
```

### 3. Cấu Hình Database

#### Tạo Database:
```sql
-- MySQL
CREATE DATABASE antique_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PostgreSQL
CREATE DATABASE antique_store;
```

### 4. Cấu Hình Environment Variables

#### Tạo file .env:
```bash
cd backend
cp env.example .env
```

#### Chỉnh sửa file .env:
```env
# =====================================================
# CẤU HÌNH BẮT BUỘC
# =====================================================

# Server
NODE_ENV=development
PORT=5000

# Database (Chọn MySQL hoặc PostgreSQL)
# MySQL:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=antique_store
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql

# PostgreSQL (uncomment nếu dùng PostgreSQL):
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=antique_store
# DB_USER=postgres
# DB_PASSWORD=your_postgres_password
# DB_DIALECT=postgres

# JWT Secrets (QUAN TRỌNG - Thay đổi ngay!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this-too
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# =====================================================
# CẤU HÌNH TÙY CHỌN
# =====================================================

# Email Service (nếu muốn gửi email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway (nếu tích hợp)
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
MOMO_PARTNER_CODE=your_momo_code
MOMO_ACCESS_KEY=your_momo_key

# Cloudinary (nếu upload ảnh lên cloud)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Chạy Database Migration

```bash
cd backend
npm run migrate
# hoặc
npx sequelize-cli db:migrate
```

### 6. Chạy Dự Án

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
npm run dev
```

## 🌐 Truy Cập

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **API Documentation**: http://localhost:5000/api-docs (nếu có)

## 🔧 Troubleshooting

### Lỗi Database Connection:
1. Kiểm tra database đã được tạo chưa
2. Kiểm tra username/password trong .env
3. Kiểm tra database service đang chạy

### Lỗi Port đã được sử dụng:
```bash
# Thay đổi PORT trong .env
PORT=5001  # hoặc port khác
```

### Lỗi CORS:
```bash
# Thêm frontend URL vào CORS_ORIGIN
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề, liên hệ:
- **GitHub Issues**: https://github.com/Minhvuong3322/antique-store/issues
- **Email**: vuongthm4994@ut.edu.vn

## 📚 Tài Liệu Tham Khảo

- [Sequelize Documentation](https://sequelize.org/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Chúc bạn setup thành công! 🎉**
