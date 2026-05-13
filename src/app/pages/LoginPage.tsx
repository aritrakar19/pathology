import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Activity, Eye, EyeOff } from "lucide-react";
import { signInWithGooglePopup, getUserRole, saveUserWithRole, auth, type UserRole } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role) {
      redirectByRole(role);
    }
  }, [user, role, navigate]);

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "doctor") {
      navigate("/doctor");
    } else if (role === "patient") {
      navigate("/patient");
    } else {
      navigate("/user/home");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userObj = cred.user;
      const userRole = await getUserRole(userObj.uid);
      if (userRole) {
        redirectByRole(userRole);
      } else {
        navigate("/user/home");
      }
      toast.success("Logged in successfully");
    } catch (err: any) {
      console.error("Email login failed", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        toast.error("Invalid email or password");
      } else if (err.code === "auth/user-not-found") {
        toast.error("User not found");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const userObj = await signInWithGooglePopup();
      if (!userObj) {
        setLoading(false);
        return;
      }

      const existingRole = await getUserRole(userObj.uid);
      if (existingRole) {
        redirectByRole(existingRole);
      } else {
        // Save as default 'user' if it's a new user signing in via Google
        await saveUserWithRole(userObj as any, "user");
        navigate("/user/home");
      }
      toast.success("Logged in successfully");
    } catch (err: any) {
      console.error("Google login failed", err);
      toast.error("Google sign-in failed. Please try again.");
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
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Welcome Back</h1>
          <p className="text-[#6B7C7B]">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
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
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-[#E6F0EE]" />
            <span className="px-3 text-xs uppercase tracking-wide text-[#6B7C7B]">
              or
            </span>
            <div className="flex-1 h-px bg-[#E6F0EE]" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-3 border border-[#E6F0EE] rounded-xl flex items-center justify-center gap-3 text-sm text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#F4F8F7] transition-all disabled:opacity-60"
          >
            <span className="w-5 h-5 bg-[url('https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg')] bg-contain bg-no-repeat" />
            {loading ? "Please wait..." : "Continue with Google"}
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-[#6B7C7B]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
