import React, { useState, useEffect } from "react";
import { SearchBar } from "../../components/user/SearchBar";
import { DoctorCard } from "../../components/user/DoctorCard";
import { Doctor, DoctorService } from "../../services/DoctorService";
import { Loader2, SlidersHorizontal, Stethoscope, Clock, Coins, Award } from "lucide-react";

const specialties = ["All", "General Physician", "Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician", "Neurologist"];

export function BookDoctor() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // New Filters
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);
  const [filterLowFee, setFilterLowFee] = useState(false);
  const [filterHighExperience, setFilterHighExperience] = useState(false);

  useEffect(() => {
    // Only fetch active/available doctors
    const unsubscribe = DoctorService.subscribeToAllActiveDoctors((data) => {
      setDoctors(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    // 1. Specialty
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    
    // 2. Search Query (Name or Specialty)
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 3. Available Today
    const matchesAvailable = !filterAvailableToday || doc.available || doc.nextSlot?.toLowerCase().includes("today");
    
    // 4. Low Fee (arbitrary threshold e.g. <= 600)
    const matchesFee = !filterLowFee || doc.fee <= 600;
    
    // 5. High Experience (e.g. >= 10 years)
    const matchesExp = !filterHighExperience || doc.experience >= 10;

    return matchesSpecialty && matchesSearch && matchesAvailable && matchesFee && matchesExp;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Find a Doctor</h1>
          <p className="text-sm text-[#6B7C7B]">Book appointments with verified specialists</p>
        </div>
        <SearchBar placeholder="Search doctors, specialties (e.g., cardio, skin)..." onSearch={setSearchQuery} className="max-w-md w-full" />
      </div>

      {/* Advanced Filters Ribbon */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setFilterAvailableToday(!filterAvailableToday)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterAvailableToday
              ? "bg-[#1FAF9A] text-white shadow-md shadow-[#1FAF9A]/20 border border-[#1FAF9A]"
              : "bg-white text-[#6B7C7B] border border-[#E6F0EE] hover:border-[#1FAF9A]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Available Today
        </button>
        <button
          onClick={() => setFilterLowFee(!filterLowFee)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterLowFee
              ? "bg-[#1FAF9A] text-white shadow-md shadow-[#1FAF9A]/20 border border-[#1FAF9A]"
              : "bg-white text-[#6B7C7B] border border-[#E6F0EE] hover:border-[#1FAF9A]"
          }`}
        >
          <Coins className="w-3.5 h-3.5" /> Low Fee (≤ ₹600)
        </button>
        <button
          onClick={() => setFilterHighExperience(!filterHighExperience)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterHighExperience
              ? "bg-[#1FAF9A] text-white shadow-md shadow-[#1FAF9A]/20 border border-[#1FAF9A]"
              : "bg-white text-[#6B7C7B] border border-[#E6F0EE] hover:border-[#1FAF9A]"
          }`}
        >
          <Award className="w-3.5 h-3.5" /> High Experience
        </button>
      </div>

      {/* Specialty filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedSpecialty === spec
                ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A]"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-[#E6F0EE] p-5 animate-pulse h-[280px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-[#E6F0EE] rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-[#E6F0EE] rounded w-3/4" />
                  <div className="h-3 bg-[#E6F0EE] rounded w-1/2" />
                  <div className="h-3 bg-[#E6F0EE] rounded w-2/3" />
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-10 bg-[#E6F0EE] rounded-xl w-full" />
                <div className="h-10 bg-[#E6F0EE] rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doc) => (
                <DoctorCard key={doc.doctorId || doc.name} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E6F0EE] p-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-[#1C2B2A] mb-2">No doctors available right now</h3>
              <p className="text-sm text-[#6B7C7B] max-w-sm mb-6">
                Try adjusting your search query, removing some filters, or selecting a different specialty.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("All");
                  setFilterAvailableToday(false);
                  setFilterLowFee(false);
                  setFilterHighExperience(false);
                }}
                className="px-6 py-2.5 bg-white border border-[#E6F0EE] text-[#1FAF9A] font-semibold rounded-xl hover:bg-[#F4F8F7] transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
