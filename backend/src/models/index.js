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
// DEFINE ASSOCIATIONS
// =====================================================

// User - CartItem (1:N)
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cart_items' });
CartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product - CartItem (1:N)
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cart_items' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Category - Product (1:N)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User - Order (1:N)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order - OrderDetail (1:N)
Order.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'order_details' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product - OrderDetail (1:N)
Product.hasMany(OrderDetail, { foreignKey: 'product_id', as: 'order_details' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order - Payment (1:1)
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

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
    syncDatabase
};



