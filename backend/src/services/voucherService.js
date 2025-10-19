/**
 * Voucher Service
 * Business logic for vouchers and discounts
 */
const { Voucher, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Validate and apply voucher to cart
 */
const applyVoucher = async (code, userId, cartData) => {
    const { items, subtotal } = cartData;

    // Find voucher
    const voucher = await Voucher.findOne({
        where: {
            code: code.toUpperCase(),
            is_active: true,
            [Op.or]: [
                { start_date: null },
                { start_date: { [Op.lte]: new Date() } }
            ],
            [Op.or]: [
                { end_date: null },
                { end_date: { [Op.gte]: new Date() } }
            ]
        }
    });

    if (!voucher) {
        throw new Error('Mã giảm giá không tồn tại hoặc đã hết hạn');
    }

    // Check usage limit
    if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
        throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }

    // Check min order amount
    if (subtotal < voucher.min_order_amount) {
        throw new Error(`Đơn hàng tối thiểu ${voucher.min_order_amount.toLocaleString('vi-VN')}₫`);
    }

    // Check product/category restrictions
    if (voucher.applicable_products || voucher.applicable_categories) {
        const applicableItems = items.filter(item => {
            if (voucher.applicable_products && voucher.applicable_products.includes(item.product_id)) {
                return true;
            }
            if (voucher.applicable_categories && voucher.applicable_categories.includes(item.category_id)) {
                return true;
            }
            return false;
        });

        if (applicableItems.length === 0) {
            throw new Error('Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng');
        }
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discount_type === 'percentage') {
        discountAmount = (subtotal * voucher.discount_value) / 100;
        if (voucher.max_discount_amount) {
            discountAmount = Math.min(discountAmount, voucher.max_discount_amount);
        }
    } else {
        discountAmount = voucher.discount_value;
    }

    discountAmount = Math.min(discountAmount, subtotal);

    logger.info({ message: 'Voucher applied', code, userId, discountAmount });

    return {
        voucher_id: voucher.id,
        code: voucher.code,
        discount_amount: discountAmount,
        final_amount: subtotal - discountAmount
    };
};

/**
 * Record voucher usage
 */
const recordUsage = async (voucherId, userId, orderId, discountAmount) => {
    await Voucher.increment('usage_count', { where: { id: voucherId } });

    logger.info({ message: 'Voucher usage recorded', voucherId, userId, orderId });
};

/**
 * Get all vouchers (admin)
 */
const getAllVouchers = async (filters = {}) => {
    const { page = 1, limit = 20, is_active = null } = filters;
    const where = {};

    if (is_active !== null) {
        where.is_active = is_active;
    }

    const { count, rows } = await Voucher.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (page - 1) * limit
    });

    return {
        vouchers: rows,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

/**
 * Get available vouchers for user
 */
const getAvailableVouchers = async () => {
    const vouchers = await Voucher.findAll({
        where: {
            is_active: true,
            [Op.or]: [
                { start_date: null },
                { start_date: { [Op.lte]: new Date() } }
            ],
            [Op.or]: [
                { end_date: null },
                { end_date: { [Op.gte]: new Date() } }
            ],
            [Op.or]: [
                { usage_limit: null },
                sequelize.where(
                    sequelize.col('usage_count'),
                    Op.lt,
                    sequelize.col('usage_limit')
                )
            ]
        },
        order: [['created_at', 'DESC']]
    });

    return vouchers;
};

/**
 * Create voucher (admin)
 */
const createVoucher = async (voucherData) => {
    voucherData.code = voucherData.code.toUpperCase();
    const voucher = await Voucher.create(voucherData);

    logger.info({ message: 'Voucher created', voucherId: voucher.id, code: voucher.code });
    return voucher;
};

/**
 * Update voucher (admin)
 */
const updateVoucher = async (id, voucherData) => {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
        throw new Error('Voucher not found');
    }

    if (voucherData.code) {
        voucherData.code = voucherData.code.toUpperCase();
    }

    await voucher.update(voucherData);

    logger.info({ message: 'Voucher updated', voucherId: id });
    return voucher;
};

/**
 * Delete voucher (admin)
 */
const deleteVoucher = async (id) => {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
        throw new Error('Voucher not found');
    }

    await voucher.destroy();

    logger.info({ message: 'Voucher deleted', voucherId: id });
};

module.exports = {
    applyVoucher,
    recordUsage,
    getAllVouchers,
    getAvailableVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher
};


