import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Users, ChevronRight } from "lucide-react";
import { useDoctorBooking } from "../../context/DoctorBookingContext";
import { useUserProfile } from "../../context/ProfileContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const STEP_LABELS = ["Doctor", "Slot", "Details", "Payment"];

export function DoctorPatientDetails() {
  const navigate = useNavigate();
  const { state, updateState } = useDoctorBooking();
  const { profile } = useUserProfile();

  const [bookingType, setBookingType] = useState<"self" | "family">(state.bookingType);
  const [patientName, setPatientName] = useState(state.patientName || profile?.fullName || "");
  const [patientPhone, setPatientPhone] = useState(state.patientPhone || profile?.phone || "");
  const [patientAge, setPatientAge] = useState<number>(state.patientAge || 0);
  const [patientGender, setPatientGender] = useState(state.patientGender || "Male");
  const [symptoms, setSymptoms] = useState(state.symptoms || "");

  // Guard: if no doctor selected, go back
  if (!state.doctor) {
    navigate("/user/book-doctor");
    return null;
  }

  const handleNext = () => {
    if (!patientName.trim() || !patientPhone.trim()) return;
    updateState({ bookingType, patientName, patientPhone, patientAge, patientGender, symptoms });
    navigate("/user/doctor-payment");
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
          <h1 className="text-xl font-bold text-[#1C2B2A]">Patient Details</h1>
          <p className="text-xs text-[#6B7C7B]">Who is this appointment for?</p>
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
                    i === 2
                      ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white ring-4 ring-[#1FAF9A]/20"
                      : i < 2
                      ? "bg-[#1FAF9A] text-white"
                      : "bg-[#E6F0EE] text-[#6B7C7B]"
                  }`}
                >
                  {i < 2 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-[10px] font-semibold hidden sm:block ${
                    i <= 2 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full ${i < 2 ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── DOCTOR MINI CARD ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1FAF9A]/8 to-blue-50/50 border border-[#1FAF9A]/20 rounded-2xl p-4 flex items-center gap-3">
        <ImageWithFallback
          src={state.doctor.image}
          alt={state.doctor.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1C2B2A] text-sm truncate">{state.doctor.name}</p>
          <p className="text-xs text-[#1FAF9A]">{state.doctor.specialty}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-[#6B7C7B]">{state.selectedDateLabel}</p>
          <p className="text-sm font-bold text-[#1C2B2A]">{state.selectedSlot}</p>
        </div>
      </div>

      {/* ── BOOKING FOR ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <p className="text-sm font-bold text-[#1C2B2A] mb-3">Booking For</p>
        <div className="flex gap-3">
          {(["self", "family"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setBookingType(type);
                if (type === "self") {
                  setPatientName(profile?.fullName || "");
                  setPatientPhone(profile?.phone || "");
                } else {
                  setPatientName("");
                  setPatientPhone("");
                }
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium border-2 flex items-center justify-center gap-2 transition-all ${
                bookingType === type
                  ? "bg-[#1FAF9A]/10 border-[#1FAF9A] text-[#0E7C6B]"
                  : "bg-white border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/40"
              }`}
            >
              {type === "self" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {type === "self" ? "Self" : "Family Member"}
            </button>
          ))}
        </div>
      </div>

      {/* ── PATIENT FORM ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 space-y-4">
        <p className="text-sm font-bold text-[#1C2B2A]">Patient Information</p>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
            Patient Name *
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3]"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
              Age
            </label>
            <input
              type="number"
              value={patientAge || ""}
              onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
              placeholder="Age"
              min={1}
              max={120}
              className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="+91 00000 00000"
            className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3]"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
            Symptoms / Reason for Visit{" "}
            <span className="normal-case font-normal text-[#9BB5B3]">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe symptoms or reason for visit..."
            className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all resize-none placeholder:text-[#9BB5B3]"
          />
        </div>
      </div>

      {/* ── STICKY CTA ─────────────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!patientName.trim() || !patientPhone.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#1FAF9A]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            Continue to Payment
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
