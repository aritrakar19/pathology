import { collection, doc, setDoc, getDocs, getDoc, query, where, onSnapshot, orderBy, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

export type ServiceType = "test" | "doctor" | "medicine";
export type BookingStatus = "booking_confirmed" | "sample_collection_scheduled" | "sample_collected" | "in_lab" | "processing" | "result_ready" | "doctor_verified" | "report_generated" | "delivered" | "cancelled";

export interface BookingTimeline {
  status: BookingStatus;
  timestamp: string;
  description: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  serviceType: ServiceType;
  testId?: string;
  testName?: string;
  doctorId?: string;
  doctorName?: string;
  sampleMethod?: "home" | "lab";
  slotDate?: string;
  slotTime?: string;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  bookingStatus: BookingStatus;
  amount: number;
  timeline: BookingTimeline[];
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "bookings";

export class BookingService {
  static async createBooking(data: Omit<Booking, "bookingId" | "createdAt" | "updatedAt" | "timeline">): Promise<string> {
    const bookingRef = doc(collection(db, COLLECTION));
    const now = new Date().toISOString();
    
    const initialTimeline: BookingTimeline = {
      status: "booking_confirmed",
      timestamp: now,
      description: "Booking has been confirmed successfully."
    };

    const newBooking: Booking = {
      ...data,
      bookingId: bookingRef.id,
      timeline: [initialTimeline],
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(bookingRef, newBooking);
    return bookingRef.id;
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const bookings = snap.docs.map(doc => doc.data() as Booking);
    return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static subscribeToUserBookings(userId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId)
    );
    return onSnapshot(q, (snap) => {
      const bookings = snap.docs.map(doc => doc.data() as Booking);
      callback(bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
  }

  static async getBookingById(bookingId: string): Promise<Booking | null> {
    const docRef = doc(db, COLLECTION, bookingId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Booking;
    }
    return null;
  }

  static async updateBookingStatus(bookingId: string, status: BookingStatus, description: string): Promise<void> {
    const docRef = doc(db, COLLECTION, bookingId);
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      const booking = snap.data() as Booking;
      const now = new Date().toISOString();
      const newTimelineEvent: BookingTimeline = {
        status,
        timestamp: now,
        description
      };
      
      await updateDoc(docRef, {
        bookingStatus: status,
        timeline: [...booking.timeline, newTimelineEvent],
        updatedAt: now
      });
    }
  }

  static subscribeToAllBookings(callback: (bookings: Booking[]) => void) {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const bookings = snap.docs.map(doc => doc.data() as Booking);
      callback(bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
  }
}
