import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
  steps: string[];
}

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="w-full bg-white border-b border-[#E6F0EE] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={index} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                        : isCurrent
                        ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white ring-4 ring-[#1FAF9A]/20"
                        : "bg-[#F4F8F7] text-[#6B7C7B] border-2 border-[#E6F0EE]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{stepNumber}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center hidden md:block ${
                      isCurrent ? "text-[#1FAF9A] font-semibold" : "text-[#6B7C7B]"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-6 md:-mt-8">
                    <div
                      className={`h-full transition-all ${
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
    </div>
  );
}
