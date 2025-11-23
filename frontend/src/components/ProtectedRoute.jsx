import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setAuthChecked(true);
  }, []);

  // Prevent flicker while checking auth
  if (!authChecked) return null;

  // Redirect if not logged in
  if (!isLoggedIn) return <Navigate to="/signup" replace />;

  return children;
};

export default ProtectedRoute;
