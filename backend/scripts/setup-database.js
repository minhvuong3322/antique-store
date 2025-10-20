const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Cấu hình database từ .env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'antique_store'
};

async function setupDatabase() {
    let connection;

    try {
        console.log('🔧 Đang thiết lập database...');

        // Kết nối không chỉ định database để tạo database
        const tempConfig = { ...dbConfig };
        delete tempConfig.database;

        connection = await mysql.createConnection(tempConfig);
        console.log('✅ Kết nối MySQL thành công');

        // Tạo database nếu chưa tồn tại
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${dbConfig.database}' đã sẵn sàng`);

        // Đóng kết nối tạm
        await connection.end();

        // Kết nối với database đã tạo
        connection = await mysql.createConnection(dbConfig);
        console.log(`✅ Kết nối với database '${dbConfig.database}' thành công`);

        // Đọc và thực thi file SQL
        const sqlPath = path.join(__dirname, 'database', 'antique_store.sql');

        if (fs.existsSync(sqlPath)) {
            console.log('📄 Đang import schema từ file SQL...');
            const sqlContent = fs.readFileSync(sqlPath, 'utf8');

            // Chia SQL thành các câu lệnh riêng biệt
            const statements = sqlContent
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const statement of statements) {
                if (statement.trim()) {
                    try {
                        await connection.execute(statement);
                    } catch (error) {
                        // Bỏ qua lỗi nếu table đã tồn tại
                        if (!error.message.includes('already exists')) {
                            console.warn(`⚠️  Cảnh báo: ${error.message}`);
                        }
                    }
                }
            }

            console.log('✅ Schema đã được import thành công');
        } else {
            console.log('⚠️  Không tìm thấy file SQL schema');
        }

        // Kiểm tra các bảng đã được tạo
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`✅ Đã tạo ${tables.length} bảng trong database`);

        // Tạo admin user mặc định
        console.log('👤 Đang tạo admin user mặc định...');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        try {
            await connection.execute(`
                INSERT IGNORE INTO users (email, password, full_name, role, is_active, created_at, updated_at)
                VALUES ('admin@antiquestore.com', ?, 'Administrator', 'admin', 1, NOW(), NOW())
            `, [hashedPassword]);
            console.log('✅ Admin user đã được tạo: admin@antiquestore.com / admin123');
        } catch (error) {
            if (error.message.includes('Duplicate entry')) {
                console.log('✅ Admin user đã tồn tại');
            } else {
                console.warn(`⚠️  Lỗi tạo admin user: ${error.message}`);
            }
        }

        console.log('\n🎉 Database setup hoàn thành!');
        console.log('📋 Thông tin đăng nhập admin:');
        console.log('   Email: admin@antiquestore.com');
        console.log('   Password: admin123');

    } catch (error) {
        console.error('❌ Lỗi khi thiết lập database:', error.message);
        console.log('\n🔧 Hướng dẫn khắc phục:');
        console.log('1. Kiểm tra MySQL đang chạy');
        console.log('2. Kiểm tra thông tin trong file .env');
        console.log('3. Đảm bảo user có quyền tạo database');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Chạy setup
setupDatabase();
