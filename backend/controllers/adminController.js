const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');

exports.loginAdmin = async (req, res) => {
  try {
    const { cnic, password } = req.body;
   

    const admin = await Admin.findOne({ cnic });
    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    res.status(200).json({ admin, success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.createadmin = async (req, res) => {
  try {
    const { cnic, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ cnic });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await Admin.create({
      cnic,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportUsers = async (req, res) => {
    try {
      const users = await User.find();
  
      const fields = [
        'cnic',
        'employeeNo',
        'email',
        'mobile',
        'emergencyContact',
        'relationWithEmergencyContact',
        'fullName',
        'designation',
        'dob',
        'postalAddress.house',
        'postalAddress.street',
        'postalAddress.block',
        'postalAddress.colony',
        'postalAddress.city',
        'father.name',
        'father.dob',
        'father.cnic',
        'mother.name',
        'mother.dob',
        'mother.cnic',
        'spouse.name',
        'spouse.dob',
        'spouse.cnic',
        'childrenCount',
        // Flatten children if needed; currently it will be [object Object]
      ];
  
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(users);
  
      // Set headers
      res.header('Content-Type', 'text/csv');
      res.attachment('emp_info_everest.csv');
      return res.send(csv);
    } catch (error) {
      console.error('Export Error:', error);
      res.status(500).json({ message: 'Failed to export users to CSV' });
    }
  };
  
