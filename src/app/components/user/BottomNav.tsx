import React from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  TestTube,
  Stethoscope,
  Pill,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { path: "/user/home", label: "Home", icon: Home },
  { path: "/user/book-test", label: "Tests", icon: TestTube },
  { path: "/user/book-doctor", label: "Doctors", icon: Stethoscope },
  { path: "/user/pharmacy", label: "Pharmacy", icon: Pill },
  { path: "/user/tracking", label: "Tracking", icon: ClipboardList },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-[#1FAF9A]"
                  : "text-[#6B7C7B] hover:text-[#1FAF9A]"
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? "bg-[#1FAF9A]/10" : ""}`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1FAF9A] rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-[#1FAF9A]" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
