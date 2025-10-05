const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const otpRoutes = require('./otpRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Antique Store API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;



