import React from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCw, Calendar, DollarSign } from "lucide-react";
import {
  useBookings,
  updateBookingStatus,
  updatePaymentStatus,
  type Booking,
  type BookingStatus,
} from "../../data/bookingStore";
import { BookingStatusTimeline } from "../../components/BookingStatusTimeline";

const STATUS_ACTIONS: { label: string; value: BookingStatus }[] = [
  { label: "Approve Booking", value: "Booking Confirmed" },
  { label: "Schedule Collection", value: "Sample Collection Scheduled" },
  { label: "Mark Sample Collected", value: "Sample Collected" },
  { label: "Set as Processing", value: "Sample Processing" },
  { label: "Mark Report Ready", value: "Report Ready" },
  { label: "Mark Report Delivered", value: "Report Delivered" },
  { label: "Cancel Booking", value: "Cancelled" },
  { label: "Reject Booking", value: "Rejected" },
];

export function BookingManagementPage() {
  const bookings = useBookings();
  const [selectedId, setSelectedId] = React.useState<string | null>(bookings[0]?.id ?? null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const selectedBooking = bookings.find((b) => b.id === selectedId) ?? bookings[0];

  const handleSelect = (booking: Booking) => {
    setSelectedId(booking.id);
  };

  const handleStatusChange = (status: BookingStatus) => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.id, status);
    if (status === "Booking Confirmed" || status === "Report Delivered") {
      updatePaymentStatus(selectedBooking.id, "Paid");
    }
    window.setTimeout(() => {
      // simple, non-intrusive notification
      // eslint-disable-next-line no-alert
      alert(`Booking status updated to "${status}".`);
    }, 10);
  };

  const filtered = bookings.filter((booking) => {
    const matchesSearch =
      !search ||
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.userName.toLowerCase().includes(search.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-1">Booking Management</h1>
          <p className="text-[#6B7C7B] text-sm">
            View, approve, and track all bookings from confirmation to report delivery.
          </p>
        </div>
      </div>

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
                <option value="Booking Confirmed">Booking Confirmed</option>
                <option value="Sample Collection Scheduled">Sample Collection Scheduled</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Sample Processing">Sample Processing</option>
                <option value="Report Ready">Report Ready</option>
                <option value="Report Delivered">Report Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E6F0EE]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F4F8F7] text-xs text-[#6B7C7B] uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Booking ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Booking Date</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F0EE]">
                {filtered.map((booking) => {
                  const isSelected = booking.id === selectedBooking?.id;
                  return (
                    <tr
                      key={booking.id}
                      className={isSelected ? "bg-[#F4F8F7]" : "bg-white hover:bg-[#F9FBFA] transition-colors"}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#1C2B2A]">{booking.id}</td>
                      <td className="px-4 py-3 text-[#1C2B2A]">{booking.userName}</td>
                      <td className="px-4 py-3 text-[#6B7C7B]">{booking.serviceName}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7C7B]">
                        {booking.bookingDate} {booking.bookingTime && `· ${booking.bookingTime}`}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.paymentStatus === "Paid"
                              ? "bg-green-50 text-green-700"
                              : booking.paymentStatus === "Pending"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E6F0EE] text-[#1C2B2A]">
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSelect(booking)}
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
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6B7C7B]">
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
                    {selectedBooking.serviceName}
                  </h2>
                  <p className="text-xs font-mono text-[#6B7C7B]">{selectedBooking.id}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7] text-[11px] text-[#6B7C7B]">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedBooking.bookingDate}
                    {selectedBooking.bookingTime && ` · ${selectedBooking.bookingTime}`}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F8F7] text-[11px] text-[#6B7C7B]">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${selectedBooking.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <BookingStatusTimeline status={selectedBooking.bookingStatus} />

              <div className="space-y-3 text-xs text-[#6B7C7B]">
                <div className="flex items-center justify-between">
                  <span>Patient</span>
                  <span className="font-medium text-[#1C2B2A]">{selectedBooking.userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      selectedBooking.paymentStatus === "Paid"
                        ? "bg-green-50 text-green-700"
                        : selectedBooking.paymentStatus === "Pending"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Report Reference</span>
                  <span className="font-mono text-[11px] text-[#1C2B2A]">
                    {selectedBooking.referenceId}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6F0EE] space-y-3">
                <p className="text-xs font-semibold text-[#1C2B2A] uppercase tracking-wide">
                  Admin Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_ACTIONS.slice(0, 6).map((action) => (
                    <button
                      key={action.value}
                      onClick={() => handleStatusChange(action.value)}
                      className="px-3 py-2 text-[11px] rounded-xl bg-[#F4F8F7] border border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#E6F0EE] transition-all text-left"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange("Cancelled")}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-xl border border-red-100 text-red-600 bg-red-50/50 hover:bg-red-50 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedBooking) return;
                      updateBookingStatus(selectedBooking.id, "Booking Confirmed");
                      updatePaymentStatus(selectedBooking.id, "Pending");
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-xl border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] bg-white transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Status
                  </button>
                </div>
                <button
                  onClick={() => handleStatusChange("Report Delivered")}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs rounded-xl bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered & Notify Patient
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-[#6B7C7B]">
              <p>Select a booking from the table to see details.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

