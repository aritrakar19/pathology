import React, { createContext, useContext, useState } from "react";
import { Booking, BookingService } from "../services/BookingService";
import { useUserProfile } from "./ProfileContext";

export interface BookingState {
  serviceType: "test" | "doctor" | "medicine";
  testId?: string;
  testName?: string;
  amount: number;
  sampleMethod?: "home" | "lab";
  slotDate?: string;
  slotTime?: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  paymentMethod?: string;
}

interface BookingContextType {
  bookingState: BookingState;
  updateBookingState: (data: Partial<BookingState>) => void;
  submitBooking: () => Promise<string | null>;
  resetBooking: () => void;
  isSubmitting: boolean;
}

const defaultState: BookingState = {
  serviceType: "test",
  amount: 0,
};

const BookingContext = createContext<BookingContextType>({
  bookingState: defaultState,
  updateBookingState: () => {},
  submitBooking: async () => null,
  resetBooking: () => {},
  isSubmitting: false,
});

export const useBookingFlow = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingState, setBookingState] = useState<BookingState>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useUserProfile();

  const updateBookingState = (data: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingState(defaultState);
  };

  const submitBooking = async () => {
    if (!profile) return null;
    setIsSubmitting(true);
    try {
      const bookingData = {
        userId: profile.uid,
        patientName: bookingState.patientName || profile.fullName,
        patientPhone: bookingState.patientPhone || profile.phone,
        patientEmail: bookingState.patientEmail || profile.email,
        serviceType: bookingState.serviceType,
        testId: bookingState.testId,
        testName: bookingState.testName,
        sampleMethod: bookingState.sampleMethod,
        slotDate: bookingState.slotDate,
        slotTime: bookingState.slotTime,
        paymentMethod: bookingState.paymentMethod || "cash",
        paymentStatus: bookingState.paymentMethod === "cash" ? "pending" : "completed", // Mock payment processing
        bookingStatus: "booking_confirmed",
        amount: bookingState.amount,
      } as Parameters<typeof BookingService.createBooking>[0];

      const bookingId = await BookingService.createBooking(bookingData);
      return bookingId;
    } catch (error) {
      console.error("Failed to submit booking:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingContext.Provider value={{ bookingState, updateBookingState, submitBooking, resetBooking, isSubmitting }}>
      {children}
    </BookingContext.Provider>
  );
};
