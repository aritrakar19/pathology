import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Loader2 } from "lucide-react";
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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/user/cart" className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-[#1C2B2A]">Checkout</h1>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1C2B2A] flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1FAF9A]" /> Delivery Address</h3>
          <button className="text-xs text-[#1FAF9A] font-medium">Change</button>
        </div>
        <div className="bg-[#F4F8F7] rounded-xl p-4">
          <p className="font-medium text-[#1C2B2A] text-sm">{profile?.fullName}</p>
          <p className="text-xs text-[#6B7C7B] mt-1">{profile?.address || "Address not provided. Please update profile."}</p>
          <p className="text-xs text-[#6B7C7B]">Phone: {profile?.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h3 className="font-semibold text-[#1C2B2A] flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-[#1FAF9A]" /> Payment Method</h3>
        <div className="space-y-2">
          {["UPI / Google Pay", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((m) => (
            <label key={m} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === m ? "bg-[#1FAF9A]/5 border border-[#1FAF9A]" : "bg-[#F4F8F7] border border-transparent hover:border-[#E6F0EE]"}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)} 
                className="w-4 h-4 text-[#1FAF9A]" 
              />
              <span className="text-sm text-[#1C2B2A]">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 space-y-3">
        <h3 className="font-semibold text-[#1C2B2A]">Order Summary</h3>
        <div className="flex justify-between text-sm text-[#6B7C7B]"><span>Items ({cartItems.length})</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between text-sm text-[#6B7C7B]"><span>Delivery</span><span>₹{delivery}</span></div>
        <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
        <div className="border-t border-[#E6F0EE] pt-3 flex justify-between font-bold text-[#1C2B2A]">
          <span>Total</span><span>₹{total}</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} 
        {isCheckingOut ? "Processing..." : `Place Order — ₹${total}`}
      </button>
    </div>
  );
}
