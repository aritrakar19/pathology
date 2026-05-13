import React, { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, ChevronRight, SlidersHorizontal } from "lucide-react";
import { TestCard } from "../../components/user/TestCard";
import { SearchBar } from "../../components/user/SearchBar";
import { testPackages, healthCategories } from "../../data/mockData";

export function BookTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = testPackages.filter((test) => {
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Book Lab Test</h1>
          <p className="text-sm text-[#6B7C7B]">Choose from 500+ tests & health packages</p>
        </div>
        <SearchBar placeholder="Search tests..." onSearch={setSearchQuery} className="max-w-md w-full" />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
              : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A]"
          }`}
        >
          All Tests
        </button>
        {healthCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.name
                ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A]"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Popular packages banner */}
      <div className="bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-5 md:p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">🔥 Most Popular Tests</h3>
          <p className="text-white/80 text-sm">Get up to 63% off on health packages</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
          <span className="font-semibold text-white">{testPackages.length}</span> packages available
        </div>
      </div>

      {/* Test grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">No tests found</h3>
          <p className="text-sm text-[#6B7C7B]">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}
