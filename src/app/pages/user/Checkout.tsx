import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useUserProfile } from "../../context/ProfileContext";
import { toast } from "sonner";

export function Checkout() {
  const { cartItems, subtotal, delivery, discount, total, checkout, isCheckingOut } = useCart();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("UPI / Google Pay");

  const handleCheckout = async () => {
    const bookingId = await checkout(paymentMethod);
    if (bookingId) {
      toast.success("Order placed successfully!");
      navigate(`/user/booking-success?id=${bookingId}`);
    } else {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    navigate("/user/cart");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-32 md:pb-8">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          to="/user/cart"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Checkout</h1>
          <p className="text-xs text-[#6B7C7B]">{cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      {/* ── CART ITEMS SUMMARY ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6F0EE]">
          <h3 className="font-bold text-[#1C2B2A] text-sm">Your Items</h3>
        </div>
        {cartItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-[#E6F0EE]/50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                💊
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C2B2A]">{item.name}</p>
                <p className="text-xs text-[#6B7C7B]">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#1C2B2A]">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      {/* ── DELIVERY ADDRESS ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1FAF9A]" />
            <h3 className="font-bold text-[#1C2B2A] text-sm">Delivery Address</h3>
          </div>
          <button className="text-xs text-[#1FAF9A] font-semibold">Change</button>
        </div>
        <div className="bg-[#F4F8F7] rounded-xl p-4">
          <p className="font-semibold text-[#1C2B2A] text-sm">{profile?.fullName}</p>
          <p className="text-xs text-[#6B7C7B] mt-1 leading-relaxed">
            Address not provided.{" "}
            <span className="text-[#1FAF9A] font-medium">Update your profile</span> to add one.
          </p>
          <p className="text-xs text-[#6B7C7B] mt-1">📞 {profile?.phone}</p>
        </div>
      </div>

      {/* ── PAYMENT METHOD ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-[#1FAF9A]" />
          <h3 className="font-bold text-[#1C2B2A] text-sm">Payment Method</h3>
        </div>
        <div className="space-y-2">
          {["UPI / Google Pay", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((m) => (
            <label
              key={m}
              className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border-2 ${
                paymentMethod === m
                  ? "border-[#1FAF9A] bg-[#1FAF9A]/4"
                  : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)}
                className="w-4 h-4 text-[#1FAF9A] accent-[#1FAF9A]"
              />
              <span className="text-sm font-medium text-[#1C2B2A]">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 justify-center text-xs text-[#6B7C7B]">
        <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
        100% Safe &amp; Secure Payment
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-2xl mx-auto">
          {/* Order total */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex gap-4 text-[#6B7C7B]">
              <span>Subtotal: <strong className="text-[#1C2B2A]">₹{subtotal}</strong></span>
              {discount > 0 && <span className="text-green-600">-₹{discount}</span>}
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6B7C7B]">Total to Pay</p>
              <p className="text-xl font-bold text-[#1FAF9A]">₹{total}</p>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#1FAF9A]/30 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {isCheckingOut ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle className="w-5 h-5" /> Place Order — ₹{total}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
