require('dotenv').config();
const app = require('./app');
const config = require('./config/app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync database (development only)
        if (config.node_env === 'development') {
            console.log('📝 Syncing database...');
            await syncDatabase({ alter: true }); // Use alter: true to sync schema changes
        }

        // Start server
        const PORT = config.port;
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('========================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${config.node_env}`);
            console.log(`🌐 API URL: http://localhost:${PORT}${config.api_prefix}`);
            console.log(`📚 Health Check: http://localhost:${PORT}${config.api_prefix}/health`);
            console.log('========================================');
            console.log('');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('\nSIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();



