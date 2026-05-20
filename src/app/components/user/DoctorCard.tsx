import React from "react";
import { Link } from "react-router";
import { Star, Clock, MapPin } from "lucide-react";
import type { Doctor } from "../../services/DoctorService";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

export function DoctorCard({ doctor, compact = false }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <ImageWithFallback
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {doctor.available && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1C2B2A] truncate">{doctor.name}</h3>
          <p className="text-sm text-[#1FAF9A] font-medium">{doctor.specialty}</p>
          <p className="text-xs text-[#6B7C7B] mt-0.5">{doctor.qualification}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-[#6B7C7B]">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-[#1C2B2A]">{doctor.rating}</span>
          <span>({doctor.reviewCount})</span>
        </div>
        <span className="w-1 h-1 bg-[#E6F0EE] rounded-full" />
        <span>{doctor.experience} yrs exp</span>
      </div>

      {!compact && (
        <div className="flex items-center gap-1 mt-2 text-xs text-[#6B7C7B]">
          <MapPin className="w-3 h-3" />
          {doctor.hospital}
        </div>
      )}

      <div className="flex items-center gap-1 mt-2 text-xs text-[#6B7C7B]">
        <Clock className="w-3 h-3 text-[#1FAF9A]" />
        <span className="text-[#1FAF9A] font-medium">{doctor.nextSlot}</span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E6F0EE]">
        <div>
          <span className="text-lg font-bold text-[#1C2B2A]">₹{doctor.fee}</span>
          <span className="text-xs text-[#6B7C7B] ml-1">Consultation</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/user/doctor-profile/${doctor.doctorId}`}
            className="px-3 py-2 border border-[#E6F0EE] text-[#1FAF9A] rounded-xl text-xs font-medium hover:border-[#1FAF9A] hover:bg-[#F4F8F7] transition-all"
          >
            View
          </Link>
          <Link
            to={`/user/doctor-profile/${doctor.doctorId}`}
            className="px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
