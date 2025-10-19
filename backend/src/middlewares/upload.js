const multer = require('multer');
const path = require('path');
const config = require('../config/app');

// Cloudinary storage (if configured)
let cloudinaryConfig = null;
try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinaryConfig = require('../config/cloudinary');
    }
} catch (error) {
    // Cloudinary not configured, will use local storage
}

// Configure storage - Use Cloudinary if available, otherwise local
const storage = cloudinaryConfig?.productStorage || multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.upload_dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Avatar storage - Use Cloudinary if available
const avatarStorageConfig = cloudinaryConfig?.avatarStorage || multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.upload_dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    if (config.upload.allowed_types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'), false);
    }
};

// Create multer instances
const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.max_file_size
    },
    fileFilter: imageFilter
});

const avatarUpload = multer({
    storage: avatarStorageConfig,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB for avatars
    },
    fileFilter: imageFilter
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa là 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    next();
};

/**
 * Helper to get image URL from uploaded file
 * Works with both Cloudinary and local storage
 */
const getImageUrl = (file) => {
    if (!file) return null;

    // Cloudinary file
    if (file.path && file.path.includes('cloudinary')) {
        return file.path; // Cloudinary returns full URL in file.path
    }

    // Local file
    return `/uploads/${file.filename}`;
};

/**
 * Helper to extract public_id from Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;

    try {
        // Extract public_id from Cloudinary URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
        const parts = url.split('/upload/');
        if (parts.length > 1) {
            const pathParts = parts[1].split('/');
            // Remove version (v1234) if exists
            const startIndex = pathParts[0].startsWith('v') ? 1 : 0;
            const publicId = pathParts.slice(startIndex).join('/').replace(/\.[^.]+$/, '');
            return publicId;
        }
    } catch (error) {
        return null;
    }

    return null;
};

module.exports = {
    upload,
    avatarUpload,
    handleMulterError,
    getImageUrl,
    getPublicIdFromUrl,
    isCloudinaryConfigured: !!cloudinaryConfig
};



