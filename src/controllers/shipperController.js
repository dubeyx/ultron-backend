const { Shipper } = require('../models');
const jwt = require('jsonwebtoken');

// Register a new shipper
exports.registerShipper = async (req, res) => {
  try {
    const {
      companyName,
      password,
      email,
      customerServiceNumber,
      gstNumber,
      cinNumber,
      companyAddress,
      ownerName,
      ownerContactNumber,
      serviceArea,
      pincode,
      pocName,
      pocEmail,
      pocDesignation,
      pocContactNumber,
    } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'companyName, email, and password are required',
      });
    }

    const existing = await Shipper.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    const newShipper = await Shipper.create({
      companyName,
      password,
      email,
      customerServiceNumber,
      gstNumber,
      cinNumber,
      companyAddress,
      ownerName,
      ownerContactNumber,
      serviceArea,
      pincode,
      pocName,
      pocEmail,
      pocDesignation,
      pocContactNumber,
    });

    const data = newShipper.toJSON();
    delete data.password;

    return res.status(201).json({
      success: true,
      message: 'Shipper registered successfully',
      data,
    });
  } catch (error) {
    console.error('Error registering shipper:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login existing shipper
exports.loginShipper = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const shipper = await Shipper.findOne({ where: { email } });
    if (!shipper || !(await shipper.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({
      id: shipper.id,
      email: shipper.email,
      companyName: shipper.companyName,
      userType: 'shipper'
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: shipper.id,
        companyName: shipper.companyName,
        email: shipper.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Protected home route for shipper
exports.getHome = async (req, res) => {
  try {
    const shipper = req.shipper;  // set by protect middleware

    return res.status(200).json({
      success: true,
      message: 'Welcome to your dashboard',
      data: {
        id: shipper.id,
        companyName: shipper.companyName,
        email: shipper.email,
      },
    });
  } catch (error) {
    console.error('Error accessing home:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve home data',
      error: error.message,
    });
  }
};
