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
} from "firebase/firestore";
import { db } from "../../firebase";

export type AppointmentStatus =
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
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  doctorSpecialization: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  symptoms?: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationFee: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  appointmentStatus: AppointmentStatus;
  bookingType: BookingType;
  timeline: AppointmentTimeline[];
  createdAt: string;
  updatedAt: string;
}

// Represents a slot document inside doctor's availability
export interface DoctorSlot {
  time: string;
  booked: boolean;
  appointmentId?: string;
}

export interface DoctorAvailability {
  doctorId: string;
  date: string; // YYYY-MM-DD
  slots: DoctorSlot[];
}

const APPOINTMENTS_COLLECTION = "appointments";
const AVAILABILITY_COLLECTION = "doctor_availability";

export class AppointmentService {
  // ── CREATE ──────────────────────────────────────────────────────────────────

  static async createAppointment(
    data: Omit<Appointment, "appointmentId" | "createdAt" | "updatedAt" | "timeline">
  ): Promise<string> {
    const apptRef = doc(collection(db, APPOINTMENTS_COLLECTION));
    const now = new Date().toISOString();

    const initialTimeline: AppointmentTimeline = {
      status: "appointment_confirmed",
      timestamp: now,
      description: "Your appointment has been confirmed successfully.",
    };

    const newAppt: Appointment = {
      ...data,
      appointmentId: apptRef.id,
      timeline: [initialTimeline],
      createdAt: now,
      updatedAt: now,
    };

    // Use a transaction to atomically save appointment + lock slot
    const availabilityDocId = `${data.doctorId}_${data.appointmentDate.replace(/\//g, "-")}`;
    const availRef = doc(db, AVAILABILITY_COLLECTION, availabilityDocId);

    await runTransaction(db, async (tx) => {
      const availSnap = await tx.get(availRef);

      if (availSnap.exists()) {
        const avail = availSnap.data() as DoctorAvailability;
        const slotIndex = avail.slots.findIndex(
          (s) => s.time === data.appointmentTime
        );

        if (slotIndex !== -1) {
          if (avail.slots[slotIndex].booked) {
            throw new Error("Slot already booked. Please choose another slot.");
          }

          const updatedSlots = [...avail.slots];
          updatedSlots[slotIndex] = {
            ...updatedSlots[slotIndex],
            booked: true,
            appointmentId: apptRef.id,
          };

          tx.update(availRef, { slots: updatedSlots });
        }
      }

      tx.set(apptRef, newAppt);
    });

    return apptRef.id;
  }

  // ── READ ─────────────────────────────────────────────────────────────────────

  static async getAppointmentById(id: string): Promise<Appointment | null> {
    const snap = await getDoc(doc(db, APPOINTMENTS_COLLECTION, id));
    return snap.exists() ? (snap.data() as Appointment) : null;
  }

  static async getUserAppointments(userId: string): Promise<Appointment[]> {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Appointment);
  }

  static subscribeToUserAppointments(
    userId: string,
    cb: (appointments: Appointment[]) => void
  ) {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      q,
      (snap) => {
        cb(snap.docs.map((d) => d.data() as Appointment));
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
    const ref = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    return onSnapshot(
      ref,
      (snap) => {
        cb(snap.exists() ? (snap.data() as Appointment) : null);
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
      return (snap.data() as DoctorAvailability).slots;
    }

    // Return default slots (not booked) when no doc exists
    return AppointmentService.generateDefaultSlots();
  }

  static subscribeToSlots(
    doctorId: string,
    date: string,
    cb: (slots: DoctorSlot[]) => void
  ) {
    const docId = `${doctorId}_${date}`;
    const ref = doc(db, AVAILABILITY_COLLECTION, docId);
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          cb((snap.data() as DoctorAvailability).slots);
        } else {
          cb(AppointmentService.generateDefaultSlots());
        }
      },
      (error) => {
        // Permission denied or network error — fall back to default slots
        console.warn("Slot subscription error (using defaults):", error.message);
        cb(AppointmentService.generateDefaultSlots());
      }
    );
  }

  static generateDefaultSlots(): DoctorSlot[] {
    const times = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "05:00 PM",
    ];
    return times.map((t) => ({ time: t, booked: false }));
  }

  // ── STATUS UPDATE ────────────────────────────────────────────────────────────

  static async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    description: string
  ): Promise<void> {
    const ref = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const now = new Date().toISOString();
    const timelineEvent: AppointmentTimeline = {
      status,
      timestamp: now,
      description,
    };

    const appt = snap.data() as Appointment;
    await updateDoc(ref, {
      appointmentStatus: status,
      timeline: [...appt.timeline, timelineEvent],
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
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => d.data() as Appointment));
    });
  }
}
