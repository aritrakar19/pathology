import { TestTube, Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";

export function TestCategories() {
  const categories = [
    { id: 1, name: "Blood Tests", tests: 45, price: "$25-75", avgTime: "4-6 hours", status: "Active" },
    { id: 2, name: "Imaging", tests: 12, price: "$50-350", avgTime: "2-24 hours", status: "Active" },
    { id: 3, name: "Screening Packages", tests: 8, price: "$150-500", avgTime: "1-2 days", status: "Active" },
    { id: 4, name: "Microbiology", tests: 23, price: "$30-100", avgTime: "24-48 hours", status: "Active" },
    { id: 5, name: "Biochemistry", tests: 34, price: "$20-80", avgTime: "4-8 hours", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Test Categories</h1>
          <p className="text-[#6B7C7B]">Manage test categories and pricing</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-[#E6F0EE] rounded-2xl p-6 hover:shadow-xl hover:border-[#1FAF9A] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4">{category.name}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7C7B]">Total Tests</span>
                <span className="font-medium text-[#1C2B2A]">{category.tests}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7C7B] flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </span>
                <span className="font-medium text-[#1C2B2A]">{category.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7C7B] flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Avg Time
                </span>
                <span className="font-medium text-[#1C2B2A]">{category.avgTime}</span>
              </div>
              <div className="pt-3 border-t border-[#E6F0EE]">
                <span className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full">{category.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
