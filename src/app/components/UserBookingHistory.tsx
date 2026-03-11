import React from "react";
import type { BookingRecord } from "../services/firebaseBookingService";
import { BookingTracker } from "./BookingTracker";

interface UserBookingHistoryProps {
  bookings: BookingRecord[];
}

export function UserBookingHistory({ bookings }: UserBookingHistoryProps) {
  if (!bookings.length) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#1C2B2A] mb-2">
        Recent Bookings
      </h2>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <BookingTracker key={booking.booking_id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

