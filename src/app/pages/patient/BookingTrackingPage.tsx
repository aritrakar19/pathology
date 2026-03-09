import React from "react";
import { Calendar as CalendarIcon, Clock, TestTube, FileText, Download } from "lucide-react";
import { useBookings } from "../../data/bookingStore";
import { BookingStatusTimeline } from "../../components/BookingStatusTimeline";

export function BookingTrackingPage() {
  const bookings = useBookings();

  const patientName = "Sarah Johnson";
  const patientBookings = bookings.filter((b) => b.userName === patientName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Booking Tracking</h1>
        <p className="text-[#6B7C7B] text-sm">
          Track the full journey of your lab bookings from confirmation to report delivery.
        </p>
      </div>

      {patientBookings.length === 0 ? (
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-10 text-center text-[#6B7C7B]">
          <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="mb-1">You don&apos;t have any tracked bookings yet.</p>
          <p className="text-xs">
            Book a new test from the Book Test section to start tracking your reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {patientBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-[#E6F0EE] rounded-2xl p-5 hover:shadow-lg hover:border-[#1FAF9A] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                    <TestTube className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B] mb-0.5">Booking</p>
                    <h2 className="text-sm font-semibold text-[#1C2B2A]">
                      {booking.serviceName}
                    </h2>
                    <p className="text-[11px] font-mono text-[#6B7C7B]">{booking.id}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-start md:justify-end gap-2 text-xs text-[#6B7C7B]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {booking.bookingDate}
                  </span>
                  {booking.bookingTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.bookingTime}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7]">
                    <FileText className="w-3.5 h-3.5" />
                    Ref: {booking.referenceId}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <BookingStatusTimeline status={booking.bookingStatus} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
                <div className="text-[#6B7C7B]">
                  <p className="mb-1">
                    <span className="font-semibold text-[#1C2B2A]">Current status: </span>
                    {booking.bookingStatus}
                  </p>
                  <p>
                    Payments:&nbsp;
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        booking.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-700"
                          : booking.paymentStatus === "Pending"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6F0EE] text-[#1FAF9A] bg-white hover:border-[#1FAF9A] hover:bg-[#E6F0EE] text-[11px] font-semibold transition-all">
                    <Download className="w-3.5 h-3.5" />
                    {booking.bookingStatus === "Report Delivered" || booking.bookingStatus === "Report Ready"
                      ? "Download Report"
                      : "Report Not Ready"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

