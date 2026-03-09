import { TestTube, Calendar, Clock, DollarSign, Search } from "lucide-react";

export function PatientBookTest() {
  const tests = [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Blood Test", price: "$25", duration: "4-6 hours" },
    { id: 2, name: "Lipid Profile", category: "Blood Test", price: "$35", duration: "6-8 hours" },
    { id: 3, name: "Thyroid Function Test", category: "Blood Test", price: "$40", duration: "6-8 hours" },
    { id: 4, name: "Liver Function Test", category: "Blood Test", price: "$45", duration: "6-8 hours" },
    { id: 5, name: "X-Ray Chest", category: "Imaging", price: "$50", duration: "2 hours" },
    { id: 6, name: "MRI Brain", category: "Imaging", price: "$350", duration: "24 hours" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Book a Test</h1>
        <p className="text-[#6B7C7B]">Choose and schedule your diagnostic tests</p>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
            <input
              type="text"
              placeholder="Search for tests..."
              className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="border border-[#E6F0EE] rounded-2xl p-6 hover:shadow-xl hover:border-[#1FAF9A] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-[#F4F8F7] text-[#6B7C7B] rounded-full text-xs">{test.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4">{test.name}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7C7B] flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Price
                  </span>
                  <span className="font-medium text-[#1C2B2A]">{test.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7C7B] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Report Time
                  </span>
                  <span className="font-medium text-[#1C2B2A]">{test.duration}</span>
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
      </div>

      <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">Need Help Choosing?</h3>
        <p className="text-white/90 mb-6">Our healthcare professionals can guide you to the right tests</p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-white text-[#1FAF9A] rounded-xl hover:shadow-xl transition-all">
            Call: +1 (555) 123-4567
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/20 transition-all">
            Chat with Expert
          </button>
        </div>
      </div>
    </div>
  );
}
