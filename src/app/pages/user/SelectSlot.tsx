import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";
import { getTestById, getTestSlots, TestSlot } from "../../services/PathologyMarketplaceService";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      id: `day_${i}`,
      day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      fullDate: d.toISOString().split('T')[0]
    });
  }
  return dates;
};

export function SelectSlot() {
  const navigate = useNavigate();
  const { bookingState, updateBookingState } = useBookingFlow();
  
  const [dates] = useState(generateDates());
  const initialDateId = dates.find(d => d.date === bookingState.slotDate)?.id || dates[0].id;

  const [selectedDate, setSelectedDate] = useState(initialDateId);
  const [selectedSlot, setSelectedSlot] = useState<TestSlot | null>(null);
  
  const [slots, setSlots] = useState<TestSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      if (!bookingState.testId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const test = await getTestById(bookingState.testId);
        if (test && test.pathology_id) {
          const fetchedSlots = await getTestSlots(test.pathology_id, test.id!);
          // Filter to only show active slots that match the selected sampleMethod if applicable
          // (assuming bookingState.sampleMethod is 'home' or 'lab'/'center')
          const method = bookingState.sampleMethod === 'home' ? 'home' : 'center';
          const activeSlots = fetchedSlots.filter(s => s.isActive && s.bookingType === method);
          setSlots(activeSlots);
        }
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [bookingState.testId, bookingState.sampleMethod]);

  // If a slot was previously selected, pre-select it
  useEffect(() => {
    if (bookingState.slotTime && slots.length > 0) {
      const match = slots.find(s => s.time === bookingState.slotTime);
      if (match) setSelectedSlot(match);
    }
  }, [slots, bookingState.slotTime]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
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
      <div className="bg-white rounded-2xl p-4 border border-[#E6F0EE] flex justify-between items-center relative shadow-sm">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6F0EE] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-2/4 h-1 bg-[#1FAF9A] -translate-y-1/2 z-0 transition-all duration-500" />
        
        {["Test", "Sample", "Slot", "Details", "Payment"].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i === 2 ? "bg-[#1FAF9A] text-white ring-4 ring-[#1FAF9A]/20" : i < 2 ? "bg-[#1FAF9A] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"}`}>
              {i < 2 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${i <= 2 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>{step}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-[#1FAF9A]" />
          <h2 className="text-lg font-bold text-[#1C2B2A]">Select Date</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelectedDate(d.id); setSelectedSlot(null); }}
              className={`flex-shrink-0 w-24 py-3 rounded-xl border transition-all text-center ${selectedDate === d.id ? "bg-[#1FAF9A] border-[#1FAF9A] text-white shadow-lg shadow-[#1FAF9A]/25 scale-[1.02]" : "bg-white border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/50 hover:bg-[#F4F8F7]"}`}
            >
              <div className="text-xs uppercase font-bold mb-1 opacity-80">{d.day}</div>
              <div className="text-sm font-semibold">{d.date}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6 shadow-sm min-h-[200px]">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#1FAF9A]" />
          <h2 className="text-lg font-bold text-[#1C2B2A]">Select Time Slot</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-[#E6F0EE] border-t-[#1FAF9A] rounded-full animate-spin"></div>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Clock className="w-8 h-8 mb-2 opacity-50 text-gray-400" />
            <p className="text-sm font-medium">No slots available for this test type.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const isFull = slot.booked >= slot.capacity;
              const isSelected = selectedSlot?.id === slot.id;
              
              return (
                <button
                  key={slot.id}
                  disabled={isFull}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border relative overflow-hidden ${
                    isFull
                      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#1FAF9A] border-[#1FAF9A] text-white shadow-lg shadow-[#1FAF9A]/25 scale-[1.02]"
                      : "bg-white border-[#E6F0EE] text-[#1C2B2A] hover:border-[#1FAF9A] hover:bg-[#F4F8F7]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{slot.time}</span>
                    {!isFull && slot.capacity - slot.booked <= 2 && (
                      <span className={`text-[10px] ${isSelected ? 'text-green-100' : 'text-orange-500'}`}>Only {slot.capacity - slot.booked} left</span>
                    )}
                    {isFull && <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Full</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 md:relative md:bg-transparent md:border-t-0 md:p-0">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button 
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot) {
                const dateObj = dates.find(d => d.id === selectedDate);
                updateBookingState({
                  slotDate: dateObj?.date,
                  slotTime: selectedSlot.time,
                });
                navigate("/user/patient-details");
              }
            }}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Details
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
