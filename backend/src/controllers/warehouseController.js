const { WarehouseLog, Product, Supplier, User, sequelize } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * @desc    Get all warehouse logs
 * @route   GET /api/warehouse/logs
 * @access  Private/Admin
 */
exports.getAllLogs = async (req, res, next) => {
    try {
        const { type, product_id, supplier_id, page = 1, limit = 20 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (type) where.type = type;
        if (product_id) where.product_id = product_id;
        if (supplier_id) where.supplier_id = supplier_id;

        const { count, rows: logs } = await WarehouseLog.findAndCountAll({
            where,
            include: [
                {
                    association: 'product',
                    attributes: ['id', 'name', 'sku', 'stock_quantity']
                },
                {
                    association: 'supplier',
                    attributes: ['id', 'company_name']
                },
                {
                    association: 'creator',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: parseInt(page),
            data: logs
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getAllLogs',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get warehouse log by ID
 * @route   GET /api/warehouse/logs/:id
 * @access  Private/Admin
 */
exports.getLogById = async (req, res, next) => {
    try {
        const log = await WarehouseLog.findByPk(req.params.id, {
            include: [
                {
                    association: 'product',
                    attributes: ['id', 'name', 'sku', 'stock_quantity', 'price']
                },
                {
                    association: 'supplier',
                    attributes: ['id', 'company_name', 'email', 'phone']
                },
                {
                    association: 'creator',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy log kho'
            });
        }

        res.status(200).json({
            success: true,
            data: log
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getLogById',
            log_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Import products to warehouse
 * @route   POST /api/warehouse/import
 * @access  Private/Admin
 */
exports.importProducts = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { product_id, supplier_id, quantity, unit_price, notes } = req.body;

        // Validate input
        if (quantity <= 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Số lượng phải lớn hơn 0'
            });
        }

        // Get product
        const product = await Product.findByPk(product_id, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Validate supplier
        if (supplier_id) {
            const supplier = await Supplier.findByPk(supplier_id, { transaction });
            if (!supplier) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhà cung cấp'
                });
            }
        }

        const quantity_before = product.stock_quantity;
        const quantity_after = quantity_before + quantity;
        const total_amount = unit_price ? quantity * unit_price : null;

        // Create warehouse log
        const log = await WarehouseLog.create({
            product_id,
            supplier_id,
            type: 'import',
            quantity,
            quantity_before,
            quantity_after,
            unit_price,
            total_amount,
            reference_type: 'purchase',
            notes,
            created_by: req.user.id
        }, { transaction });

        // Update product stock
        product.stock_quantity = quantity_after;
        await product.save({ transaction });

        await transaction.commit();

        logger.info(`Imported ${quantity} units of product ${product_id} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: `Nhập kho thành công ${quantity} sản phẩm`,
            data: log
        });
    } catch (error) {
        await transaction.rollback();
        logger.logError(error, {
            operation: 'importProducts',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Export products from warehouse
 * @route   POST /api/warehouse/export
 * @access  Private/Admin
 */
exports.exportProducts = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { product_id, quantity, unit_price, reference_type, reference_id, notes } = req.body;

        // Validate input
        if (quantity <= 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Số lượng phải lớn hơn 0'
            });
        }

        // Get product
        const product = await Product.findByPk(product_id, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Check stock
        if (product.stock_quantity < quantity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Không đủ hàng trong kho. Tồn kho hiện tại: ${product.stock_quantity}`
            });
        }

        const quantity_before = product.stock_quantity;
        const quantity_after = quantity_before - quantity;
        const total_amount = unit_price ? quantity * unit_price : null;

        // Create warehouse log
        const log = await WarehouseLog.create({
            product_id,
            supplier_id: null,
            type: 'export',
            quantity: -quantity, // Negative for export
            quantity_before,
            quantity_after,
            unit_price,
            total_amount,
            reference_type,
            reference_id,
            notes,
            created_by: req.user.id
        }, { transaction });

        // Update product stock
        product.stock_quantity = quantity_after;
        await product.save({ transaction });

        await transaction.commit();

        logger.info(`Exported ${quantity} units of product ${product_id} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: `Xuất kho thành công ${quantity} sản phẩm`,
            data: log
        });
    } catch (error) {
        await transaction.rollback();
        logger.logError(error, {
            operation: 'exportProducts',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Adjust warehouse stock (manual adjustment)
 * @route   POST /api/warehouse/adjust
 * @access  Private/Admin
 */
exports.adjustStock = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { product_id, new_quantity, notes } = req.body;

        // Validate input
        if (new_quantity < 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Số lượng không thể âm'
            });
        }

        // Get product
        const product = await Product.findByPk(product_id, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const quantity_before = product.stock_quantity;
        const quantity_after = new_quantity;
        const adjustment = quantity_after - quantity_before;

        // Create warehouse log
        const log = await WarehouseLog.create({
            product_id,
            supplier_id: null,
            type: 'adjustment',
            quantity: adjustment,
            quantity_before,
            quantity_after,
            unit_price: null,
            total_amount: null,
            reference_type: 'manual',
            notes: notes || 'Điều chỉnh tồn kho thủ công',
            created_by: req.user.id
        }, { transaction });

        // Update product stock
        product.stock_quantity = quantity_after;
        await product.save({ transaction });

        await transaction.commit();

        logger.info(`Stock adjusted for product ${product_id}: ${quantity_before} → ${quantity_after} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Điều chỉnh tồn kho thành công',
            data: log
        });
    } catch (error) {
        await transaction.rollback();
        logger.logError(error, {
            operation: 'adjustStock',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Get inventory summary for a product
 * @route   GET /api/warehouse/inventory/:productId
 * @access  Private/Admin
 */
exports.getProductInventory = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productId, {
            attributes: ['id', 'name', 'sku', 'stock_quantity', 'price']
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const summary = await WarehouseLog.getInventorySummary(req.params.productId);

        res.status(200).json({
            success: true,
            data: {
                product,
                inventory_summary: summary
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getProductInventory',
            product_id: req.params.productId,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get low stock products
 * @route   GET /api/warehouse/low-stock
 * @access  Private/Admin
 */
exports.getLowStockProducts = async (req, res, next) => {
    try {
        const { threshold = 10 } = req.query;

        const products = await Product.findAll({
            where: {
                stock_quantity: { [Op.lte]: parseInt(threshold) },
                is_active: true
            },
            attributes: ['id', 'name', 'sku', 'stock_quantity', 'price'],
            order: [['stock_quantity', 'ASC']],
            limit: 50
        });

        res.status(200).json({
            success: true,
            threshold: parseInt(threshold),
            count: products.length,
            data: products
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getLowStockProducts',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get warehouse statistics
 * @route   GET /api/warehouse/statistics
 * @access  Private/Admin
 */
exports.getWarehouseStatistics = async (req, res, next) => {
    try {
        // Total products
        const totalProducts = await Product.count({ where: { is_active: true } });

        // Total stock value (approximate)
        const products = await Product.findAll({
            where: { is_active: true },
            attributes: ['stock_quantity', 'price']
        });

        const totalStockValue = products.reduce((sum, p) => {
            return sum + (p.stock_quantity * parseFloat(p.price));
        }, 0);

        // Low stock count (threshold = 10)
        const lowStockCount = await Product.count({
            where: {
                stock_quantity: { [Op.lte]: 10 },
                is_active: true
            }
        });

        // Out of stock count
        const outOfStockCount = await Product.count({
            where: {
                stock_quantity: 0,
                is_active: true
            }
        });

        // Recent logs (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentImports = await WarehouseLog.count({
            where: {
                type: 'import',
                created_at: { [Op.gte]: sevenDaysAgo }
            }
        });

        const recentExports = await WarehouseLog.count({
            where: {
                type: 'export',
                created_at: { [Op.gte]: sevenDaysAgo }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                total_products: totalProducts,
                total_stock_value: totalStockValue,
                low_stock_count: lowStockCount,
                out_of_stock_count: outOfStockCount,
                recent_imports: recentImports,
                recent_exports: recentExports
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getWarehouseStatistics',
            user: req.user?.id
        });
        next(error);
    }
};

