import React, { createContext, useContext, useState } from "react";
import { AppointmentService, Appointment, BookingType, PaymentStatus } from "../services/AppointmentService";
import { useUserProfile } from "./ProfileContext";
import { Doctor } from "../services/DoctorService";

export interface DoctorBookingState {
  doctor: Doctor | null;
  selectedDate: string;         // YYYY-MM-DD
  selectedDateLabel: string;    // e.g. "5 Jun 2026"
  selectedSlot: string;         // e.g. "09:00 AM"
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  symptoms: string;
  medicalNotes: string;
  bookingType: BookingType;
  bookingFor: string;           // "Self" or relation label
  relation: string;             // "Father", "Mother" etc.
  paymentMethod: string;
}

interface DoctorBookingContextType {
  state: DoctorBookingState;
  updateState: (data: Partial<DoctorBookingState>) => void;
  resetState: () => void;
  submitAppointment: (paymentMethod?: string) => Promise<string | null>;
  isSubmitting: boolean;
}

const defaultState: DoctorBookingState = {
  doctor: null,
  selectedDate: "",
  selectedDateLabel: "",
  selectedSlot: "",
  patientName: "",
  patientPhone: "",
  patientAge: 0,
  patientGender: "Male",
  symptoms: "",
  medicalNotes: "",
  bookingType: "self",
  bookingFor: "Self",
  relation: "",
  paymentMethod: "cash",
};

const DoctorBookingContext = createContext<DoctorBookingContextType>({
  state: defaultState,
  updateState: () => {},
  resetState: () => {},
  submitAppointment: async () => null,
  isSubmitting: false,
});

export const useDoctorBooking = () => useContext(DoctorBookingContext);

export const DoctorBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DoctorBookingState>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useUserProfile();

  const updateState = (data: Partial<DoctorBookingState>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const resetState = () => setState(defaultState);

  const submitAppointment = async (paymentMethodOverride?: string): Promise<string | null> => {
    if (!profile || !state.doctor) return null;

    setIsSubmitting(true);
    const pm = paymentMethodOverride || state.paymentMethod;

    try {
      const paymentStatus: PaymentStatus =
        pm === "cash"
          ? "cash"
          : pm === "upi" || pm === "card" || pm === "netbanking"
          ? "paid"
          : "pending";

      const appointmentId = await AppointmentService.createAppointment({
        tenantId: (state.doctor as any).tenantId || "default",
        branchId: (state.doctor as any).branchId || "default",
        doctorId: state.doctor.doctorId,
        doctorName: state.doctor.name,
        doctorPhoto: state.doctor.image,
        doctorSpecialization: state.doctor.specialty,
        doctorHospital: state.doctor.hospital,
        userId: profile.uid,
        patientName: state.patientName || profile.fullName,
        patientPhone: state.patientPhone || profile.phone || "",
        patientAge: state.patientAge,
        patientGender: state.patientGender,
        symptoms: state.symptoms,
        medicalNotes: state.medicalNotes,
        appointmentDate: state.selectedDateLabel,
        appointmentTime: state.selectedSlot,
        selectedSlot: state.selectedSlot,
        consultationFee: state.doctor.fee,
        paymentMethod: pm,
        paymentStatus,
        appointmentStatus: "appointment_confirmed",
        bookingType: state.bookingType,
        bookingFor: state.bookingFor || "Self",
        relation: state.relation || "",
        // Pass maxPatientsPerSlot so the query can enforce it
        ...(state.doctor.maxPatientsPerSlot ? { maxPatientsPerSlot: state.doctor.maxPatientsPerSlot } : {}),
      } as any);

      return appointmentId;
    } catch (error: any) {
      console.error("Appointment creation failed:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DoctorBookingContext.Provider value={{ state, updateState, resetState, submitAppointment, isSubmitting }}>
      {children}
    </DoctorBookingContext.Provider>
  );
};
