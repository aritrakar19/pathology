import React from "react";
import { Navigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../../firebase";

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "doctor":
      return "/doctor";
    case "patient":
      return "/patient";
    default:
      return "/user/home";
  }
}

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8F7]">
        <Loader2 className="w-8 h-8 text-[#1FAF9A] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const dashboard = getDashboardPath(role);
    const alreadyOnDashboard =
      location.pathname === dashboard || location.pathname.startsWith(`${dashboard}/`);

    if (!alreadyOnDashboard) {
      return <Navigate to={dashboard} replace />;
    }
  }

  return <>{children}</>;
};
