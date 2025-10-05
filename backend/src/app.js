const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/app');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Create Express app
const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

// Security headers
app.use(helmet());

// CORS
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = config.cors.origin.split(',').map(o => o.trim());

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: config.cors.credentials,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.node_env === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// =====================================================
// ROUTES
// =====================================================

// API routes
app.use(config.api_prefix, routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Antique Store API',
        version: '1.0.0',
        documentation: `${config.api_prefix}/health`
    });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;



