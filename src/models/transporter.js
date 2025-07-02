const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const Transporter = sequelize.define('Transporter', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Required fields as per the specifications
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'company_name'
  },
  companyAddress: {
    type: DataTypes.TEXT,
    field: 'company_address',
    defaultValue: null
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    field: 'company_email'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerServiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_service_number'
  },
  gstNumber: {
    type: DataTypes.STRING,
    field: 'gst_number',
    defaultValue: null
  },
  cinNumber: {
    type: DataTypes.STRING,
    field: 'cin_number',
    defaultValue: null
  },
  ownerName: {
    type: DataTypes.STRING,
    field: 'owner_name',
    defaultValue: null
  },
  ownerContactNumber: {
    type: DataTypes.STRING,
    field: 'owner_contact_number',
    defaultValue: null
  },
  fleetCount: {
    type: DataTypes.INTEGER,
    field: 'fleet_count',
    defaultValue: 0
  },
  serviceArea: {
    type: DataTypes.ENUM('district', 'cities', 'all_india'),
    field: 'service_area',
    defaultValue: null
  },
  pincode: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  districtCityRates: {
    type: DataTypes.TEXT, // JSON string for rates
    field: 'district_city_rates',
    defaultValue: null
  },
  serviceType: {
    type: DataTypes.ENUM('godown_to_godown', 'door_to_door', 'both'),
    field: 'service_type',
    defaultValue: null
  },
  etdDetails: {
    type: DataTypes.TEXT, // JSON string for ETD details per city
    field: 'etd_details',
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'transporters',
  timestamps: true,
  hooks: {
    beforeCreate: async (transporter) => {
      if (transporter.password) {
        const salt = await bcrypt.genSalt(10);
        transporter.password = await bcrypt.hash(transporter.password, salt);
      }
    },
    beforeUpdate: async (transporter) => {
      if (transporter.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        transporter.password = await bcrypt.hash(transporter.password, salt);
      }
    }
  }
});

// Instance method to check password
Transporter.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = Transporter;
