import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Activity, Eye, EyeOff } from "lucide-react";
import { signInWithGooglePopup, getUserRole, saveUserWithRole, auth, type UserRole } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"admin" | "doctor" | "patient">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole>("patient");
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGoogleLoading(true);
      const cred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = cred.user;
      const role = await getUserRole(user.uid);
      if (role) {
        redirectByRole(role);
        return;
      }
      // No saved role yet, ask the user.
      setPendingUserId(user.uid);
      setShowRoleDialog(true);
    } catch (err) {
      console.error("Email login failed", err);
      alert("Login failed. Please check your email and password.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/patient");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const user = await signInWithGooglePopup();
      if (!user) {
        setGoogleLoading(false);
        return;
      }

      const existingRole = await getUserRole(user.uid);
      if (existingRole) {
        redirectByRole(existingRole);
        setGoogleLoading(false);
        return;
      }

      // No role yet: ask the user which role they want.
      setPendingUserId(user.uid);
      setShowRoleDialog(true);
    } catch (err) {
      console.error("Google login failed", err);
      alert("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleConfirmRole = async () => {
    if (!pendingUserId) {
      setShowRoleDialog(false);
      return;
    }
    try {
      setGoogleLoading(true);
      const current = auth.currentUser;
      const baseUser =
        current && current.uid === pendingUserId
          ? current
          : ({ uid: pendingUserId, displayName: null, email: null, photoURL: null } as any);
      await saveUserWithRole(baseUser, pendingRole);
      setShowRoleDialog(false);
      redirectByRole(pendingRole);
    } catch (err) {
      console.error("Saving role failed", err);
      alert("Could not save your role. Please try again.");
    } finally {
      setGoogleLoading(false);
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
            disabled={googleLoading}
            className="w-full px-6 py-3 border border-[#E6F0EE] rounded-xl flex items-center justify-center gap-3 text-sm text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#F4F8F7] transition-all disabled:opacity-60"
          >
            <span className="w-5 h-5 bg-[url('https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg')] bg-contain bg-no-repeat" />
            {googleLoading ? "Signing in with Google..." : "Continue with Google"}
          </button>

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
            <Link to="/signup" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
            ← Back to Home
          </a>
        </div>
      </div>

      {/* Role selection overlay for Google sign-in */}
      {showRoleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E6F0EE] p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold text-[#1C2B2A] mb-2">
              Choose your role
            </h2>
            <p className="text-xs text-[#6B7C7B] mb-4">
              You&apos;ve signed in with Google. How would you like to use MediPath?
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(["patient", "doctor", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setPendingRole(role)}
                  className={`px-3 py-2 rounded-xl text-xs capitalize border transition-all ${
                    pendingRole === role
                      ? "border-[#1FAF9A] bg-[#E6F0EE] text-[#1FAF9A] font-semibold"
                      : "border-[#E6F0EE] bg-[#F4F8F7] text-[#6B7C7B] hover:border-[#1FAF9A]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRoleDialog(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-[#E6F0EE] text-xs text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRole}
                disabled={googleLoading}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-60"
              >
                Continue as {pendingRole}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
