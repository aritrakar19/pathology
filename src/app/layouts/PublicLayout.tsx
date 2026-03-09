import { Outlet, Link } from "react-router";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import React from "react";

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E6F0EE] shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1C2B2A]">MediPath</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
                Home
              </Link>
              <Link to="/book-test" className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
                Book Test
              </Link>
              <Link to="/track-report" className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
                Track Report
              </Link>
              <Link to="/about" className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
                Contact
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#1C2B2A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#E6F0EE]">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/book-test"
                  className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Test
                </Link>
                <Link
                  to="/track-report"
                  className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Report
                </Link>
                <Link
                  to="/about"
                  className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E6F0EE] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-[#1C2B2A]">MediPath</span>
              </div>
              <p className="text-[#6B7C7B] text-sm">
                Your trusted pathology and diagnostic center partner.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-[#1C2B2A]">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
                  Home
                </Link>
                <Link to="/book-test" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
                  Book Test
                </Link>
                <Link to="/track-report" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
                  Track Report
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-[#1C2B2A]">Services</h3>
              <div className="flex flex-col gap-2">
                <p className="text-[#6B7C7B] text-sm">Blood Test</p>
                <p className="text-[#6B7C7B] text-sm">X-Ray</p>
                <p className="text-[#6B7C7B] text-sm">MRI Scan</p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-[#1C2B2A]">Contact</h3>
              <div className="flex flex-col gap-2">
                <p className="text-[#6B7C7B] text-sm">support@medipath.com</p>
                <p className="text-[#6B7C7B] text-sm">+1 (555) 123-4567</p>
                <p className="text-[#6B7C7B] text-sm">24/7 Support Available</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E6F0EE] text-center text-[#6B7C7B] text-sm">
            © 2026 MediPath. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
