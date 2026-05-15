import React from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  TestTube,
  Stethoscope,
  MapPin,
  User,
} from "lucide-react";

const navItems = [
  { path: "/user/home", label: "Home", icon: Home },
  { path: "/user/book-test", label: "Tests", icon: TestTube },
  { path: "/user/book-doctor", label: "Doctors", icon: Stethoscope },
  { path: "/user/tracking", label: "Track", icon: MapPin },
  { path: "/user/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/98 backdrop-blur-2xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(31,175,154,0.08)]">
      <div className="flex items-center justify-around px-1 safe-area-bottom" style={{ paddingTop: "8px", paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))" }}>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 min-w-[60px] relative"
            >
              <div
                className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-[#1FAF9A]/15 to-[#0E7C6B]/10 scale-110"
                    : "scale-100"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-[#1FAF9A]/10 blur-sm" />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    isActive
                      ? "text-[#1FAF9A] stroke-[2.5]"
                      : "text-[#9BB5B3] stroke-[1.5]"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? "text-[#1FAF9A]" : "text-[#9BB5B3]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
