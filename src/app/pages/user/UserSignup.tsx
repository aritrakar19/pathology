import React from "react";
import { Link } from "react-router";
import { Activity } from "lucide-react";

export function UserSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F8F7]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-[#1C2B2A]">MediPath</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Create Account</h1>
          <p className="text-[#6B7C7B] text-sm">Join MediPath for smart healthcare</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          <form className="space-y-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Full Name</label>
              <input type="text" placeholder="Enter your full name" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
            </div>
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Phone Number</label>
              <div className="flex gap-2">
                <div className="px-3 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm text-[#6B7C7B]">+91</div>
                <input type="tel" placeholder="Mobile number" className="flex-1 px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
              </div>
            </div>
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Email Address</label>
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
            </div>
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Password</label>
              <input type="password" placeholder="Create a password" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all mt-2">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7C7B]">
            Already have an account?{" "}
            <Link to="/user-login" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
