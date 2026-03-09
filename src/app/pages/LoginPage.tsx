import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"admin" | "doctor" | "patient">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect based on role
    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/patient");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F8F7]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-[#1C2B2A]">MediPath</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Welcome Back</h1>
          <p className="text-[#6B7C7B]">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-[#1C2B2A] mb-3">Login As</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "patient", label: "Patient" },
                { value: "doctor", label: "Doctor" },
                { value: "admin", label: "Admin" },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value as any)}
                  className={`px-4 py-3 rounded-xl transition-all text-sm ${
                    selectedRole === role.value
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                      : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#1C2B2A] mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7C7B] hover:text-[#1FAF9A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#6B7C7B] cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E6F0EE] text-[#1FAF9A] focus:ring-[#1FAF9A]"
                />
                Remember me
              </label>
              <a href="#" className="text-[#1FAF9A] hover:text-[#0E7C6B]">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[#F4F8F7] rounded-xl">
            <p className="text-xs text-[#6B7C7B] mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-[#6B7C7B]">
              <p>Patient: patient@demo.com / demo123</p>
              <p>Doctor: doctor@demo.com / demo123</p>
              <p>Admin: admin@demo.com / demo123</p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-[#6B7C7B]">
            Don't have an account?{" "}
            <a href="#" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">
              Sign Up
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
