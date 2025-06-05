// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../services/AuthService';

const ProtectedRoute = ({ allowedRoles, children }) => {
  if (!isLoggedIn()) {
    // Not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    // Logged in but not authorized for this route
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render the children component
  return children;
};

export default ProtectedRoute;
