import React from "react";
import { Link, useLocation } from "react-router";

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-[#1FAF9A] tracking-wide uppercase mb-2">
          404 · Page Not Found
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C2B2A] mb-3">
          We couldn&apos;t find that page
        </h1>
        <p className="text-sm sm:text-base text-[#6B7C7B] mb-6">
          The requested path <span className="font-mono text-xs bg-[#F4F8F7] px-1.5 py-0.5 rounded">
            {location.pathname}
          </span>{" "}
          doesn&apos;t match any route. Check the URL or use one of the main navigation links.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all w-full sm:w-auto"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[#E6F0EE] text-sm font-semibold text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] bg-white transition-all w-full sm:w-auto"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

