# 🏺 Shop Đồ Cổ - Antique Store

Một website thương mại điện tử hoàn chỉnh với thiết kế hoài cổ sang trọng, chuyên bán các sản phẩm đồ cổ độc đáo.

## ✨ Tính Năng

### ✅ Đã Hoàn Thành
- ✅ **Frontend hoàn chỉnh** với React 18 + TailwindCSS
- ✅ **Backend API đầy đủ** với Node.js + Express + Sequelize
- ✅ **Database PostgreSQL/MySQL** với schema hoàn chỉnh
- ✅ **Xác thực người dùng** (Đăng ký, đăng nhập, JWT)
- ✅ **Quản lý sản phẩm** (CRUD, phân loại, tìm kiếm)
- ✅ **Giỏ hàng** (Thêm, sửa, xóa sản phẩm)
- ✅ **Đơn hàng** (Tạo đơn, theo dõi trạng thái)
- ✅ **Thanh toán** (Tích hợp VNPay, MoMo)
- ✅ **OTP xác thực** (Email verification, reset password)
- ✅ **Responsive design** (Mobile-first)
- ✅ **Dark/Light mode**
- ✅ **Đa ngôn ngữ** (Tiếng Việt & English)
- ✅ **Docker support** (Containerization)
- ✅ **File upload** (Hình ảnh sản phẩm)
- ✅ **Comment tiếng Việt** (Toàn bộ codebase)

### 🔄 Đang Phát Triển
- 🔄 **Admin dashboard** (Quản lý sản phẩm, đơn hàng)
- 🔄 **Social login** (Google, Facebook)
- 🔄 **Email notifications** (Thông báo đơn hàng)
- 🔄 **Advanced search** (Tìm kiếm nâng cao)
- 🔄 **Product reviews** (Đánh giá sản phẩm)

### 📋 Roadmap Tương Lai
- 📋 **Analytics dashboard** (Thống kê bán hàng)
- 📋 **Inventory management** (Quản lý kho)
- 📋 **SEO optimization** (Tối ưu SEO)
- 📋 **Mobile app** (React Native)
- 📋 **Multi-vendor** (Nhiều nhà bán)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS + Custom CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **i18n**: React-i18next
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL / MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Logging**: Winston

### DevOps & Tools
- **Containerization**: Docker + Docker Compose
- **Environment**: dotenv
- **API Documentation**: Swagger (planned)
- **Testing**: Jest (planned)

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
├── 📄 SETUP_GUIDE.md            # Hướng dẫn setup
├── 📄 DEVELOPER_GUIDE.md        # Hướng dẫn phát triển
└── 📄 README.md                # Tài liệu dự án
```

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- **Node.js**: >= 18.x
- **npm**: >= 8.x
- **Database**: PostgreSQL 13+ hoặc MySQL 8.0+
- **Docker**: (Tùy chọn)

### Cài Đặt Nhanh

```bash
# 1. Clone repository
git clone https://github.com/Minhvuong3322/antique-store.git
cd antique-store

# 2. Cài đặt dependencies
npm install                    # Frontend
cd backend && npm install      # Backend

# 3. Cấu hình database
# Tạo database và import file SQL
mysql -u root -p antique_store < antique_store.sql

# 4. Cấu hình environment
cd backend
cp env.example .env
# Chỉnh sửa file .env với thông tin database

# 5. Chạy dự án
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Cài Đặt Với Docker

```bash
# Chạy toàn bộ hệ thống với Docker
docker-compose up -d

# Hoặc chỉ backend
cd backend
docker-compose up -d
```

## 🌐 API Endpoints

### Authentication
```javascript
POST   /api/v1/auth/register          // Đăng ký tài khoản
POST   /api/v1/auth/login             // Đăng nhập
POST   /api/v1/auth/logout            // Đăng xuất
GET    /api/v1/auth/profile           // Lấy thông tin user
PUT    /api/v1/auth/profile           // Cập nhật profile
PUT    /api/v1/auth/change-password   // Đổi mật khẩu
```

### Products
```javascript
GET    /api/v1/products               // Danh sách sản phẩm
GET    /api/v1/products/:id           // Chi tiết sản phẩm
GET    /api/v1/products/featured      // Sản phẩm nổi bật
GET    /api/v1/products/categories    // Danh mục sản phẩm
POST   /api/v1/products               // Tạo sản phẩm (Admin)
PUT    /api/v1/products/:id           // Cập nhật sản phẩm (Admin)
DELETE /api/v1/products/:id           // Xóa sản phẩm (Admin)
```

### Cart & Orders
```javascript
GET    /api/v1/cart                   // Lấy giỏ hàng
POST   /api/v1/cart                   // Thêm vào giỏ hàng
PUT    /api/v1/cart/:itemId           // Cập nhật số lượng
DELETE /api/v1/cart/:itemId           // Xóa khỏi giỏ hàng

POST   /api/v1/orders                 // Tạo đơn hàng
GET    /api/v1/orders                 // Lịch sử đơn hàng
GET    /api/v1/orders/:id             // Chi tiết đơn hàng
PUT    /api/v1/orders/:id/status       // Cập nhật trạng thái (Admin)
```

### OTP & Verification
```javascript
POST   /api/v1/otp/send               // Gửi OTP
POST   /api/v1/otp/verify             // Xác thực OTP
POST   /api/v1/otp/resend             // Gửi lại OTP
```

## 🎨 Design System

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

## 📊 Database Schema

### Bảng Chính
- **users** - Người dùng (Admin, Customer)
- **categories** - Danh mục sản phẩm
- **products** - Sản phẩm với slug SEO-friendly
- **cart_items** - Giỏ hàng
- **orders** - Đơn hàng
- **order_details** - Chi tiết đơn hàng
- **payments** - Thanh toán
- **otps** - Mã OTP xác thực

### Dữ Liệu Mẫu
- ✅ **14 danh mục** sản phẩm
- ✅ **20 sản phẩm** với hình ảnh và mô tả
- ✅ **Admin account**: admin@antiquestore.com / admin123
- ✅ **Sample users** và OTP records

## 🔧 Development

### Scripts Available

```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check

# Backend  
npm run dev          # Development server
npm run start        # Production server
npm run migrate      # Database migration
npm run seed         # Seed sample data
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=antique_store
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 👥 Team & Contribution

- **Full-stack Developer**: Minh Vuong
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express + Sequelize
- **Database**: PostgreSQL/MySQL
- **Design**: Vintage/Antique theme
- **Language**: Vietnamese comments & documentation

## 📄 License

MIT License - Tự do sử dụng cho mục đích thương mại và học tập.

---

**Liên hệ**: Để được hỗ trợ tích hợp backend hoặc tùy chỉnh thêm tính năng.


