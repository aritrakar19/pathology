import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Star, Clock, MapPin, Calendar, Award, Languages, Loader2 } from "lucide-react";
import { Doctor, DoctorService } from "../../services/DoctorService";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useBookingFlow } from "../../context/BookingContext";

export function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBookingState, resetBooking } = useBookingFlow();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);

  useEffect(() => {
    if (id) {
      DoctorService.getDoctorById(id).then(data => {
        setDoctor(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#1C2B2A] mb-2">Doctor not found</h2>
        <Link to="/user/book-doctor" className="text-[#1FAF9A] text-sm">← Back</Link>
      </div>
    );
  }

  const slots = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/user/book-doctor" className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <ImageWithFallback src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1C2B2A]">{doctor.name}</h1>
            <p className="text-[#1FAF9A] font-medium">{doctor.specialty}</p>
            <p className="text-sm text-[#6B7C7B]">{doctor.qualification}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">{doctor.rating}</span>
              <span className="text-xs text-[#6B7C7B]">({doctor.reviewCount} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="flex items-center gap-1 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
                <Award className="w-3 h-3 text-[#1FAF9A]" />{doctor.experience} yrs
              </span>
              <span className="flex items-center gap-1 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
                <MapPin className="w-3 h-3 text-[#1FAF9A]" />{doctor.hospital}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#6B7C7B] bg-[#F4F8F7] px-3 py-1.5 rounded-xl">
                <Languages className="w-3 h-3 text-[#1FAF9A]" />{doctor.languages.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <h2 className="text-lg font-bold text-[#1C2B2A] mb-4">Book Appointment</h2>
        <h3 className="text-sm font-medium text-[#1C2B2A] mb-3">Select Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() + i);
            return (
              <button 
                key={i} 
                onClick={() => setSelectedDateIndex(i)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl min-w-[60px] ${i === selectedDateIndex ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25" : "bg-[#F4F8F7] text-[#6B7C7B]"}`}>
                <span className="text-[10px]">{d.toLocaleDateString("en-US",{weekday:"short"})}</span>
                <span className="text-lg font-bold">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
        <h3 className="text-sm font-medium text-[#1C2B2A] mb-3">Available Slots</h3>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s, i) => (
            <button 
              key={s} 
              onClick={() => setSelectedSlot(i)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${i === selectedSlot ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white" : "bg-[#F4F8F7] text-[#6B7C7B] hover:text-[#1FAF9A]"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="sticky bottom-20 md:bottom-4 bg-white rounded-2xl border border-[#E6F0EE] p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-[#1C2B2A]">₹{doctor.fee}</span>
          <span className="text-sm text-[#6B7C7B] ml-1">Fee</span>
        </div>
        <button 
          onClick={() => {
            resetBooking();
            
            const d = new Date(); d.setDate(d.getDate() + selectedDateIndex);
            
            updateBookingState({
              serviceType: "doctor",
              testId: doctor.doctorId || doctor.name, // Using doctorId instead of testId context
              testName: doctor.name,
              amount: doctor.fee,
              slotDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              slotTime: slots[selectedSlot]
            });
            navigate("/user/patient-details");
          }}
          className="px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Book Now
        </button>
      </div>
    </div>
  );
}
