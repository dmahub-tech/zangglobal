
import React, { useAdminAuth } from "../context/Admin";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;