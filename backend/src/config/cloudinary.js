/**
 * Cloudinary Configuration
 * Cloud storage for images and files
 */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Cloudinary Storage for Products
 */
const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'antique-store/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
        ],
        public_id: (req, file) => {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `product-${uniqueSuffix}`;
        }
    }
});

/**
 * Cloudinary Storage for Avatars
 */
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'antique-store/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
        ],
        public_id: (req, file) => {
            // Use user ID if available
            const userId = req.user?.id || Date.now();
            return `avatar-${userId}`;
        }
    }
});

/**
 * Cloudinary Storage for Invoices (PDF)
 */
const invoiceStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'antique-store/invoices',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
        public_id: (req, file) => {
            const uniqueSuffix = Date.now();
            return `invoice-${uniqueSuffix}`;
        }
    }
});

/**
 * Delete file from Cloudinary
 */
const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info({ message: 'File deleted from Cloudinary', publicId, result });
        return result;
    } catch (error) {
        logger.logError(error, { operation: 'deleteCloudinaryFile', publicId });
        throw error;
    }
};

/**
 * Delete multiple files from Cloudinary
 */
const deleteFiles = async (publicIds) => {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        logger.info({ message: 'Files deleted from Cloudinary', count: publicIds.length });
        return result;
    } catch (error) {
        logger.logError(error, { operation: 'deleteCloudinaryFiles', count: publicIds.length });
        throw error;
    }
};

/**
 * Get file info from Cloudinary
 */
const getFileInfo = async (publicId) => {
    try {
        const result = await cloudinary.api.resource(publicId);
        return result;
    } catch (error) {
        logger.logError(error, { operation: 'getCloudinaryFileInfo', publicId });
        throw error;
    }
};

/**
 * Verify Cloudinary configuration
 */
const verifyConfig = async () => {
    try {
        await cloudinary.api.ping();
        logger.info('Cloudinary configuration verified successfully');
        return true;
    } catch (error) {
        logger.error('Cloudinary configuration verification failed:', error.message);
        return false;
    }
};

module.exports = {
    cloudinary,
    productStorage,
    avatarStorage,
    invoiceStorage,
    deleteFile,
    deleteFiles,
    getFileInfo,
    verifyConfig
};


