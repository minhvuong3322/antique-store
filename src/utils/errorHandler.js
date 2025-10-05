/**
 * Frontend Error Handler Utility
 * Handles API error responses and provides localized error messages
 */
import i18n from '../i18n';

/**
 * Get localized error message from error response
 * @param {Object} error - Axios error object
 * @returns {string} Localized error message
 */
export const getErrorMessage = (error) => {
    // Handle network errors
    if (!error.response) {
        return i18n.t('error.server.internal');
    }

    const { data } = error.response;
    const errorCode = data?.errorCode;

    if (!errorCode) {
        return i18n.t('error.server.internal');
    }

    // Handle validation errors with field details
    if (data.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((err) => {
            const translationKey = err.errorCode || 'error.validation.field';
            return i18n.t(translationKey, {
                field: err.field,
                defaultValue: err.message || 'Validation error',
            });
        });
        return messages.join('. ');
    }

    // Handle unique constraint with field details
    if (data.details?.field) {
        return i18n.t(errorCode, {
            field: data.details.field,
            defaultValue: errorCode,
        });
    }

    // Translate error code
    return i18n.t(errorCode, {
        defaultValue: i18n.t('error.server.internal'),
    });
};

/**
 * Check if error is an authentication error
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
    const errorCode = error.response?.data?.errorCode;
    return errorCode?.startsWith('error.auth.token');
};

/**
 * Check if error is a validation error
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
    const errorCode = error.response?.data?.errorCode;
    return errorCode?.startsWith('error.validation');
};

/**
 * Get validation field errors as an object
 * Useful for displaying inline form errors
 * @param {Object} error - Axios error object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const getValidationErrors = (error) => {
    const fieldErrors = {};
    const data = error.response?.data;

    if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err) => {
            const translationKey = err.errorCode || 'error.validation.field';
            fieldErrors[err.field] = i18n.t(translationKey, {
                field: err.field,
                defaultValue: err.message || 'Validation error',
            });
        });
    }

    return fieldErrors;
};

/**
 * Handle API error with optional callback for notifications
 * @param {Object} error - Axios error object
 * @param {Function} [showNotification] - Optional notification function (e.g., toast)
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.redirectOnAuth=true] - Whether to redirect on auth errors
 * @param {string} [options.loginPath='/login'] - Login page path for redirect
 * @returns {string} Error message
 */
export const handleApiError = (error, showNotification, options = {}) => {
    const {
        redirectOnAuth = true,
        loginPath = '/login',
    } = options;

    const message = getErrorMessage(error);

    // Show notification if provided
    if (showNotification && typeof showNotification === 'function') {
        showNotification(message, 'error');
    }

    // Handle authentication errors
    if (redirectOnAuth && isAuthError(error)) {
        // Clear token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = loginPath;
        }, 1500);
    }

    return message;
};

/**
 * Create a custom error handler for specific error types
 * @param {Object} handlers - Object with error code patterns as keys and handler functions as values
 * @returns {Function} Error handler function
 * 
 * @example
 * const myErrorHandler = createErrorHandler({
 *   'error.auth': (error) => console.log('Auth error:', error),
 *   'error.validation': (error) => console.log('Validation error:', error),
 *   'default': (error) => console.log('Other error:', error)
 * });
 * myErrorHandler(error);
 */
export const createErrorHandler = (handlers) => {
    return (error) => {
        const errorCode = error.response?.data?.errorCode || '';

        // Find matching handler
        for (const [pattern, handler] of Object.entries(handlers)) {
            if (pattern === 'default') continue;
            if (errorCode.startsWith(pattern)) {
                return handler(error);
            }
        }

        // Use default handler if provided
        if (handlers.default) {
            return handlers.default(error);
        }

        // Fallback
        return getErrorMessage(error);
    };
};

/**
 * Log error to console in development mode
 * @param {string} context - Context where error occurred
 * @param {Object} error - Error object
 */
export const logError = (context, error) => {
    if (import.meta.env.DEV) {
        console.error(`[${context}]`, {
            message: error.message,
            response: error.response?.data,
            stack: error.stack,
        });
    }
};

export default {
    getErrorMessage,
    isAuthError,
    isValidationError,
    getValidationErrors,
    handleApiError,
    createErrorHandler,
    logError,
};

