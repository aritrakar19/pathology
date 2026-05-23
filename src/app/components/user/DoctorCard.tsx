import React from "react";
import { Link } from "react-router";
import { Star, Clock, MapPin, Calendar } from "lucide-react";
import type { Doctor } from "../../services/DoctorService";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

export function DoctorCard({ doctor, compact = false }: DoctorCardProps) {
  const isAvailableToday = doctor.available || doctor.nextSlot?.toLowerCase().includes("today");

  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <ImageWithFallback
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {isAvailableToday && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1C2B2A] truncate">{doctor.name}</h3>
          <p className="text-sm text-[#1FAF9A] font-medium">{doctor.specialty}</p>
          <p className="text-xs text-[#6B7C7B] mt-0.5 line-clamp-1">{doctor.qualification}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-[#6B7C7B]">
        <span>{doctor.experience} yrs exp</span>
        {doctor.rating && (
          <>
            <span className="w-1 h-1 bg-[#E6F0EE] rounded-full" />
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[#1C2B2A]">{doctor.rating}</span>
            </div>
          </>
        )}
      </div>

      {/* Availability Section */}
      <div className="mt-3 bg-[#F8FAFA] rounded-xl p-3 space-y-2 border border-[#E6F0EE]/50">
        {(doctor.workingDays && doctor.workingDays.length > 0) ? (
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#1FAF9A] mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#1C2B2A]">
                {doctor.workingDays.join(" ")}
              </span>
              {doctor.timings && (
                <span className="text-[10px] text-[#6B7C7B]">
                  {doctor.timings.join(" • ")}
                </span>
              )}
            </div>
          </div>
        ) : (
          !compact && (
            <div className="flex items-center gap-1 text-xs text-[#6B7C7B]">
              <MapPin className="w-3.5 h-3.5 text-[#1FAF9A] flex-shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
          )
        )}
        
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className={`w-3.5 h-3.5 ${isAvailableToday ? 'text-green-500' : 'text-orange-500'}`} />
          <span className={`font-medium ${isAvailableToday ? 'text-green-600' : 'text-orange-600'}`}>
            {isAvailableToday ? "Available Today" : `Next: ${doctor.nextSlot}`}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#1C2B2A] leading-none">₹{doctor.fee}</span>
            <span className="text-[10px] text-[#6B7C7B] mt-1 uppercase tracking-wide">Consultation</span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Link
            to={`/user/doctor-profile/${doctor.doctorId}`}
            className="flex-1 text-center py-2.5 border border-[#E6F0EE] text-[#1C2B2A] rounded-xl text-sm font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] hover:bg-[#F4F8F7] transition-all"
          >
            View Profile
          </Link>
          <Link
            to={`/user/doctor-profile/${doctor.doctorId}`}
            className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
