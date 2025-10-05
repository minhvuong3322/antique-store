# 📚 Hướng Dẫn Phát Triển - Shop Đồ Cổ

## 📁 Cấu Trúc Dự Án Chi Tiết

```
antique-shop/
│
├── public/                          # Static assets (images, icons)
│   └── vite.svg                     # Default Vite logo (có thể thay thế)
│
├── src/
│   ├── components/                  # Các component tái sử dụng
│   │   ├── layout/                  # Layout components
│   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   ├── Navbar.jsx          # Navigation bar với menu, search, cart
│   │   │   └── Footer.jsx          # Footer với links, newsletter
│   │   │
│   │   └── products/               # Product-related components
│   │       └── ProductCard.jsx     # Card hiển thị sản phẩm
│   │
│   ├── pages/                       # Các trang chính
│   │   ├── HomePage.jsx            # ✅ Trang chủ (đã hoàn thành)
│   │   ├── ProductsPage.jsx        # ✅ Danh sách sản phẩm với filters
│   │   ├── ProductDetailPage.jsx   # ✅ Chi tiết sản phẩm
│   │   ├── CartPage.jsx            # ✅ Giỏ hàng
│   │   ├── CheckoutPage.jsx        # ✅ Thanh toán
│   │   ├── AboutPage.jsx           # ✅ Giới thiệu
│   │   └── ContactPage.jsx         # ✅ Liên hệ
│   │
│   ├── context/                     # React Context API
│   │   └── ThemeContext.jsx        # Dark/Light mode state management
│   │
│   ├── utils/                       # Utility functions
│   │   ├── cn.js                   # Tailwind class merger
│   │   └── format.js               # Format currency, date, text
│   │
│   ├── locales/                     # i18n translation files
│   │   ├── vi.json                 # Tiếng Việt
│   │   └── en.json                 # English
│   │
│   ├── data/                        # Mock data
│   │   └── mockData.js             # Sample products, categories
│   │
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles + Tailwind
│   └── i18n.js                      # i18n configuration
│
├── index.html                       # HTML template
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration & theme
├── postcss.config.js                # PostCSS configuration
├── eslint.config.js                 # ESLint configuration
├── .gitignore                       # Git ignore rules
├── README.md                        # Project overview
└── DEVELOPER_GUIDE.md              # This file

```

## 🎨 Design System

### Color Palette (Tailwind Custom Colors)

```javascript
// Vintage Antique Theme
colors: {
  vintage: {
    gold: '#D4A574',      // Màu vàng sang trọng
    bronze: '#CD7F32',    // Màu đồng
    darkwood: '#3E2723',  // Màu gỗ tối
    wood: '#5D4037',      // Màu gỗ
    lightwood: '#8D6E63', // Màu gỗ nhạt
    cream: '#F5E6D3',     // Màu kem (background)
    ivory: '#FFFFF0',     // Màu ngà voi
    sage: '#9CAF88',      // Màu xanh olive nhạt
    rust: '#B7410E',      // Màu gỉ sắt
  },
  dark: {
    bg: '#1A1410',        // Dark mode background
    card: '#2D2419',      // Dark mode card
    border: '#3E342A',    // Dark mode border
  }
}
```

### Typography

- **Headings**: `font-elegant` (Cinzel) - Trang trọng, cổ điển
- **Serif**: `font-serif` (Playfair Display) - Cho tiêu đề section
- **Sans**: `font-sans` (Cormorant Garamond) - Cho body text

### Custom CSS Classes

#### Buttons
```jsx
// Primary button
<button className="btn-vintage">Click Me</button>

// Outline button
<button className="btn-outline-vintage">Click Me</button>
```

#### Cards
```jsx
// Vintage styled card
<div className="card-vintage">
  {/* Content */}
</div>
```

#### Inputs
```jsx
// Vintage styled input
<input className="input-vintage" />
```

#### Dividers
```jsx
// Decorative divider
<div className="divider-vintage"></div>
```

## 🔧 Công Nghệ Sử Dụng

### Core
- **React 18** - UI library
- **Vite** - Build tool (nhanh hơn CRA)
- **React Router DOM** - Client-side routing

### Styling
- **TailwindCSS** - Utility-first CSS framework
- **Custom Theme** - Vintage color palette & typography

### Internationalization
- **react-i18next** - i18n framework
- **i18next** - i18n core

### Icons & UI
- **Lucide React** - Beautiful icon library
- **clsx** + **tailwind-merge** - Class name utilities

### State Management
- **React Context API** - Theme management
- **React Hooks** - Local state (useState, useEffect)

> 💡 **TODO Backend**: Có thể thêm Redux Toolkit hoặc Zustand cho global state khi tích hợp API

## 🚀 Cách Chạy Dự Án

### 1. Cài Đặt Dependencies

```bash
npm install
```

### 2. Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

### 3. Build Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📝 Các Tính Năng Đã Hoàn Thành

### ✅ Core Features
- [x] Thiết lập dự án với Vite + React
- [x] Cấu hình TailwindCSS với custom theme
- [x] Dark/Light mode toggle
- [x] Đa ngôn ngữ (Tiếng Việt & English)
- [x] Responsive design (Mobile-first)

### ✅ Components
- [x] Layout (Navbar + Footer)
- [x] ProductCard component
- [x] Trang chủ với Hero section
- [x] Trang danh sách sản phẩm với filters
- [x] Trang chi tiết sản phẩm
- [x] Giỏ hàng
- [x] Checkout form
- [x] Trang giới thiệu
- [x] Trang liên hệ

## 🔜 Roadmap Phát Triển Tiếp Theo

### Phase 2: State Management & API Integration
- [ ] Tạo CartContext cho quản lý giỏ hàng
- [ ] Tạo AuthContext cho authentication
- [ ] Tích hợp API endpoints (xem section API Design)
- [ ] Loading states & Error handling
- [ ] Toast notifications

### Phase 3: Advanced Features
- [ ] Search functionality (Algolia hoặc custom)
- [ ] Product filtering & sorting
- [ ] Wishlist functionality
- [ ] User account pages (profile, orders)
- [ ] Admin dashboard (quản lý sản phẩm)

### Phase 4: Performance & SEO
- [ ] Image optimization (lazy loading)
- [ ] Code splitting
- [ ] SEO meta tags
- [ ] Open Graph tags
- [ ] Sitemap generation

### Phase 5: Backend Integration
- [ ] Connect to backend API
- [ ] Payment gateway (VNPay, Momo, Stripe)
- [ ] Real-time inventory updates
- [ ] Order tracking system

## 🔌 API Design (Cho Backend Team)

### Authentication
```javascript
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Products
```javascript
GET    /api/products              // List all products
GET    /api/products/:id          // Product detail
GET    /api/products/featured     // Featured products
GET    /api/products/categories   // List categories
POST   /api/products/search       // Search products
```

**Query Parameters cho GET /api/products:**
```javascript
?page=1&limit=12               // Pagination
&category=ceramics             // Filter by category
&minPrice=0&maxPrice=50000000  // Price range
&era=1850-1900                 // Filter by era
&sort=price_asc                // Sorting
&search=vase                   // Search keyword
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 48,
      "totalPages": 4
    }
  }
}
```

### Cart
```javascript
GET    /api/cart                  // Get user's cart
POST   /api/cart                  // Add item to cart
PUT    /api/cart/:itemId          // Update quantity
DELETE /api/cart/:itemId          // Remove item
DELETE /api/cart                  // Clear cart
```

### Orders
```javascript
GET    /api/orders                // User's orders
GET    /api/orders/:id            // Order detail
POST   /api/orders                // Create order
PUT    /api/orders/:id/cancel     // Cancel order
```

### Payment
```javascript
POST   /api/payment/create        // Create payment
POST   /api/payment/callback      // Payment gateway callback
GET    /api/payment/:id/status    // Check payment status
```

## 💾 Data Models

### Product Model
```javascript
{
  id: number,
  name: string,                    // Tên tiếng Việt
  nameEn: string,                  // Tên tiếng Anh
  price: number,                   // Giá (VND)
  era: string,                     // Niên đại "1850-1900"
  origin: string,                  // Xuất xứ (VI)
  originEn: string,                // Xuất xứ (EN)
  condition: string,               // Tình trạng (VI)
  conditionEn: string,             // Tình trạng (EN)
  category: string,                // Category ID
  inStock: boolean,                // Còn hàng?
  isUnique: boolean,               // Sản phẩm độc bản?
  featured: boolean,               // Sản phẩm nổi bật?
  images: string[],                // Mảng URLs
  description: string,             // Mô tả (VI)
  descriptionEn: string,           // Mô tả (EN)
  specifications: {                // Thông số kỹ thuật
    height: string,
    width: string,
    weight: string,
    material: string,
    // ... other specs
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Best Practices

### Component Structure
```jsx
// 1. Imports
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// 2. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const { t } = useTranslation()
  const [state, setState] = useState(null)

  // 4. Event handlers
  const handleClick = () => {
    // ...
  }

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 6. Export
export default MyComponent
```

### Styling Guidelines
1. Sử dụng Tailwind utility classes
2. Sử dụng custom classes (btn-vintage, card-vintage) cho patterns lặp lại
3. Responsive design: mobile-first approach
4. Dark mode: sử dụng `dark:` prefix

### Code Organization
- Mỗi component trong file riêng
- Component nhỏ, dễ test, tái sử dụng
- Logic phức tạp extract thành custom hooks
- Constants và configs trong file riêng

## 🐛 Debugging Tips

### Common Issues

**1. Styling không hiển thị:**
```bash
# Đảm bảo Tailwind đã build
npm run dev
```

**2. i18n translations không hoạt động:**
- Check file `src/locales/vi.json` và `en.json`
- Verify key đang sử dụng trong `t('key')`

**3. Routing không hoạt động:**
- Check BrowserRouter đã wrap App.jsx
- Verify route paths trong App.jsx

## 📧 Liên Hệ & Hỗ Trợ

Nếu có thắc mắc hoặc cần hỗ trợ khi phát triển:
- Check README.md cho overview
- Check code comments trong source files
- Mock data trong `src/data/mockData.js` làm reference

---

**Happy Coding! 🚀**


