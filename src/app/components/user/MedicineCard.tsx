import React from "react";
import { Link } from "react-router";
import { ShoppingCart, FileText } from "lucide-react";
import type { Medicine } from "../../services/PharmacyService";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-36 bg-[#F4F8F7] flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={medicine.image}
          alt={medicine.name}
          className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {medicine.requiresPrescription && (
          <div className="absolute top-2 left-2 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            Rx Required
          </div>
        )}
        {!medicine.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#1C2B2A] px-3 py-1 rounded-full text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1C2B2A] text-sm truncate">{medicine.name}</h3>
        <p className="text-xs text-[#6B7C7B] truncate">{medicine.genericName}</p>
        <p className="text-[10px] text-[#6B7C7B] mt-1">{medicine.quantity} • {medicine.manufacturer}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-[#1C2B2A]">₹{medicine.price}</span>
            <span className="text-xs text-[#6B7C7B] line-through ml-1.5">₹{medicine.originalPrice}</span>
          </div>
          <button
            onClick={() => {
              addToCart(medicine);
              toast.success(`${medicine.name} added to cart`);
            }}
            disabled={!medicine.inStock}
            className="p-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
