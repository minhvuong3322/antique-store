const { Wishlist, Product } = require('../models');

/**
 * Get user's wishlist
 * GET /api/v1/wishlist
 */
const getWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        const wishlistItems = await Wishlist.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    where: { is_active: true },
                    required: false
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                wishlist: wishlistItems.map(item => item.product).filter(p => p !== null)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add product to wishlist (or toggle if already exists)
 * POST /api/v1/wishlist/:productId
 */
const addToWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Check if already in wishlist
        const existingItem = await Wishlist.findOne({
            where: { user_id, product_id: productId }
        });

        if (existingItem) {
            // Toggle: Remove if already exists
            await existingItem.destroy();
            return res.status(200).json({
                success: true,
                message: 'Đã xóa khỏi danh sách yêu thích',
                action: 'removed'
            });
        }

        // Add to wishlist
        await Wishlist.create({
            user_id,
            product_id: productId
        });

        res.status(201).json({
            success: true,
            message: 'Đã thêm vào danh sách yêu thích',
            action: 'added'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove product from wishlist
 * DELETE /api/v1/wishlist/:productId
 */
const removeFromWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { productId } = req.params;

        const deleted = await Wishlist.destroy({
            where: { user_id, product_id: productId }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không có trong danh sách yêu thích'
            });
        }

        res.json({
            success: true,
            message: 'Đã xóa khỏi danh sách yêu thích'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear wishlist
 * DELETE /api/v1/wishlist
 */
const clearWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        await Wishlist.destroy({
            where: { user_id }
        });

        res.json({
            success: true,
            message: 'Đã xóa toàn bộ danh sách yêu thích'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Check if product is in wishlist
 * GET /api/v1/wishlist/check/:productId
 */
const checkWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { productId } = req.params;

        const exists = await Wishlist.findOne({
            where: { user_id, product_id: productId }
        });

        res.json({
            success: true,
            data: {
                inWishlist: !!exists
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist
};

