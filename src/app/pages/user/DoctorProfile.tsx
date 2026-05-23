import React, { useEffect, useState, useMemo } from "react";
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
  UserRound,
  FileText,
  Timer,
  RefreshCw,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { Doctor, DoctorService } from "../../services/DoctorService";
import { AppointmentService } from "../../services/AppointmentService";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useDoctorBooking } from "../../context/DoctorBookingContext";
import {
  generateSmartSlots,
  getValidBookingDates,
  getAvailabilityLabel,
  GeneratedSlot,
} from "../../utils/slotGenerator";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.getTime() === tomorrow.getTime()) return "Tmrw";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getSlotPeriod(timeStr: string): "morning" | "afternoon" | "evening" {
  const [timePart, period] = timeStr.split(" ");
  const h = parseInt(timePart.split(":")[0]);
  if (period === "AM") return h < 12 ? "morning" : "afternoon";
  if (h < 5) return "afternoon";
  return "evening";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DoctorProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-4 w-24 bg-[#E6F0EE] rounded-lg" />
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#E6F0EE] to-[#F4F8F7]" />
        <div className="px-5 pb-5">
          <div className="flex gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-[#E6F0EE] flex-shrink-0" />
            <div className="flex-1 pt-10 space-y-2">
              <div className="h-5 bg-[#E6F0EE] rounded w-1/2" />
              <div className="h-3 bg-[#E6F0EE] rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F4F8F7] rounded-xl h-16" />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#E6F0EE] h-32" />
      <div className="bg-white rounded-2xl border border-[#E6F0EE] h-40" />
      <div className="bg-white rounded-2xl border border-[#E6F0EE] h-56" />
    </div>
  );
}

interface SlotButtonProps {
  slot: GeneratedSlot;
  isChosen: boolean;
  onSelect: (time: string) => void;
}

function SlotButton({ slot, isChosen, onSelect }: SlotButtonProps) {
  const isDisabled = slot.isFull || slot.isPast;

  return (
    <button
      disabled={isDisabled}
      onClick={() => onSelect(isChosen ? "" : slot.time)}
      className={`
        relative px-2 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 
        flex flex-col items-center gap-0.5 min-h-[60px] justify-center
        ${isChosen
          ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/30 scale-105"
          : isDisabled
          ? "bg-[#F4F8F7] text-[#C5D5D3] cursor-not-allowed"
          : "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#1FAF9A]/10 hover:text-[#1FAF9A] active:scale-95"
        }
      `}
    >
      <span className={slot.isPast && !isChosen ? "line-through" : ""}>{slot.time}</span>
      {slot.isFull && !slot.isPast && (
        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">
          {slot.max === 1 ? "Booked" : "Full"}
        </span>
      )}
      {slot.isPast && (
        <span className="text-[9px] text-[#C5D5D3]">Past</span>
      )}
      {!isDisabled && !isChosen && slot.count > 0 && (
        <span className="text-[9px] text-[#1FAF9A]">{slot.max - slot.count} left</span>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateState, resetState } = useDoctorBooking();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedCounts, setBookedCounts] = useState<{ [time: string]: number }>({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [datePageStart, setDatePageStart] = useState(0); // for date pagination

  // Load doctor from Firebase
  useEffect(() => {
    if (!id) return;
    DoctorService.getDoctorById(id).then((data) => {
      setDoctor(data);
      setLoading(false);
    });
  }, [id]);

  // Compute valid booking dates based on working days
  const validDates = useMemo(() => {
    if (!doctor) return [];
    return getValidBookingDates(doctor, 30);
  }, [doctor]);

  const visibleDates = validDates.slice(datePageStart, datePageStart + 7);
  const selectedDate = validDates[selectedDateIndex] ?? null;

  // Subscribe to booked counts when date changes
  useEffect(() => {
    if (!doctor || !selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlot("");

    const unsub = AppointmentService.subscribeToBookedCounts(
      doctor.doctorId,
      formatDateKey(selectedDate),
      (counts) => {
        setBookedCounts(counts);
        setSlotsLoading(false);
      }
    );
    return () => unsub();
  }, [doctor, selectedDateIndex]);

  // Generate slots dynamically
  const allSlots = useMemo(() => {
    if (!doctor || !selectedDate) return [];
    return generateSmartSlots(doctor, selectedDate, bookedCounts);
  }, [doctor, selectedDate, bookedCounts]);

  // Filter out past slots if today (requirement: If today: Hide past slots)
  const visibleSlots = allSlots.filter(s => !s.isPast);

  const morningSlots = visibleSlots.filter((s) => getSlotPeriod(s.time) === "morning");
  const afternoonSlots = visibleSlots.filter((s) => getSlotPeriod(s.time) === "afternoon");
  const eveningSlots = visibleSlots.filter((s) => getSlotPeriod(s.time) === "evening");

  const availableCount = visibleSlots.filter((s) => s.isAvailable).length;

  if (loading) return <DoctorProfileSkeleton />;

  if (!doctor) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-5xl">👨‍⚕️</div>
        <h2 className="text-xl font-bold text-[#1C2B2A]">Doctor not found</h2>
        <Link to="/user/book-doctor" className="text-[#1FAF9A] text-sm font-medium">
          ← Back to Doctors
        </Link>
      </div>
    );
  }

  const availabilityLabel = getAvailabilityLabel(doctor);
  const isAvailableToday = availabilityLabel === "Available Today";

  const handleContinue = () => {
    if (!selectedSlot || !selectedDate) return;
    resetState();
    updateState({
      doctor,
      selectedDate: formatDateKey(selectedDate),
      selectedDateLabel: formatDateLabel(selectedDate),
      selectedSlot,
    });
    navigate("/user/doctor-patient-details");
  };

  const handleDateSelect = (globalIndex: number) => {
    setSelectedDateIndex(globalIndex);
    setSelectedSlot("");
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

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
      <div className="bg-white rounded-3xl border border-[#E6F0EE] overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-[#1FAF9A]/25 via-blue-50 to-indigo-50 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #1FAF9A 0%, transparent 60%)" }}
          />
          <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            {isAvailableToday ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700">Available Today</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-semibold text-orange-700">{availabilityLabel}</span>
              </>
            )}
          </div>
        </div>

        <div className="px-5 pb-6">
          <div className="flex items-start gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {isAvailableToday && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-12">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-[#1C2B2A] leading-tight">{doctor.name}</h1>
                  <p className="text-[#1FAF9A] font-semibold text-sm mt-0.5">{doctor.specialty}</p>
                  <p className="text-xs text-[#6B7C7B] mt-0.5">{doctor.qualification}</p>
                </div>
                {doctor.rating && (
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-xl flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-700">{doctor.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Award, label: "Experience", value: `${doctor.experience} yrs` },
              { icon: UserRound, label: "Patients", value: doctor.reviewCount ? `${doctor.reviewCount}+` : "—" },
              { icon: IndianRupee, label: "Fee", value: `₹${doctor.fee}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#F4F8F7] rounded-2xl p-3 text-center">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  <Icon className="w-4 h-4 text-[#1FAF9A]" />
                </div>
                <p className="text-[10px] text-[#6B7C7B] font-medium">{label}</p>
                <p className="text-sm font-bold text-[#1C2B2A]">{value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
              <MapPin className="w-3 h-3 text-[#1FAF9A]" /> {doctor.hospital}
            </span>
            {doctor.languages && doctor.languages.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
                <Languages className="w-3 h-3 text-[#1FAF9A]" /> {doctor.languages.join(", ")}
              </span>
            )}
            {doctor.registrationNumber && (
              <span className="flex items-center gap-1.5 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
                <BadgeCheck className="w-3 h-3 text-[#1FAF9A]" /> Reg: {doctor.registrationNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── CONSULTATION INFO ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h2 className="font-bold text-[#1C2B2A] mb-4 flex items-center gap-2 text-sm">
          <IndianRupee className="w-4 h-4 text-[#1FAF9A]" /> Consultation Info
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-[#1FAF9A]/8 to-[#0E7C6B]/5 border border-[#1FAF9A]/20 rounded-2xl p-3 text-center">
            <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide mb-1">Consultation</p>
            <p className="text-lg font-bold text-[#1C2B2A]">₹{doctor.fee}</p>
          </div>
          <div className="bg-[#F4F8F7] rounded-2xl p-3 text-center">
            <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide mb-1">Follow-up</p>
            <p className="text-lg font-bold text-[#1C2B2A]">
              {doctor.followUpFee ? `₹${doctor.followUpFee}` : "—"}
            </p>
          </div>
          <div className="bg-[#F4F8F7] rounded-2xl p-3 text-center">
            <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide mb-1">Duration</p>
            <p className="text-lg font-bold text-[#1C2B2A]">
              {doctor.visitDuration ? `${doctor.visitDuration} min` : "15 min"}
            </p>
          </div>
        </div>
      </div>

      {/* ── ABOUT / BIO ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h2 className="font-bold text-[#1C2B2A] mb-3 flex items-center gap-2 text-sm">
          <Stethoscope className="w-4 h-4 text-[#1FAF9A]" /> About Doctor
        </h2>
        <p className="text-sm text-[#6B7C7B] leading-relaxed">
          {doctor.bio ||
            `${doctor.name} is a highly experienced ${doctor.specialty} with ${doctor.experience}+ years of clinical practice at ${doctor.hospital}. Specialises in providing comprehensive, patient-centred care with a focus on accurate diagnosis and effective treatment plans.`}
        </p>
      </div>

      {/* ── WORKING SCHEDULE ───────────────────────────────────────── */}
      {((doctor.workingDays && doctor.workingDays.length > 0) ||
        (doctor.timings && doctor.timings.length > 0)) && (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
          <h2 className="font-bold text-[#1C2B2A] mb-4 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-[#1FAF9A]" /> Working Schedule
          </h2>

          {doctor.workingDays && doctor.workingDays.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#6B7C7B] uppercase tracking-wide mb-2">Working Days</p>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                  const isWorking = doctor.workingDays?.some(
                    (d) => d.toLowerCase().startsWith(day.toLowerCase())
                  );
                  return (
                    <span
                      key={day}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isWorking
                          ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white shadow-sm"
                          : "bg-[#F4F8F7] text-[#C5D5D3]"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {doctor.timings && doctor.timings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#6B7C7B] uppercase tracking-wide mb-2">Timings</p>
              <div className="space-y-2">
                {doctor.timings.map((timing, i) => {
                  const parts = timing.split("-").map((p) => p.trim());
                  const startHour = parseInt(parts[0]?.split(":")[0] || "9");
                  const isPM = parts[0]?.includes("PM");
                  const hour24 = isPM && startHour !== 12 ? startHour + 12 : startHour;
                  const label = hour24 < 12 ? "Morning" : hour24 < 17 ? "Afternoon" : "Evening";
                  const emoji = hour24 < 12 ? "🌅" : hour24 < 17 ? "☀️" : "🌙";
                  return (
                    <div key={i} className="flex items-center gap-3 bg-[#F4F8F7] rounded-xl px-4 py-3">
                      <span className="text-lg">{emoji}</span>
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase">{label}</p>
                        <p className="text-sm font-bold text-[#1C2B2A]">{timing}</p>
                      </div>
                    </div>
                  );
                })}
                {doctor.breakTime && (
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-[10px] font-semibold text-orange-600 uppercase">Break</p>
                      <p className="text-sm font-bold text-orange-700">
                        {doctor.breakTime.start} – {doctor.breakTime.end}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DATE PICKER ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1C2B2A] flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[#1FAF9A]" /> Select Date
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setDatePageStart(Math.max(0, datePageStart - 7));
                setSelectedDateIndex(Math.max(0, selectedDateIndex - 7));
              }}
              disabled={datePageStart === 0}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7C7B] hover:bg-[#F4F8F7] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDatePageStart(Math.min(validDates.length - 7, datePageStart + 7));
              }}
              disabled={datePageStart + 7 >= validDates.length}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7C7B] hover:bg-[#F4F8F7] disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {validDates.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-[#6B7C7B]">No available dates based on doctor's schedule.</p>
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {visibleDates.map((d, i) => {
              const globalIndex = datePageStart + i;
              const isSelected = globalIndex === selectedDateIndex;
              const dayLabel = getDayLabel(d);
              return (
                <button
                  key={globalIndex}
                  onClick={() => handleDateSelect(globalIndex)}
                  className={`
                    flex-shrink-0 flex flex-col items-center px-3 py-3 rounded-2xl min-w-[60px] transition-all duration-200 active:scale-95
                    ${isSelected
                      ? "bg-gradient-to-b from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/30"
                      : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
                    }
                  `}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide">{dayLabel}</span>
                  <span className="text-xl font-bold mt-0.5">{d.getDate()}</span>
                  <span className="text-[10px] mt-0.5 opacity-80">
                    {d.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── SMART SLOTS ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1C2B2A] flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#1FAF9A]" /> Available Slots
          </h2>
          {!slotsLoading && (
            <span
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                availableCount > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {availableCount > 0 ? `${availableCount} available` : "No slots"}
            </span>
          )}
        </div>

        {slotsLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-14 bg-[#F4F8F7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : allSlots.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 bg-[#F4F8F7] rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-[#C5D5D3]" />
            </div>
            <p className="text-sm font-semibold text-[#1C2B2A]">No slots configured</p>
            <p className="text-xs text-[#6B7C7B]">Doctor timings not available for this date</p>
          </div>
        ) : availableCount === 0 && allSlots.every(s => s.isPast) ? (
          <div className="text-center py-8 space-y-2">
            <RefreshCw className="w-10 h-10 text-[#C5D5D3] mx-auto" />
            <p className="text-sm font-semibold text-[#1C2B2A]">All slots have passed</p>
            <p className="text-xs text-[#6B7C7B]">Please select a future date</p>
          </div>
        ) : availableCount === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-4xl">😔</div>
            <p className="text-sm font-semibold text-[#1C2B2A]">No slots available</p>
            <p className="text-xs text-[#6B7C7B]">All slots are fully booked for this date</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wide">Morning</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {morningSlots.map((slot) => (
                    <SlotButton
                      key={slot.time}
                      slot={slot}
                      isChosen={selectedSlot === slot.time}
                      onSelect={handleSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sunset className="w-4 h-4 text-orange-400" />
                  <p className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wide">Afternoon</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {afternoonSlots.map((slot) => (
                    <SlotButton
                      key={slot.time}
                      slot={slot}
                      isChosen={selectedSlot === slot.time}
                      onSelect={handleSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <p className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wide">Evening</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {eveningSlots.map((slot) => (
                    <SlotButton
                      key={slot.time}
                      slot={slot}
                      isChosen={selectedSlot === slot.time}
                      onSelect={handleSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[#E6F0EE] flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-lg bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]" />
            <span className="text-[11px] text-[#6B7C7B]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-lg bg-[#F4F8F7] border border-[#E6F0EE]" />
            <span className="text-[11px] text-[#6B7C7B]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-lg bg-red-50 border border-red-100" />
            <span className="text-[11px] text-[#6B7C7B]">Full</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-lg bg-[#F4F8F7] border border-dashed border-[#C5D5D3]" />
            <span className="text-[11px] text-[#6B7C7B]">Unavailable</span>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-shrink-0">
            <p className="text-[10px] text-[#6B7C7B] font-medium uppercase tracking-wide">Fee</p>
            <p className="text-xl font-bold text-[#1C2B2A]">₹{doctor.fee}</p>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedSlot || !selectedDate}
            className="flex-1 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-base
              hover:shadow-xl hover:shadow-[#1FAF9A]/30
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
              transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Calendar className="w-5 h-5" />
            {selectedSlot
              ? `Continue — ${selectedSlot}`
              : selectedDate
              ? "Select a Time Slot"
              : "Select Date & Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
