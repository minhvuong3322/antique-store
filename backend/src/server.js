require('dotenv').config();
const app = require('./app');
const config = require('./config/app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// =====================================================
// KHỞI ĐỘNG SERVER
// =====================================================

const startServer = async () => {
    try {
        // Kiểm tra kết nối database
        await testConnection();

        // Đồng bộ database (chỉ trong development)
        if (config.node_env === 'development') {
            console.log('📝 Đang đồng bộ database...');
            await syncDatabase({ alter: true }); // Sử dụng alter: true để đồng bộ thay đổi schema
        }

        // Khởi động server
        const PORT = config.port;
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('========================================');
            console.log(`🚀 Server đang chạy trên port ${PORT}`);
            console.log(`📍 Môi trường: ${config.node_env}`);
            console.log(`🌐 URL API: http://localhost:${PORT}${config.api_prefix}`);
            console.log(`📚 Kiểm tra sức khỏe: http://localhost:${PORT}${config.api_prefix}/health`);
            console.log('========================================');
            console.log('');
        });

        // Tắt server một cách graceful
        process.on('SIGTERM', () => {
            console.log('Nhận tín hiệu SIGTERM: đang đóng HTTP server');
            server.close(() => {
                console.log('HTTP server đã đóng');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('\nNhận tín hiệu SIGINT: đang đóng HTTP server');
            server.close(() => {
                console.log('HTTP server đã đóng');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Không thể khởi động server:', error);
        process.exit(1);
    }
};

startServer();



