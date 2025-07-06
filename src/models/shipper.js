const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const Shipper = sequelize.define('Shipper', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'company_name',
  },
  companyAddress: {
    type: DataTypes.TEXT,
    field: 'company_address',
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
    field: 'company_email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerServiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_service_number',
  },
  gstNumber: {
    type: DataTypes.STRING,
    field: 'gst_number',
    defaultValue: null,
  },
  cinNumber: {
    type: DataTypes.STRING,
    field: 'cin_number',
    defaultValue: null,
  },
  ownerName: {
    type: DataTypes.STRING,
    field: 'owner_name',
    defaultValue: null,
  },
  ownerContactNumber: {
    type: DataTypes.STRING,
    field: 'owner_contact_number',
    defaultValue: null,
  },
  serviceArea: {
    type: DataTypes.ENUM('district', 'cities', 'all_india'),
    field: 'service_area',
    defaultValue: null,
  },
  pincode: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  // POC fields
  pocName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'poc_name',
  },
  pocEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
    field: 'poc_email',
  },
  pocDesignation: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'poc_designation',
  },
  pocContactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'poc_contact_number',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  }
}, {
  tableName: 'shippers',
  timestamps: true,
  hooks: {
    beforeCreate: async shipper => {
      if (shipper.password) {
        const salt = await bcrypt.genSalt(10);
        shipper.password = await bcrypt.hash(shipper.password, salt);
      }
    },
    beforeUpdate: async shipper => {
      if (shipper.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        shipper.password = await bcrypt.hash(shipper.password, salt);
      }
    },
  }
});

// Instance method to verify password
Shipper.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = Shipper;
