import React, { useState, useEffect } from "react";
import { TestTube, Stethoscope, Pill, ChevronRight, Loader2, ArrowLeft, CheckCircle2, Clock, Circle } from "lucide-react";
import { StatusBadge } from "../../components/user/StatusBadge";
import { Booking, BookingService } from "../../services/BookingService";
import { useUserProfile } from "../../context/ProfileContext";
import { Link } from "react-router";

const statusSteps = [
  { key: "booking_confirmed", label: "Booking Confirmed", desc: "Your booking is confirmed", icon: "✅" },
  { key: "sample_collection_scheduled", label: "Sample Scheduled", desc: "Sample collection time set", icon: "📅" },
  { key: "sample_collected", label: "Sample Collected", desc: "Our technician collected the sample", icon: "🧪" },
  { key: "in_lab", label: "In Laboratory", desc: "Sample received at the lab", icon: "🔬" },
  { key: "processing", label: "Processing", desc: "Running analysis on your sample", icon: "⚗️" },
  { key: "result_ready", label: "Results Ready", desc: "Test results are available", icon: "📊" },
  { key: "doctor_verified", label: "Doctor Verified", desc: "Results reviewed by doctor", icon: "👨‍⚕️" },
  { key: "report_generated", label: "Report Generated", desc: "Your report is ready to download", icon: "📄" },
  { key: "delivered", label: "Delivered", desc: "Report delivered successfully", icon: "🎉" },
];

const getStatusLabel = (status: string) => {
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export function Tracking() {
  const { profile } = useUserProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

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
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 bg-[#1FAF9A]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#1FAF9A]" />
        </div>
        <p className="text-sm text-[#6B7C7B]">Loading your bookings...</p>
      </div>
    );
  }

  const currentStep = selectedBooking
    ? statusSteps.findIndex((s) => s.key === selectedBooking.bookingStatus)
    : -1;

  // MOBILE: Show list or detail. DESKTOP: Show side by side.
  if (showDetail && selectedBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Mobile Back Header */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setShowDetail(false)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1C2B2A] leading-tight">
              {selectedBooking.testName || selectedBooking.serviceType}
            </h1>
            <p className="text-xs text-[#6B7C7B]">ID: {selectedBooking.bookingId.substring(0, 8)}</p>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedBooking.serviceType === "test"
                    ? "bg-[#1FAF9A]/10"
                    : selectedBooking.serviceType === "doctor"
                    ? "bg-blue-50"
                    : "bg-purple-50"
                }`}
              >
                {selectedBooking.serviceType === "test" ? (
                  <TestTube className="w-6 h-6 text-[#1FAF9A]" />
                ) : selectedBooking.serviceType === "doctor" ? (
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                ) : (
                  <Pill className="w-6 h-6 text-purple-500" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-[#1C2B2A] text-base">
                  {selectedBooking.testName || selectedBooking.serviceType}
                </h2>
                <p className="text-xs text-[#6B7C7B] mt-0.5">
                  Booked {new Date(selectedBooking.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <StatusBadge status={getStatusLabel(selectedBooking.bookingStatus)} size="sm" />
          </div>
          <div className="flex justify-between text-sm bg-[#F4F8F7] rounded-xl px-4 py-3">
            <span className="text-[#6B7C7B]">Amount Paid</span>
            <span className="font-bold text-[#1C2B2A]">₹{selectedBooking.amount}</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
          <h3 className="font-bold text-[#1C2B2A] text-base mb-5">Tracking Timeline</h3>
          <div className="space-y-0">
            {statusSteps.map((step, i) => {
              const isComplete = i <= currentStep;
              const isCurrent = i === currentStep;
              const isPending = i > currentStep;
              const timelineEvent = selectedBooking.timeline?.find((t) => t.status === step.key);

              return (
                <div key={step.key} className="flex items-start gap-4">
                  {/* Connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCurrent
                          ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/30 ring-4 ring-[#1FAF9A]/20"
                          : isComplete
                          ? "bg-[#1FAF9A] text-white"
                          : "bg-[#F4F8F7] text-[#6B7C7B] border border-[#E6F0EE]"
                      }`}
                    >
                      {isComplete && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <span>{step.icon}</span>
                      ) : (
                        <Circle className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-10 mt-1 rounded-full transition-all duration-500 ${
                          isComplete ? "bg-gradient-to-b from-[#1FAF9A] to-[#1FAF9A]/30" : "bg-[#E6F0EE]"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm transition-colors ${
                        isComplete ? "text-[#1C2B2A]" : "text-[#9BB5B3]"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCurrent ? "text-[#1FAF9A] font-medium" : "text-[#6B7C7B]"
                      }`}
                    >
                      {isCurrent
                        ? "Currently at this stage"
                        : timelineEvent
                        ? new Date(timelineEvent.timestamp).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : isPending
                        ? step.desc
                        : "Completed"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Sticky CTA - Report Ready */}
        {["report_generated", "delivered", "result_ready"].includes(selectedBooking.bookingStatus) && (
          <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] z-30 md:static md:shadow-none md:bg-transparent md:border-0 md:p-0">
            <div className="max-w-2xl mx-auto flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-2xl font-bold text-sm hover:bg-[#1FAF9A]/5 transition-all active:scale-95">
                📤 Share Report
              </button>
              <Link
                to={`/user/report-details/${selectedBooking.bookingId}`}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all active:scale-95"
              >
                📄 Download Report
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── BOOKING LIST VIEW ────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2B2A]">My Bookings</h1>
        <p className="text-sm text-[#6B7C7B] mt-0.5">Track all your orders and appointments</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-10 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-bold text-[#1C2B2A] text-base mb-2">No Bookings Yet</h3>
          <p className="text-sm text-[#6B7C7B] mb-5">
            Book a lab test or doctor appointment to get started
          </p>
          <Link
            to="/user/book-test"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
          >
            <TestTube className="w-4 h-4" /> Book a Test
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const step = statusSteps.findIndex((s) => s.key === b.bookingStatus);
            const progress = Math.round(((step + 1) / statusSteps.length) * 100);

            return (
              <button
                key={b.bookingId}
                onClick={() => {
                  setSelectedBooking(b);
                  setShowDetail(true);
                }}
                className="w-full text-left bg-white rounded-2xl border border-[#E6F0EE] p-4 hover:shadow-md hover:border-[#1FAF9A]/30 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      b.serviceType === "test"
                        ? "bg-[#1FAF9A]/10"
                        : b.serviceType === "doctor"
                        ? "bg-blue-50"
                        : "bg-purple-50"
                    }`}
                  >
                    {b.serviceType === "test" ? (
                      <TestTube className="w-5 h-5 text-[#1FAF9A]" />
                    ) : b.serviceType === "doctor" ? (
                      <Stethoscope className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Pill className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1C2B2A] text-sm truncate">
                      {b.testName || b.serviceType}
                    </h3>
                    <p className="text-xs text-[#6B7C7B]">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={getStatusLabel(b.bookingStatus)} size="sm" />
                    <ChevronRight className="w-4 h-4 text-[#6B7C7B]" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#6B7C7B] font-medium">
                      {step + 1} of {statusSteps.length} steps
                    </span>
                    <span className="text-[10px] text-[#1FAF9A] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E6F0EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
