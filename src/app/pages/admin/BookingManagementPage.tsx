import React from "react";
import { AdminBookingManager } from "../../components/AdminBookingManager";
import {
  subscribeBookingUpdates,
  updateBookingStatus,
  getCurrentTenantId,
  type BookingRecord,
  type BookingStatusId,
} from "../../services/firebaseBookingService";

export function BookingManagementPage() {
  const [bookings, setBookings] = React.useState<BookingRecord[]>([]);

  React.useEffect(() => {
    const tenantId = getCurrentTenantId();
    const unsub = subscribeBookingUpdates({
      tenantId,
      onChange: setBookings,
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (booking: BookingRecord, status: BookingStatusId) => {
    try {
      await updateBookingStatus(booking.tenant_id, booking.booking_id, status);
      // optional feedback, keep subtle to not disrupt UX
      // eslint-disable-next-line no-alert
      alert(`Booking status updated to "${status.replace(/_/g, " ")}".`);
    } catch (err) {
      console.error("Failed to update booking status", err);
      alert("Could not update booking status. Please try again.");
    }
  };

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

      <AdminBookingManager bookings={bookings} onStatusChange={handleStatusChange} />
    </div>
  );
}

