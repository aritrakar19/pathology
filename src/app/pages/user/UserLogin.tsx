import React, { useState } from "react";
import { Link } from "react-router";
import { Activity, Eye, EyeOff, Phone } from "lucide-react";

export function UserLogin() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

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
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Welcome Back</h1>
          <p className="text-[#6B7C7B] text-sm">Sign in to your healthcare account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6F0EE] shadow-lg p-8">
          {/* Method toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-[#F4F8F7] p-1 rounded-xl">
            <button onClick={() => { setLoginMethod("phone"); setOtpSent(false); }} className={`py-2.5 rounded-lg text-sm font-medium transition-all ${loginMethod === "phone" ? "bg-white text-[#1FAF9A] shadow-sm" : "text-[#6B7C7B]"}`}>
              📱 Mobile OTP
            </button>
            <button onClick={() => setLoginMethod("email")} className={`py-2.5 rounded-lg text-sm font-medium transition-all ${loginMethod === "email" ? "bg-white text-[#1FAF9A] shadow-sm" : "text-[#6B7C7B]"}`}>
              ✉️ Email
            </button>
          </div>

          {loginMethod === "phone" ? (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-[#1C2B2A] mb-2 text-sm">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="px-3 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm text-[#6B7C7B] flex items-center">+91</div>
                      <input type="tel" placeholder="Enter mobile number" className="flex-1 px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
                    </div>
                  </div>
                  <button onClick={() => setOtpSent(true)} className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[#1C2B2A] mb-2 text-sm">Enter OTP</label>
                    <div className="flex gap-2 justify-center">
                      {[1,2,3,4,5,6].map((i) => (
                        <input key={i} type="text" maxLength={1} className="w-11 h-12 text-center bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#6B7C7B] mt-2 text-center">Didn't receive? <button className="text-[#1FAF9A] font-medium">Resend</button></p>
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
                    Verify & Sign In
                  </button>
                </>
              )}
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-[#1C2B2A] mb-2 text-sm">Email Address</label>
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
              </div>
              <div>
                <label className="block text-[#1C2B2A] mb-2 text-sm">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Enter password" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7C7B]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#6B7C7B] cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-[#1FAF9A]" /> Remember me
                </label>
                <Link to="/user-forgot-password" className="text-[#1FAF9A] hover:text-[#0E7C6B]">Forgot Password?</Link>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
                Sign In
              </button>
            </form>
          )}

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-[#E6F0EE]" />
            <span className="px-3 text-xs text-[#6B7C7B] uppercase">or</span>
            <div className="flex-1 h-px bg-[#E6F0EE]" />
          </div>

          <button className="w-full px-6 py-3 border border-[#E6F0EE] rounded-xl flex items-center justify-center gap-3 text-sm text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#F4F8F7] transition-all">
            <span className="w-5 h-5 bg-[url('https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg')] bg-contain bg-no-repeat" />
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-[#6B7C7B]">
            Don&apos;t have an account?{" "}
            <Link to="/user-signup" className="text-[#1FAF9A] hover:text-[#0E7C6B] font-medium">Sign Up</Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
