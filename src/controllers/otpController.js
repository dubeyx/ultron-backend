const { redisClient } = require('../config/redis');

const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOtp();

  try {
    await redisClient.set(phoneNumber, otp, { EX: 120 });

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

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const cachedOtp = await redisClient.get(phoneNumber);

    if (cachedOtp === otp) {
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp };
