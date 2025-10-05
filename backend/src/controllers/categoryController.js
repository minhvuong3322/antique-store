const { Category, Product } = require('../models');

/**
 * Get all categories
 * GET /api/v1/categories
 */
const getAllCategories = async (req, res, next) => {
    try {
        const { include_children = 'true' } = req.query;

        const categories = await Category.findAll({
            where: { parent_id: null }, // Get only root categories
            include: include_children === 'true' ? [
                {
                    model: Category,
                    as: 'children',
                    attributes: ['id', 'name', 'slug', 'description', 'image']
                }
            ] : [],
            order: [['created_at', 'ASC']]
        });

        res.json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get category by ID or slug with products
 * GET /api/v1/categories/:identifier
 */
const getCategoryById = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Check if identifier is numeric (ID) or slug
        const isNumeric = /^\d+$/.test(identifier);
        const where = isNumeric ? { id: identifier } : { slug: identifier };

        const category = await Category.findOne({
            where,
            include: [
                {
                    model: Category,
                    as: 'children',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Category,
                    as: 'parent',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Get products in this category with pagination
        const offset = (page - 1) * limit;
        const { count, rows: products } = await Product.findAndCountAll({
            where: {
                category_id: category.id,
                is_active: true
            },
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                category,
                products,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total_pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new category (Admin only)
 * POST /api/v1/categories
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description, image, parent_id } = req.body;

        // Validate parent category if provided
        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục cha không tồn tại'
                });
            }
        }

        const category = await Category.create({
            name,
            description,
            image,
            parent_id
        });

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update category (Admin only)
 * PUT /api/v1/categories/:id
 */
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, image, parent_id } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Prevent circular reference
        if (parent_id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: 'Danh mục không thể là cha của chính nó'
            });
        }

        // Validate parent category if changing
        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục cha không tồn tại'
                });
            }
        }

        await category.update({
            name: name || category.name,
            description: description !== undefined ? description : category.description,
            image: image !== undefined ? image : category.image,
            parent_id: parent_id !== undefined ? parent_id : category.parent_id
        });

        res.json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete category (Admin only)
 * DELETE /api/v1/categories/:id
 */
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Check if category has products
        const productCount = await Product.count({
            where: { category_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa danh mục vì có ${productCount} sản phẩm`
            });
        }

        // Check if category has children
        const childrenCount = await Category.count({
            where: { parent_id: id }
        });

        if (childrenCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa danh mục có danh mục con'
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};



