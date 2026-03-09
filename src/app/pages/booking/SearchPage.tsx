import { useState } from "react";
import { Search, MapPin, Star, Clock, DollarSign, Filter, ArrowRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    availability: "all",
    rating: "all",
  });

  // Mock data based on service type
  const getResults = () => {
    if (service === "pathology") {
      return [
        {
          id: 1,
          name: "Complete Blood Count (CBC)",
          category: "Blood Test",
          price: "$25",
          duration: "4-6 hours",
          rating: 4.8,
          reviews: 1250,
          available: true,
        },
        {
          id: 2,
          name: "Lipid Profile",
          category: "Blood Test",
          price: "$35",
          duration: "6-8 hours",
          rating: 4.9,
          reviews: 980,
          available: true,
        },
        {
          id: 3,
          name: "Thyroid Function Test",
          category: "Blood Test",
          price: "$40",
          duration: "6-8 hours",
          rating: 4.7,
          reviews: 856,
          available: true,
        },
        {
          id: 4,
          name: "Diabetes Screening (HbA1c)",
          category: "Blood Test",
          price: "$30",
          duration: "4-6 hours",
          rating: 4.8,
          reviews: 1100,
          available: false,
        },
        {
          id: 5,
          name: "Liver Function Test",
          category: "Blood Test",
          price: "$45",
          duration: "6-8 hours",
          rating: 4.6,
          reviews: 745,
          available: true,
        },
        {
          id: 6,
          name: "Full Body Health Checkup",
          category: "Health Screening",
          price: "$199",
          duration: "1-2 days",
          rating: 4.9,
          reviews: 2300,
          available: true,
        },
      ];
    } else if (service === "doctor") {
      return [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          category: "Cardiologist",
          price: "$80",
          duration: "30 min",
          rating: 4.9,
          reviews: 450,
          available: true,
          experience: "15 years",
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          category: "General Physician",
          price: "$50",
          duration: "20 min",
          rating: 4.8,
          reviews: 890,
          available: true,
          experience: "12 years",
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          category: "Dermatologist",
          price: "$70",
          duration: "30 min",
          rating: 4.9,
          reviews: 620,
          available: true,
          experience: "10 years",
        },
        {
          id: 4,
          name: "Dr. James Wilson",
          category: "Orthopedic",
          price: "$90",
          duration: "40 min",
          rating: 4.7,
          reviews: 380,
          available: false,
          experience: "18 years",
        },
      ];
    } else {
      return [
        {
          id: 1,
          name: "Downtown Medical Center",
          category: "Full Service",
          price: "$100",
          duration: "1-2 hours",
          rating: 4.8,
          reviews: 2100,
          available: true,
          location: "123 Main St",
        },
        {
          id: 2,
          name: "Northside Diagnostic Lab",
          category: "Pathology Only",
          price: "$75",
          duration: "1 hour",
          rating: 4.7,
          reviews: 1500,
          available: true,
          location: "456 North Ave",
        },
      ];
    }
  };

  const results = getResults();

  const handleViewDetails = (id: number) => {
    navigate(`/booking/details?service=${service}&id=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={2} steps={steps} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
              <input
                type="text"
                placeholder={`Search ${service === "pathology" ? "tests" : service === "doctor" ? "doctors" : "clinics"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button className="px-6 py-3 bg-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:bg-[#1FAF9A] hover:text-white transition-all flex items-center gap-2 font-semibold">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setFilters({ ...filters, availability: "all" })}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filters.availability === "all"
                  ? "bg-[#1FAF9A] text-white"
                  : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilters({ ...filters, availability: "available" })}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filters.availability === "available"
                  ? "bg-[#1FAF9A] text-white"
                  : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
              }`}
            >
              Available Today
            </button>
            <button
              onClick={() => setFilters({ ...filters, rating: "4.5+" })}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filters.rating === "4.5+"
                  ? "bg-[#1FAF9A] text-white"
                  : "bg-[#F4F8F7] text-[#6B7C7B] hover:bg-[#E6F0EE]"
              }`}
            >
              Top Rated (4.5+)
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[#6B7C7B]">
            Found <span className="font-semibold text-[#1C2B2A]">{results.length}</span> results
          </p>
        </div>

        <div className="grid gap-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white border border-[#E6F0EE] rounded-2xl p-6 hover:border-[#1FAF9A] hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1C2B2A] mb-1">
                        {result.name}
                      </h3>
                      <p className="text-sm text-[#6B7C7B]">{result.category}</p>
                    </div>
                    {result.available ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">
                        Unavailable
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7C7B] mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                      <span className="font-semibold text-[#1C2B2A]">{result.rating}</span>
                      <span>({result.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{result.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-[#1C2B2A]">{result.price}</span>
                    </div>
                    {service === "doctor" && "experience" in result && (
                      <div className="flex items-center gap-1">
                        <span>Exp: {result.experience}</span>
                      </div>
                    )}
                    {service === "clinic" && "location" in result && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{result.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(result.id)}
                  disabled={!result.available}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    result.available
                      ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white hover:shadow-lg hover:shadow-[#1FAF9A]/25"
                      : "bg-[#F4F8F7] text-[#6B7C7B] cursor-not-allowed"
                  }`}
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
