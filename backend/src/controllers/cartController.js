const { CartItem, Product } = require('../models');

/**
 * Get user's cart
 * GET /api/v1/cart
 */
const getCart = async (req, res, next) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'sale_price', 'images', 'stock_quantity', 'is_active']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            const price = item.product.sale_price || item.product.price;
            return sum + (price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                cart_items: cartItems,
                summary: {
                    total_items: cartItems.length,
                    total_quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                    total_amount: total
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add item to cart
 * POST /api/v1/cart
 */
const addToCart = async (req, res, next) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const user_id = req.user.id;

        // Check if product exists and is active
        const product = await Product.findOne({
            where: { id: product_id, is_active: true }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh'
            });
        }

        // Check stock
        if (!product.isInStock(quantity)) {
            return res.status(400).json({
                success: false,
                message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho`
            });
        }

        // Check if item already in cart
        let cartItem = await CartItem.findOne({
            where: { user_id, product_id }
        });

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;

            if (!product.isInStock(newQuantity)) {
                return res.status(400).json({
                    success: false,
                    message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho`
                });
            }

            await cartItem.update({ quantity: newQuantity });
        } else {
            // Create new cart item
            cartItem = await CartItem.create({
                user_id,
                product_id,
                quantity
            });
        }

        // Fetch cart item with product details
        const cartItemWithProduct = await CartItem.findByPk(cartItem.id, {
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Đã thêm vào giỏ hàng',
            data: { cart_item: cartItemWithProduct }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update cart item quantity
 * PUT /api/v1/cart/:id
 */
const updateCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Số lượng phải lớn hơn 0'
            });
        }

        const cartItem = await CartItem.findOne({
            where: { id, user_id: req.user.id },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm trong giỏ hàng'
            });
        }

        // Check stock
        if (!cartItem.product.isInStock(quantity)) {
            return res.status(400).json({
                success: false,
                message: `Chỉ còn ${cartItem.product.stock_quantity} sản phẩm trong kho`
            });
        }

        await cartItem.update({ quantity });

        res.json({
            success: true,
            message: 'Cập nhật giỏ hàng thành công',
            data: { cart_item: cartItem }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove item from cart
 * DELETE /api/v1/cart/:id
 */
const removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm trong giỏ hàng'
            });
        }

        await cartItem.destroy();

        res.json({
            success: true,
            message: 'Đã xóa sản phẩm khỏi giỏ hàng'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear cart
 * DELETE /api/v1/cart
 */
const clearCart = async (req, res, next) => {
    try {
        await CartItem.destroy({
            where: { user_id: req.user.id }
        });

        res.json({
            success: true,
            message: 'Đã xóa toàn bộ giỏ hàng'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};



