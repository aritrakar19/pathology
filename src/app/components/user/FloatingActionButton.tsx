import React, { useState } from "react";
import { Link } from "react-router";
import { Plus, TestTube, Stethoscope, Pill, X, Bot } from "lucide-react";

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: "Book Test", icon: TestTube, path: "/user/book-test", color: "from-[#1FAF9A] to-[#0E7C6B]" },
    { label: "Book Doctor", icon: Stethoscope, path: "/user/book-doctor", color: "from-[#45B7D1] to-[#2980B9]" },
    { label: "Order Medicine", icon: Pill, path: "/user/pharmacy", color: "from-[#6C5CE7] to-[#4834D4]" },
    { label: "AI Assistant", icon: Bot, path: "/user/ai-assistant", color: "from-[#FF8A65] to-[#E64A19]" },
  ];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3">
      {/* Action items */}
      {open && (
        <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 group"
              >
                <span className="bg-white text-[#1C2B2A] text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-[#1FAF9A]/30 transition-all duration-300 ${
          open ? "rotate-45" : ""
        }`}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
