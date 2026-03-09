import React from "react";
import { Check } from "lucide-react";
import type { BookingStatus } from "../data/bookingStore";

const STATUS_STEPS: BookingStatus[] = [
  "Booking Confirmed",
  "Sample Collection Scheduled",
  "Sample Collected",
  "Sample Processing",
  "Report Ready",
  "Report Delivered",
];

interface BookingStatusTimelineProps {
  status: BookingStatus;
}

export function BookingStatusTimeline({ status }: BookingStatusTimelineProps) {
  const currentIndex = STATUS_STEPS.indexOf(
    STATUS_STEPS.includes(status) ? status : "Booking Confirmed",
  );

  return (
    <div className="w-full bg-white border border-[#E6F0EE] rounded-2xl px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        {STATUS_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex items-center flex-1">
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
                  {step}
                </span>
              </div>
              {index < STATUS_STEPS.length - 1 && (
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

