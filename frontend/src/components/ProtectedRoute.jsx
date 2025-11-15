import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to signup page
  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
