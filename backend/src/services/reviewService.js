/**
 * Review Service
 * Business logic for reviews and ratings
 */
const { Review, Product, User, Order, OrderDetail } = require('../models');
const logger = require('../../utils/logger');

/**
 * Create a review
 */
const createReview = async (userId, reviewData) => {
    const { product_id, order_id, rating, comment, images } = reviewData;

    // Check if user has purchased this product
    let isVerifiedPurchase = false;
    if (order_id) {
        const orderDetail = await OrderDetail.findOne({
            include: [{
                model: Order,
                where: { id: order_id, user_id: userId, status: 'delivered' }
            }],
            where: { product_id }
        });
        isVerifiedPurchase = !!orderDetail;
    }

    const review = await Review.create({
        product_id,
        user_id: userId,
        order_id,
        rating,
        comment,
        images,
        is_verified_purchase: isVerifiedPurchase,
        status: 'approved' // Auto-approve for now, can be changed to 'pending'
    });

    // Update product rating
    await updateProductRating(product_id);

    logger.info({ message: 'Review created', reviewId: review.id, userId, product_id });
    return review;
};

/**
 * Update product average rating
 */
const updateProductRating = async (productId) => {
    const reviews = await Review.findAll({
        where: { product_id: productId, status: 'approved' },
        attributes: ['rating']
    });

    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.update(
            { rating: avgRating.toFixed(1), review_count: reviews.length },
            { where: { id: productId } }
        );
    }
};

/**
 * Get reviews for a product
 */
const getProductReviews = async (productId, options = {}) => {
    const { page = 1, limit = 10, rating = null } = options;
    const offset = (page - 1) * limit;

    const where = {
        product_id: productId,
        status: 'approved'
    };

    if (rating) {
        where.rating = rating;
    }

    const { count, rows } = await Review.findAndCountAll({
        where,
        include: [
            {
                model: User,
                attributes: ['id', 'full_name', 'avatar']
            }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
    });

    return {
        reviews: rows,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

/**
 * Mark review as helpful
 */
const markHelpful = async (reviewId, userId) => {
    const review = await Review.findByPk(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    await review.increment('helpful_count');
    logger.info({ message: 'Review marked as helpful', reviewId, userId });

    return review;
};

/**
 * Admin reply to review
 */
const adminReply = async (reviewId, reply) => {
    const review = await Review.findByPk(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    review.admin_reply = reply;
    review.admin_reply_date = new Date();
    await review.save();

    logger.info({ message: 'Admin replied to review', reviewId });
    return review;
};

module.exports = {
    createReview,
    getProductReviews,
    markHelpful,
    adminReply,
    updateProductRating
};


