import React, { useState, useEffect } from "react";
import { SearchBar } from "../../components/user/SearchBar";
import { MedicineCard } from "../../components/user/MedicineCard";
import { Medicine, PharmacyService } from "../../services/PharmacyService";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";

const categories = ["All", "Pain Relief", "Antibiotics", "Gastro", "Supplements", "Diabetes"];

export function Pharmacy() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const unsubscribe = PharmacyService.subscribeToMedicines((data) => {
      setMedicines(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = medicines.filter((m) => {
    const catMatch = selectedCat === "All" || m.category === selectedCat;
    const searchMatch = m.name.toLowerCase().includes(query.toLowerCase()) || m.genericName.toLowerCase().includes(query.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Pharmacy</h1>
          <p className="text-sm text-[#6B7C7B]">Order medicines & health essentials</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Search medicines..." onSearch={setQuery} className="max-w-sm w-full" />
          <Link to="/user/cart" className="relative p-3 bg-white border border-[#E6F0EE] rounded-xl hover:border-[#1FAF9A] transition-colors">
            <ShoppingCart className="w-5 h-5 text-[#6B7C7B]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1FAF9A] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((c) => (
          <button key={c} onClick={() => setSelectedCat(c)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCat === c ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/25" : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 flex items-center gap-4">
        <span className="text-3xl">💊</span>
        <div>
          <h3 className="font-semibold text-[#1C2B2A] text-sm">Upload Prescription</h3>
          <p className="text-xs text-[#6B7C7B]">Get medicines delivered with a valid prescription</p>
        </div>
        <button className="ml-auto px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-xs font-semibold hover:shadow-lg transition-all">Upload</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((m) => <MedicineCard key={m.medicineId} medicine={m} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💊</div>
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">No medicines found</h3>
          <p className="text-sm text-[#6B7C7B]">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
