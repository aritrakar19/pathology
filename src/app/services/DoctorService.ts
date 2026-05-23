import { collection, doc, getDocs, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export interface DoctorBreakTime {
  start: string; // e.g. "11:00 AM"
  end: string;   // e.g. "11:30 AM"
}

export interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  fee: number;
  followUpFee?: number;
  available: boolean;
  active?: boolean;
  nextSlot: string;
  image: string;
  hospital: string;
  qualification: string;
  languages: string[];
  tenantId?: string;
  branchId?: string;

  // ── Simple Clinic Scheduling ──────────────────────────────────────
  workingDays?: string[];        // ["Mon","Tue","Thu"]
  shiftStartTime?: string;       // e.g. "09:00 AM"  (start of first token)
  shiftEndTime?: string;         // optional, not used for slot count
  slotGap?: number;              // minutes between tokens, default 5
  maxPatientsPerDay?: number;    // total tokens per day (= total slots)
  maxPatientsPerSlot?: number;   // patients allowed per token, default 1
  blockedDates?: string[];       // YYYY-MM-DD leave/blocked dates

  // ── Legacy / optional ────────────────────────────────────────────
  timings?: string[];            // kept for backward compat
  visitDuration?: number;        // kept for backward compat
  breakTime?: DoctorBreakTime;   // kept for backward compat
  leaveDates?: string[];         // alias for blockedDates
  bio?: string;
  registrationNumber?: string;
  advanceBookingDays?: number;
}

const COLLECTION = "doctors";

/**
 * Normalize raw Firestore doctor data to the Doctor interface.
 * The Admin Panel may save fields under different names — this maps them all.
 */
function normalizeDoctor(raw: any, docId: string): Doctor {
  return {
    // Core identity
    doctorId: raw.doctorId || docId,

    // Name
    name: raw.name || raw.doctorName || "",

    // Fee — admin may save as consultationFee, fee, or consultation_fee
    fee: raw.fee ?? raw.consultationFee ?? raw.consultation_fee ?? 0,
    followUpFee: raw.followUpFee ?? raw.follow_up_fee ?? undefined,

    // Specialty — admin may use specialization, speciality, specialty
    specialty: raw.specialty || raw.specialization || raw.speciality || "",

    // Availability — various boolean field names
    available: raw.available ?? raw.isAvailable ?? raw.isActive ?? raw.active ?? false,
    active: raw.active ?? raw.isActive ?? false,

    // Other standard fields
    experience: raw.experience ?? 0,
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? raw.reviews ?? 0,
    nextSlot: raw.nextSlot ?? raw.next_slot ?? "",
    image: raw.image || raw.photo || raw.photoUrl || raw.profileImage || "",
    hospital: raw.hospital || raw.clinicName || raw.clinic || "",
    qualification: raw.qualification || raw.degree || "",
    languages: raw.languages || [],
    tenantId: raw.tenantId || "default",
    branchId: raw.branchId || "default",

    // ── Simple clinic scheduling (new token-based system) ──────────
    workingDays: raw.workingDays ?? raw.working_days ?? raw.availableDays ?? undefined,
    shiftStartTime: raw.shiftStartTime ?? raw.shift_start_time ?? raw.startTime ?? undefined,
    shiftEndTime: raw.shiftEndTime ?? raw.shift_end_time ?? raw.endTime ?? undefined,
    slotGap: raw.slotGap ?? raw.slot_gap ?? raw.gapMinutes ?? undefined,
    maxPatientsPerDay: raw.maxPatientsPerDay ?? raw.max_patients_per_day ?? raw.maxPatients ?? undefined,
    maxPatientsPerSlot: raw.maxPatientsPerSlot ?? raw.max_patients_per_slot ?? raw.maxPerSlot ?? undefined,

    // Blocked / leave dates — support both field names
    blockedDates: raw.blockedDates ?? raw.blocked_dates ?? raw.leaveDates ?? raw.leave_dates ?? undefined,
    leaveDates: raw.leaveDates ?? raw.blockedDates ?? undefined,

    // ── Legacy scheduling fields (kept for backward compat) ────────
    timings: raw.timings ?? undefined,
    visitDuration: raw.visitDuration ?? raw.visit_duration ?? undefined,
    breakTime: raw.breakTime ?? raw.break_time ?? undefined,

    // Optional info fields
    bio: raw.bio ?? undefined,
    registrationNumber: raw.registrationNumber ?? raw.regNumber ?? undefined,
    advanceBookingDays: raw.advanceBookingDays ?? undefined,
  };
}

export class DoctorService {
  static async getDoctors(): Promise<Doctor[]> {
    const snap = await getDocs(query(collection(db, COLLECTION)));
    return snap.docs.map(d => normalizeDoctor(d.data(), d.id));
  }

  /** Returns only doctors where available===true OR active===true */
  static async getActiveDoctors(limit = 8): Promise<Doctor[]> {
    const snap = await getDocs(query(collection(db, COLLECTION)));
    return snap.docs
      .map(d => normalizeDoctor(d.data(), d.id))
      .filter(d => d.available || d.active)
      .slice(0, limit);
  }

  static subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
    return onSnapshot(query(collection(db, COLLECTION)), (snap) => {
      callback(snap.docs.map(d => normalizeDoctor(d.data(), d.id)));
    });
  }

  /** Realtime subscription to active doctors only (up to `limit`) */
  static subscribeToActiveDoctors(callback: (doctors: Doctor[]) => void, limit = 8) {
    return onSnapshot(query(collection(db, COLLECTION)), (snap) => {
      const active = snap.docs
        .map(d => normalizeDoctor(d.data(), d.id))
        .filter(d => d.available || d.active)
        .slice(0, limit);
      callback(active);
    });
  }

  /** Realtime subscription to all active doctors (no limit) */
  static subscribeToAllActiveDoctors(callback: (doctors: Doctor[]) => void) {
    return onSnapshot(query(collection(db, COLLECTION)), (snap) => {
      const active = snap.docs
        .map(d => normalizeDoctor(d.data(), d.id))
        .filter(d => d.available || d.active);
      callback(active);
    });
  }

  static async getDoctorById(doctorId: string): Promise<Doctor | null> {
    const snap = await getDoc(doc(db, COLLECTION, doctorId));
    if (snap.exists()) {
      return normalizeDoctor(snap.data(), snap.id);
    }
    return null;
  }
}

