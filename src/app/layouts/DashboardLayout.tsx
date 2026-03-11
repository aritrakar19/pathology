import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Activity,
  LayoutDashboard,
  Users,
  UserCog,
  TestTube,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  Upload,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Beaker,
  ClipboardList,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

interface DashboardLayoutProps {
  role: "admin" | "doctor" | "patient";
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const adminMenuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/doctors", label: "Manage Doctors", icon: UserCog },
    { path: "/admin/patients", label: "Manage Patients", icon: Users },
    { path: "/admin/test-categories", label: "Test Categories", icon: TestTube },
    { path: "/admin/reports", label: "Reports Management", icon: FileText },
    { path: "/admin/appointments", label: "Appointments", icon: Calendar },
    { path: "/admin/booking", label: "Booking", icon: Calendar },
    { path: "/admin/booking-management", label: "Booking Management", icon: FileText },
    { path: "/admin/payments", label: "Payments", icon: CreditCard },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/sample-collection-queue", label: "Sample Collection", icon: Beaker },
    { path: "/admin/sample-tracking", label: "Sample Tracking", icon: ClipboardList },
    { path: "/admin/result-entry", label: "Result Entry", icon: Upload },
    { path: "/admin/doctor-verification", label: "Doctor Verification", icon: CheckCircle },
    { path: "/admin/report-generation", label: "Report Generation", icon: FileCheck },
  ];

  const doctorMenuItems = [
    { path: "/doctor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/doctor/patients", label: "My Patients", icon: Users },
    { path: "/doctor/upload-reports", label: "Upload Reports", icon: Upload },
    { path: "/doctor/appointments", label: "Appointments", icon: Calendar },
  ];

  const patientMenuItems = [
    { path: "/patient", label: "Dashboard", icon: LayoutDashboard },
    { path: "/patient/book-test", label: "Book Test", icon: TestTube },
    { path: "/patient/reports", label: "My Reports", icon: FileText },
    { path: "/patient/appointments", label: "Appointments", icon: Calendar },
    { path: "/patient/payment-history", label: "Payment History", icon: CreditCard },
    { path: "/patient/booking-tracking", label: "Booking Tracking", icon: Activity },
  ];

  const menuItems =
    role === "admin" ? adminMenuItems : role === "doctor" ? doctorMenuItems : patientMenuItems;

  const roleName = role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "Patient";
  const userName =
    role === "admin"
      ? "Admin User"
      : role === "doctor"
      ? "Dr. John Smith"
      : "Sarah Johnson";

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during logout", err);
    } finally {
      setProfileMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F8F7]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-[#E6F0EE] transition-all duration-300 fixed h-screen z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-[#E6F0EE] flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1C2B2A]">MediPath</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                      : "text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A]"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-12 border-t border-[#E6F0EE] flex items-center justify-center text-[#6B7C7B] hover:text-[#1FAF9A] hover:bg-[#F4F8F7] transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E6F0EE] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-[#6B7C7B] hover:text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#F4F8F7] rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-sm">
                  {userName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm text-[#1C2B2A]">{userName}</p>
                  <p className="text-xs text-[#6B7C7B]">{roleName}</p>
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E6F0EE] py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}