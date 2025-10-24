const { Supplier, Product, ProductSupplier, User } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private/Admin
 */
exports.getAllSuppliers = async (req, res, next) => {
    try {
        const { is_active, search, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (is_active !== undefined) {
            where.is_active = is_active === 'true';
        }

        if (search) {
            where[Op.or] = [
                { company_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { contact_person: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: suppliers } = await Supplier.findAndCountAll({
            where,
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'email', 'role', 'is_active']
                }
            ],
            order: [['company_name', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: parseInt(page),
            data: suppliers
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getAllSuppliers',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Private/Admin or Owner
 */
exports.getSupplierById = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id, {
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'email', 'full_name', 'phone', 'role']
                },
                {
                    association: 'products',
                    through: { attributes: ['supply_price', 'is_primary'] },
                    attributes: ['id', 'name', 'sku', 'price', 'stock_quantity']
                }
            ]
        });

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && supplier.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin này'
            });
        }

        res.status(200).json({
            success: true,
            data: supplier
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getSupplierById',
            supplier_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Create new supplier
 * @route   POST /api/suppliers
 * @access  Private/Admin
 */
exports.createSupplier = async (req, res, next) => {
    try {
        const {
            user_id,
            company_name,
            contact_person,
            email,
            phone,
            address,
            tax_code,
            description
        } = req.body;

        // Check if email already exists
        const existingSupplier = await Supplier.findByEmail(email);
        if (existingSupplier) {
            return res.status(400).json({
                success: false,
                message: 'Email nhà cung cấp đã tồn tại'
            });
        }

        // If user_id provided, check if user exists and has supplier role
        if (user_id) {
            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            if (user.role !== 'supplier') {
                return res.status(400).json({
                    success: false,
                    message: 'Người dùng phải có role = supplier'
                });
            }
        }

        const supplier = await Supplier.create({
            user_id,
            company_name,
            contact_person,
            email,
            phone,
            address,
            tax_code,
            description
        });

        logger.info(`Supplier created: ${company_name} (ID: ${supplier.id}) by admin ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Tạo nhà cung cấp thành công',
            data: supplier
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'createSupplier',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Update supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private/Admin or Owner
 */
exports.updateSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && supplier.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật thông tin này'
            });
        }

        const {
            company_name,
            contact_person,
            email,
            phone,
            address,
            tax_code,
            description,
            is_active
        } = req.body;

        // Check if email is being changed and already exists
        if (email && email !== supplier.email) {
            const existingSupplier = await Supplier.findByEmail(email);
            if (existingSupplier) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng bởi nhà cung cấp khác'
                });
            }
        }

        // Update fields
        if (company_name) supplier.company_name = company_name;
        if (contact_person) supplier.contact_person = contact_person;
        if (email) supplier.email = email;
        if (phone) supplier.phone = phone;
        if (address !== undefined) supplier.address = address;
        if (tax_code !== undefined) supplier.tax_code = tax_code;
        if (description !== undefined) supplier.description = description;

        // Only admin can change is_active
        if (req.user.role === 'admin' && is_active !== undefined) {
            supplier.is_active = is_active;
        }

        await supplier.save();

        logger.info(`Supplier updated: ${supplier.company_name} (ID: ${supplier.id}) by user ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Cập nhật nhà cung cấp thành công',
            data: supplier
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'updateSupplier',
            supplier_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Delete supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private/Admin
 */
exports.deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        // Check if supplier has products
        const productCount = await ProductSupplier.count({
            where: { supplier_id: supplier.id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa nhà cung cấp có ${productCount} sản phẩm. Vui lòng xóa hoặc chuyển sản phẩm trước.`
            });
        }

        await supplier.destroy();

        logger.info(`Supplier deleted: ${supplier.company_name} (ID: ${supplier.id}) by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Xóa nhà cung cấp thành công'
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'deleteSupplier',
            supplier_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Add product to supplier
 * @route   POST /api/suppliers/:id/products
 * @access  Private/Admin
 */
exports.addProductToSupplier = async (req, res, next) => {
    try {
        const { product_id, supply_price, is_primary = false } = req.body;

        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Check if relationship already exists
        const existing = await ProductSupplier.findOne({
            where: {
                product_id,
                supplier_id: req.params.id
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Sản phẩm đã được liên kết với nhà cung cấp này'
            });
        }

        const productSupplier = await supplier.createProductSupplier({
            product_id,
            supply_price,
            is_primary
        });

        logger.info(`Product ${product_id} added to supplier ${req.params.id} by admin ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm vào nhà cung cấp thành công',
            data: productSupplier
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'addProductToSupplier',
            supplier_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Remove product from supplier
 * @route   DELETE /api/suppliers/:id/products/:productId
 * @access  Private/Admin
 */
exports.removeProductFromSupplier = async (req, res, next) => {
    try {
        const { id: supplierId, productId } = req.params;

        const productSupplier = await ProductSupplier.findOne({
            where: {
                product_id: productId,
                supplier_id: supplierId
            }
        });

        if (!productSupplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy quan hệ sản phẩm - nhà cung cấp'
            });
        }

        await productSupplier.destroy();

        logger.info(`Product ${productId} removed from supplier ${supplierId} by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm khỏi nhà cung cấp thành công'
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'removeProductFromSupplier',
            supplier_id: req.params.id,
            product_id: req.params.productId,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get supplier's products
 * @route   GET /api/suppliers/:id/products
 * @access  Private/Admin or Owner
 */
exports.getSupplierProducts = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && supplier.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin này'
            });
        }

        const productSuppliers = await ProductSupplier.findAll({
            where: { supplier_id: req.params.id },
            include: [
                {
                    association: 'product',
                    attributes: ['id', 'name', 'sku', 'price', 'stock_quantity', 'images', 'is_active']
                }
            ],
            order: [['is_primary', 'DESC'], ['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: productSuppliers.length,
            data: productSuppliers
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getSupplierProducts',
            supplier_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

