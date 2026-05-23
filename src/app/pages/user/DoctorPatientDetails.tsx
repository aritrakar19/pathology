import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { useDoctorBooking } from "../../context/DoctorBookingContext";
import { useUserProfile } from "../../context/ProfileContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const STEP_LABELS = ["Doctor", "Slot", "Details", "Payment"];

const RELATIONS = [
  "Father", "Mother", "Son", "Daughter",
  "Wife", "Husband", "Brother", "Sister", "Other",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5 font-medium">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

export function DoctorPatientDetails() {
  const navigate = useNavigate();
  const { state, updateState } = useDoctorBooking();
  const { profile } = useUserProfile();

  const [bookingType, setBookingType] = useState<"self" | "family">(state.bookingType);
  const [relation, setRelation] = useState(state.relation || "");
  const [patientName, setPatientName] = useState(state.patientName || (state.bookingType === "self" ? profile?.fullName || "" : ""));
  const [patientPhone, setPatientPhone] = useState(state.patientPhone || (state.bookingType === "self" ? profile?.phone || "" : ""));
  const [patientAge, setPatientAge] = useState<number>(state.patientAge || 0);
  const [patientGender, setPatientGender] = useState(state.patientGender || "Male");
  const [symptoms, setSymptoms] = useState(state.symptoms || "");
  const [medicalNotes, setMedicalNotes] = useState(state.medicalNotes || "");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Guard: if no doctor selected, go back
  if (!state.doctor) {
    navigate("/user/book-doctor");
    return null;
  }

  const errors: Record<string, string> = {};
  if (!patientName.trim()) errors.patientName = "Patient name is required";
  if (!patientPhone.trim()) errors.patientPhone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(patientPhone.replace(/\s+/g, "")))
    errors.patientPhone = "Enter a valid 10-digit Indian mobile number";
  if (!patientAge || patientAge < 1 || patientAge > 120)
    errors.patientAge = "Please enter a valid age (1–120)";
  if (bookingType === "family" && !relation)
    errors.relation = "Please select the relation";

  const isValid = Object.keys(errors).length === 0;

  const handleNext = () => {
    // Mark all as touched to show errors
    setTouched({
      patientName: true,
      patientPhone: true,
      patientAge: true,
      relation: true,
    });
    if (!isValid) return;

    const bookingFor = bookingType === "self" ? "Self" : relation;
    updateState({
      bookingType,
      bookingFor,
      relation: bookingType === "family" ? relation : "",
      patientName: patientName.trim(),
      patientPhone: patientPhone.replace(/\s+/g, ""),
      patientAge,
      patientGender,
      symptoms: symptoms.trim(),
      medicalNotes: medicalNotes.trim(),
    });
    navigate("/user/doctor-payment");
  };

  const handleBookingTypeChange = (type: "self" | "family") => {
    setBookingType(type);
    if (type === "self") {
      setPatientName(profile?.fullName || "");
      setPatientPhone(profile?.phone || "");
      setRelation("");
    } else {
      setPatientName("");
      setPatientPhone("");
    }
    setTouched({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-36">
      {/* ── HEADER */}
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

      {/* ── STEP INDICATOR */}
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
                  {i < 2 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${i <= 2 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full ${i < 2 ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── DOCTOR MINI CARD */}
      <div className="bg-gradient-to-r from-[#1FAF9A]/8 to-blue-50/50 border border-[#1FAF9A]/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={state.doctor.image}
            alt={state.doctor.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1C2B2A] text-sm truncate">{state.doctor.name}</p>
            <p className="text-xs text-[#1FAF9A]">{state.doctor.specialty}</p>
          </div>
          <div className="text-right flex-shrink-0 space-y-1">
            <div className="flex items-center gap-1 justify-end text-xs text-[#6B7C7B]">
              <Calendar className="w-3 h-3" />
              <span>{state.selectedDateLabel}</span>
            </div>
            <div className="flex items-center gap-1 justify-end text-xs font-bold text-[#1C2B2A]">
              <Clock className="w-3 h-3 text-[#1FAF9A]" />
              <span>{state.selectedSlot}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOOKING FOR */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <p className="text-sm font-bold text-[#1C2B2A] mb-3">Booking For</p>
        <div className="flex gap-3 mb-4">
          {(["self", "family"] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleBookingTypeChange(type)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition-all text-sm ${
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

        {/* Relation dropdown — only for family */}
        {bookingType === "family" && (
          <div>
            <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
              Relation *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RELATIONS.map((rel) => (
                <button
                  key={rel}
                  onClick={() => { setRelation(rel); setTouched((p) => ({ ...p, relation: true })); }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                    relation === rel
                      ? "bg-[#1FAF9A]/10 border-[#1FAF9A] text-[#0E7C6B]"
                      : "bg-white border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/40"
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            {touched.relation && errors.relation && <FieldError message={errors.relation} />}
          </div>
        )}
      </div>

      {/* ── PATIENT FORM */}
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
            onBlur={() => setTouched((p) => ({ ...p, patientName: true }))}
            placeholder="Enter full name"
            className={`w-full px-4 py-3 bg-[#F4F8F7] border-2 rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3] ${
              touched.patientName && errors.patientName
                ? "border-red-300 bg-red-50/50"
                : "border-transparent focus:border-[#1FAF9A]"
            }`}
          />
          {touched.patientName && errors.patientName && <FieldError message={errors.patientName} />}
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
              Age *
            </label>
            <input
              type="number"
              value={patientAge || ""}
              onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
              onBlur={() => setTouched((p) => ({ ...p, patientAge: true }))}
              placeholder="Age"
              min={1}
              max={120}
              className={`w-full px-4 py-3 bg-[#F4F8F7] border-2 rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3] ${
                touched.patientAge && errors.patientAge
                  ? "border-red-300 bg-red-50/50"
                  : "border-transparent focus:border-[#1FAF9A]"
              }`}
            />
            {touched.patientAge && errors.patientAge && <FieldError message={errors.patientAge} />}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
              Gender *
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all"
            >
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7C7B]">+91</span>
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, patientPhone: true }))}
              placeholder="00000 00000"
              maxLength={10}
              className={`w-full pl-14 pr-4 py-3 bg-[#F4F8F7] border-2 rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all placeholder:text-[#9BB5B3] ${
                touched.patientPhone && errors.patientPhone
                  ? "border-red-300 bg-red-50/50"
                  : "border-transparent focus:border-[#1FAF9A]"
              }`}
            />
          </div>
          {touched.patientPhone && errors.patientPhone && <FieldError message={errors.patientPhone} />}
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

        {/* Medical Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">
            Medical Notes / Allergies{" "}
            <span className="normal-case font-normal text-[#9BB5B3]">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Any allergies, current medications, or medical history..."
            className="w-full px-4 py-3 bg-[#F4F8F7] border-2 border-transparent focus:border-[#1FAF9A] rounded-xl text-sm text-[#1C2B2A] focus:outline-none transition-all resize-none placeholder:text-[#9BB5B3]"
          />
        </div>
      </div>

      {/* ── STICKY CTA */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base
              hover:shadow-xl hover:shadow-[#1FAF9A]/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            Review & Pay
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
