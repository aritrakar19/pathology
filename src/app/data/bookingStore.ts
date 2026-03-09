import React from "react";

export type BookingStatus =
  | "Booking Confirmed"
  | "Sample Collection Scheduled"
  | "Sample Collected"
  | "Sample Processing"
  | "Report Ready"
  | "Report Delivered"
  | "Cancelled"
  | "Rejected";

export type PaymentStatus = "Pending" | "Paid" | "Refunded";

export interface Booking {
  id: string;
  userName: string;
  serviceName: string;
  packageName?: string;
  bookingDate: string;
  bookingTime?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  amount: number;
  referenceId: string;
}

const initialBookings: Booking[] = [
  {
    id: "BK-2026-0001",
    userName: "John Doe",
    serviceName: "Complete Blood Count",
    bookingDate: "2026-03-04",
    bookingTime: "09:00",
    paymentStatus: "Paid",
    bookingStatus: "Sample Collected",
    amount: 25,
    referenceId: "RPT-2026-001234",
  },
  {
    id: "BK-2026-0002",
    userName: "Sarah Wilson",
    serviceName: "X-Ray Chest",
    bookingDate: "2026-03-04",
    bookingTime: "10:30",
    paymentStatus: "Pending",
    bookingStatus: "Booking Confirmed",
    amount: 60,
    referenceId: "RPT-2026-001235",
  },
  {
    id: "BK-2026-0003",
    userName: "Michael Chen",
    serviceName: "Liver Function Test",
    bookingDate: "2026-03-05",
    bookingTime: "09:30",
    paymentStatus: "Paid",
    bookingStatus: "Sample Processing",
    amount: 45,
    referenceId: "RPT-2026-001236",
  },
  {
    id: "BK-2026-0004",
    userName: "Emma Davis",
    serviceName: "Lipid Profile",
    bookingDate: "2026-03-05",
    bookingTime: "11:00",
    paymentStatus: "Paid",
    bookingStatus: "Report Ready",
    amount: 35,
    referenceId: "RPT-2026-001237",
  },
  {
    id: "BK-2026-0005",
    userName: "Sarah Johnson",
    serviceName: "Thyroid Function Test",
    bookingDate: "2026-03-06",
    bookingTime: "10:15",
    paymentStatus: "Paid",
    bookingStatus: "Report Delivered",
    amount: 40,
    referenceId: "RPT-2026-001238",
  },
];

let bookings: Booking[] = initialBookings;

type Listener = (current: Booking[]) => void;

const listeners = new Set<Listener>();

export function getBookings(): Booking[] {
  return bookings;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(bookings);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) {
    listener(bookings);
  }
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  bookings = bookings.map((booking) =>
    booking.id === id ? { ...booking, bookingStatus: status } : booking,
  );
  emit();
}

export function updatePaymentStatus(id: string, status: PaymentStatus) {
  bookings = bookings.map((booking) =>
    booking.id === id ? { ...booking, paymentStatus: status } : booking,
  );
  emit();
}

export function useBookings() {
  const [data, setData] = React.useState<Booking[]>(() => getBookings());

  React.useEffect(() => {
    return subscribe(setData);
  }, []);

  return data;
}

