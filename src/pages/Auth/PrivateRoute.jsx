import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isAuthenticated, allowedRoles, userRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền truy cập dựa trên vai trò
  if (!allowedRoles.some(role => userRoles.includes(role))) {
    return <Navigate to="/home" replace />;
  }
  return children;
};
export default PrivateRoute;
