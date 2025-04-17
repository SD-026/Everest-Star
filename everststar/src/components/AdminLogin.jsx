import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatCNIC = (value) => {
    if (!value) return '';
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 5) return nums;
    if (nums.length <= 12) return `${nums.slice(0, 5)}-${nums.slice(5, 12)}`;
    return `${nums.slice(0, 5)}-${nums.slice(5, 12)}-${nums.slice(12, 13)}`;
  };

  const handleCNICChange = (e) => {
    const formatted = formatCNIC(e.target.value);
    setCnic(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!cnic || cnic.replace(/-/g, '').length !== 13) {
      setError('Please enter a valid 13-digit CNIC');
      return;
    }

    try {
      const res = await axios.post('https://everestar.onrender.com/api/admin/login', {
        cnic,
        password,
      });

      if (res.data?.success) {
        localStorage.setItem('user', JSON.stringify(res.data.admin));
        navigate('/admin');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access restricted to authorized personnel only
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="cnic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin CNIC
              </label>
              <input
                id="cnic"
                name="cnic"
                type="text"
                required
                value={cnic}
                onChange={handleCNICChange}
                placeholder="00000-0000000-0"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                maxLength="15"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
