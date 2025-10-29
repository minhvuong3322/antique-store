/**
 * Global error handler middleware with structured logging,
 * internationalization support, and Sentry integration
 */
const Sentry = require('@sentry/node');
const logger = require('../utils/logger');

// Initialize Sentry only in production
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
        // Don't capture errors with status codes < 500
        beforeSend(event, hint) {
            const error = hint.originalException;
            if (error && error.statusCode && error.statusCode < 500) {
                return null;
            }
            return event;
        },
    });
}

/**
 * Error codes mapping for internationalization
 * Frontend should map these codes to localized messages
 */
const ERROR_CODES = {
    // Validation errors (400)
    VALIDATION_ERROR: 'error.validation.general',
    UNIQUE_CONSTRAINT: 'error.validation.unique_constraint',
    FOREIGN_KEY_CONSTRAINT: 'error.validation.foreign_key_constraint',

    // Authentication errors (401)
    TOKEN_INVALID: 'error.auth.token_invalid',
    TOKEN_EXPIRED: 'error.auth.token_expired',
    UNAUTHORIZED: 'error.auth.unauthorized',

    // Authorization errors (403)
    FORBIDDEN: 'error.auth.forbidden',

    // Not found errors (404)
    NOT_FOUND: 'error.resource.not_found',

    // Server errors (500)
    INTERNAL_SERVER: 'error.server.internal',
    DATABASE_ERROR: 'error.server.database',
};

/**
 * Map error types to error codes and status codes
 */
const getErrorInfo = (err) => {
    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message,
            errorCode: `error.validation.${e.validatorKey || 'field'}`,
        }));

        return {
            statusCode: 400,
            errorCode: ERROR_CODES.VALIDATION_ERROR,
            errors,
        };
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'field';
        return {
            statusCode: 400,
            errorCode: ERROR_CODES.UNIQUE_CONSTRAINT,
            details: { field },
        };
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return {
            statusCode: 400,
            errorCode: ERROR_CODES.FOREIGN_KEY_CONSTRAINT,
        };
    }

    // Sequelize database connection errors
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
        return {
            statusCode: 503,
            errorCode: ERROR_CODES.DATABASE_ERROR,
            message: 'Không thể kết nối đến database. Vui lòng thử lại sau.',
        };
    }

    // Sequelize timeout errors
    if (err.name === 'SequelizeTimeoutError') {
        return {
            statusCode: 504,
            errorCode: ERROR_CODES.DATABASE_ERROR,
            message: 'Database query timeout. Vui lòng thử lại.',
        };
    }

    // Generic Sequelize errors
    if (err.name && err.name.startsWith('Sequelize')) {
        return {
            statusCode: 500,
            errorCode: ERROR_CODES.DATABASE_ERROR,
            message: err.message || 'Database error occurred',
        };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return {
            statusCode: 401,
            errorCode: ERROR_CODES.TOKEN_INVALID,
        };
    }

    if (err.name === 'TokenExpiredError') {
        return {
            statusCode: 401,
            errorCode: ERROR_CODES.TOKEN_EXPIRED,
        };
    }

    // Default error
    return {
        statusCode: err.statusCode || 500,
        errorCode: err.errorCode || ERROR_CODES.INTERNAL_SERVER,
        message: err.message,
    };
};

/**
 * Main error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const errorInfo = getErrorInfo(err);
    const statusCode = errorInfo.statusCode;

    // Log error with context
    const logContext = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id,
        errorCode: errorInfo.errorCode,
        statusCode,
    };

    // Log based on severity
    if (statusCode >= 500) {
        logger.logError(err, logContext);

        // Send to Sentry in production for server errors
        if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
            Sentry.captureException(err, {
                contexts: {
                    request: {
                        method: req.method,
                        url: req.originalUrl,
                        headers: req.headers,
                        query: req.query,
                    },
                    user: req.user ? {
                        id: req.user.id,
                        email: req.user.email,
                    } : undefined,
                },
            });
        }
    } else {
        // Client errors - log as warning
        logger.warn({
            message: err.message,
            ...logContext,
        });
    }

    // Prepare response
    const response = {
        success: false,
        errorCode: errorInfo.errorCode,
    };

    // Add additional fields based on error type
    if (errorInfo.errors) {
        response.errors = errorInfo.errors;
    }

    if (errorInfo.details) {
        response.details = errorInfo.details;
    }

    // Include error message in development, but use error codes in production
    if (process.env.NODE_ENV === 'development') {
        response.message = errorInfo.message || err.message;
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    logger.warn({
        message: 'Resource not found',
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    res.status(404).json({
        success: false,
        errorCode: ERROR_CODES.NOT_FOUND,
        ...(process.env.NODE_ENV === 'development' && {
            message: 'Resource not found',
            path: req.originalUrl,
        }),
    });
};

/**
 * Async error wrapper for route handlers
 * Eliminates need for try-catch in async routes
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    notFound,
    asyncHandler,
    AppError,
    ERROR_CODES,
};
