import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If user has a role but not the right one, redirect to home or their specific dashboard
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "doctor") return <Navigate to="/doctor" replace />;
    return <Navigate to="/user/home" replace />;
  }

  return <>{children}</>;
};
