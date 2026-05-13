import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Clock, Shield, Check, Users, Star, ShoppingCart } from "lucide-react";
import { testPackages } from "../../data/mockData";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useBookingFlow } from "../../context/BookingContext";

export function TestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBookingState, resetBooking } = useBookingFlow();
  const test = testPackages.find((t) => t.id === id);

  if (!test) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-[#1C2B2A] mb-2">Test not found</h2>
        <Link to="/user/book-test" className="text-[#1FAF9A] hover:text-[#0E7C6B] text-sm">← Back to tests</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/user/book-test" className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tests
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        <div className="relative h-48 md:h-64">
          <ImageWithFallback src={test.image} alt={test.name} className="w-full h-full object-cover" />
          {test.discount > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              {test.discount}% OFF
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1C2B2A] mb-2">{test.name}</h1>
              <p className="text-[#6B7C7B]">{test.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-bold text-[#1C2B2A]">₹{test.price}</div>
              <div className="text-lg text-[#6B7C7B] line-through">₹{test.originalPrice}</div>
              <div className="text-xs text-[#1FAF9A] font-semibold">You save ₹{test.originalPrice - test.price}</div>
            </div>
          </div>

          {/* Quick info */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-[#F4F8F7] px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-[#1FAF9A]" />
              <span className="text-sm text-[#1C2B2A]">{test.turnaround}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F4F8F7] px-4 py-2 rounded-xl">
              <Shield className="w-4 h-4 text-[#1FAF9A]" />
              <span className="text-sm text-[#1C2B2A]">{test.testCount} Parameters</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F4F8F7] px-4 py-2 rounded-xl">
              <Users className="w-4 h-4 text-[#1FAF9A]" />
              <span className="text-sm text-[#1C2B2A]">Home Collection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tests included */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <h2 className="text-lg font-bold text-[#1C2B2A] mb-4">Tests Included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {test.testsIncluded.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F4F8F7] rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-[#1C2B2A]">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preparation tips */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <h2 className="text-lg font-bold text-[#1C2B2A] mb-4">Preparation Tips</h2>
        <div className="space-y-3">
          {["Fasting of 10-12 hours is required before the test", "Drink water normally", "Continue prescribed medications unless instructed otherwise", "Bring previous reports if available"].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">💡</span>
              </div>
              <p className="text-sm text-[#6B7C7B]">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Book now footer */}
      <div className="sticky bottom-20 md:bottom-4 bg-white rounded-2xl border border-[#E6F0EE] p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-[#1C2B2A]">₹{test.price}</span>
          <span className="text-sm text-[#6B7C7B] line-through ml-2">₹{test.originalPrice}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-xl font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button 
            onClick={() => {
              resetBooking();
              updateBookingState({
                serviceType: "test",
                testId: test.id,
                testName: test.name,
                amount: test.price,
              });
              navigate("/user/booking-summary");
            }}
            className="px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
