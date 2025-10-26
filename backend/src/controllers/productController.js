const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/app');

/**
 * Get all products with pagination, search, filter
 * GET /api/v1/products
 */
// const getAllProducts = async (req, res, next) => {
//     try {
//         const {
//             page = 1,
//             limit = config.pagination.default_limit,
//             search = '',
//             category_id,
//             condition,
//             min_price,
//             max_price,
//             is_featured,
//             sort_by = 'created_at',
//             order = 'DESC'
//         } = req.query;

//         // Build where clause
//         const where = { is_active: true };

//         if (search) {
//             where[Op.or] = [
//                 { name: { [Op.like]: `%${search}%` } },
//                 { description: { [Op.like]: `%${search}%` } }
//             ];
//         }

//         if (category_id) where.category_id = category_id;
//         if (condition) where.condition = condition;
//         if (is_featured !== undefined) where.is_featured = is_featured === 'true';

//         if (min_price || max_price) {
//             where.price = {};
//             if (min_price) where.price[Op.gte] = min_price;
//             if (max_price) where.price[Op.lte] = max_price;
//         }

//         // Calculate pagination
//         const offset = (page - 1) * limit;
//         const parsedLimit = Math.min(parseInt(limit), config.pagination.max_limit);

//         // Fetch products
//         const { count, rows: products } = await Product.findAndCountAll({
//             where,
//             include: [
//                 {
//                     model: Category,
//                     as: 'category',
//                     attributes: ['id', 'name', 'slug']
//                 }
//             ],
//             limit: parsedLimit,
//             offset,
//             order: [[sort_by, order.toUpperCase()]],
//             distinct: true
//         });

//         res.json({
//             success: true,
//             data: {
//                 products,
//                 pagination: {
//                     total: count,
//                     page: parseInt(page),
//                     limit: parsedLimit,
//                     total_pages: Math.ceil(count / parsedLimit)
//                 }
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const getAllProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = config.pagination.default_limit,
            search = '',
            category_id,
            condition,
            min_price,
            max_price,
            sort_by = 'created_at',
            order = 'DESC'
        } = req.query;

        // Chỉ lọc sản phẩm đang hoạt động
        const where = { is_active: true };

        // Tìm kiếm theo tên hoặc mô tả
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Lọc theo danh mục, tình trạng, giá
        if (category_id) where.category_id = category_id;
        if (condition) where.condition = condition;

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = min_price;
            if (max_price) where.price[Op.lte] = max_price;
        }

        // Tính phân trang
        const parsedLimit = Math.min(parseInt(limit), config.pagination.max_limit);
        const offset = (page - 1) * parsedLimit;

        // Truy vấn sản phẩm
        const { count, rows: products } = await Product.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit: parsedLimit,
            offset,
            order: [[sort_by, order.toUpperCase()]],
            distinct: true
        });

        // Trả kết quả
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parsedLimit,
                    total_pages: Math.ceil(count / parsedLimit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Get product by ID or slug
 * GET /api/v1/products/:identifier
 */
const getProductById = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        // Check if identifier is numeric (ID) or slug
        const isNumeric = /^\d+$/.test(identifier);
        const where = isNumeric ? { id: identifier } : { slug: identifier };

        const product = await Product.findOne({
            where: { ...where, is_active: true },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Increment view count
        await product.increment('view_count');

        res.json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product (Admin only)
 * POST /api/v1/products
 */
const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;

        // Clean SKU - empty string should be null for unique constraint
        if (productData.sku === '' || productData.sku === undefined) {
            productData.sku = null;
        }

        // Convert empty strings to null for numeric fields
        // This prevents database errors when trying to insert '' into numeric columns
        if (productData.sale_price === '') {
            productData.sale_price = null;
        }
        if (productData.weight === '') {
            productData.weight = null;
        }
        if (productData.year_manufactured === '') {
            productData.year_manufactured = null;
        }

        // Validate category exists
        const category = await Category.findByPk(productData.category_id);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Danh mục không tồn tại'
            });
        }

        const product = await category.createProduct(productData);

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product (Admin only)
 * PUT /api/v1/products/:id
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Clean SKU - empty string should be null for unique constraint
        if (updateData.sku === '' || updateData.sku === undefined) {
            updateData.sku = null;
        }

        // Convert empty strings to null for numeric fields
        // This prevents database errors when trying to insert '' into numeric columns
        if (updateData.sale_price === '') {
            updateData.sale_price = null;
        }
        if (updateData.weight === '') {
            updateData.weight = null;
        }
        if (updateData.year_manufactured === '') {
            updateData.year_manufactured = null;
        }

        // Validate category if changing
        if (updateData.category_id) {
            const category = await Category.findByPk(updateData.category_id);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục không tồn tại'
                });
            }
        }

        await product.update(updateData);

        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (Admin only - soft delete)
 * DELETE /api/v1/products/:id
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Soft delete by setting is_active to false
        await product.update({ is_active: false });

        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured products
 * GET /api/v1/products/featured
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const { limit = 8 } = req.query;

        const products = await Product.findAll({
            where: {
                is_featured: true,
                is_active: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts
};



