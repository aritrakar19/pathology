import React from "react";
import { Link } from "react-router";
import { Clock, ArrowRight } from "lucide-react";
import type { TestPackage } from "../../data/mockData";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface TestCardProps {
  test: TestPackage;
  compact?: boolean;
}

export function TestCard({ test, compact = false }: TestCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden hover:shadow-xl hover:shadow-[#1FAF9A]/10 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback
          src={test.image}
          alt={test.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {test.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {test.discount}% OFF
          </div>
        )}
        {test.popular && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#1FAF9A] px-3 py-1 rounded-full text-xs font-semibold shadow">
            ⭐ Popular
          </div>
        )}
      </div>
      <div className={`${compact ? "p-4" : "p-5"}`}>
        <h3 className="font-semibold text-[#1C2B2A] mb-1 line-clamp-1">{test.name}</h3>
        {!compact && <p className="text-xs text-[#6B7C7B] mb-3 line-clamp-2">{test.description}</p>}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-[#6B7C7B]">
            <span className="font-medium text-[#1FAF9A]">{test.testCount}</span> tests
          </div>
          <span className="w-1 h-1 bg-[#E6F0EE] rounded-full" />
          <div className="flex items-center gap-1 text-xs text-[#6B7C7B]">
            <Clock className="w-3 h-3" />
            {test.turnaround}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#1C2B2A]">₹{test.price}</span>
            <span className="text-sm text-[#6B7C7B] line-through ml-2">₹{test.originalPrice}</span>
          </div>
          <Link
            to={`/user/test-details/${test.id}`}
            className="px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center gap-1"
          >
            Book Now
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
