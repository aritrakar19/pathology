import React, { useState, useEffect } from "react";
import { SearchBar } from "../../components/user/SearchBar";
import { DoctorCard } from "../../components/user/DoctorCard";
import { Doctor, DoctorService } from "../../services/DoctorService";
import { Loader2 } from "lucide-react";

const specialties = ["All", "General Physician", "Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician", "Neurologist"];

export function BookDoctor() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = DoctorService.subscribeToDoctors((data) => {
      setDoctors(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Book Doctor</h1>
          <p className="text-sm text-[#6B7C7B]">Find & book appointments with top doctors</p>
        </div>
        <SearchBar placeholder="Search doctors..." onSearch={setSearchQuery} className="max-w-md w-full" />
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

      {/* Info banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
        <span className="text-3xl">👨‍⚕️</span>
        <div>
          <h3 className="font-semibold text-[#1C2B2A] text-sm">Verified & Experienced Doctors</h3>
          <p className="text-xs text-[#6B7C7B]">All doctors are verified with 8+ years of average experience</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Doctor grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.doctorId || doc.name} doctor={doc as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">No doctors found</h3>
          <p className="text-sm text-[#6B7C7B]">Try adjusting your search or specialty filter</p>
        </div>
      )}
        </>
      )}
    </div>
  );
}
