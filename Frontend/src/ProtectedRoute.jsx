// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Optional: basic token validation (e.g., JWT must have 3 parts)
const isValidToken = token => {
  return token && token.split('.').length === 3;
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const token = localStorage.getItem('userToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const isAuthenticated = isValidToken(token);

  // Optional: check role (for admin-only or user-only routes)
  if (requiredRole && userInfo?.role !== requiredRole) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/userLogin"
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
