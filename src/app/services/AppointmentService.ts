import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  arrayUnion,
  Timestamp,
  runTransaction,
  collectionGroup,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "appointment_confirmed"
  | "reminder_sent"
  | "checked_in"
  | "consultation_started"
  | "completed"
  | "cancelled";

export type PaymentStatus = "paid" | "pending" | "cash";
export type BookingType = "self" | "family";

export interface AppointmentTimeline {
  status: AppointmentStatus;
  timestamp: string;
  description: string;
}

export interface Appointment {
  appointmentId: string;
  humanReadableId?: string;      // e.g. APT-2026-0001
  tenantId: string;              // added per requirement
  branchId: string;              // added per requirement
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  doctorSpecialization: string;
  doctorHospital?: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  symptoms?: string;
  medicalNotes?: string;
  appointmentDate: string;
  appointmentTime: string;
  selectedSlot: string;          // added per requirement
  consultationFee: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  appointmentStatus: AppointmentStatus;
  bookingType: BookingType;
  bookingFor?: string;           // "Self" or relation like "Father"
  relation?: string;             // e.g. "Father", "Mother"
  invoiceUrl?: string;
  timeline: AppointmentTimeline[];
  createdAt: string;
  updatedAt: string;
}

// Represents a slot document inside doctor's availability
export interface DoctorSlot {
  time: string;
  booked: boolean;
  appointmentId?: string;
  count?: number;
}

// New count-based availability — keys are slot times e.g. "09:00 AM"
export interface DoctorAvailability {
  doctorId: string;
  date: string; // YYYY-MM-DD
  bookedCounts: { [slotTime: string]: number };
  // Legacy field kept for backward compatibility
  slots?: DoctorSlot[];
}

const APPOINTMENTS_COLLECTION = "appointments";
const AVAILABILITY_COLLECTION = "doctor_availability";
const NOTIFICATIONS_COLLECTION = "notifications";

export class AppointmentService {
  // ── CREATE ──────────────────────────────────────────────────────────────────

  /** Generate a human-readable ID like APT-2026-0001 */
  static async generateHumanReadableId(): Promise<string> {
    const year = new Date().getFullYear();
    const metaPath = `_meta/appointment_counter_${year}`;

    const counterRef = doc(db, "_meta", `appointment_counter_${year}`);
    let num = 1;
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        if (snap.exists()) {
          num = (snap.data().count as number) + 1;
        }
        tx.set(counterRef, { count: num });
      });
    } catch {
      // Fallback to timestamp-based unique suffix if transaction fails
      num = Date.now() % 10000;
    }
    return `APT-${year}-${String(num).padStart(4, "0")}`;
  }

  static async createAppointment(
    data: Omit<Appointment, "appointmentId" | "createdAt" | "updatedAt" | "timeline">
  ): Promise<string> {
    const slotTime = data.selectedSlot || data.appointmentTime;
    const maxPerSlot = (data as any).maxPatientsPerSlot || 1;



    const collectionPath = collection(db, "tenants", data.tenantId, "branches", data.branchId, "appointments");
    
    // STEP 2 & 6: Pre-booking Duplicate Check
    const slotQuery = query(
      collectionPath,
      where("doctorId", "==", data.doctorId),
      where("appointmentDate", "==", data.appointmentDate),
      where("selectedSlot", "==", slotTime)
    );
    


    let slotSnap;
    try {
      slotSnap = await getDocs(slotQuery);
    } catch (error: any) {
      console.error("Permission error on slotQuery:", error);
      throw new Error(`Permission error on slotQuery: ${error.message}`);
    }
    
    // Count valid (non-cancelled) appointments for this exact slot
    const validBookings = slotSnap.docs.filter((d) => {
      const appt = d.data() as Appointment;
      return appt.appointmentStatus !== "cancelled";
    });

    if (validBookings.length >= maxPerSlot) {
      throw new Error("This slot is already booked");
    }

    // Proceed to save
    const apptRef = doc(collectionPath);
    const now = new Date().toISOString();
    const humanReadableId = await AppointmentService.generateHumanReadableId();

    const initialTimeline: AppointmentTimeline = {
      status: "pending",
      timestamp: now,
      description: "Your appointment request has been received and is pending approval.",
    };

    const newAppt: Appointment = {
      ...data,
      appointmentStatus: "pending",
      appointmentId: apptRef.id,
      humanReadableId,
      timeline: [initialTimeline],
      createdAt: now,
      updatedAt: now,
    };

    const notifRef = doc(collection(db, NOTIFICATIONS_COLLECTION));
    const notification = {
      notificationId: notifRef.id,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      appointmentId: apptRef.id,
      patientName: data.patientName,
      appointmentDate: data.appointmentDate,
      appointmentTime: slotTime,
      type: 'doctor_booking',
      title: 'New Appointment Booking',
      message: `${data.patientName} booked Dr. ${data.doctorName} on ${data.appointmentDate} at ${slotTime}.`,
      read: false,
      createdAt: now,
    };

    try {
      await setDoc(apptRef, newAppt);
    } catch (error: any) {
      console.error("Permission error on saving appointment:", error);
      throw new Error(`Permission error on saving appointment: ${error.message}`);
    }

    try {
      await setDoc(notifRef, notification);
    } catch (error: any) {
      console.error("Permission error on saving notification:", error);
      throw new Error(`Permission error on saving notification: ${error.message}`);
    }

    return apptRef.id;
  }

  // ── READ ─────────────────────────────────────────────────────────────────────

  static async getAppointmentById(id: string): Promise<Appointment | null> {
    const q = query(collectionGroup(db, APPOINTMENTS_COLLECTION), where("appointmentId", "==", id));

    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0].data() as Appointment);
  }

  static async getUserAppointments(userId: string): Promise<Appointment[]> {
    const q = query(
      collectionGroup(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId)
    );

    const snap = await getDocs(q);
    const appointments = snap.docs.map((d) => d.data() as Appointment);
    return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static subscribeToUserAppointments(
    userId: string,
    cb: (appointments: Appointment[]) => void
  ) {
    const q = query(
      collectionGroup(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId)
    );

    return onSnapshot(
      q,
      (snap) => {
        const appointments = snap.docs.map((d) => d.data() as Appointment);
        cb(appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      },
      (error) => {
        console.error("Appointments subscription error:", error.message);
        cb([]);
      }
    );
  }

  static subscribeToAppointment(
    appointmentId: string,
    cb: (appointment: Appointment | null) => void
  ) {
    const q = query(collectionGroup(db, APPOINTMENTS_COLLECTION), where("appointmentId", "==", appointmentId));

    return onSnapshot(
      q,
      (snap) => {
        cb(snap.empty ? null : (snap.docs[0].data() as Appointment));
      },
      (error) => {
        console.error("Appointment tracking error:", error.message);
        cb(null);
      }
    );
  }

  // ── SLOT MANAGEMENT ──────────────────────────────────────────────────────────

  /**
   * Get or create availability for a doctor on a specific date.
   * Default slot times if no availability doc exists.
   */
  static async getDoctorSlots(
    doctorId: string,
    date: string // YYYY-MM-DD
  ): Promise<DoctorSlot[]> {
    const docId = `${doctorId}_${date}`;
    const ref = doc(db, AVAILABILITY_COLLECTION, docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as DoctorAvailability;
      // New schema uses bookedCounts; convert to legacy DoctorSlot[] shape
      if (data.bookedCounts) {
        return Object.entries(data.bookedCounts).map(([time, count]) => ({
          time,
          booked: count >= 1,
          count,
        }));
      }
      // Fallback: legacy slots array (if it somehow still exists)
      return data.slots ?? AppointmentService.generateDefaultSlots();
    }

    // Return default slots (not booked) when no doc exists
    return AppointmentService.generateDefaultSlots();
  }

  /**
   * Subscribe to booked slot counts for a doctor on a given date.
   * Returns a map like { "09:00 AM": 2, "10:00 AM": 1 }
   * The UI generates slots dynamically and uses these counts to mark slots as Full.
   */
  static subscribeToBookedCounts(
    doctorId: string,
    date: string,
    cb: (counts: { [slotTime: string]: number }) => void
  ) {
    const q = query(
      collectionGroup(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorId),
      where("appointmentDate", "==", date)
    );

    return onSnapshot(
      q,
      (snap) => {
        const counts: { [slotTime: string]: number } = {};
        snap.docs.forEach((docSnap) => {
          const appt = docSnap.data() as Appointment;
          // Ignore cancelled appointments
          if (appt.appointmentStatus !== "cancelled") {
            const slot = appt.selectedSlot || appt.appointmentTime;
            if (slot) {
              counts[slot] = (counts[slot] || 0) + 1;
            }
          }
        });
        cb(counts);
      },
      (error) => {
        console.warn("Booked counts subscription error:", error.message);
        cb({});
      }
    );
  }

  /** Legacy method — kept for backward compatibility */
  static subscribeToSlots(
    doctorId: string,
    date: string,
    cb: (slots: DoctorSlot[]) => void
  ) {
    return AppointmentService.subscribeToBookedCounts(doctorId, date, (counts) => {
      const defaultTimes = [
        "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
        "11:00 AM","11:30 AM","02:00 PM","02:30 PM",
        "03:00 PM","03:30 PM","04:00 PM","05:00 PM",
      ];
      cb(defaultTimes.map((t) => ({ time: t, booked: (counts[t] || 0) >= 1 })));
    });
  }

  static generateDefaultSlots(): DoctorSlot[] {
    const times = [
      "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
      "11:00 AM","11:30 AM","02:00 PM","02:30 PM",
      "03:00 PM","03:30 PM","04:00 PM","05:00 PM",
    ];
    return times.map((t) => ({ time: t, booked: false }));
  }

  // ── STATUS UPDATE ────────────────────────────────────────────────────────────

  static async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    description: string
  ): Promise<void> {
    const q = query(collectionGroup(db, APPOINTMENTS_COLLECTION), where("appointmentId", "==", appointmentId));
    const snap = await getDocs(q);
    if (snap.empty) return;
    const ref = snap.docs[0].ref;

    const now = new Date().toISOString();
    const timelineEvent: AppointmentTimeline = {
      status,
      timestamp: now,
      description,
    };

    const appt = snap.docs[0].data() as Appointment;
    await updateDoc(ref, {
      appointmentStatus: status,
      timeline: [...(appt.timeline || []), timelineEvent],
      updatedAt: now,
    });
  }

  // ── CANCEL ───────────────────────────────────────────────────────────────────

  static async cancelAppointment(appointmentId: string): Promise<void> {
    await AppointmentService.updateAppointmentStatus(
      appointmentId,
      "cancelled",
      "Appointment cancelled by patient."
    );
  }

  // ── ADMIN: Subscribe all ─────────────────────────────────────────────────────

  static subscribeToAllAppointments(cb: (appointments: Appointment[]) => void) {
    const q = query(collectionGroup(db, APPOINTMENTS_COLLECTION));

    return onSnapshot(q, (snap) => {
      const appointments = snap.docs.map((d) => d.data() as Appointment);
      cb(appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
  }
}
