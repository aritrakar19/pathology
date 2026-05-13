import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { testPackages, healthCategories } from "../../data/mockData";
import { TestCard } from "../../components/user/TestCard";
import { SearchBar } from "../../components/user/SearchBar";

export function TestCategory() {
  const { id } = useParams();
  const category = healthCategories.find(c => c.id === id || c.name.toLowerCase() === id?.toLowerCase());
  const categoryName = category ? category.name : "All Tests";

  const [searchQuery, setSearchQuery] = useState("");
  const filteredTests = testPackages.filter((test) => {
    const matchesCategory = categoryName === "All Tests" || test.category === categoryName;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/user/book-test" className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B2A] flex items-center gap-2">
              {category?.icon} {categoryName}
            </h1>
            <p className="text-sm text-[#6B7C7B]">{filteredTests.length} tests available</p>
          </div>
        </div>
        <SearchBar placeholder={`Search in ${categoryName}...`} onSearch={setSearchQuery} className="max-w-md w-full" />
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
          <p className="text-sm text-[#6B7C7B]">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
