import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import EmployeeModal from './EmployeeModal';
// import EmployeeModal from './EmployeeModal';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://everestar.onrender.com/api/admin/users');
        
        // console.log(response.data)
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const csvData = employees.map(emp => {
    const childrenDetails = emp.children?.map(child =>
      `${child.name || 'N/A'} (${child.gender || 'N/A'}, ${child.dob || 'N/A'}, ${child.relation || 'N/A'},${child.documentNumber || 'N/A'},)`
    ) || [];
  
    return {
      CNIC: emp.cnic,
      'Employee #': emp.employeeNumber,
      'Full Name': emp.fullName,
      Email: emp.email,
      Mobile: emp.mobile,
      Designation: emp.designation,
      'Date of Birth': emp.dob,
      'Relation with Emergency Contact': emp.emergencyRelation,
  
      'Father Name': emp.father?.name || '',
      'Father CNIC': emp.father?.cnic || '',
      'Father DOB': emp.father?.dob || '',
  
      'Mother Name': emp.mother?.name || '',
      'Mother CNIC': emp.mother?.cnic || '',
      'Mother DOB': emp.mother?.dob || '',
  
      'Spouse Name': emp.spouse?.name || '',
      'Spouse CNIC': emp.spouse?.cnic || '',
      'Spouse DOB': emp.spouse?.dob || '',
  
      'Postal Address': `${emp.address?.house || ''}, ${emp.address?.street || ''}, ${emp.address?.society || ''}, ${emp.address?.district || ''}`,
  
      'Children Count': emp.childrenCount,
      // remove this ↓ line
      // 'Children Details': emp.children?.map(...)...
  
      // Spread children into their own columns
      ...childrenDetails.reduce((acc, detail, index) => {
        acc[`Child ${index + 1}`] = detail;
        return acc;
      }, {})
    };
  });
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Employee Records</h2>
        <CSVLink 
          data={csvData} 
          filename="employee_records.csv"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Export to CSV
        </CSVLink>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees?.map((employee) => (
                <tr key={employee._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.cnic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(employee)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal employee={selectedEmployee} onClose={closeModal} />
      )}
    </div>
  );
};

export default AdminDashboard;