import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "lucide-react";
import { auth, saveUserWithRole, type UserRole } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = cred.user;
      // Save user document with selected role
      await saveUserWithRole(
        {
          ...user,
          displayName: formData.name,
        } as any,
        role,
      );
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }
    } catch (err) {
      console.error("Signup failed", err);
      alert("Sign up failed. Please check your details and try again.");
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Create Account</h1>
          <p className="text-[#6B7C7B] text-sm">
            Sign up and choose how you want to use MediPath.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-[#1C2B2A] mb-3 text-sm">Sign up as</label>
            <div className="grid grid-cols-3 gap-3">
              {(["patient", "doctor", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-4 py-3 rounded-xl transition-all text-sm capitalize ${
                    role === r
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                      : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

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
              <label className="block text-[#1C2B2A] mb-2 text-sm">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
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
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

