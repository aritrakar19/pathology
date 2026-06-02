import React, { useState, useEffect, useMemo } from "react";
import { Search, Flame, Loader2, Home, MapPin, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";

// Define the interface based on the requested fields
interface PathologyTest {
  id: string;
  name?: string;
  testName?: string;
  category: string;
  price: number;
  discountedPrice?: number;
  offerPrice?: number;
  pathologyName?: string;
  address: string;
  homeCollectionAvailable: boolean;
}

export function BookTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState<PathologyTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read directly from collection(db, "pathologyTests") as requested
    const q = query(collection(db, "pathologyTests"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTests: PathologyTest[] = [];
      snapshot.forEach((doc) => {
        fetchedTests.push({ id: doc.id, ...doc.data() } as PathologyTest);
      });
      setTests(fetchedTests);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pathologyTests: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(tests.map(t => t.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [tests]);

  const filteredTests = tests.filter((test) => {
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    const matchesSearch =
      ((test.name || test.testName || "").toLowerCase().includes(searchQuery.toLowerCase())) ||
      (test.category && test.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (test.pathologyName && test.pathologyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A]">Pathology Marketplace</h1>
        <p className="text-[#6B7C7B] mt-1 text-lg">Search tests across top diagnostic centers & compare prices.</p>
      </div>

      {/* ── SEARCH BAR ─────────────────────────────────────────────── */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
        <input
          type="text"
          placeholder="Search for CBC, Thyroid, Centers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-[#E6F0EE] rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* ── POPULAR BANNER ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-6 flex items-center justify-between overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-300" />
            <h3 className="font-bold text-white text-lg">Compare & Book Lab Tests</h3>
          </div>
          <p className="text-white/90 text-sm max-w-md">Find the best prices for diagnostic tests across multiple certified pathology centers in your area.</p>
        </div>
        <div className="relative z-10 hidden sm:flex flex-col items-end flex-shrink-0">
          <span className="text-3xl font-black text-white">{tests.length}</span>
          <span className="text-white/80 text-sm font-medium">Tests Available</span>
        </div>
      </div>

      {/* ── CATEGORY PILLS ─────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-[#1C2B2A] text-white shadow-md"
              : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/30 hover:bg-[#F4F8F7]"
          }`}
        >
          All Tests
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-[#1C2B2A] text-white shadow-md"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/30 hover:bg-[#F4F8F7]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── RESULTS COUNT ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#E6F0EE] pb-2">
        <h2 className="text-lg font-bold text-[#1C2B2A]">Search Results</h2>
        <p className="text-sm text-[#6B7C7B]">
          Found <strong className="text-[#1FAF9A]">{filteredTests.length}</strong> tests
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </p>
      </div>

      {/* ── TEST GRID ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#6B7C7B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A] mb-4" />
          <p>Loading tests from pathologyTests collection...</p>
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTests.map((test) => {
            const actualName = test.name || test.testName || "Unknown Test";
            const actualDiscountedPrice = test.offerPrice || test.discountedPrice || test.price;
            const actualPathologyName = test.pathologyName || "Partner Pathology Center";
            const actualAddress = test.address || "Center Address";
            const discount = Math.round(((test.price - actualDiscountedPrice) / test.price) * 100);
            return (
              <div key={test.id} className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-[#1C2B2A] line-clamp-1">{actualName}</h3>
                    {discount > 0 && !isNaN(discount) && (
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#1FAF9A] uppercase tracking-wider mb-4">
                    {test.category}
                  </div>
                  
                  {/* Center Details */}
                  <div className="bg-[#F4F8F7] rounded-xl p-3 mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#1FAF9A]" />
                      <span className="font-semibold text-[#1C2B2A] text-sm line-clamp-1">{actualPathologyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B7C7B]">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{actualAddress}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {test.homeCollectionAvailable && (
                      <div className="flex items-center gap-1.5 text-xs text-[#1FAF9A] bg-[#1FAF9A]/10 px-2 py-1 rounded-md">
                        <Home className="w-3.5 h-3.5" />
                        Home Collection
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto border-t border-[#E6F0EE] bg-gray-50 flex items-center justify-between">
                  <div className="pt-3">
                    <span className="text-xl font-bold text-[#1C2B2A]">₹{actualDiscountedPrice}</span>
                    {test.price > actualDiscountedPrice && (
                      <span className="text-sm text-[#6B7C7B] line-through ml-2">₹{test.price}</span>
                    )}
                  </div>
                  <div className="pt-3">
                    <Link
                      to={`/user/test-details/${test.id}`}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E6F0EE]">
          <div className="text-5xl mb-4 opacity-80">🔍</div>
          <h3 className="text-lg font-bold text-[#1C2B2A] mb-2">No tests found</h3>
          <p className="text-sm text-[#6B7C7B] mb-5 max-w-sm mx-auto">We couldn't find any tests matching your search criteria.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="px-6 py-2.5 bg-[#F4F8F7] text-[#1C2B2A] rounded-xl font-semibold text-sm hover:bg-[#E6F0EE] transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
