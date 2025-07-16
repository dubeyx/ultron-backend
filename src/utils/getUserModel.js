const { Shipper,Transporter} = require("../models/index");


function getUserModel(userType) {
  if (userType === 'shipper') return Shipper;
  if (userType === 'transporter') return Transporter;
  throw new Error('Invalid userType');
}

module.exports = getUserModel;
