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
    const Supplier = require('./Supplier');
    const ProductSupplier = require('./ProductSupplier');
    const WarehouseLog = require('./WarehouseLog');
    const Invoice = require('./Invoice');
    const SocialAuth = require('./SocialAuth');
    const Review = require('./Review');
    const Voucher = require('./Voucher');

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

    // User - Supplier (1:1 optional)
    User.hasOne(Supplier, {
        foreignKey: 'user_id',
        as: 'supplier',
        onDelete: 'SET NULL'
    });
    Supplier.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - WarehouseLog (1:N) - created_by
    User.hasMany(WarehouseLog, {
        foreignKey: 'created_by',
        as: 'warehouse_logs',
        onDelete: 'RESTRICT'
    });
    WarehouseLog.belongsTo(User, {
        foreignKey: 'created_by',
        as: 'creator'
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

    // Product - ProductSupplier (1:N)
    Product.hasMany(ProductSupplier, {
        foreignKey: 'product_id',
        as: 'product_suppliers',
        onDelete: 'CASCADE'
    });
    ProductSupplier.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // Product - WarehouseLog (1:N)
    Product.hasMany(WarehouseLog, {
        foreignKey: 'product_id',
        as: 'warehouse_logs',
        onDelete: 'RESTRICT'
    });
    WarehouseLog.belongsTo(Product, {
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

    // =====================================================
    // 5. SUPPLIER RELATIONSHIPS
    // =====================================================

    // Supplier - ProductSupplier (1:N)
    Supplier.hasMany(ProductSupplier, {
        foreignKey: 'supplier_id',
        as: 'product_suppliers',
        onDelete: 'CASCADE'
    });
    ProductSupplier.belongsTo(Supplier, {
        foreignKey: 'supplier_id',
        as: 'supplier'
    });

    // Supplier - WarehouseLog (1:N)
    Supplier.hasMany(WarehouseLog, {
        foreignKey: 'supplier_id',
        as: 'warehouse_logs',
        onDelete: 'SET NULL'
    });
    WarehouseLog.belongsTo(Supplier, {
        foreignKey: 'supplier_id',
        as: 'supplier'
    });

    // =====================================================
    // 6. MANY-TO-MANY RELATIONSHIPS
    // =====================================================

    // Product - Supplier (Many-to-Many through ProductSupplier)
    Product.belongsToMany(Supplier, {
        through: ProductSupplier,
        foreignKey: 'product_id',
        otherKey: 'supplier_id',
        as: 'suppliers'
    });
    Supplier.belongsToMany(Product, {
        through: ProductSupplier,
        foreignKey: 'supplier_id',
        otherKey: 'product_id',
        as: 'products'
    });

    console.log('✓ Tất cả quan hệ Sequelize đã được thiết lập thành công');
};

module.exports = { setupAssociations };
