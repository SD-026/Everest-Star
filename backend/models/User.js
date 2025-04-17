const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: String,
  dob: String,
  gender: String,
  relation: String,
  documentNumber: String,
});

const userSchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true },
  employeeNumber: { type: String},
  email: { type: String, required: true },
  mobile: String,
  emergencyContact: String,
  emergencyRelation: String,
  fullName: String,
  designation: String,
  dob: String,
  address: {
    house: String,
    street: String,
    sector: String,
    society: { type: String, required: true },
    district: { type: String, required: true },
  },
  father: {
    name: String,
    dob: String,
    cnic: String,
  },
  mother: {
    name: String,
    dob: String,
    cnic: String,
  },
  spouse: {
    name: String,
    dob: String,
    cnic: String,
  },
  childrenCount: Number,
  children: [childSchema],
  gender: String,
});

module.exports = mongoose.model('emp_info_everest', userSchema);
