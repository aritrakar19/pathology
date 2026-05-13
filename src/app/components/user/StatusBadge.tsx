import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Confirmed": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  "Sample Collected": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  "Processing": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  "Report Ready": { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  "Delivered": { bg: "bg-[#E6F0EE]", text: "text-[#0E7C6B]", dot: "bg-[#1FAF9A]" },
  "Ready": { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  "Pending": { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" },
  "Cancelled": { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" };
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
