import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Home, MapPin, Clock, Calendar, Shield } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";

export function ChooseSampleMethod() {
  const navigate = useNavigate();
  const { bookingState, updateBookingState } = useBookingFlow();
  const [selectedMethod, setSelectedMethod] = useState<"home" | "lab" | null>(bookingState.sampleMethod || null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Choose Sample Method</h1>
          <p className="text-sm text-[#6B7C7B]">How would you like to give your sample?</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6F0EE] flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6F0EE] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-1/4 h-1 bg-[#1FAF9A] -translate-y-1/2 z-0" />
        
        {["Test", "Sample", "Slot", "Details", "Payment"].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? "bg-[#1FAF9A] text-white ring-4 ring-[#1FAF9A]/20" : i < 1 ? "bg-[#1FAF9A] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"}`}>
              {i < 1 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${i <= 1 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>{step}</span>
          </div>
        ))}
      </div>

      {/* Selection Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Home Collection */}
        <button 
          onClick={() => setSelectedMethod("home")}
          className={`text-left p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${selectedMethod === "home" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] bg-white hover:border-[#1FAF9A]/30"}`}
        >
          {selectedMethod === "home" && (
            <div className="absolute top-0 right-0 bg-[#1FAF9A] text-white px-3 py-1 text-xs font-bold rounded-bl-xl">
              SELECTED
            </div>
          )}
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Home className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-[#1C2B2A] mb-2">Home Sample Collection</h3>
          <p className="text-sm text-[#6B7C7B] mb-4">A trained phlebotomist will visit your address to collect the sample.</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#1C2B2A]">
              <Clock className="w-4 h-4 text-[#1FAF9A]" />
              <span>Available from 06:00 AM</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1C2B2A]">
              <Shield className="w-4 h-4 text-[#1FAF9A]" />
              <span>Safe & Hygienic</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1C2B2A]">
              <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center text-[10px] text-green-600 font-bold">₹</div>
              <span className="text-green-600 font-semibold">Free Collection</span>
            </div>
          </div>
        </button>

        {/* Visit Lab */}
        <button 
          onClick={() => setSelectedMethod("lab")}
          className={`text-left p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${selectedMethod === "lab" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] bg-white hover:border-[#1FAF9A]/30"}`}
        >
          {selectedMethod === "lab" && (
            <div className="absolute top-0 right-0 bg-[#1FAF9A] text-white px-3 py-1 text-xs font-bold rounded-bl-xl">
              SELECTED
            </div>
          )}
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-[#1C2B2A] mb-2">Visit Lab Center</h3>
          <p className="text-sm text-[#6B7C7B] mb-4">Visit your nearest MediPath diagnostic center to give your sample.</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#1C2B2A]">
              <MapPin className="w-4 h-4 text-[#1FAF9A]" />
              <span>12 Centers nearby</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1C2B2A]">
              <Clock className="w-4 h-4 text-[#1FAF9A]" />
              <span>Open 08:00 AM - 08:00 PM</span>
            </div>
          </div>
        </button>
      </div>

      {/* Footer CTA */}
      <div className="flex justify-end pt-4">
        <button 
          disabled={!selectedMethod}
          onClick={() => {
            if (selectedMethod) updateBookingState({ sampleMethod: selectedMethod });
            navigate("/user/select-slot");
          }}
          className="px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue to Select Slot
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
