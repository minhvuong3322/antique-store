require('dotenv').config();

module.exports = {
    // Server
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    api_prefix: process.env.API_PREFIX || '/api/v1',

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expire: process.env.JWT_EXPIRE || '7d',
        refresh_secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        refresh_expire: process.env.JWT_REFRESH_EXPIRE || '30d'
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000',
        credentials: true
    },

    // Pagination
    pagination: {
        default_page: 1,
        default_limit: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
        max_limit: parseInt(process.env.MAX_PAGE_SIZE) || 100
    },

    // File Upload
    upload: {
        max_file_size: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
        allowed_types: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
        upload_dir: 'uploads/'
    },

    // Security
    bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,

    // Payment
    payment: {
        vnpay: {
            tmn_code: process.env.VNPAY_TMN_CODE,
            hash_secret: process.env.VNPAY_HASH_SECRET
        },
        momo: {
            partner_code: process.env.MOMO_PARTNER_CODE,
            access_key: process.env.MOMO_ACCESS_KEY
        }
    }
};



