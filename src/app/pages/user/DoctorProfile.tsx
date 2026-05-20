import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Award,
  Languages,
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Stethoscope,
  IndianRupee,
} from "lucide-react";
import { Doctor, DoctorService } from "../../services/DoctorService";
import { AppointmentService, DoctorSlot } from "../../services/AppointmentService";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useDoctorBooking } from "../../context/DoctorBookingContext";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isPastSlot(date: Date, slotTime: string): boolean {
  const now = new Date();
  const today = formatDate(now);
  const selectedDay = formatDate(date);
  if (selectedDay > today) return false;
  if (selectedDay < today) return true;

  // Same day — compare times
  const [timePart, period] = slotTime.split(" ");
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr);
  const m = parseInt(mStr);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const slotMinutes = h * 60 + m;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
}

export function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateState, resetState } = useDoctorBooking();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateOffset, setDateOffset] = useState(0); // 0 = today, 1 = tomorrow, …
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Generate 7 visible dates starting from dateOffset
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset + i);
    return d;
  });

  const selectedDate = dates[selectedDateIndex];

  useEffect(() => {
    if (id) {
      DoctorService.getDoctorById(id).then((data) => {
        setDoctor(data);
        setLoading(false);
      });
    }
  }, [id]);

  // Subscribe to slots for selected date
  useEffect(() => {
    if (!doctor) return;
    setSlotsLoading(true);
    setSelectedSlot(null);

    const unsub = AppointmentService.subscribeToSlots(
      doctor.doctorId,
      formatDate(selectedDate),
      (data) => {
        setSlots(data);
        setSlotsLoading(false);
      }
    );
    return () => unsub();
  }, [doctor, selectedDateIndex, dateOffset]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#1C2B2A] mb-2">Doctor not found</h2>
        <Link to="/user/book-doctor" className="text-[#1FAF9A] text-sm">
          ← Back to Doctors
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedSlot) return;
    resetState();
    updateState({
      doctor,
      selectedDate: formatDate(selectedDate),
      selectedDateLabel: formatDateLabel(selectedDate),
      selectedSlot,
    });
    navigate("/user/doctor-patient-details");
  };

  const availableSlotCount = slots.filter(
    (s) => !s.booked && !isPastSlot(selectedDate, s.time)
  ).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-36">
      {/* Back */}
      <Link
        to="/user/book-doctor"
        className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Doctors
      </Link>

      {/* ── DOCTOR HEADER CARD ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        {/* Top gradient banner */}
        <div className="h-20 bg-gradient-to-r from-[#1FAF9A]/20 to-blue-50 relative">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1FAF9A 0%, transparent 50%)" }} />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-start gap-4 -mt-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              {doctor.available && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-10">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-lg font-bold text-[#1C2B2A]">{doctor.name}</h1>
                  <p className="text-[#1FAF9A] font-medium text-sm">{doctor.specialty}</p>
                  <p className="text-xs text-[#6B7C7B] mt-0.5">{doctor.qualification}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{doctor.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: Award, label: "Experience", value: `${doctor.experience} yrs` },
              { icon: Star, label: "Reviews", value: `${doctor.reviewCount}+` },
              { icon: IndianRupee, label: "Fee", value: `₹${doctor.fee}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#F4F8F7] rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 text-[#1FAF9A] mx-auto mb-1" />
                <p className="text-[11px] text-[#6B7C7B] font-medium">{label}</p>
                <p className="text-sm font-bold text-[#1C2B2A]">{value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
              <MapPin className="w-3 h-3 text-[#1FAF9A]" /> {doctor.hospital}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
              <Languages className="w-3 h-3 text-[#1FAF9A]" /> {doctor.languages?.join(", ")}
            </span>
            {doctor.available && (
              <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-xl font-semibold">
                <BadgeCheck className="w-3 h-3" /> Available Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h2 className="font-bold text-[#1C2B2A] mb-2 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-[#1FAF9A]" /> About Doctor
        </h2>
        <p className="text-sm text-[#6B7C7B] leading-relaxed">
          Dr. {doctor.name} is a highly experienced {doctor.specialty} with {doctor.experience}+ years of
          clinical practice at {doctor.hospital}. Specialises in providing comprehensive, patient-centred
          care with a focus on accurate diagnosis and effective treatment plans.
        </p>
      </div>

      {/* ── DATE PICKER ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1C2B2A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1FAF9A]" /> Select Date
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setDateOffset(Math.max(0, dateOffset - 7)); setSelectedDateIndex(0); }}
              disabled={dateOffset === 0}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7C7B] hover:bg-[#F4F8F7] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setDateOffset(dateOffset + 7); setSelectedDateIndex(0); }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7C7B] hover:bg-[#F4F8F7] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {dates.map((d, i) => {
            const isSelected = i === selectedDateIndex;
            const isToday = formatDate(d) === formatDate(new Date());
            return (
              <button
                key={i}
                onClick={() => setSelectedDateIndex(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-3 rounded-2xl min-w-[56px] transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-b from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                    : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase">
                  {isToday ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-xl font-bold mt-0.5">{d.getDate()}</span>
                <span className="text-[10px] mt-0.5 opacity-80">
                  {d.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TIME SLOTS ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1C2B2A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1FAF9A]" /> Available Slots
          </h2>
          <span className="text-xs text-[#6B7C7B] bg-[#F4F8F7] px-2.5 py-1 rounded-lg font-medium">
            {availableSlotCount} left
          </span>
        </div>

        {slotsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#1FAF9A]" />
          </div>
        ) : (
          <>
            {/* Morning slots */}
            {slots.filter(s => s.time.includes("AM")).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-2">🌅 Morning</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.filter(s => s.time.includes("AM")).map((slot) => {
                    const isPast = isPastSlot(selectedDate, slot.time);
                    const isDisabled = slot.booked || isPast;
                    const isChosen = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={isDisabled}
                        onClick={() => setSelectedSlot(isChosen ? null : slot.time)}
                        className={`px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isChosen
                            ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-md shadow-[#1FAF9A]/25"
                            : isDisabled
                            ? "bg-[#F4F8F7] text-[#C5D5D3] cursor-not-allowed line-through"
                            : "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#1FAF9A]/10 hover:text-[#1FAF9A]"
                        }`}
                      >
                        {slot.time}
                        {slot.booked && <span className="block text-[9px] mt-0.5 text-[#C5D5D3] font-normal">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon slots */}
            {slots.filter(s => s.time.includes("PM")).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-2">🌞 Afternoon & Evening</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.filter(s => s.time.includes("PM")).map((slot) => {
                    const isPast = isPastSlot(selectedDate, slot.time);
                    const isDisabled = slot.booked || isPast;
                    const isChosen = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={isDisabled}
                        onClick={() => setSelectedSlot(isChosen ? null : slot.time)}
                        className={`px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isChosen
                            ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-md shadow-[#1FAF9A]/25"
                            : isDisabled
                            ? "bg-[#F4F8F7] text-[#C5D5D3] cursor-not-allowed line-through"
                            : "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#1FAF9A]/10 hover:text-[#1FAF9A]"
                        }`}
                      >
                        {slot.time}
                        {slot.booked && <span className="block text-[9px] mt-0.5 text-[#C5D5D3] font-normal">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Slot legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E6F0EE]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B]" />
            <span className="text-[11px] text-[#6B7C7B]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#F4F8F7] border border-[#E6F0EE]" />
            <span className="text-[11px] text-[#6B7C7B]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#F4F8F7] border border-dashed border-[#C5D5D3]" />
            <span className="text-[11px] text-[#6B7C7B]">Unavailable</span>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA ─────────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div>
            <p className="text-[11px] text-[#6B7C7B]">Consultation Fee</p>
            <p className="text-xl font-bold text-[#1C2B2A]">₹{doctor.fee}</p>
          </div>
          <button
            onClick={handleBookNow}
            disabled={!selectedSlot}
            className="flex-1 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#1FAF9A]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Calendar className="w-5 h-5" />
            {selectedSlot ? `Book ${selectedSlot}` : "Select a Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
