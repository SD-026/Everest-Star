import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard ';
import { Router, Routes,Route  } from 'react-router-dom';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
// import AdminDashboard from './components/AdminDashboard';
// import AdminLogin from './components/AdminLogin';
// import Navbar from './components/Navbar';

function App() {
  return (
    // <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* <Route path="/" element={<EmployeeForm/>} /> */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/" element={<Unauthorized />} />

            

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard/>} />
        </Route>
          </Routes>
        </div>
      </div>
    // </Router>
  );
}

export default App;