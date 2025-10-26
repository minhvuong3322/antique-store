# 🐛 Debug Support Messages

## 📊 Tình trạng hiện tại

✅ **Database:** Có 9 tin nhắn trong database  
✅ **Backend API:** Hoạt động đúng  
❌ **Frontend Admin:** Bị lỗi 403 Forbidden  

## 🔍 Nguyên nhân

**Lỗi 403** nghĩa là user hiện tại **KHÔNG có quyền admin**.

### User Admin có sẵn:
- **Email:** `admin@antiquestore.com
- **Password:** (Hãy kiểm tra trong database hoặc env)

## ✅ Bước 1: Đăng nhập lại bằng Admin

1. **Mở trang đăng nhập:** `http://localhost:5173/login`
2. **Đăng nhập bằng tài khoản admin:**
   - Email: `admin@antiquestore.com`
   - Password: (mật khẩu của admin)
3. **Sau khi đăng nhập, truy cập:** `http://localhost:5173/admin/support`

## 🔍 Bước 2: Kiểm tra Network Request

1. **Mở Developer Tools** (F12)
2. **Chọn tab Network**
3. **Refresh trang** `/admin/support`
4. **Tìm request:** `http://localhost:5000/api/v1/admin/support`
5. **Kiểm tra:**
   - **Status:** Nếu là **200** → ✅ OK, vấn đề đã được giải quyết
   - **Status:** Nếu vẫn là **403** → Tiếp tục bước 3
   - **Status:** Nếu là **401** → Token hết hạn, logout và login lại

## 🔍 Bước 3: Kiểm tra Token và Header

Vào **Request Headers** của request `/admin/support`:

```
Authorization: Bearer <token>
```

Nếu **KHÔNG có** dòng này → Đăng xuất và đăng nhập lại.

## 🔍 Bước 4: Test API trực tiếp

Nếu vẫn không được, test API trực tiếp:

### Cách 1: Dùng Postman/Thunder Client

1. **GET:** `http://localhost:5000/api/v1/admin/support`
2. **Headers:**
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
3. **Nhấn Send**

### Cách 2: Dùng Browser Console

Mở Console trên trang admin và chạy:

```javascript
// Lấy token từ localStorage
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

// Gọi API
fetch('http://localhost:5000/api/v1/admin/support', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## 🎯 Kết luận

**Nếu Status = 200 và Response có 9 messages:**
- ✅ Admin đã thấy tin nhắn
- ✅ Vấn đề đã được giải quyết

**Nếu Status = 403:**
- User hiện tại không có role admin
- Đăng xuất và đăng nhập lại bằng tài khoản admin

**Nếu Status = 401:**
- Token đã hết hạn
- Đăng xuất và đăng nhập lại

## 📝 Lưu ý

- Tài khoản admin: `admin@antiquestore.com`
- Có 9 tin nhắn đang chờ trong database
- Backend API đã hoạt động đúng

---

## 🧪 Test gửi tin nhắn mới

Để test lại luồng hoàn chỉnh:

1. **Mở trang Contact:** `http://localhost:5173/contact`
2. **Điền form** và gửi tin nhắn
3. **Kiểm tra:** Developer Tools → Network → Tìm request POST `/support`
4. **Sau đó:** Vào `/admin/support` để xem tin nhắn mới

