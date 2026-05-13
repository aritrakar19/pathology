import React from "react";
import { Link } from "react-router";
import { Activity, ArrowLeft } from "lucide-react";

export function ForgotPassword() {
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
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Reset Password</h1>
          <p className="text-[#6B7C7B] text-sm">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          <form className="space-y-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Email Address</label>
              <input type="email" placeholder="Enter your registered email" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
              Send Reset Link
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/user-login" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
