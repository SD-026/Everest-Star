import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    cnic: '',
    employeeNumber: '',
    email: '',
    mobile: '',
    emergencyContact: '',
    emergencyRelation: '',
    fullName: '',
    designation: '',
    dob: '',
    address: {
      house: '',
      street: '',
      sector: '',
      society: '',
      district: ''
    },
    father: {
      name: '',
      dob: '',
      cnic: '',
      isDeceased: false
    },
    mother: {
      name: '',
      dob: '',
      cnic: '',
      isDeceased: false
    },
    spouse: {
      name: '',
      dob: '',
      cnic: '',
      isMarried: false
    },
    children: [],
    gender: ''
  });

  const [childrenCount, setChildrenCount] = useState(0);
  const [editing, setEditing] = useState(false);

  // Handle deceased/married status changes
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      };
      
      // Clear fields when disabled
      if (parent === 'father' && checked) {
        newData.father.name = 'Deceased';
        newData.father.dob = '';
        newData.father.cnic = '';
      } else if (parent === 'mother' && checked) {
        newData.mother.name = 'Deceased';
        newData.mother.dob = '';
        newData.mother.cnic = '';
      } else if (parent === 'spouse' && !checked) {
        newData.spouse.name = 'Unmarried';
        newData.spouse.dob = '';
        newData.spouse.cnic = '';
        newData.children = [];
        setChildrenCount(0);
      }
      
      return newData;
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle address field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Format CNIC input
  const formatCNIC = (value) => {
    if (!value) return '';
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 5) return nums;
    if (nums.length <= 12) return `${nums.slice(0, 5)}-${nums.slice(5, 12)}`;
    return `${nums.slice(0, 5)}-${nums.slice(5, 12)}-${nums.slice(12, 13)}`;
  };

  // Handle CNIC input
  const handleCNICChange = (e) => {
    const formatted = formatCNIC(e.target.value);
    setFormData(prev => ({ ...prev, cnic: formatted }));
  };

  // Handle employee number input
  const handleEmployeeNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setFormData(prev => ({ ...prev, employeeNumber: value }));
    }
  };

  // Handle mobile number input
  const handleMobileChange = (e) => {
    const nums = e.target.value.replace(/\D/g, '');
    let formatted = nums;
    if (nums.length > 4) {
      formatted = `${nums.slice(0, 4)}-${nums.slice(4, 11)}`;
    }
    if (nums.length <= 13) {
      setFormData(prev => ({ ...prev, mobile: formatted }));
    }
  };

  // Handle emergency contact input
  const handleEmergencyContactChange = (e) => {
    const nums = e.target.value.replace(/\D/g, '');
    let formatted = nums;
    if (nums.length > 4) {
      formatted = `${nums.slice(0, 4)}-${nums.slice(4, 11)}`;
    }
    if (nums.length <= 13) {
      setFormData(prev => ({ ...prev, emergencyContact: formatted }));
    }
  };

  // Handle date input
  const handleDateChange = (e, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  // Handle name fields with capitalization
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = capitalizeWords(value);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: capitalizedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: capitalizedValue
      }));
    }
  };

  // Add child
  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [
        ...prev.children,
        {
          name: '',
          dob: '',
          relation: '',
          gender: '',
          documentNumber: ''
        }
      ]
    }));
    setChildrenCount(prev => prev + 1);
  };

  // Remove child
  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
    setChildrenCount(prev => prev - 1);
  };

  // Handle child field changes
  const handleChildChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [name]: name === 'name' ? capitalizeWords(value) : value } : child
      )
    }));
  };

  // Handle child CNIC input
  const handleChildCNICChange = (index, e) => {
    const formatted = formatCNIC(e.target.value);
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, documentNumber: formatted } : child
      )
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.cnic || formData.cnic.replace(/-/g, '').length !== 13) {
        toast.info('CNIC is required and must be 13 digits (formatted as 00000-0000000-0)');
        return;
      }
      
      if (!formData.employeeNumber || formData.employeeNumber.length !== 6) {
        toast.info('Employee # is required and must be 6 digits');
        return;
      }

      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.info('Valid email address is required');
        return;
      }

      if (!formData.mobile || formData.mobile.replace(/-/g, '').length !== 11) {
        toast.info('Mobile # is required and must be 11 digits (formatted as 0000-0000000)');
        return;
      }

      if (!formData.fullName) {
        toast.info('Full name is required');
        return;
      }

      if (!formData.dob) {
        toast.info('Date of birth is required');
        return;
      }

      if (!formData.address.society || !formData.address.district) {
        toast.info('Society/Colony/Village/Taluqa and District/City are required in address');
        return;
      }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        father: formData.father.isDeceased ? {
          isDeceased: true,
          name: 'Deceased',
          dob: '',
          cnic: ''
        } : formData.father,
        mother: formData.mother.isDeceased ? {
          isDeceased: true,
          name: 'Deceased',
          dob: '',
          cnic: ''
        } : formData.mother,
        spouse: !formData.spouse.isMarried ? {
          isMarried: false,
          name: 'Unmarried',
          dob: '',
          cnic: ''
        } : formData.spouse
      };

      const response = await axios.post('https://everest-star.onrender.com/api/user/submit', submissionData);
      toast.success(editing ? 'Employee updated successfully!' : 'Employee added successfully!');
      setEditing(true);
    } catch (err) {
    //   alert(`Error: ${err.response?.data?.error || err.message}`);
    console.log(err)
    }
  };

  // Search employee by CNIC
  const searchEmployee = async () => {
    try {
      const response = await axios.get(`https://everest-star.onrender.com/api/user/${formData.cnic}`);
      setFormData(response.data);
    //   console.log(response.data)
      setChildrenCount(response.data.children.length);
      setEditing(true);
    } catch (err) {
      alert('Employee not found. You can add a new record.');
      setEditing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Employee Information Form</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CNIC Search */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">CNIC #</label>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={handleCNICChange}
              placeholder="00000-0000000-0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="15"
              required
            />
          </div>
          <button
            type="button"
            onClick={searchEmployee}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee #</label>
              <input
                type="text"
                name="employeeNumber"
                value={formData?.employeeNumber}
                onChange={handleEmployeeNumberChange}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="6"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (As Per CNIC)</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile #</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleMobileChange}
                placeholder="0000-0000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="12"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact #</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleEmergencyContactChange}
                placeholder="0000-0000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relation with Emergency Contact</label>
              <input
                type="text"
                name="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (As Per CNIC)</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={(e) => handleDateChange(e, 'dob')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                max={( 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Postal Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat #</label>
              <input
                type="text"
                name="house"
                value={formData?.address?.house}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street/Muhalla/Area</label>
              <input
                type="text"
                name="street"
                value={formData.address?.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector/Block</label>
              <input
                type="text"
                name="sector"
                value={formData.address?.sector}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society/Colony/Village/Taluqa</label>
              <input
                type="text"
                name="society"
                value={formData.address?.society}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District/City</label>
              <input
                type="text"
                name="district"
                value={formData.address?.district}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Father Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Father Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="father.isDeceased"
                checked={formData.father.isDeceased}
                onChange={handleStatusChange}
                id="fatherDeceased"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="fatherDeceased" className="ml-2 block text-sm text-gray-700">
                Father is deceased
              </label>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father Name (As Per CNIC)</label>
              <input
                type="text"
                name="father.name"
                value={formData.father.name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.father.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={formData.father.isDeceased}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father Date of Birth (As Per CNIC)</label>
              <input
                type="date"
                name="father.dob"
                value={formData.father.dob}
                onChange={(e) => handleDateChange(e, 'father.dob')}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.father.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={formData.father.isDeceased}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father CNIC #</label>
              <input
                type="text"
                name="father.cnic"
                value={formData.father.cnic}
                onChange={(e) => {
                  const formatted = formatCNIC(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    father: {
                      ...prev.father,
                      cnic: formatted
                    }
                  }));
                }}
                placeholder="00000-0000000-0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.father.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                maxLength="15"
                disabled={formData.father.isDeceased}
              />
            </div>
          </div>
        </div>

        {/* Mother Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Mother Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="mother.isDeceased"
                checked={formData.mother.isDeceased}
                onChange={handleStatusChange}
                id="motherDeceased"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="motherDeceased" className="ml-2 block text-sm text-gray-700">
                Mother is deceased
              </label>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother Name (As Per CNIC)</label>
              <input
                type="text"
                name="mother.name"
                value={formData.mother.name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.mother.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={formData.mother.isDeceased}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother Date of Birth (As Per CNIC)</label>
              <input
                type="date"
                name="mother.dob"
                value={formData.mother.dob}
                onChange={(e) => handleDateChange(e, 'mother.dob')}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.mother.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={formData.mother.isDeceased}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother CNIC #</label>
              <input
                type="text"
                name="mother.cnic"
                value={formData.mother.cnic}
                onChange={(e) => {
                  const formatted = formatCNIC(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    mother: {
                      ...prev.mother,
                      cnic: formatted
                    }
                  }));
                }}
                placeholder="00000-0000000-0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.mother.isDeceased ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                maxLength="15"
                disabled={formData.mother.isDeceased}
              />
            </div>
          </div>
        </div>

        {/* Spouse Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Spouse Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="spouse.isMarried"
                checked={formData.spouse.isMarried}
                onChange={handleStatusChange}
                id="isMarried"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isMarried" className="ml-2 block text-sm text-gray-700">
                Married
              </label>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Name (As Per CNIC)</label>
              <input
                type="text"
                name="spouse.name"
                value={formData.spouse.name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.spouse.isMarried ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={!formData.spouse.isMarried}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Date of Birth (As Per CNIC)</label>
              <input
                type="date"
                name="spouse.dob"
                value={formData.spouse.dob}
                onChange={(e) => handleDateChange(e, 'spouse.dob')}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.spouse.isMarried ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={!formData.spouse.isMarried}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse CNIC #</label>
              <input
                type="text"
                name="spouse.cnic"
                value={formData.spouse.cnic}
                onChange={(e) => {
                  const formatted = formatCNIC(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    spouse: {
                      ...prev.spouse,
                      cnic: formatted
                    }
                  }));
                }}
                placeholder="00000-0000000-0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.spouse.isMarried ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                maxLength="15"
                disabled={!formData.spouse.isMarried}
              />
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Children Information</h2>
          <div className="mb-4">
            <button
              type="button"
              onClick={addChild}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.spouse.isMarried}
            >
              Add Child
            </button>
          </div>
          
          {formData.children.map((child, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Child {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child Name (As Per Birth Certificate)</label>
                  <input
                    type="text"
                    name="name"
                    value={child.name}
                    onChange={(e) => handleChildChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={child.dob}
                    onChange={(e) => handleChildChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relation with Child</label>
                  <select
                    name="relation"
                    value={child.relation}
                    onChange={(e) => handleChildChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Relation</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={child.gender}
                    onChange={(e) => handleChildChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC/FRC/BForm #</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={child.documentNumber}
                    onChange={(e) => handleChildCNICChange(index, e)}
                    placeholder="00000-0000000-0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="15"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {editing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;