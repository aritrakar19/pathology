import React from "react";
import { Check } from "lucide-react";
import type { BookingStatusId } from "../services/firebaseBookingService";

const WORKFLOW_STEPS: { id: BookingStatusId; label: string }[] = [
  { id: "booking_confirmed", label: "Booking Confirmed" },
  { id: "sample_collection_scheduled", label: "Sample Scheduled" },
  { id: "sample_collected", label: "Sample Collected" },
  { id: "in_lab", label: "In Lab" },
  { id: "processing", label: "Processing" },
  { id: "result_ready", label: "Result Ready" },
  { id: "doctor_verified", label: "Doctor Verified" },
  { id: "report_generated", label: "Report Ready" },
];

interface BookingTimelineProps {
  status: BookingStatusId;
}

export function BookingTimeline({ status }: BookingTimelineProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.id === status);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full bg-white border border-[#E6F0EE] rounded-2xl px-4 py-4">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {WORKFLOW_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = index < safeIndex;
          const isCurrent = index === safeIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 min-w-[80px]">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-md shadow-[#1FAF9A]/25"
                      : isCurrent
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white ring-4 ring-[#1FAF9A]/15"
                      : "bg-[#F4F8F7] text-[#6B7C7B] border border-[#E6F0EE]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs text-center px-1 ${
                    isCurrent ? "text-[#1FAF9A] font-semibold" : "text-[#6B7C7B]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 sm:mx-2">
                  <div
                    className={`h-full rounded-full ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B]"
                        : "bg-[#E6F0EE]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

