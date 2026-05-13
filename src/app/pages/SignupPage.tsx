import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Activity } from "lucide-react";
import { auth, saveUserWithRole, type UserRole } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "patient") navigate("/patient");
      else navigate("/user/home");
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userObj = cred.user;
      
      // Save user document with default role "user"
      await saveUserWithRole(
        {
          ...userObj,
          displayName: formData.name,
        } as any,
        "user",
        formData.phone
      );
      
      toast.success("Account created successfully!");
      navigate("/user/home");
    } catch (err: any) {
      console.error("Signup failed", err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else {
        toast.error("Signup failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F8F7]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-[#1C2B2A]">MediPath</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Create Account</h1>
          <p className="text-[#6B7C7B] text-sm">
            Sign up to access your healthcare dashboard.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent text-sm"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent text-sm"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7C7B]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

