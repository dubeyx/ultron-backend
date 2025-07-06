const express = require('express');
const shipperController = require('../controllers/shipperController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
// POST route for transporter registration
router.post('/register', shipperController.registerShipper);

// POST route for transporter login
router.post('/login', shipperController.loginShipper);

// Protected routes (requires authentication)
// GET route for protected home page
router.get('/home', protect, shipperController.getHome);

module.exports = router;
