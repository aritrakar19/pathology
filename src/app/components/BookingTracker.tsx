import React from "react";
import { Calendar as CalendarIcon, Clock, TestTube, FileText, Download } from "lucide-react";
import type { BookingRecord } from "../services/firebaseBookingService";
import { BookingTimeline } from "./BookingTimeline";

interface BookingTrackerProps {
  booking: BookingRecord;
}

export function BookingTracker({ booking }: BookingTrackerProps) {
  const isReportReady =
    booking.booking_status === "report_generated" || booking.booking_status === "result_ready";

  return (
    <div className="bg-white border border-[#E6F0EE] rounded-2xl p-5 hover:shadow-lg hover:border-[#1FAF9A] transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
            <TestTube className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-[#6B7C7B] mb-0.5">Booking</p>
            <h2 className="text-sm font-semibold text-[#1C2B2A]">
              {booking.service_name ?? booking.service_type}
            </h2>
            <p className="text-[11px] font-mono text-[#6B7C7B]">{booking.booking_id}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-start md:justify-end gap-2 text-xs text-[#6B7C7B]">
          {booking.booking_date && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
              <CalendarIcon className="w-3.5 h-3.5" />
              {booking.booking_date}
            </span>
          )}
          {booking.booking_time && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
              <Clock className="w-3.5 h-3.5" />
              {booking.booking_time}
            </span>
          )}
          {booking.report_reference && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
              <FileText className="w-3.5 h-3.5" />
              Ref: {booking.report_reference}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <BookingTimeline status={booking.booking_status} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="text-[#6B7C7B]">
          <p className="mb-1">
            <span className="font-semibold text-[#1C2B2A]">Current status: </span>
            {booking.booking_status.replace(/_/g, " ")}
          </p>
          {booking.payment_status && (
            <p>
              Payments:&nbsp;
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  booking.payment_status === "Paid"
                    ? "bg-green-50 text-green-700"
                    : booking.payment_status === "Pending"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {booking.payment_status}
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6F0EE] text-[#1FAF9A] bg-white hover:border-[#1FAF9A] hover:bg-[#E6F0EE] text-[11px] font-semibold transition-all">
            <Download className="w-3.5 h-3.5" />
            {isReportReady ? "Download Report" : "Report Not Ready"}
          </button>
        </div>
      </div>
    </div>
  );
}

