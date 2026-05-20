import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Wallet,
  Banknote,
  CreditCard,
  Landmark,
  ShieldCheck,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useDoctorBooking } from "../../context/DoctorBookingContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { toast } from "sonner";

const STEP_LABELS = ["Doctor", "Slot", "Details", "Payment"];

const paymentMethods = [
  {
    id: "cash",
    label: "Cash at Clinic",
    sub: "Pay when you visit the clinic",
    icon: Banknote,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    badge: null,
    badgeColor: "",
  },
  {
    id: "upi",
    label: "UPI",
    sub: "Google Pay, PhonePe, Paytm",
    icon: Wallet,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badge: "Instant",
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
];

export function DoctorPayment() {
  const navigate = useNavigate();
  const { state, updateState, submitAppointment, isSubmitting } = useDoctorBooking();
  const [selectedMethod, setSelectedMethod] = useState(state.paymentMethod || "cash");

  if (!state.doctor) {
    navigate("/user/book-doctor");
    return null;
  }

  const handleConfirm = async () => {
    try {
      const appointmentId = await submitAppointment(selectedMethod);
      if (appointmentId) {
        updateState({ paymentMethod: selectedMethod }); // persist in context
        toast.success("Appointment booked successfully!");
        navigate(`/user/appointment-success?id=${appointmentId}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-36">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Payment</h1>
          <p className="text-xs text-[#6B7C7B]">Confirm your appointment</p>
        </div>
      </div>

      {/* ── STEP INDICATOR ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] px-4 py-3">
        <div className="flex items-center">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i === 3
                      ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white ring-4 ring-[#1FAF9A]/20"
                      : i < 3
                      ? "bg-[#1FAF9A] text-white"
                      : "bg-[#E6F0EE] text-[#6B7C7B]"
                  }`}
                >
                  {i < 3 ? <CheckCircle className="w-3.5 h-3.5" /> : "4"}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${i <= 3 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full ${i < 3 ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── BOOKING SUMMARY ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1FAF9A]/8 to-blue-50/30 border border-[#1FAF9A]/20 rounded-2xl p-4">
        <p className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wider mb-3">Appointment Summary</p>

        <div className="flex items-start gap-3">
          <ImageWithFallback
            src={state.doctor.image}
            alt={state.doctor.name}
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1C2B2A]">{state.doctor.name}</p>
            <p className="text-sm text-[#1FAF9A]">{state.doctor.specialty}</p>
            <p className="text-xs text-[#6B7C7B] mt-0.5">
              📅 {state.selectedDateLabel} · ⏰ {state.selectedSlot}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#1FAF9A]/20 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7C7B]">Patient</span>
            <span className="font-semibold text-[#1C2B2A]">{state.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7C7B]">Phone</span>
            <span className="font-semibold text-[#1C2B2A]">{state.patientPhone}</span>
          </div>
          {state.patientAge > 0 && (
            <div className="flex justify-between">
              <span className="text-[#6B7C7B]">Age / Gender</span>
              <span className="font-semibold text-[#1C2B2A]">{state.patientAge} yrs · {state.patientGender}</span>
            </div>
          )}
          <div className="flex justify-between pt-1.5 border-t border-[#1FAF9A]/20">
            <span className="font-bold text-[#1C2B2A]">Consultation Fee</span>
            <span className="text-lg font-bold text-[#1FAF9A]">₹{state.doctor.fee}</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT METHODS ────────────────────────────────────────── */}
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
        100% Safe &amp; Secure · SSL Encrypted
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#6B7C7B]">Total Amount</span>
            <span className="text-xl font-bold text-[#1FAF9A]">₹{state.doctor.fee}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#1FAF9A]/30 disabled:opacity-60 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Booking...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" /> Confirm Appointment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
