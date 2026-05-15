import React, { useState } from "react";
import { Link } from "react-router";
import { Search, ChevronRight, Flame } from "lucide-react";
import { TestCard } from "../../components/user/TestCard";
import { testPackages, healthCategories } from "../../data/mockData";

export function BookTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = testPackages.filter((test) => {
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2B2A]">Book Lab Test</h1>
        <p className="text-sm text-[#6B7C7B] mt-0.5">Choose from 500+ tests &amp; health packages</p>
      </div>

      {/* ── SEARCH BAR ─────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
        <input
          type="text"
          placeholder="Search tests, e.g. CBC, Thyroid, Vitamin D..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E6F0EE] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* ── POPULAR BANNER ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-5 flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-300" />
            <h3 className="font-bold text-white text-base">Most Popular Tests</h3>
          </div>
          <p className="text-white/80 text-xs">Up to 63% off on health packages</p>
        </div>
        <div className="relative z-10 flex flex-col items-end flex-shrink-0">
          <span className="text-2xl font-black text-white">{testPackages.length}+</span>
          <span className="text-white/70 text-xs">Packages</span>
        </div>
      </div>

      {/* ── CATEGORY PILLS ─────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
              : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/30"
          }`}
        >
          All Tests
        </button>
        {healthCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              selectedCategory === cat.name
                ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/30"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── RESULTS COUNT ─────────────────────────────────────────── */}
      {searchQuery && (
        <p className="text-sm text-[#6B7C7B]">
          Found <strong className="text-[#1C2B2A]">{filteredTests.length}</strong> result{filteredTests.length !== 1 ? "s" : ""}
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </p>
      )}

      {/* ── TEST GRID ──────────────────────────────────────────────── */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-[#1C2B2A] mb-2">No tests found</h3>
          <p className="text-sm text-[#6B7C7B] mb-5">Try adjusting your search or category filter</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
