import React, { useState } from "react";
import { Bell, Moon, Globe, Lock, HelpCircle, LogOut, ChevronRight, Shield, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { toast } from "sonner";

export function SettingsPage() {
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", desc: "Manage push & email alerts", toggle: true, value: notifEnabled, onChange: () => setNotifEnabled(!notifEnabled) },
        { icon: Moon, label: "Dark Mode", desc: "Switch to dark theme", toggle: true, value: darkMode, onChange: () => setDarkMode(!darkMode) },
        { icon: Globe, label: "Language", desc: "English (India)", toggle: false },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: Lock, label: "Change Password", desc: "Update your password", toggle: false },
        { icon: Shield, label: "Two-Factor Auth", desc: "Add extra security", toggle: false },
        { icon: Smartphone, label: "Linked Devices", desc: "Manage active sessions", toggle: false },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQ", desc: "Get answers to common questions", toggle: false },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1C2B2A]">Settings</h1>

      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
          <h3 className="px-5 pt-5 pb-2 text-xs uppercase tracking-wider text-[#6B7C7B] font-semibold">{section.title}</h3>
          {section.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-[#F4F8F7] transition-colors text-left ${i < section.items.length - 1 ? "border-b border-[#E6F0EE]" : ""}`}>
                <div className="w-10 h-10 bg-[#F4F8F7] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1FAF9A]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C2B2A]">{item.label}</p>
                  <p className="text-xs text-[#6B7C7B]">{item.desc}</p>
                </div>
                {item.toggle ? (
                  <div onClick={(e) => { e.stopPropagation(); item.onChange?.(); }} className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${item.value ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-5.5" : "translate-x-0.5"}`} />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#6B7C7B]" />
                )}
              </button>
            );
          })}
        </div>
      ))}

      <button 
        onClick={async () => {
          try {
            await signOut(auth);
            toast.success("Logged out successfully");
            navigate("/login");
          } catch (err) {
            toast.error("Failed to log out");
          }
        }}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-medium hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
}
