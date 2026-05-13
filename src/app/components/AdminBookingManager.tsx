import React from "react";
import { Search, Filter, Eye } from "lucide-react";
import type { Booking, BookingStatus } from "../services/BookingService";
import { BookingTimeline } from "./BookingTimeline";
import { StatusUpdatePanel } from "./StatusUpdatePanel";

interface AdminBookingManagerProps {
  bookings: Booking[];
  onStatusChange: (booking: Booking, status: BookingStatus) => void;
}

export function AdminBookingManager({ bookings, onStatusChange }: AdminBookingManagerProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(bookings[0]?.bookingId ?? null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const selectedBooking =
    bookings.find((b) => b.bookingId === selectedId) ?? bookings[0] ?? null;

  const filtered = bookings.filter((booking) => {
    const matchesSearch =
      !search ||
      booking.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      (booking.patientName ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (booking.testName ?? booking.serviceType ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid xl:grid-cols-3 gap-6">
      {/* Booking Table */}
      <section className="xl:col-span-2 bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by booking ID, patient, or test..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7C7B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="booking_confirmed">Booking Confirmed</option>
              <option value="sample_collection_scheduled">Sample Scheduled</option>
              <option value="sample_collected">Sample Collected</option>
              <option value="in_lab">In Lab</option>
              <option value="processing">Processing</option>
              <option value="result_ready">Result Ready</option>
              <option value="doctor_verified">Doctor Verified</option>
              <option value="report_generated">Report Ready</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E6F0EE]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F4F8F7] text-xs text-[#6B7C7B] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Booking ID</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6F0EE]">
              {filtered.map((booking) => {
                const isSelected = booking.bookingId === selectedBooking?.bookingId;
                return (
                  <tr
                    key={booking.bookingId}
                    className={isSelected ? "bg-[#F4F8F7]" : "bg-white hover:bg-[#F9FBFA] transition-colors"}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#1C2B2A]">
                      {booking.bookingId.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-[#1C2B2A]">
                      {booking.patientName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7C7B]">
                      {booking.testName ?? booking.serviceType}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7C7B]">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E6F0EE] text-[#1C2B2A]">
                        {booking.bookingStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedId(booking.bookingId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-[#E6F0EE] text-[#1FAF9A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6B7C7B]">
                    No bookings found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Details Panel */}
      <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6 space-y-5">
        {selectedBooking ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[#6B7C7B] mb-1">Booking</p>
                <h2 className="text-lg font-semibold text-[#1C2B2A]">
                  {selectedBooking.testName ?? selectedBooking.serviceType}
                </h2>
                <p className="text-xs font-mono text-[#6B7C7B]">
                  {selectedBooking.bookingId}
                </p>
              </div>
            </div>

            <BookingTimeline status={selectedBooking.bookingStatus} />

            <StatusUpdatePanel booking={selectedBooking} onStatusChange={onStatusChange} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-[#6B7C7B]">
            <p>Select a booking from the table to see details.</p>
          </div>
        )}
      </section>
    </div>
  );
}

