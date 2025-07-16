const { redisClient } = require('../config/redis');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const {getUserModel,sendEmail} = require('../utils/index');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

//OTP sender function to user mobile number
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOtp();

  try {
    await redisClient.set(`${phoneNumber}_phoneOtp`, otp, { EX: 60 });

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.PHONENUMBER,
      to: phoneNumber
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

//OTP verifier function
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const cachedOtp = await redisClient.get(`${phoneNumber}_phoneOtp`);

    if (cachedOtp === otp) {
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
};

// Function to check if user is verified or not
async function checkVerificationStatus(req, res) {
  const { gstNumber, userType } = req.body;

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber } });

    if (!user) return res.status(404).json({ status: 'user_not_found' });
    if (user.emailVerified) return res.status(200).json({ status: 'verified' });

    const tokenExists = await redisClient.get(`${userType}:${gstNumber}`);
    if (tokenExists) return res.status(200).json({ status: 'token_sent_not_verified' });

    return res.status(200).json({ status: 'not_verified_no_token' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to send verification email
async function sendVerificationEmail(req, res) {
  const { gstNumber, userType } = req.body;

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Clear existing token
    await redisClient.del(`${userType}:${gstNumber}`);

    // Generate JWT token
    const token = jwt.sign({ gstNumber, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store in Redis
    await redisClient.set(`${userType}:${gstNumber}`, token, { EX: 3600 });

    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to verify token
async function verifyEmailToken(req, res) {
  const { token } = req.body;
  try {
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { gstNumber, userType } = decoded;

    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.status(200).json({ message: 'Email already verified' });

    const storedToken = await redisClient.get(`${userType}:${gstNumber}`);
    if (!storedToken || storedToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    await user.save();
    await redisClient.del(`${userType}:${gstNumber}`);

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
}




module.exports = { sendOtp, verifyOtp,checkVerificationStatus,sendVerificationEmail,verifyEmailToken };
