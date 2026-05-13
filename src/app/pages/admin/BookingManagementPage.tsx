import React, { useState, useEffect } from "react";
import { AdminBookingManager } from "../../components/AdminBookingManager";
import { Booking, BookingService, BookingStatus } from "../../services/BookingService";
import { toast } from "sonner";

export function BookingManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const unsub = BookingService.subscribeToAllBookings(setBookings);
    return () => unsub();
  }, []);

  const handleStatusChange = async (booking: Booking, status: BookingStatus) => {
    try {
      await BookingService.updateBookingStatus(booking.bookingId, status, `Admin updated status to ${status}`);
      toast.success(`Booking status updated to "${status.replace(/_/g, " ")}".`);
    } catch (err) {
      console.error("Failed to update booking status", err);
      toast.error("Could not update booking status. Please try again.");
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

