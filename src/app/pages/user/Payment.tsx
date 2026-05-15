import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Wallet, Landmark, Banknote, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";
import { toast } from "sonner";

const paymentMethods = [
  {
    id: "upi",
    label: "UPI",
    sub: "Google Pay, PhonePe, Paytm",
    icon: Wallet,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badge: "Recommended",
    badgeColor: "bg-[#1FAF9A]/10 text-[#1FAF9A]",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, RuPay",
    icon: CreditCard,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badge: null,
    badgeColor: "",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    sub: "All Indian banks supported",
    icon: Landmark,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    badge: null,
    badgeColor: "",
  },
  {
    id: "cash",
    label: "Pay at Center / Home",
    sub: "Cash or UPI after collection",
    icon: Banknote,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    badge: null,
    badgeColor: "",
  },
];

// Step indicator
const STEPS = ["Test", "Sample", "Slot", "Details", "Payment"];

export function Payment() {
  const navigate = useNavigate();
  const { bookingState, updateBookingState, submitBooking, isSubmitting } = useBookingFlow();
  const [selectedMethod, setSelectedMethod] = useState("upi");

  const handleConfirm = async () => {
    updateBookingState({ paymentMethod: selectedMethod });
    const bookingId = await submitBooking();
    if (bookingId) {
      toast.success("Booking Confirmed successfully!");
      navigate(`/user/booking-success?id=${bookingId}`);
    } else {
      toast.error("Booking Failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-32 md:pb-8">
      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Payment</h1>
          <p className="text-xs text-[#6B7C7B]">Final step — confirm your booking</p>
        </div>
      </div>

      {/* ── STEP PROGRESS ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-4">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i === 4
                      ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white ring-4 ring-[#1FAF9A]/20"
                      : i < 4
                      ? "bg-[#1FAF9A] text-white"
                      : "bg-[#E6F0EE] text-[#6B7C7B]"
                  }`}
                >
                  {i < 4 ? <CheckCircle className="w-3.5 h-3.5" /> : "5"}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${i <= 4 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < 4 ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── BOOKING SUMMARY ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1FAF9A]/8 to-[#0E7C6B]/4 border border-[#1FAF9A]/20 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wider mb-3">Booking Summary</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[#1C2B2A] text-sm">{bookingState.testName || "No test selected"}</p>
              <p className="text-xs text-[#6B7C7B] capitalize mt-0.5">
                {bookingState.sampleMethod === "home" ? "🏠 Home Sample Collection" : "🏥 Visit Lab Center"}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-lg font-bold text-[#1FAF9A]">₹{bookingState.amount}</p>
              {bookingState.sampleMethod === "home" && (
                <p className="text-[10px] text-green-600 font-semibold">+ FREE Collection</p>
              )}
            </div>
          </div>
          <div className="border-t border-[#1FAF9A]/20 pt-2 flex justify-between text-xs text-[#6B7C7B]">
            <span>Patient: <strong className="text-[#1C2B2A]">{bookingState.patientName || "Not specified"}</strong></span>
            <span>{bookingState.slotDate || "Flexible"}</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT METHODS ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-4">
        <h3 className="font-bold text-[#1C2B2A] mb-3">Select Payment Method</h3>
        <div className="space-y-2.5">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left active:scale-[0.99] ${
                  isSelected
                    ? "border-[#1FAF9A] bg-[#1FAF9A]/4 shadow-sm shadow-[#1FAF9A]/10"
                    : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"
                }`}
              >
                <div className={`w-11 h-11 ${method.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${method.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1C2B2A] text-sm">{method.label}</h4>
                    {method.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${method.badgeColor}`}>
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7C7B] mt-0.5">{method.sub}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "border-[#1FAF9A]" : "border-[#E6F0EE]"
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1FAF9A]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 justify-center py-1 text-xs text-[#6B7C7B]">
        <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
        100% Safe &amp; Secure Payment · SSL Encrypted
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#6B7C7B]">Total Amount</span>
            <span className="text-xl font-bold text-[#1FAF9A]">₹{bookingState.amount}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !bookingState.testId}
            className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#1FAF9A]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Confirm Booking</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
