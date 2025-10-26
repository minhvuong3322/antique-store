const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist
} = require('../controllers/wishlistController');

// All routes require authentication
router.use(authenticate);

// Get wishlist
router.get('/', getWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

// Add to wishlist
router.post('/:productId', addToWishlist);

// Remove from wishlist
router.delete('/:productId', removeFromWishlist);

// Clear wishlist
router.delete('/', clearWishlist);

module.exports = router;

