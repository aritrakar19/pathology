import React from "react";
import { Link } from "react-router";
import { Clock, ArrowRight, MapPin, Building, Star, Home } from "lucide-react";
import type { DiagnosticTest, PathologyCenter } from "../../services/PathologyMarketplaceService";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface MarketplaceTestCardProps {
  test: DiagnosticTest & { center?: PathologyCenter };
}

export function MarketplaceTestCard({ test }: MarketplaceTestCardProps) {
  const center = test.center;
  const discount = Math.round(((test.original_price - test.discounted_price) / test.original_price) * 100);

  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-[#1C2B2A] line-clamp-1">{test.name}</h3>
          {discount > 0 && (
            <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
              {discount}% OFF
            </span>
          )}
        </div>
        <p className="text-sm text-[#6B7C7B] mb-4 line-clamp-2">{test.description}</p>
        
        {/* Center Details */}
        {center && (
          <div className="bg-[#F4F8F7] rounded-xl p-3 mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#1FAF9A]" />
              <span className="font-semibold text-[#1C2B2A] text-sm line-clamp-1">{center.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7C7B]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{center.address}, {center.city}</span>
            </div>
            {center.rating && (
              <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {center.rating} ({center.review_count || 0} reviews)
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C7B] bg-[#E6F0EE] px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {test.report_delivery_time || "24 hrs"}
          </div>
          {test.home_collection_available && (
            <div className="flex items-center gap-1.5 text-xs text-[#1FAF9A] bg-[#1FAF9A]/10 px-2 py-1 rounded-md">
              <Home className="w-3.5 h-3.5" />
              Home Collection
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto border-t border-[#E6F0EE] bg-gray-50 flex items-center justify-between">
        <div className="pt-3">
          <span className="text-xl font-bold text-[#1C2B2A]">₹{test.discounted_price}</span>
          {test.original_price > test.discounted_price && (
            <span className="text-sm text-[#6B7C7B] line-through ml-2">₹{test.original_price}</span>
          )}
        </div>
        <div className="pt-3">
          <Link
            to={`/user/test-details/${test.id}`}
            className="px-5 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            Select Slots
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
