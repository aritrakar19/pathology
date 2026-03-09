import { useState } from "react";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function SlotSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  const id = searchParams.get("id") || "1";

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Mock time slots
  const timeSlots = {
    morning: [
      { time: "08:00 AM", available: true },
      { time: "08:30 AM", available: true },
      { time: "09:00 AM", available: false },
      { time: "09:30 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "11:30 AM", available: true },
    ],
    afternoon: [
      { time: "12:00 PM", available: true },
      { time: "12:30 PM", available: true },
      { time: "01:00 PM", available: true },
      { time: "01:30 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "02:30 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "03:30 PM", available: true },
    ],
    evening: [
      { time: "04:00 PM", available: true },
      { time: "04:30 PM", available: false },
      { time: "05:00 PM", available: true },
      { time: "05:30 PM", available: true },
      { time: "06:00 PM", available: true },
      { time: "06:30 PM", available: true },
      { time: "07:00 PM", available: false },
      { time: "07:30 PM", available: true },
    ],
  };

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split("T")[0],
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      navigate(`/booking/patient-info?service=${service}&id=${id}&date=${selectedDate}&slot=${selectedSlot}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={4} steps={steps} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">
            Select Date & Time
          </h1>
          <p className="text-[#6B7C7B]">
            Choose your preferred appointment slot
          </p>
        </div>

        {/* Date Selection */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1C2B2A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1FAF9A]" />
              Select Date
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-[#F4F8F7] rounded-lg hover:bg-[#E6F0EE] transition-all">
                <ChevronLeft className="w-5 h-5 text-[#6B7C7B]" />
              </button>
              <button className="p-2 bg-[#F4F8F7] rounded-lg hover:bg-[#E6F0EE] transition-all">
                <ChevronRight className="w-5 h-5 text-[#6B7C7B]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {dates.map((date) => {
              const { day, date: dateNum, month, fullDate } = formatDate(date);
              const isSelected = selectedDate === fullDate;
              const today = isToday(date);

              return (
                <button
                  key={fullDate}
                  onClick={() => setSelectedDate(fullDate)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[#1FAF9A] bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                      : "border-[#E6F0EE] bg-white hover:border-[#1FAF9A] hover:bg-[#F4F8F7]"
                  }`}
                >
                  {today && !isSelected && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#1FAF9A] rounded-full" />
                  )}
                  <div className="text-center">
                    <p className={`text-xs mb-1 ${isSelected ? "text-white/80" : "text-[#6B7C7B]"}`}>
                      {day}
                    </p>
                    <p className={`text-2xl font-bold ${isSelected ? "text-white" : "text-[#1C2B2A]"}`}>
                      {dateNum}
                    </p>
                    <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-[#6B7C7B]"}`}>
                      {month}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#1C2B2A] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1FAF9A]" />
              Select Time Slot
            </h3>

            <div className="space-y-6">
              {/* Morning */}
              <div>
                <h4 className="text-sm font-semibold text-[#6B7C7B] mb-3 uppercase">
                  Morning
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {timeSlots.morning.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedSlot === slot.time
                          ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                          : slot.available
                          ? "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#E6F0EE] hover:border-[#1FAF9A] border-2 border-transparent"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <h4 className="text-sm font-semibold text-[#6B7C7B] mb-3 uppercase">
                  Afternoon
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {timeSlots.afternoon.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedSlot === slot.time
                          ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                          : slot.available
                          ? "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#E6F0EE] hover:border-[#1FAF9A] border-2 border-transparent"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div>
                <h4 className="text-sm font-semibold text-[#6B7C7B] mb-3 uppercase">
                  Evening
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {timeSlots.evening.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedSlot === slot.time
                          ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                          : slot.available
                          ? "bg-[#F4F8F7] text-[#1C2B2A] hover:bg-[#E6F0EE] hover:border-[#1FAF9A] border-2 border-transparent"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#E6F0EE] text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F4F8F7] border-2 border-[#E6F0EE] rounded" />
                <span className="text-[#6B7C7B]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded" />
                <span className="text-[#6B7C7B]">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span className="text-[#6B7C7B]">Booked</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Summary & Continue */}
        {selectedDate && selectedSlot && (
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="font-semibold text-[#1C2B2A] mb-2">
                  Selected Appointment
                </h4>
                <div className="flex items-center gap-4 text-[#6B7C7B]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1FAF9A]" />
                    <span>{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1FAF9A]" />
                    <span>{selectedSlot}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all font-semibold flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
