@echo off
echo ========================================
echo    SHOP DO CO - ANTIQUE STORE SETUP
echo ========================================
echo.

REM Kiểm tra Node.js
echo [1/6] Kiem tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js chua duoc cai dat!
    echo Vui long tai va cai dat Node.js tu: https://nodejs.org/
    echo Yeu cau: Node.js >= 16.0.0
    pause
    exit /b 1
)
echo  Node.js da duoc cai dat

REM Kiểm tra npm
echo [2/6] Kiem tra npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  npm chua duoc cai dat!
    pause
    exit /b 1
)
echo  npm da duoc cai dat

REM Cài đặt frontend dependencies
echo [3/6] Cai dat frontend dependencies...
echo Dang cai dat dependencies cho frontend...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo  Loi khi cai dat frontend dependencies!
    echo Thu chay: npm install --legacy-peer-deps
    pause
    exit /b 1
)
echo  Frontend dependencies da duoc cai dat

REM Cài đặt backend dependencies
echo [4/6] Cai dat backend dependencies...
echo Dang cai dat dependencies cho backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo  Loi khi cai dat backend dependencies!
    pause
    exit /b 1
)
echo  Backend dependencies da duoc cai dat
cd ..

REM Tạo file .env cho backend
echo [5/6] Tao file cau hinh backend...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo  Da tao file backend\.env tu env.example
    echo.
    echo   CAN THIET: Ban can chinh sua file backend\.env
    echo    - Cap nhat thong tin database (DB_HOST, DB_USER, DB_PASSWORD)
    echo    - Cap nhat JWT_SECRET
    echo.
) else (
    echo  File backend\.env da ton tai
)

REM Hướng dẫn tiếp theo
echo [6/6] Hoan thanh!
echo.
echo ========================================
echo           HUONG DAN TIEP THEO
echo ========================================
echo.
echo 1. CAU HINH DATABASE:
echo    - Cai dat MySQL hoac PostgreSQL
echo    - Tao database: antique_store
echo    - Import file: backend\database\antique_store.sql
echo.
echo 2. CAU HINH BACKEND:
echo    - Chinh sua file: backend\.env
echo    - Cap nhat thong tin database
echo.
echo 3. CHAY DU AN:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: npm run dev
echo.
echo 4. TRUY CAP:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    Admin:    admin@antiquestore.com / admin123
echo.
echo ========================================
echo.
echo Ban co muon mo file backend\.env de chinh sua ngay bay gio? (y/n)
set /p choice=
if /i "%choice%"=="y" (
    notepad backend\.env
)

echo.
echo Setup hoan thanh! Chuc ban code vui ve! 🎉
pause
