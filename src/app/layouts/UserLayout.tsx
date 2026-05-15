import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Activity,
  Bell,
  Search,
  MapPin,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import { BottomNav } from "../components/user/BottomNav";
import { FloatingActionButton } from "../components/user/FloatingActionButton";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "sonner";
import { useUserProfile } from "../context/ProfileContext";

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  const isHomePage = location.pathname === "/user/home" || location.pathname === "/user";

  return (
    <div className="min-h-screen bg-[#F4F8F7] flex flex-col">
      {/* ─── TOP NAV BAR ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-2xl border-b border-[#E6F0EE] shadow-[0_2px_20px_rgba(31,175,154,0.06)]">
        <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 max-w-screen-xl mx-auto">
          
          {/* Left: Logo */}
          <Link to="/user/home" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center shadow-md shadow-[#1FAF9A]/25">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-base md:text-lg font-bold text-[#1C2B2A] tracking-tight">MediPath</span>
          </Link>

          {/* Center: Location (md+) */}
          <button className="hidden md:flex items-center gap-1.5 text-sm text-[#1C2B2A] hover:text-[#1FAF9A] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#F4F8F7]">
            <MapPin className="w-4 h-4 text-[#1FAF9A]" />
            <span className="font-medium">Delhi NCR</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7C7B]" />
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search (mobile icon, desktop expanded) */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
                <input
                  type="text"
                  placeholder="Search tests, doctors..."
                  className="pl-9 pr-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all w-56"
                />
              </div>
            </div>
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-all"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#E6F0EE] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pb-2 border-b border-[#E6F0EE] flex items-center justify-between">
                      <h3 className="font-semibold text-[#1C2B2A] text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs text-[#1FAF9A] font-medium">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-[#F4F8F7] transition-colors cursor-pointer border-b border-[#E6F0EE]/50 last:border-0 ${
                            n.unread ? "bg-[#1FAF9A]/3" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {n.unread && <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-1.5" />}
                            <div className={n.unread ? "" : "ml-5"}>
                              <p className="text-sm text-[#1C2B2A] leading-snug">{n.text}</p>
                              <p className="text-xs text-[#6B7C7B] mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="w-9 h-9 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center text-white text-sm font-bold uppercase shadow-md shadow-[#1FAF9A]/25 hover:shadow-lg hover:shadow-[#1FAF9A]/30 transition-all"
              >
                {profile?.fullName?.charAt(0) || "U"}
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#E6F0EE] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#E6F0EE]">
                      <p className="font-semibold text-[#1C2B2A] text-sm">{profile?.fullName || "User"}</p>
                      <p className="text-xs text-[#6B7C7B] truncate">{profile?.email || ""}</p>
                    </div>
                    <Link
                      to="/user/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/user/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <div className="border-t border-[#E6F0EE] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Expand */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
              <input
                type="text"
                autoFocus
                placeholder="Search tests, doctors, medicines..."
                className="w-full pl-10 pr-10 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7C7B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* ─── BOTTOM NAVIGATION (Mobile) ────────────────────────────── */}
      <BottomNav />

      {/* ─── FLOATING ACTION BUTTON ────────────────────────────────── */}
      <FloatingActionButton />
    </div>
  );
}
