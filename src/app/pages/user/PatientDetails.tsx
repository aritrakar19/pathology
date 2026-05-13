import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, User, Users } from "lucide-react";
import { useBookingFlow } from "../../context/BookingContext";
import { useUserProfile } from "../../context/ProfileContext";

export function PatientDetails() {
  const navigate = useNavigate();
  const [bookingFor, setBookingFor] = useState<"self" | "family">("self");
  const { bookingState, updateBookingState } = useBookingFlow();
  const { profile } = useUserProfile();

  const [patientName, setPatientName] = useState(bookingState.patientName || profile?.fullName || "");
  const [patientPhone, setPatientPhone] = useState(bookingState.patientPhone || profile?.phone || "");
  const [patientEmail, setPatientEmail] = useState(bookingState.patientEmail || profile?.email || "");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">Patient Details</h1>
          <p className="text-sm text-[#6B7C7B]">Who is this test for?</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6F0EE] flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6F0EE] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-[#1FAF9A] -translate-y-1/2 z-0" />
        
        {["Test", "Sample", "Slot", "Details", "Payment"].map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 3 ? "bg-[#1FAF9A] text-white ring-4 ring-[#1FAF9A]/20" : i < 3 ? "bg-[#1FAF9A] text-white" : "bg-[#E6F0EE] text-[#6B7C7B]"}`}>
              {i < 3 ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${i <= 3 ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`}>{step}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setBookingFor("self")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${bookingFor === "self" ? "bg-[#1FAF9A]/10 border-[#1FAF9A] text-[#0E7C6B]" : "bg-white border-[#E6F0EE] text-[#6B7C7B]"}`}
          >
            <User className="w-4 h-4" /> Self
          </button>
          <button 
            onClick={() => setBookingFor("family")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${bookingFor === "family" ? "bg-[#1FAF9A]/10 border-[#1FAF9A] text-[#0E7C6B]" : "bg-white border-[#E6F0EE] text-[#6B7C7B]"}`}
          >
            <Users className="w-4 h-4" /> Family Member
          </button>
        </div>

        {bookingFor === "family" && (
          <div className="mb-6 p-4 bg-[#F4F8F7] rounded-xl border border-[#E6F0EE]">
            <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Select Family Member</label>
            <select className="w-full px-4 py-3 bg-white border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm">
              <option>Select Member</option>
              <option>John Doe (Father)</option>
              <option>Jane Doe (Mother)</option>
            </select>
            <button className="text-[#1FAF9A] text-sm font-semibold mt-3 hover:underline">+ Add New Member</button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm" 
              placeholder="Enter patient name" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Age</label>
              <input type="number" defaultValue={28} className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm" placeholder="Age" />
            </div>
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Gender</label>
              <select defaultValue="Female" className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Phone</label>
              <input 
                type="tel" 
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm" 
                placeholder="Phone number" 
              />
            </div>
            <div>
              <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Email</label>
              <input 
                type="email" 
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm" 
                placeholder="Email address" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1C2B2A] mb-2 text-sm font-medium">Symptoms / Medical Notes (Optional)</label>
            <textarea rows={3} className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] text-sm" placeholder="Any specific symptoms or instructions for the lab..." />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => {
            updateBookingState({
              patientName,
              patientPhone,
              patientEmail
            });
            navigate("/user/payment");
          }}
          className="px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center gap-2"
        >
          Proceed to Payment
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
