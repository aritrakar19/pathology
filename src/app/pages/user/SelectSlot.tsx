import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";

const DATES = [
  { id: "today", day: "Today", date: "15 May" },
  { id: "tomorrow", day: "Tomorrow", date: "16 May" },
  { id: "day3", day: "Thu", date: "17 May" },
  { id: "day4", day: "Fri", date: "18 May" },
];

const SLOTS = [
  { id: "s1", time: "06:00 AM", available: true },
  { id: "s2", time: "07:00 AM", available: true },
  { id: "s3", time: "08:00 AM", available: false },
  { id: "s4", time: "09:00 AM", available: true },
  { id: "s5", time: "10:30 AM", available: true },
  { id: "s6", time: "11:00 AM", available: false },
  { id: "s7", time: "12:00 PM", available: true },
  { id: "s8", time: "02:00 PM", available: true },
];

export function SelectSlot() {
  const navigate = useNavigate();
  const { bookingState, updateBookingState } = useBookingFlow();
  
  // Find initial IDs if they exist in state
  const initialDateId = DATES.find(d => d.date === bookingState.slotDate)?.id || DATES[0].id;
  const initialSlotId = SLOTS.find(s => s.time === bookingState.slotTime)?.id || null;

  const [selectedDate, setSelectedDate] = useState(initialDateId);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(initialSlotId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Select Slot</h1>
          <p className="text-sm text-[#6B7C7B]">Choose your preferred date and time</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6F0EE] flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6F0EE] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-2/4 h-1 bg-[#1FAF9A] -translate-y-1/2 z-0" />
        
        {["Test", "Sample", "Slot", "Details", "Payment"].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 2 ? "bg-[#1FAF9A] text-white ring-4 ring-[#1FAF9A]/20" : i < 2 ? "bg-[#1FAF9A] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"}`}>
              {i < 2 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${i <= 2 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>{step}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-[#1FAF9A]" />
          <h2 className="text-lg font-bold text-[#1C2B2A]">Select Date</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {DATES.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelectedDate(d.id); setSelectedSlot(null); }}
              className={`flex-shrink-0 w-24 py-3 rounded-xl border transition-all text-center ${selectedDate === d.id ? "bg-[#1FAF9A] border-[#1FAF9A] text-white shadow-lg shadow-[#1FAF9A]/25" : "bg-white border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/50"}`}
            >
              <div className="text-xs uppercase font-bold mb-1 opacity-80">{d.day}</div>
              <div className="text-sm font-semibold">{d.date}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#1FAF9A]" />
          <h2 className="text-lg font-bold text-[#1C2B2A]">Select Time Slot</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SLOTS.map((slot) => (
            <button
              key={slot.id}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot.id)}
              className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                !slot.available
                  ? "bg-[#F4F8F7] border-[#E6F0EE] text-[#A0B0AF] cursor-not-allowed"
                  : selectedSlot === slot.id
                  ? "bg-[#1FAF9A] border-[#1FAF9A] text-white shadow-lg shadow-[#1FAF9A]/25"
                  : "bg-white border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A]"
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex justify-end pt-4">
        <button 
          disabled={!selectedSlot}
          onClick={() => {
            if (selectedSlot) {
              const dateObj = DATES.find(d => d.id === selectedDate);
              const timeObj = SLOTS.find(s => s.id === selectedSlot);
              updateBookingState({
                slotDate: dateObj?.date,
                slotTime: timeObj?.time,
              });
              navigate("/user/patient-details");
            }
          }}
          className="px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue to Details
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
