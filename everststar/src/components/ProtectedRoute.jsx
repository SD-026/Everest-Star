
import { Navigate, Outlet } from "react-router-dom";


// Optional: Add roles you want to allow (for role-based protection)
const ProtectedRoute = ({ allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    

  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Logged in, but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // All good
  return <Outlet />;
};

export default ProtectedRoute;
