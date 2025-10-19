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
const Warranty = require('./Warranty');
const Invoice = require('./Invoice');
const SocialAuth = require('./SocialAuth');

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
// NEW ASSOCIATIONS - Extended Features
// =====================================================

// User - Supplier (1:1 optional)
User.hasOne(Supplier, { foreignKey: 'user_id', as: 'supplier' });
Supplier.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product - ProductSupplier - Supplier (Many-to-Many)
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

// Direct associations for easier access
Product.hasMany(ProductSupplier, { foreignKey: 'product_id', as: 'product_suppliers' });
ProductSupplier.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Supplier.hasMany(ProductSupplier, { foreignKey: 'supplier_id', as: 'product_suppliers' });
ProductSupplier.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// Product - WarehouseLog (1:N)
Product.hasMany(WarehouseLog, { foreignKey: 'product_id', as: 'warehouse_logs' });
WarehouseLog.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Supplier - WarehouseLog (1:N)
Supplier.hasMany(WarehouseLog, { foreignKey: 'supplier_id', as: 'warehouse_logs' });
WarehouseLog.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// User - WarehouseLog (1:N) - created_by
User.hasMany(WarehouseLog, { foreignKey: 'created_by', as: 'warehouse_logs' });
WarehouseLog.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Order - Warranty (1:N)
Order.hasMany(Warranty, { foreignKey: 'order_id', as: 'warranties' });
Warranty.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product - Warranty (1:N)
Product.hasMany(Warranty, { foreignKey: 'product_id', as: 'warranties' });
Warranty.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order - Invoice (1:1)
Order.hasOne(Invoice, { foreignKey: 'order_id', as: 'invoice' });
Invoice.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// User - Invoice (1:N) - created_by
User.hasMany(Invoice, { foreignKey: 'created_by', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User - SocialAuth (1:N) - OAuth providers
User.hasMany(SocialAuth, { foreignKey: 'user_id', as: 'social_auths' });
SocialAuth.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

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
    Warranty,
    Invoice,
    SocialAuth,
    syncDatabase
};



