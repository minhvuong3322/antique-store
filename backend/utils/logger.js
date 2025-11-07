/**
 * Winston Logger Configuration
 * Provides structured logging with JSON format, colored console output in development,
 * and file-based logging in production.
 */
const winston = require('winston');
const path = require('path');

// Define log levels and colors
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(logColors);

// Determine log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

// Custom format for development (colored and readable)
const devFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
);

// Format for production (JSON)
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Console transport for development
const consoleTransport = new winston.transports.Console({
    format: devFormat,
});

// File transports for production
const errorFileTransport = new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: prodFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
});

const combinedFileTransport = new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: prodFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
});

// Create transports array based on environment
const transports = [];

if (process.env.NODE_ENV === 'production') {
    transports.push(errorFileTransport, combinedFileTransport);

    // Also log to console in production but with JSON format
    transports.push(
        new winston.transports.Console({
            format: prodFormat,
        })
    );
} else {
    // Development: colorized console only
    transports.push(consoleTransport);
}

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels: logLevels,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
});

// Handle uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === 'production') {
    logger.exceptions.handle(
        new winston.transports.File({
            filename: path.join('logs', 'exceptions.log'),
            format: prodFormat,
        })
    );

    logger.rejections.handle(
        new winston.transports.File({
            filename: path.join('logs', 'rejections.log'),
            format: prodFormat,
        })
    );
}

/**
 * Helper function to log error objects with full context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
logger.logError = (error, context = {}) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        statusCode: error.statusCode,
        ...context,
    });
};

/**
 * Helper function to log with request context
 * @param {Object} req - Express request object
 * @param {string} message - Log message
 * @param {string} level - Log level
 */
logger.logRequest = (req, message, level = 'info') => {
    logger[level]({
        message,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id,
    });
};

module.exports = logger;

