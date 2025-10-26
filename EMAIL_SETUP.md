# 📧 Hướng Dẫn Cấu Hình Email

## Vấn đề
Admin đã gửi hóa đơn nhưng khách hàng không nhận được email.

## Nguyên nhân
Code đã được sửa để gửi email, NHƯNG cần cấu hình SMTP credentials trong file `.env`.

## Cách sửa

### Bước 1: Cấu hình email trong `.env`

Mở file `backend/.env` và thêm các thông tin sau:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Bước 2: Tạo App Password cho Gmail

Nếu dùng Gmail, bạn cần tạo App Password:

1. **Đăng nhập vào Gmail**
2. **Mở:** [Google Account](https://myaccount.google.com/)
3. **Chọn:** Security → 2-Step Verification (nếu chưa bật)
4. **Chọn:** App passwords
5. **Tạo mật khẩu mới** cho "Mail" và "Other (Custom name)" → Nhập "Antique Store"
6. **Copy** mật khẩu 16 ký tự (không có khoảng trắng)
7. **Dán vào** `SMTP_PASS` trong `.env`

### Bước 3: Restart Backend

```bash
cd backend
# Stop server hiện tại (Ctrl+C)
npm start
```

### Bước 4: Test gửi email

Thử gửi lại hóa đơn từ admin panel.

---

## Các SMTP khác

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid (Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

## Kiểm tra logs

Sau khi restart backend, check logs:

```bash
# Terminal nơi backend đang chạy
# Tìm message: "Email transporter initialized"
```

Nếu có lỗi, check logs ở:
- `backend/logs/combined.log`
- `backend/logs/error.log`

---

## Lưu ý

- Đảm bảo email không vào thư mục Spam
- Kiểm tra email đúng format (có @ và .com)
- App password chỉ dùng cho email development, không dùng mật khẩu thật

