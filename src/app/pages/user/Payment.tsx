import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Wallet, Landmark, Banknote, ShieldCheck, Loader2 } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";
import { toast } from "sonner";

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Payment</h1>
          <p className="text-sm text-[#6B7C7B]">Complete your booking</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6F0EE] flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6F0EE] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#1FAF9A] -translate-y-1/2 z-0" />
        
        {["Test", "Sample", "Slot", "Details", "Payment"].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 4 ? "bg-[#1FAF9A] text-white ring-4 ring-[#1FAF9A]/20" : i < 4 ? "bg-[#1FAF9A] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"}`}>
              {i < 4 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${i <= 4 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>{step}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Col: Payment Methods */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
            <h2 className="text-lg font-bold text-[#1C2B2A] mb-4">Select Payment Method</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedMethod("upi")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "upi" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1C2B2A] text-sm">UPI</h3>
                  <p className="text-xs text-[#6B7C7B]">Google Pay, PhonePe, Paytm</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "upi" ? "border-[#1FAF9A]" : "border-[#E6F0EE]"}`}>
                  {selectedMethod === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-[#1FAF9A]" />}
                </div>
              </button>

              <button 
                onClick={() => setSelectedMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "card" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}
              >
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1C2B2A] text-sm">Credit / Debit Card</h3>
                  <p className="text-xs text-[#6B7C7B]">Visa, Mastercard, RuPay</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "card" ? "border-[#1FAF9A]" : "border-[#E6F0EE]"}`}>
                  {selectedMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-[#1FAF9A]" />}
                </div>
              </button>

              <button 
                onClick={() => setSelectedMethod("netbanking")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "netbanking" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1C2B2A] text-sm">Net Banking</h3>
                  <p className="text-xs text-[#6B7C7B]">All Indian banks supported</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "netbanking" ? "border-[#1FAF9A]" : "border-[#E6F0EE]"}`}>
                  {selectedMethod === "netbanking" && <div className="w-2.5 h-2.5 rounded-full bg-[#1FAF9A]" />}
                </div>
              </button>

              <button 
                onClick={() => setSelectedMethod("cash")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "cash" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}
              >
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1C2B2A] text-sm">Pay at Center / Home</h3>
                  <p className="text-xs text-[#6B7C7B]">Pay via cash or UPI after sample collection</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "cash" ? "border-[#1FAF9A]" : "border-[#E6F0EE]"}`}>
                  {selectedMethod === "cash" && <div className="w-2.5 h-2.5 rounded-full bg-[#1FAF9A]" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6 sticky top-24">
            <h3 className="font-bold text-[#1C2B2A] mb-4">Booking Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm font-medium text-[#1C2B2A]">{bookingState.testName || "Select a Test"}</p>
                <p className="text-xs text-[#6B7C7B] capitalize">{bookingState.sampleMethod === "home" ? "Home Sample Collection" : "Visit Lab Center"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C2B2A]">Patient: {bookingState.patientName || "Not specified"}</p>
                <p className="text-xs text-[#6B7C7B]">{bookingState.slotDate || "Any Day"}, {bookingState.slotTime || "Any Time"}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-[#E6F0EE] py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7C7B]">Test Price</span>
                <span className="font-medium text-[#1C2B2A]">₹{bookingState.amount}</span>
              </div>
              {bookingState.sampleMethod === "home" && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7C7B]">Home Collection</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#E6F0EE] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1C2B2A]">Total Amount</span>
                <span className="text-xl font-bold text-[#1FAF9A]">₹{bookingState.amount}</span>
              </div>
              <p className="text-[10px] text-[#6B7C7B] text-right mt-1">Inclusive of all taxes</p>
            </div>

            <div className="flex items-center gap-2 mb-6 justify-center text-xs text-[#6B7C7B] bg-[#F4F8F7] py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              100% Safe & Secure Payment
            </div>

            <button 
              onClick={handleConfirm}
              disabled={isSubmitting || !bookingState.testId}
              className="w-full py-3.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
