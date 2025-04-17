import React from 'react';
import { format } from 'date-fns';

const EmployeeModal = ({ employee, onClose }) => {
  if (!employee) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date) ? 'N/A' : format(date, 'dd/MMM/yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.house,
      address.street,
      address.sector,
      address.society,
      address.district
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Details: {employee.fullName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <DetailRow label="CNIC #" value={employee.cnic} />
              <DetailRow label="Employee #" value={employee.employeeNumber} />
              <DetailRow label="Full Name" value={employee.fullName} />
              <DetailRow label="Designation" value={employee.designation} />
              <DetailRow label="Date of Birth" value={formatDate(employee.dob)} />
              <DetailRow label="Gender" value={employee.gender} />
              <DetailRow label="Email" value={employee.email} />
              <DetailRow label="Mobile #" value={employee.mobile} />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
              <DetailRow label="Postal Address" value={formatAddress(employee.address)} />
            </div>

            {/* Family Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Family Information</h3>
              <DetailRow 
                label="Father Name" 
                value={employee.father?.isDeceased ? 'Deceased' : employee.father?.name} 
              />
              {!employee.father?.isDeceased && (
                <>
                  <DetailRow label="Father CNIC" value={employee.father?.cnic} />
                  <DetailRow label="Father DOB" value={formatDate(employee.father?.dob)} />
                </>
              )}

              <DetailRow 
                label="Mother Name" 
                value={employee.mother?.isDeceased ? 'Deceased' : employee.mother?.name} 
              />
              {!employee.mother?.isDeceased && (
                <>
                  <DetailRow label="Mother CNIC" value={employee.mother?.cnic} />
                  <DetailRow label="Mother DOB" value={formatDate(employee.mother?.dob)} />
                </>
              )}

              <DetailRow 
                label="Spouse Name" 
                value={employee.spouse?.isMarried === false ? 'Unmarried' : employee.spouse?.name} 
              />
              {employee.spouse?.isMarried !== false && (
                <>
                  <DetailRow label="Spouse CNIC" value={employee.spouse?.cnic} />
                  <DetailRow label="Spouse DOB" value={formatDate(employee.spouse?.dob)} />
                </>
              )}
            </div>

            {/* Children Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Children Information ({employee.children?.length || 0})
              </h3>
              {employee.children?.length > 0 ? (
                employee.children.map((child, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <DetailRow label="Child Name" value={child.name} />
                    <DetailRow label="Date of Birth" value={formatDate(child.dob)} />
                    <DetailRow label="Relation" value={child.relation} />
                    <DetailRow label="Gender" value={child.gender} />
                    <DetailRow label="CNIC/B-form #" value={child.documentNumber} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No children information available</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>
              <DetailRow label="Contact #" value={employee.emergencyContact} />
              <DetailRow label="Relation" value={employee.emergencyRelation} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent detail rows
const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="col-span-2 text-sm text-gray-900">
      {value || 'N/A'}
    </span>
  </div>
);

export default EmployeeModal;