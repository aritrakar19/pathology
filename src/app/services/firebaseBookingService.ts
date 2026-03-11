import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  setDoc,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth, type UserRole, getUserRole } from "../../firebase";

export type ServiceType = "test" | "doctor_appointment";

export type BookingStatusId =
  | "booking_confirmed"
  | "sample_collection_scheduled"
  | "sample_collected"
  | "in_lab"
  | "processing"
  | "result_ready"
  | "doctor_verified"
  | "report_generated";

export interface BookingTimeline {
  booking_confirmed?: Date;
  sample_collection_scheduled?: Date;
  sample_collected?: Date;
  in_lab?: Date;
  processing?: Date;
  result_ready?: Date;
  doctor_verified?: Date;
  report_generated?: Date;
}

export interface BookingRecord {
  booking_id: string;
  tenant_id: string;
  patient_id: string;
  service_type: ServiceType;
  test_id?: string;
  doctor_id?: string;
  booking_status: BookingStatusId;
  created_at?: Date;
  timeline?: BookingTimeline;
  // convenience fields for UI
  patient_name?: string;
  service_name?: string;
  booking_date?: string;
  booking_time?: string;
  payment_status?: "Pending" | "Paid" | "Refunded";
  amount?: number;
  report_reference?: string;
}

export interface CreateBookingInput {
  tenantId: string;
  patientId: string;
  serviceType: ServiceType;
  testId?: string;
  doctorId?: string;
  patientName?: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  amount?: number;
}

const BOOKINGS_COLLECTION = "bookings";

// In a production app this would come from auth claims or context.
export function getCurrentTenantId(): string {
  return "tenant_001";
}

function fromSnapshot(snap: QuerySnapshot<DocumentData>): BookingRecord[] {
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const timeline: BookingTimeline = {};
    if (data.timeline) {
      Object.keys(data.timeline).forEach((key) => {
        const ts = data.timeline[key];
        if (ts?.toDate) {
          (timeline as any)[key] = ts.toDate();
        }
      });
    }
    return {
      booking_id: data.booking_id ?? d.id,
      tenant_id: data.tenant_id,
      patient_id: data.patient_id,
      service_type: data.service_type,
      test_id: data.test_id,
      doctor_id: data.doctor_id,
      booking_status: data.booking_status,
      created_at: data.created_at?.toDate?.() ?? undefined,
      timeline,
      patient_name: data.patient_name,
      service_name: data.service_name,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      payment_status: data.payment_status,
      amount: data.amount,
      report_reference: data.report_reference,
    };
  });
}

export async function createBooking(input: CreateBookingInput): Promise<string> {
  const bookingId = input.bookingDate
    ? `BK-${input.bookingDate.replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    : `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  const ref = doc(collection(db, BOOKINGS_COLLECTION), bookingId);

  const now = serverTimestamp();

  await setDoc(ref, {
    booking_id: bookingId,
    tenant_id: input.tenantId,
    patient_id: input.patientId,
    service_type: input.serviceType,
    test_id: input.testId ?? null,
    doctor_id: input.doctorId ?? null,
    booking_status: "booking_confirmed" as BookingStatusId,
    created_at: now,
    timeline: {
      booking_confirmed: now,
    },
    patient_name: input.patientName ?? null,
    service_name: input.serviceName ?? null,
    booking_date: input.bookingDate ?? null,
    booking_time: input.bookingTime ?? null,
    payment_status: "Pending",
    amount: input.amount ?? null,
  });

  return bookingId;
}

export async function updateBookingStatus(
  tenantId: string,
  bookingId: string,
  status: BookingStatusId,
  extra?: Partial<Pick<BookingRecord, "payment_status" | "report_reference" | "doctor_id">>,
): Promise<void> {
  const ref = doc(db, BOOKINGS_COLLECTION, bookingId);
  const timelineField = `timeline.${status}`;

  const payload: any = {
    booking_status: status,
    [timelineField]: serverTimestamp(),
  };

  if (extra?.payment_status) {
    payload.payment_status = extra.payment_status;
  }
  if (extra?.report_reference) {
    payload.report_reference = extra.report_reference;
  }
  if (extra?.doctor_id) {
    payload.doctor_id = extra.doctor_id;
  }

  await updateDoc(ref, payload);
}

export async function getBookingsByTenant(tenantId: string): Promise<BookingRecord[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("tenant_id", "==", tenantId),
    orderBy("created_at", "desc"),
  );
  const snap = await getDocs(q);
  return fromSnapshot(snap);
}

export async function getUserBookings(tenantId: string, patientId: string): Promise<BookingRecord[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("tenant_id", "==", tenantId),
    where("patient_id", "==", patientId),
    orderBy("created_at", "desc"),
  );
  const snap = await getDocs(q);
  return fromSnapshot(snap);
}

export function subscribeBookingUpdates(params: {
  tenantId: string;
  onChange: (bookings: BookingRecord[]) => void;
  onError?: (error: unknown) => void;
  patientId?: string;
}) {
  const { tenantId, onChange, onError, patientId } = params;

  const filters = [
    where("tenant_id", "==", tenantId),
  ] as any[];

  if (patientId) {
    filters.push(where("patient_id", "==", patientId));
  }

  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    ...filters,
    orderBy("created_at", "desc"),
  );

  return onSnapshot(
    q,
    (snap) => onChange(fromSnapshot(snap)),
    (err) => {
      console.error("Booking updates error", err);
      onError?.(err);
    },
  );
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return getUserRole(user.uid);
}

