import type { Doctor } from "../services/DoctorService";

export interface GeneratedSlot {
  time: string;       // e.g. "09:00 AM"
  isFull: boolean;    // true if bookedCounts >= maxPatientsPerSlot
  isPast: boolean;    // true if time already passed today
  isBreak: boolean;   // true if falls in break window
  isAvailable: boolean; // combined: !isFull && !isPast && !isBreak
  count: number;      // how many bookings already made
  max: number;        // max allowed
}

/** Convert "09:00 AM" or "9:00 AM" to total minutes from midnight */
export function timeToMinutes(timeStr: string): number {
  const clean = timeStr.trim();
  const [timePart, period] = clean.split(" ");
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period?.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period?.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/** Convert total minutes from midnight to "09:00 AM" format */
export function minutesToTimeStr(totalMinutes: number): string {
  const h24 = totalMinutes / 60;
  const h = Math.floor(h24);
  const m = totalMinutes % 60;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Parse timing string like "09:00 AM - 01:00 PM" into { startMin, endMin }
 */
function parseTimingRange(timing: string): { startMin: number; endMin: number } | null {
  const parts = timing.split("-").map((p) => p.trim());
  if (parts.length < 2) return null;
  const startMin = timeToMinutes(parts[0]);
  const endMin = timeToMinutes(parts[1]);
  return { startMin, endMin };
}

/**
 * Check if a given time (in minutes) falls within a break window
 */
function isInBreak(timeMin: number, slotDuration: number, breakStart: number, breakEnd: number): boolean {
  const slotEnd = timeMin + slotDuration;
  return timeMin < breakEnd && slotEnd > breakStart;
}

/**
 * Main smart slot generator.
 *
 * @param doctor  The doctor object with timing config
 * @param date    The selected date
 * @param bookedCounts  Map of { "09:00 AM": 2 } from Firestore
 * @returns Array of GeneratedSlot objects
 */
export function generateSmartSlots(
  doctor: Doctor,
  date: Date,
  bookedCounts: { [slotTime: string]: number }
): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];
  const maxPerSlot = Number(doctor.maxPatientsPerSlot) || 1;

  // Current time for past-slot check
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // ── NEW TOKEN-BASED CLINIC SCHEDULING ────────────────────────────────
  if (doctor.shiftStartTime && doctor.maxPatientsPerDay != null) {
    console.log("doctor.shiftStartTime:", doctor.shiftStartTime);
    console.log("doctor.maxPatientsPerDay:", doctor.maxPatientsPerDay);
    console.log("doctor.slotGap:", doctor.slotGap);
    console.log("doctor.maxPatientsPerSlot:", doctor.maxPatientsPerSlot);
    console.log("doctor.workingDays:", doctor.workingDays);
    console.log("doctor.blockedDates:", doctor.blockedDates || doctor.leaveDates);

    const slotGap = Number(doctor.slotGap) || 5; // Default to 5 minutes
    const totalSlots = Number(doctor.maxPatientsPerDay);
    let currentMin = timeToMinutes(doctor.shiftStartTime);

    for (let i = 0; i < totalSlots; i++) {
      const timeStr = minutesToTimeStr(currentMin);
      const count = bookedCounts[timeStr] || 0;
      const isPast = isToday && currentMin <= currentMinutes;
      const isFull = count >= maxPerSlot;

      slots.push({
        time: timeStr,
        isFull,
        isPast,
        isBreak: false, // Simple token system ignores breaks
        isAvailable: !isFull && !isPast,
        count,
        max: maxPerSlot,
      });

      currentMin += slotGap;
    }

    console.log("generatedSlots.length:", slots.length);
    return slots;
  }

  // ── LEGACY LOGIC (Fallback) ──────────────────────────────────────────
  console.log("Using Legacy Logic. doctor config:", doctor);
  const timings = doctor.timings && doctor.timings.length > 0
    ? doctor.timings
    : ["09:00 AM - 01:00 PM", "05:00 PM - 08:00 PM"];

  const visitDuration = doctor.visitDuration || 15;

  let breakStartMin: number | null = null;
  let breakEndMin: number | null = null;
  if (doctor.breakTime?.start && doctor.breakTime?.end) {
    breakStartMin = timeToMinutes(doctor.breakTime.start);
    breakEndMin = timeToMinutes(doctor.breakTime.end);
  }

  for (const timing of timings) {
    const range = parseTimingRange(timing);
    if (!range) continue;

    const { startMin, endMin } = range;
    let current = startMin;

    while (current + visitDuration <= endMin) {
      const timeStr = minutesToTimeStr(current);
      const count = bookedCounts[timeStr] || 0;
      const isPast = isToday && current <= currentMinutes;
      const isFull = count >= maxPerSlot;
      const isBreakSlot =
        breakStartMin !== null && breakEndMin !== null
          ? isInBreak(current, visitDuration, breakStartMin, breakEndMin)
          : false;

      if (!isBreakSlot) {
        slots.push({
          time: timeStr,
          isFull,
          isPast,
          isBreak: isBreakSlot,
          isAvailable: !isFull && !isPast,
          count,
          max: maxPerSlot,
        });
      }
      current += visitDuration;
    }
  }

  return slots;
}

/**
 * Check if a given date (JS Date) is a valid working day for the doctor.
 * workingDays uses short format: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
 */
export function isValidWorkingDay(date: Date, doctor: Doctor): boolean {
  if (!doctor.workingDays || doctor.workingDays.length === 0) return true;
  const dayShort = date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.
  return doctor.workingDays.some(
    (d) => d.toLowerCase().startsWith(dayShort.toLowerCase().slice(0, 3))
  );
}

/**
 * Check if a date is in the doctor's leave dates or blocked dates
 */
export function isLeaveDate(date: Date, doctor: Doctor): boolean {
  const dates = doctor.blockedDates || doctor.leaveDates;
  if (!dates || dates.length === 0) return false;
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  return dates.includes(dateStr);
}

/**
 * Generate the next N valid booking dates for a doctor.
 * Skips: non-working days, leave dates, past dates, dates beyond advanceBookingDays
 */
export function getValidBookingDates(doctor: Doctor, count = 30): Date[] {
  const validDates: Date[] = [];
  const maxDaysAhead = doctor.advanceBookingDays || 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let offset = 0;
  while (validDates.length < count && offset <= maxDaysAhead) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);

    if (isValidWorkingDay(candidate, doctor) && !isLeaveDate(candidate, doctor)) {
      validDates.push(candidate);
    }
    offset++;
  }

  return validDates;
}

/**
 * Get next available date text like "Available Today" or "Next: Tuesday"
 */
export function getAvailabilityLabel(doctor: Doctor): string {
  const validDates = getValidBookingDates(doctor, 7);
  if (validDates.length === 0) return "Not available";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = validDates[0];
  first.setHours(0, 0, 0, 0);

  if (first.getTime() === today.getTime()) return "Available Today";
  return `Next: ${first.toLocaleDateString("en-US", { weekday: "long" })}`;
}
