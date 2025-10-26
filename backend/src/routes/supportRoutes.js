const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middlewares/auth');
const {
    createSupportMessage,
    getMyMessages,
    getMessageById
} = require('../controllers/supportController');

// Public/authenticated routes
router.post('/', optionalAuth, createSupportMessage); // Can be used by guests or authenticated users
router.get('/my-messages', authenticate, getMyMessages);
router.get('/:id', optionalAuth, getMessageById);

module.exports = router;

