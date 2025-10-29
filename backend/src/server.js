require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const config = require('./config/app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// =====================================================
// KHỞI ĐỘNG SERVER
// =====================================================

// =====================================================
// ERROR HANDLERS - Xử lý unhandled errors
// =====================================================
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection tại:', promise);
    console.error('Lý do:', reason);
    // Log chi tiết error để debug
    if (reason instanceof Error) {
        console.error('Stack:', reason.stack);
    }
    // Không exit trong development để có thể debug
    if (config.node_env === 'production') {
        // Trong production, có thể exit để container restart
        // process.exit(1);
    }
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Exit trong mọi trường hợp vì app không còn an toàn
    process.exit(1);
});

const startServer = async () => {
    try {
        // Kiểm tra kết nối database
        await testConnection();

        // Kiểm tra database schema (không alter)
        // Lưu ý: Sử dụng SQL schema files để quản lý database thay vì auto-sync
        if (config.node_env === 'development') {
            console.log('✅ Bỏ qua auto-sync (dùng SQL schema files)');
            // await syncDatabase({ alter: false }); // Tắt để tránh lỗi "Too many keys"
        }

        const PORT = config.port;
        let server;
        let protocol = 'http';

        // =====================================================
        // HTTPS Configuration
        // =====================================================
        if (config.ssl.enabled) {
            try {
                // Đọc SSL certificate và key
                const keyPath = path.resolve(__dirname, '..', config.ssl.keyPath);
                const certPath = path.resolve(__dirname, '..', config.ssl.certPath);

                // Kiểm tra file tồn tại
                if (!fs.existsSync(keyPath)) {
                    throw new Error(`SSL key file không tồn tại: ${keyPath}`);
                }
                if (!fs.existsSync(certPath)) {
                    throw new Error(`SSL certificate file không tồn tại: ${certPath}`);
                }

                const httpsOptions = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath)
                };

                // Tạo HTTPS server
                server = https.createServer(httpsOptions, app);
                protocol = 'https';

                console.log('');
                console.log('========================================');
                console.log('🔒 SSL/TLS đã được kích hoạt');
                console.log(`📁 Key: ${keyPath}`);
                console.log(`📁 Cert: ${certPath}`);
                console.log('========================================');

            } catch (sslError) {
                console.error('❌ Lỗi khi khởi tạo SSL:', sslError.message);
                console.log('⚠️  Fallback về HTTP server...');
                server = http.createServer(app);
                protocol = 'http';
            }
        } else {
            // Tạo HTTP server
            server = http.createServer(app);
            protocol = 'http';
        }

        // Khởi động server
        server.listen(PORT, () => {
            console.log('');
            console.log('========================================');
            console.log(`🚀 Server đang chạy trên port ${PORT}`);
            console.log(`📍 Môi trường: ${config.node_env}`);
            console.log(`🔐 Protocol: ${protocol.toUpperCase()}`);
            console.log(`🌐 URL API: ${protocol}://localhost:${PORT}${config.api_prefix}`);
            console.log(`📚 Health Check: ${protocol}://localhost:${PORT}${config.api_prefix}/health`);

            if (protocol === 'https' && config.node_env === 'development') {
                console.log('');
                console.log('⚠️  HTTPS Development Mode:');
                console.log('   Trình duyệt sẽ cảnh báo về self-signed certificate');
                console.log('   Click "Advanced" → "Proceed to localhost"');
                console.log('   Hoặc trust certificate bằng cách chạy:');
                console.log('   cd backend/scripts && ./generate-ssl-cert.sh');
            }

            console.log('========================================');
            console.log('');
        });

        // Tắt server một cách graceful
        const gracefulShutdown = (signal) => {
            console.log(`\nNhận tín hiệu ${signal}: đang đóng ${protocol.toUpperCase()} server`);
            server.close(() => {
                console.log(`${protocol.toUpperCase()} server đã đóng`);
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Không thể khởi động server:', error);
        process.exit(1);
    }
};

startServer();



