const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const router = express.Router();

router.post('/getotp', sendOtp);
router.post('/verifyotp', verifyOtp);

module.exports = router;
