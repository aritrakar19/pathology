import React from "react";
import { Activity } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center animate-pulse">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-[#1FAF9A]/20 rounded-2xl animate-ping" />
      </div>
      <p className="mt-4 text-sm text-[#6B7C7B] animate-pulse">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden animate-pulse">
      <div className="h-40 bg-[#E6F0EE]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#E6F0EE] rounded-lg w-3/4" />
        <div className="h-3 bg-[#E6F0EE] rounded-lg w-full" />
        <div className="h-3 bg-[#E6F0EE] rounded-lg w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-[#E6F0EE] rounded-lg w-16" />
          <div className="h-8 bg-[#E6F0EE] rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}
