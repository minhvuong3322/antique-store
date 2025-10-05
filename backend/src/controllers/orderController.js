const { sequelize } = require('../config/database');
const { Order, OrderDetail, Product, CartItem, User, Payment } = require('../models');
const { Op } = require('sequelize');

/**
 * Create order from cart
 * POST /api/v1/orders
 */
const createOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { shipping_address, notes, payment_method = 'COD' } = req.body;
        const user_id = req.user.id;

        // Get cart items
        const cartItems = await CartItem.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    where: { is_active: true }
                }
            ],
            transaction
        });

        if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Giỏ hàng trống'
            });
        }

        // Check stock and calculate total
        let subtotal = 0;
        for (const item of cartItems) {
            if (!item.product.isInStock(item.quantity)) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm "${item.product.name}" không đủ hàng`
                });
            }
            const price = item.product.sale_price || item.product.price;
            subtotal += price * item.quantity;
        }

        // Calculate shipping fee (simple logic - can be improved)
        const shipping_fee = subtotal >= 5000000 ? 0 : 50000; // Free ship for orders >= 5M VND

        // Calculate tax (10% - example)
        const tax = subtotal * 0.1;

        const total_amount = subtotal + shipping_fee + tax;

        // Generate order number
        const order_number = Order.generateOrderNumber();

        // Create order
        const order = await Order.create(
            {
                user_id,
                order_number,
                total_amount,
                shipping_address,
                shipping_fee,
                tax,
                discount: 0,
                status: 'pending',
                notes
            },
            { transaction }
        );

        // Create order details and update product stock
        for (const item of cartItems) {
            const price = item.product.sale_price || item.product.price;

            await OrderDetail.create(
                {
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: price,
                    subtotal: price * item.quantity
                },
                { transaction }
            );

            // Decrease product stock
            await item.product.decrement('stock_quantity', {
                by: item.quantity,
                transaction
            });
        }

        // Create payment record
        await Payment.create(
            {
                order_id: order.id,
                amount: total_amount,
                payment_method,
                payment_status: payment_method === 'COD' ? 'pending' : 'pending'
            },
            { transaction }
        );

        // Clear cart
        await CartItem.destroy({
            where: { user_id },
            transaction
        });

        await transaction.commit();

        // Fetch complete order with details
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderDetail,
                    as: 'order_details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'slug', 'images']
                        }
                    ]
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Đặt hàng thành công',
            data: { order: completeOrder }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Get user's orders
 * GET /api/v1/orders
 */
const getUserOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const user_id = req.user.id;

        const where = { user_id };
        if (status) where.status = status;

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: OrderDetail,
                    as: 'order_details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'slug', 'images']
                        }
                    ]
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                orders,
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
 * Get order by ID
 * GET /api/v1/orders/:id
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const is_admin = req.user.role === 'admin';

        const where = { id };
        if (!is_admin) where.user_id = user_id;

        const order = await Order.findOne({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email', 'phone']
                },
                {
                    model: OrderDetail,
                    as: 'order_details',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update order status (Admin only)
 * PUT /api/v1/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        await order.update({ status });

        // Update payment status if order is delivered
        if (status === 'delivered' && order.payment) {
            await order.payment.markAsCompleted();
        }

        res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel order (Customer can cancel if status is pending)
 * PUT /api/v1/orders/:id/cancel
 */
const cancelOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const order = await Order.findOne({
            where: { id, user_id },
            include: [
                {
                    model: OrderDetail,
                    as: 'order_details'
                }
            ],
            transaction
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (order.status !== 'pending') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý'
            });
        }

        // Restore product stock
        for (const detail of order.order_details) {
            await Product.increment('stock_quantity', {
                by: detail.quantity,
                where: { id: detail.product_id },
                transaction
            });
        }

        await order.update({ status: 'cancelled' }, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Hủy đơn hàng thành công'
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Get all orders (Admin only)
 * GET /api/v1/admin/orders
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        const where = {};
        if (status) where.status = status;

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email', 'phone'],
                    ...(search && {
                        where: {
                            [Op.or]: [
                                { full_name: { [Op.like]: `%${search}%` } },
                                { email: { [Op.like]: `%${search}%` } }
                            ]
                        }
                    })
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                orders,
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

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
};

