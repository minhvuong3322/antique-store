# 🏺 Shop Đồ Cổ - Antique Store

Một website thương mại điện tử hiện đại với thiết kế hoài cổ sang trọng, chuyên bán các sản phẩm đồ cổ độc đáo.

## ✨ Tính Năng

### Đã Hoàn Thành
- ✅ Thiết kế giao diện hoài cổ sang trọng với TailwindCSS
- ✅ Responsive design (Mobile-first)
- ✅ Dark/Light mode
- ✅ Đa ngôn ngữ (Tiếng Việt & English)
- ✅ Component tái sử dụng cao
- ✅ Trang chủ với banner và sản phẩm nổi bật

### Roadmap Phát Triển
- 🔄 Trang danh mục sản phẩm với bộ lọc nâng cao
- 🔄 Trang chi tiết sản phẩm
- 🔄 Giỏ hàng & Checkout
- 🔄 Quản lý tài khoản người dùng
- 🔄 Tìm kiếm nâng cao
- 📋 Tích hợp Backend API
- 📋 Payment Gateway
- 📋 Quản lý kho hàng
- 📋 SEO Optimization
- 📋 Analytics & Tracking

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Router**: React Router DOM
- **i18n**: React-i18next
- **State Management**: React Context API (có thể mở rộng với Redux/Zustand)

## 📁 Cấu Trúc Dự Án

```
antique-shop/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Common components (Button, Card, Modal...)
│   │   ├── layout/      # Layout components (Navbar, Footer, Sidebar...)
│   │   ├── products/    # Product-related components
│   │   └── cart/        # Cart & checkout components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context providers
│   ├── utils/           # Utility functions
│   ├── locales/         # i18n translations
│   ├── data/            # Mock data for development
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
- Node.js >= 18.x
- npm hoặc yarn

### Các Bước

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy development server
npm run dev

# 3. Build cho production
npm run build

# 4. Preview production build
npm run preview
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

## 📝 Hướng Dẫn Tích Hợp Backend

### API Endpoints Cần Thiết

```javascript
// Products
GET    /api/products              // Lấy danh sách sản phẩm
GET    /api/products/:id           // Lấy chi tiết sản phẩm
GET    /api/products/featured      // Sản phẩm nổi bật
GET    /api/products/categories    // Danh mục sản phẩm

// Cart
POST   /api/cart                   // Thêm vào giỏ hàng
GET    /api/cart                   // Lấy giỏ hàng
PUT    /api/cart/:itemId           // Cập nhật số lượng
DELETE /api/cart/:itemId           // Xóa khỏi giỏ

// Orders
POST   /api/orders                 // Tạo đơn hàng
GET    /api/orders                 // Lịch sử đơn hàng
GET    /api/orders/:id             // Chi tiết đơn hàng

// Auth
POST   /api/auth/register          // Đăng ký
POST   /api/auth/login             // Đăng nhập
POST   /api/auth/logout            // Đăng xuất
GET    /api/auth/profile           // Thông tin user
```

### Data Models

Xem file `src/data/mockData.js` để biết cấu trúc dữ liệu chi tiết.

## 👥 Team & Contribution

- **Frontend**: React + TailwindCSS
- **Backend**: (Chưa triển khai - sẵn sàng tích hợp)
- **Design**: Vintage/Antique theme

## 📄 License

MIT License - Tự do sử dụng cho mục đích thương mại và học tập.

---

**Liên hệ**: Để được hỗ trợ tích hợp backend hoặc tùy chỉnh thêm tính năng.


