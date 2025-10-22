const { sequelize } = require('../config/database');
const logger = require('../utils/logger');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Payment = require('./Payment');
const Otp = require('./Otp');

// =====================================================
// NEW MODELS - Extended Features
// =====================================================
const Supplier = require('./Supplier');
const ProductSupplier = require('./ProductSupplier');
const WarehouseLog = require('./WarehouseLog');
const Invoice = require('./Invoice');
const SocialAuth = require('./SocialAuth');
const Review = require('./Review');
const Voucher = require('./Voucher');

// =====================================================
// SETUP ASSOCIATIONS
// =====================================================
const { setupAssociations } = require('./associations');

// Thiết lập tất cả quan hệ giữa các model
setupAssociations();

// =====================================================
// SYNC DATABASE (Development only)
// =====================================================
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.sync(options);
        logger.info('Database synchronized successfully');
    } catch (error) {
        logger.logError(error, { operation: 'syncDatabase' });
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    Category,
    Product,
    CartItem,
    Order,
    OrderDetail,
    Payment,
    Otp,
    // New models
    Supplier,
    ProductSupplier,
    WarehouseLog,
    Invoice,
    SocialAuth,
    Review,
    Voucher,
    syncDatabase
};



