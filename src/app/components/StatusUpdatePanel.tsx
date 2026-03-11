import React from "react";
import { CheckCircle, XCircle, RefreshCw, Calendar, DollarSign } from "lucide-react";
import type { BookingRecord, BookingStatusId } from "../services/firebaseBookingService";

interface StatusUpdatePanelProps {
  booking: BookingRecord;
  onStatusChange: (booking: BookingRecord, status: BookingStatusId) => void;
}

export function StatusUpdatePanel({ booking, onStatusChange }: StatusUpdatePanelProps) {
  const handle = (status: BookingStatusId) => onStatusChange(booking, status);

  return (
    <div className="space-y-3 pt-3 border-t border-[#E6F0EE]">
      <p className="text-xs font-semibold text-[#1C2B2A] uppercase tracking-wide">
        Admin Actions
      </p>

      <div className="space-y-3 text-xs text-[#6B7C7B]">
        <div className="flex items-center justify-between">
          <span>Patient</span>
          <span className="font-medium text-[#1C2B2A]">
            {booking.patient_name ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Payment Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
              booking.payment_status === "Paid"
                ? "bg-green-50 text-green-700"
                : booking.payment_status === "Pending"
                ? "bg-orange-50 text-orange-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {booking.payment_status ?? "Pending"}
          </span>
        </div>
        {booking.amount != null && (
          <div className="flex items-center justify-between">
            <span>Amount</span>
            <span className="inline-flex items-center gap-1 text-[#1C2B2A]">
              <DollarSign className="w-3.5 h-3.5" />
              {booking.amount}
            </span>
          </div>
        )}
        {booking.booking_date && (
          <div className="flex items-center justify-between">
            <span>Date</span>
            <span className="inline-flex items-center gap-1 text-[#1C2B2A]">
              <Calendar className="w-3.5 h-3.5" />
              {booking.booking_date}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handle("booking_confirmed")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Approve Booking
        </button>
        <button
          type="button"
          onClick={() => handle("sample_collection_scheduled")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Schedule Collection
        </button>
        <button
          type="button"
          onClick={() => handle("sample_collected")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Mark Sample Collected
        </button>
        <button
          type="button"
          onClick={() => handle("in_lab")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Move to Lab
        </button>
        <button
          type="button"
          onClick={() => handle("processing")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Set Processing
        </button>
        <button
          type="button"
          onClick={() => handle("result_ready")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Mark Result Ready
        </button>
        <button
          type="button"
          onClick={() => handle("doctor_verified")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Doctor Verified
        </button>
        <button
          type="button"
          onClick={() => handle("report_generated")}
          className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
        >
          Report Generated
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handle("report_generated")}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs rounded-xl bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Mark as Delivered & Notify
        </button>
        <button
          type="button"
          onClick={() => handle("booking_confirmed")}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-xl border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] bg-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Status
        </button>
      </div>

      <button
        type="button"
        onClick={() => handle("booking_confirmed")}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-xl border border-red-100 text-red-600 bg-red-50/50 hover:bg-red-50 transition-all"
      >
        <XCircle className="w-3.5 h-3.5" />
        Cancel / Reject Booking
      </button>
    </div>
  );
}

