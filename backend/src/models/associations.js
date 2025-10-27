/**
 * =====================================================
 * SEQUELIZE MODEL ASSOCIATIONS
 * =====================================================
 * File này quản lý tất cả các quan hệ giữa các model trong hệ thống
 * Tự động cập nhật từ analysis các foreign keys
 */

const setupAssociations = () => {
    // Import tất cả các models
    const User = require('./User');
    const Category = require('./Category');
    const Product = require('./Product');
    const CartItem = require('./CartItem');
    const Order = require('./Order');
    const OrderDetail = require('./OrderDetail');
    const Payment = require('./Payment');
    const Otp = require('./Otp');
    const Invoice = require('./Invoice');
    const SocialAuth = require('./SocialAuth');
    const Review = require('./Review');
    const Voucher = require('./Voucher');
    const Wishlist = require('./Wishlist');
    const SupportMessage = require('./SupportMessage');

    // =====================================================
    // 1. USER RELATIONSHIPS
    // =====================================================

    // User - CartItem (1:N)
    User.hasMany(CartItem, {
        foreignKey: 'user_id',
        as: 'cart_items',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Order (1:N)
    User.hasMany(Order, {
        foreignKey: 'user_id',
        as: 'orders',
        onDelete: 'CASCADE'
    });
    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Invoice (1:N) - created_by
    User.hasMany(Invoice, {
        foreignKey: 'created_by',
        as: 'invoices',
        onDelete: 'RESTRICT'
    });
    Invoice.belongsTo(User, {
        foreignKey: 'created_by',
        as: 'creator'
    });

    // User - SocialAuth (1:N)
    User.hasMany(SocialAuth, {
        foreignKey: 'user_id',
        as: 'social_auths',
        onDelete: 'CASCADE'
    });
    SocialAuth.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Review (1:N)
    User.hasMany(Review, {
        foreignKey: 'user_id',
        as: 'reviews',
        onDelete: 'CASCADE'
    });
    Review.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Wishlist (1:N)
    User.hasMany(Wishlist, {
        foreignKey: 'user_id',
        as: 'wishlists',
        onDelete: 'CASCADE'
    });
    Wishlist.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - SupportMessage (1:N) - as submitter
    User.hasMany(SupportMessage, {
        foreignKey: 'user_id',
        as: 'support_messages',
        onDelete: 'SET NULL'
    });
    SupportMessage.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - SupportMessage (1:N) - as responder
    User.hasMany(SupportMessage, {
        foreignKey: 'responded_by',
        as: 'responded_messages',
        onDelete: 'SET NULL'
    });
    SupportMessage.belongsTo(User, {
        foreignKey: 'responded_by',
        as: 'responder'
    });

    // =====================================================
    // 2. CATEGORY RELATIONSHIPS
    // =====================================================

    // Category - Category (Self-referencing: parent-child)
    // Đã được định nghĩa trong Category.js

    // Category - Product (1:N)
    Category.hasMany(Product, {
        foreignKey: 'category_id',
        as: 'products',
        onDelete: 'RESTRICT'
    });
    Product.belongsTo(Category, {
        foreignKey: 'category_id',
        as: 'category'
    });

    // =====================================================
    // 3. PRODUCT RELATIONSHIPS
    // =====================================================

    // Product - CartItem (1:N)
    Product.hasMany(CartItem, {
        foreignKey: 'product_id',
        as: 'cart_items',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // Product - OrderDetail (1:N)
    Product.hasMany(OrderDetail, {
        foreignKey: 'product_id',
        as: 'order_details',
        onDelete: 'RESTRICT'
    });
    OrderDetail.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // Product - Review (1:N)
    Product.hasMany(Review, {
        foreignKey: 'product_id',
        as: 'reviews',
        onDelete: 'CASCADE'
    });
    Review.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // Product - Wishlist (1:N)
    Product.hasMany(Wishlist, {
        foreignKey: 'product_id',
        as: 'wishlists',
        onDelete: 'CASCADE'
    });
    Wishlist.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // =====================================================
    // 4. ORDER RELATIONSHIPS
    // =====================================================

    // Order - OrderDetail (1:N)
    Order.hasMany(OrderDetail, {
        foreignKey: 'order_id',
        as: 'order_details',
        onDelete: 'CASCADE'
    });
    OrderDetail.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    // Order - Payment (1:1)
    Order.hasOne(Payment, {
        foreignKey: 'order_id',
        as: 'payment',
        onDelete: 'CASCADE'
    });
    Payment.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    // Order - Invoice (1:1)
    Order.hasOne(Invoice, {
        foreignKey: 'order_id',
        as: 'invoice',
        onDelete: 'CASCADE'
    });
    Invoice.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    // Order - Review (1:N) - Optional relationship for verified purchase
    Order.hasMany(Review, {
        foreignKey: 'order_id',
        as: 'reviews',
        onDelete: 'SET NULL'
    });
    Review.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    console.log('✓ Tất cả quan hệ Sequelize đã được thiết lập thành công');
};

module.exports = { setupAssociations };
