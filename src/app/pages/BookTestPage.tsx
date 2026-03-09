import { useState } from "react";
import { Search, TestTube, Clock, DollarSign, Calendar } from "lucide-react";

export function BookTestPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tests" },
    { id: "blood", name: "Blood Tests" },
    { id: "imaging", name: "Imaging" },
    { id: "screening", name: "Health Screening" },
  ];

  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "blood",
      price: "$25",
      duration: "4-6 hours",
      description: "Measures different components of blood including RBC, WBC, and platelets",
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "blood",
      price: "$35",
      duration: "6-8 hours",
      description: "Cholesterol test to assess cardiovascular health risk",
    },
    {
      id: 3,
      name: "Diabetes Screening (HbA1c)",
      category: "blood",
      price: "$30",
      duration: "4-6 hours",
      description: "Measures average blood sugar levels over the past 3 months",
    },
    {
      id: 4,
      name: "Chest X-Ray",
      category: "imaging",
      price: "$50",
      duration: "2 hours",
      description: "Digital radiography for lung and chest cavity imaging",
    },
    {
      id: 5,
      name: "MRI Brain",
      category: "imaging",
      price: "$350",
      duration: "24 hours",
      description: "Detailed magnetic resonance imaging of the brain",
    },
    {
      id: 6,
      name: "Full Body Health Checkup",
      category: "screening",
      price: "$199",
      duration: "1-2 days",
      description: "Comprehensive health screening including blood tests and imaging",
    },
    {
      id: 7,
      name: "Thyroid Function Test",
      category: "blood",
      price: "$40",
      duration: "6-8 hours",
      description: "Tests TSH, T3, and T4 levels to assess thyroid function",
    },
    {
      id: 8,
      name: "Liver Function Test",
      category: "blood",
      price: "$45",
      duration: "6-8 hours",
      description: "Evaluates liver health through enzyme and protein levels",
    },
  ];

  const filteredTests = selectedCategory === "all" 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C2B2A] mb-4">Book a Test</h1>
          <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
            Choose from our wide range of diagnostic tests and book your appointment
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
            <input
              type="text"
              placeholder="Search for tests..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#E6F0EE] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                  : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white border border-[#E6F0EE] rounded-2xl p-6 hover:shadow-xl hover:border-[#1FAF9A] transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mb-4">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">{test.name}</h3>
              <p className="text-sm text-[#6B7C7B] mb-4">{test.description}</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-[#6B7C7B]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{test.price}</span>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/booking/service-selection'}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-4">Need Help Choosing?</h3>
          <p className="text-white/90 mb-6">Our healthcare professionals are here to guide you</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-[#1FAF9A] rounded-xl hover:shadow-lg transition-all">
              Call Us: +1 (555) 123-4567
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/20 transition-all">
              Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
