import React, { useState, useEffect } from "react";
import { TestTube, Stethoscope, Pill, ChevronRight, Loader2 } from "lucide-react";
import { StatusBadge } from "../../components/user/StatusBadge";
import { Booking, BookingService } from "../../services/BookingService";
import { useUserProfile } from "../../context/ProfileContext";

const statusSteps = [
  "booking_confirmed", 
  "sample_collection_scheduled", 
  "sample_collected", 
  "in_lab", 
  "processing", 
  "result_ready", 
  "doctor_verified", 
  "report_generated",
  "delivered"
];

const getStatusLabel = (status: string) => {
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export function Tracking() {
  const { profile } = useUserProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    const unsubscribe = BookingService.subscribeToUserBookings(profile.uid, (data) => {
      setBookings(data);
      if (data.length > 0 && !selectedBooking) {
        setSelectedBooking(data[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile, selectedBooking]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
      </div>
    );
  }

  const currentStep = selectedBooking ? statusSteps.indexOf(selectedBooking.bookingStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C2B2A]">Booking Tracking</h1>
        <p className="text-sm text-[#6B7C7B]">Track your bookings and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking list */}
        <div className="md:col-span-1 space-y-2">
          {bookings.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-2xl border border-[#E6F0EE]">
              <p className="text-[#6B7C7B]">No bookings found.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <button
                key={b.bookingId}
                onClick={() => setSelectedBooking(b)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${selectedBooking?.bookingId === b.bookingId ? "bg-[#1FAF9A]/5 border-2 border-[#1FAF9A]" : "bg-white border border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.serviceType === "test" ? "bg-[#1FAF9A]/10" : b.serviceType === "doctor" ? "bg-blue-50" : "bg-purple-50"}`}>
                    {b.serviceType === "test" ? <TestTube className="w-5 h-5 text-[#1FAF9A]" /> : b.serviceType === "doctor" ? <Stethoscope className="w-5 h-5 text-blue-500" /> : <Pill className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1C2B2A] text-sm truncate">{b.testName || b.serviceType}</h4>
                    <p className="text-xs text-[#6B7C7B]">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7C7B]" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Tracking detail */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#E6F0EE] p-6">
          {selectedBooking ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1C2B2A]">{selectedBooking.testName || selectedBooking.serviceType}</h2>
                  <p className="text-sm text-[#6B7C7B]">ID: {selectedBooking.bookingId.substring(0, 8)} • {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={getStatusLabel(selectedBooking.bookingStatus)} size="md" />
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {statusSteps.map((step, i) => {
                  const isComplete = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const timelineEvent = selectedBooking.timeline.find(t => t.status === step);
                  
                  return (
                    <div key={step} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"} ${isCurrent ? "ring-4 ring-[#1FAF9A]/20" : ""}`}>
                          {isComplete ? "✓" : i + 1}
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-12 ${isComplete ? "bg-[#1FAF9A]" : "bg-[#E6F0EE]"}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <h4 className={`font-medium text-sm ${isComplete ? "text-[#1C2B2A]" : "text-[#6B7C7B]"}`}>{getStatusLabel(step)}</h4>
                        <p className="text-xs text-[#6B7C7B] mt-0.5">
                          {timelineEvent ? new Date(timelineEvent.timestamp).toLocaleString() : (isComplete ? "Completed" : "Pending")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E6F0EE] flex justify-between text-sm">
                <span className="text-[#6B7C7B]">Amount Paid</span>
                <span className="font-bold text-[#1C2B2A]">₹{selectedBooking.amount}</span>
              </div>
            </>
          ) : (
            <div className="text-center p-10">
              <p className="text-[#6B7C7B]">Select a booking to view tracking details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
