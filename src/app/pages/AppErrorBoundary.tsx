import React from "react";
import { isRouteErrorResponse, useRouteError, Link } from "react-router";

export function AppErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusLabel = "Error";

  if (isRouteErrorResponse(error)) {
    statusLabel = `${error.status} ${error.statusText}`;

    if (error.status === 404) {
      title = "Page not found";
      message = "The page you are looking for does not exist or may have been moved.";
    } else if (error.status >= 500) {
      title = "Server error";
      message = "We encountered a server error while loading this page.";
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-[#1FAF9A] tracking-wide uppercase mb-2">
          {statusLabel}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C2B2A] mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-[#6B7C7B] mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all w-full sm:w-auto"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

