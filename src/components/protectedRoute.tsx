import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/Admin";

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  console.log("ProtectedRoute isAdmin:", isAdmin, "loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
