#!/bin/bash

echo "========================================"
echo "   SHOP DO CO - ANTIQUE STORE SETUP"
echo "========================================"
echo

# Kiểm tra Node.js
echo "[1/6] Kiểm tra Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt!"
    echo "Vui lòng tải và cài đặt Node.js từ: https://nodejs.org/"
    echo "Yêu cầu: Node.js >= 16.0.0"
    exit 1
fi
echo "✅ Node.js đã được cài đặt"

# Kiểm tra npm
echo "[2/6] Kiểm tra npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt!"
    exit 1
fi
echo "✅ npm đã được cài đặt"

# Cài đặt frontend dependencies
echo "[3/6] Cài đặt frontend dependencies..."
echo "Đang cài đặt dependencies cho frontend..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Lỗi khi cài đặt frontend dependencies!"
    echo "Thử chạy: npm install --legacy-peer-deps"
    exit 1
fi
echo "✅ Frontend dependencies đã được cài đặt"

# Cài đặt backend dependencies
echo "[4/6] Cài đặt backend dependencies..."
echo "Đang cài đặt dependencies cho backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Lỗi khi cài đặt backend dependencies!"
    exit 1
fi
echo "✅ Backend dependencies đã được cài đặt"
cd ..

# Tạo file .env cho backend
echo "[5/6] Tạo file cấu hình backend..."
if [ ! -f "backend/.env" ]; then
    cp "backend/env.example" "backend/.env"
    echo "✅ Đã tạo file backend/.env từ env.example"
    echo
    echo "⚠️  CẦN THIẾT: Bạn cần chỉnh sửa file backend/.env"
    echo "   - Cập nhật thông tin database (DB_HOST, DB_USER, DB_PASSWORD)"
    echo "   - Cập nhật JWT_SECRET"
    echo
else
    echo "✅ File backend/.env đã tồn tại"
fi

# Hướng dẫn tiếp theo
echo "[6/6] Hoàn thành!"
echo
echo "========================================"
echo "           HƯỚNG DẪN TIẾP THEO"
echo "========================================"
echo
echo "1. CẤU HÌNH DATABASE:"
echo "   - Cài đặt MySQL hoặc PostgreSQL"
echo "   - Tạo database: antique_store"
echo "   - Import file: backend/database/antique_store.sql"
echo
echo "2. CẤU HÌNH BACKEND:"
echo "   - Chỉnh sửa file: backend/.env"
echo "   - Cập nhật thông tin database"
echo
echo "3. CHẠY DỰ ÁN:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: npm run dev"
echo
echo "4. TRUY CẬP:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Admin:    admin@antiquestore.com / admin123"
echo
echo "========================================"
echo
read -p "Bạn có muốn mở file backend/.env để chỉnh sửa ngay bây giờ? (y/n): " choice
if [[ $choice == "y" || $choice == "Y" ]]; then
    if command -v code &> /dev/null; then
        code backend/.env
    elif command -v nano &> /dev/null; then
        nano backend/.env
    elif command -v vim &> /dev/null; then
        vim backend/.env
    else
        echo "Không tìm thấy editor. Vui lòng mở file backend/.env thủ công."
    fi
fi

echo
echo "Setup hoàn thành! Chúc bạn code vui vẻ! 🎉"
