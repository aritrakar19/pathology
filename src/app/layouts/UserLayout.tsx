import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Activity,
  Home,
  TestTube,
  Stethoscope,
  Pill,
  ClipboardList,
  FileText,
  User,
  Settings,
  Bell,
  Search,
  MapPin,
  ChevronDown,
  LogOut,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { BottomNav } from "../components/user/BottomNav";
import { FloatingActionButton } from "../components/user/FloatingActionButton";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "sonner";
import { useUserProfile } from "../context/ProfileContext";

const sidebarItems = [
  { path: "/user/home", label: "Home", icon: Home },
  { path: "/user/book-test", label: "Book Test", icon: TestTube },
  { path: "/user/book-doctor", label: "Doctors", icon: Stethoscope },
  { path: "/user/pharmacy", label: "Pharmacy", icon: Pill },
  { path: "/user/tracking", label: "Tracking", icon: ClipboardList },
  { path: "/user/reports", label: "Reports", icon: FileText },
  { path: "/user/ai-assistant", label: "AI Assistant", icon: Bot },
  { path: "/user/profile", label: "Profile", icon: User },
  { path: "/user/settings", label: "Settings", icon: Settings },
];

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { profile } = useUserProfile();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
      toast.error("Failed to log out");
    }
  };

  const notifications = [
    { id: 1, text: "Your blood test report is ready", time: "2 min ago", unread: true },
    { id: 2, text: "Appointment with Dr. Priya confirmed", time: "1 hour ago", unread: true },
    { id: 3, text: "Medicine order #4521 delivered", time: "Yesterday", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen flex bg-[#F4F8F7]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E6F0EE] fixed h-screen z-40 flex-col">
        {/* Logo */}
        <div className="h-16 border-b border-[#E6F0EE] flex items-center px-5">
          <Link to="/user/home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1C2B2A]">MediPath</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                      : "text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E6F0EE]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 border-b border-[#E6F0EE] flex items-center justify-between px-5">
              <Link to="/user/home" className="flex items-center gap-2" onClick={() => setMobileSidebarOpen(false)}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-[#1C2B2A]">MediPath</span>
              </Link>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-[#6B7C7B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-6 px-3 overflow-y-auto">
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                          : "text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A]"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-[#E6F0EE] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-[#1C2B2A] hover:bg-[#F4F8F7] rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Location selector */}
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-[#1C2B2A] hover:text-[#1FAF9A] transition-colors">
              <MapPin className="w-4 h-4 text-[#1FAF9A]" />
              <span className="font-medium">Delhi NCR</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7C7B]" />
            </button>

            {/* Desktop Search */}
            <div className="hidden md:block relative max-w-md w-full ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
              <input
                type="text"
                placeholder="Search tests, doctors, medicines..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile search */}
            <button className="md:hidden p-2 text-[#6B7C7B] hover:text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 text-[#6B7C7B] hover:text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E6F0EE] py-3 z-50">
                  <div className="px-4 pb-2 border-b border-[#E6F0EE]">
                    <h3 className="font-semibold text-[#1C2B2A] text-sm">Notifications</h3>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-[#F4F8F7] transition-colors cursor-pointer ${n.unread ? "bg-[#F4F8F7]/50" : ""}`}>
                      <p className="text-sm text-[#1C2B2A]">{n.text}</p>
                      <p className="text-xs text-[#6B7C7B] mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F4F8F7] rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-sm font-semibold uppercase">
                  {profile?.fullName?.charAt(0) || "U"}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm text-[#1C2B2A] font-medium">{profile?.fullName ? profile.fullName.split(" ")[0] : "User"}</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E6F0EE] py-2 z-50">
                  <Link
                    to="/user/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    to="/user/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-red-500 transition-colors"
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
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
