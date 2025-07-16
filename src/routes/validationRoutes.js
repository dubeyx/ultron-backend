const express = require('express');
const { sendOtp, verifyOtp,checkVerificationStatus,sendVerificationEmail,verifyEmailToken } = require('../controllers/ValidationController');
const router = express.Router();


//POST route for sending otp to users phone number
router.post('/sendotp', sendOtp);

//POST route for verifiying otp
router.post('/verifyotp', verifyOtp);

// POST - Check if user email is verified / token status
router.post('/checkemailstatus', checkVerificationStatus);

// POST - Send new verification email (removes old token if exists)
router.post('/sendemaillink', sendVerificationEmail);

// GET - Verify email via token (used in email link)
router.get('/verifyemaillink', verifyEmailToken);



module.exports = router;
