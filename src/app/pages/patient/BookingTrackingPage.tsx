import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  subscribeBookingUpdates,
  getCurrentTenantId,
  type BookingRecord,
} from "../../services/firebaseBookingService";
import { BookingTracker } from "../../components/BookingTracker";
import { auth } from "../../../firebase";

export function BookingTrackingPage() {
  const [bookings, setBookings] = React.useState<BookingRecord[]>([]);

  React.useEffect(() => {
    const tenantId = getCurrentTenantId();
    const user = auth.currentUser;
    if (!user) {
      setBookings([]);
      return;
    }

    const unsub = subscribeBookingUpdates({
      tenantId,
      patientId: user.uid,
      onChange: setBookings,
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Booking Tracking</h1>
        <p className="text-[#6B7C7B] text-sm">
          Track the full journey of your lab bookings from confirmation to report delivery.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-10 text-center text-[#6B7C7B]">
          <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="mb-1">You don&apos;t have any tracked bookings yet.</p>
          <p className="text-xs">
            Book a new test from the Book Test section to start tracking your reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingTracker key={booking.booking_id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

