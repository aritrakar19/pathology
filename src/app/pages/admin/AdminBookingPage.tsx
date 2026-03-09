import React from "react";
import { useNavigate } from "react-router";
import { TestTube, Stethoscope, ArrowRight, Calendar } from "lucide-react";

export function AdminBookingPage() {
  const navigate = useNavigate();

  const handleOpenBooking = (service?: "pathology" | "doctor") => {
    const base = "/booking/service-selection";
    const url = service ? `${base}?service=${service}` : base;
    navigate(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-1">Book for Patient</h1>
          <p className="text-[#6B7C7B] text-sm">
            Quickly create bookings for lab tests or doctor appointments on behalf of patients.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F0EE] text-xs text-[#1FAF9A]">
          <Calendar className="w-3.5 h-3.5" />
          Admin Booking Shortcut
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 hover:border-[#1FAF9A] hover:shadow-lg transition-all cursor-pointer"
          onClick={() => handleOpenBooking("pathology")}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mb-4">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-[#1C2B2A] mb-2">Book Pathology Test</h2>
          <p className="text-sm text-[#6B7C7B] mb-4">
            Use the existing patient booking flow to schedule lab tests, home sample collection, and health packages.
          </p>
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#1FAF9A] hover:text-[#0E7C6B]">
            Open Booking Module
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 hover:border-[#1FAF9A] hover:shadow-lg transition-all cursor-pointer"
          onClick={() => handleOpenBooking("doctor")}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-[#1C2B2A] mb-2">Book Doctor Appointment</h2>
          <p className="text-sm text-[#6B7C7B] mb-4">
            Book consultations with doctors directly from the admin panel using the same guided steps as patients.
          </p>
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#1FAF9A] hover:text-[#0E7C6B]">
            Open Booking Module
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F4F8F7] border border-dashed border-[#E6F0EE] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#1C2B2A] mb-2">How it works</h2>
          <ol className="text-xs text-[#6B7C7B] space-y-1.5">
            <li>1. Choose whether to book a test or doctor visit.</li>
            <li>2. You will be taken into the existing booking journey.</li>
            <li>3. Complete the steps on behalf of the patient.</li>
            <li>4. The booking will appear in Booking Management and patient views.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

