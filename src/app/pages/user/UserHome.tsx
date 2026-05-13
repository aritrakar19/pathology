import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  TestTube,
  Stethoscope,
  Pill,
  FileText,
  Bot,
  ChevronRight,
  TrendingUp,
  ChevronLeft,
  Heart,
  Shield,
} from "lucide-react";
import { SearchBar } from "../../components/user/SearchBar";
import { TestCard } from "../../components/user/TestCard";
import { DoctorCard } from "../../components/user/DoctorCard";
import { MedicineCard } from "../../components/user/MedicineCard";
import { StatusBadge } from "../../components/user/StatusBadge";
import {
  healthCategories,
  testPackages,
  doctors,
  medicines,
  healthTimelines,
  banners,
} from "../../data/mockData";
import { useUserProfile } from "../../context/ProfileContext";
import { Booking, BookingService } from "../../services/BookingService";

const getStatusLabel = (status: string) => {
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export function UserHome() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const { profile } = useUserProfile();
  const firstName = profile?.fullName ? profile.fullName.split(" ")[0] : "User";

  useEffect(() => {
    if (profile) {
      const unsubscribe = BookingService.subscribeToUserBookings(profile.uid, (data) => {
        setRecentBookings(data.slice(0, 3));
      });
      return () => unsubscribe();
    }
  }, [profile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: "Book Lab Test", icon: TestTube, path: "/user/book-test", emoji: "🧪", gradient: "from-[#1FAF9A]/10 to-[#0E7C6B]/10", iconColor: "text-[#1FAF9A]" },
    { label: "Book Doctor", icon: Stethoscope, path: "/user/book-doctor", emoji: "👨‍⚕️", gradient: "from-blue-50 to-indigo-50", iconColor: "text-blue-500" },
    { label: "Order Medicine", icon: Pill, path: "/user/pharmacy", emoji: "💊", gradient: "from-purple-50 to-pink-50", iconColor: "text-purple-500" },
    { label: "View Reports", icon: FileText, path: "/user/reports", emoji: "📄", gradient: "from-amber-50 to-orange-50", iconColor: "text-amber-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-3xl p-6 md:p-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-10 right-20 w-3 h-3 bg-white/20 rounded-full" />
        <div className="absolute bottom-10 right-40 w-2 h-2 bg-white/30 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm text-white/90 font-medium">Smart Healthcare Platform</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-white/80 mb-6 max-w-lg">
              Your health companion for booking tests, consultations, and medicines — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/user/book-test"
                className="px-5 py-3 bg-white text-[#1FAF9A] rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <TestTube className="w-4 h-4" />
                Book Test
              </Link>
              <Link
                to="/user/book-doctor"
                className="px-5 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl font-medium hover:bg-white/25 transition-all flex items-center gap-2 text-sm"
              >
                <Stethoscope className="w-4 h-4" />
                Book Doctor
              </Link>
              <Link
                to="/user/pharmacy"
                className="px-5 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl font-medium hover:bg-white/25 transition-all flex items-center gap-2 text-sm"
              >
                <Pill className="w-4 h-4" />
                Order Medicine
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-7xl">🏥</div>
              </div>
              <div className="absolute -top-3 -right-3 bg-white rounded-xl p-3 shadow-lg">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl p-2.5 shadow-lg">
                <div className="text-xs font-semibold text-[#1FAF9A]">500+</div>
                <div className="text-[10px] text-[#6B7C7B]">Tests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Search */}
        <div className="relative z-10 mt-6 md:mt-8">
          <SearchBar large placeholder="Search doctors, tests, medicines..." className="max-w-2xl" />
        </div>
      </section>

      {/* ─── QUICK ACTIONS ─────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                className={`bg-gradient-to-br ${action.gradient} border border-[#E6F0EE] rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{action.emoji}</span>
                </div>
                <h3 className="font-semibold text-[#1C2B2A] text-sm">{action.label}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7C7B] group-hover:text-[#1FAF9A] transition-colors">
                  Explore <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── HEALTHCARE CATEGORIES ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Health Categories</h2>
          <Link to="/user/book-test" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {healthCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/user/test-category/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-[#E6F0EE] hover:shadow-lg hover:border-[#1FAF9A]/30 hover:-translate-y-1 transition-all duration-300 min-w-[100px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat.color}15` }}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-[#1C2B2A] whitespace-nowrap">{cat.name}</span>
              <span className="text-[10px] text-[#6B7C7B]">{cat.testCount} tests</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED TEST PACKAGES ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Featured Test Packages</h2>
          <Link to="/user/book-test" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testPackages.slice(0, 3).map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

      {/* ─── TOP DOCTORS ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Top Doctors</h2>
          <Link to="/user/book-doctor" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, 3).map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      </section>

      {/* ─── PHARMACY PREVIEW ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Pharmacy</h2>
          <Link to="/user/pharmacy" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {medicines.slice(0, 4).map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </section>

      {/* ─── HEALTH BANNERS CAROUSEL ───────────────────────────────── */}
      <section>
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.gradient} rounded-2xl p-6 md:p-8`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-2">{banner.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{banner.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{banner.subtitle}</p>
                    <Link
                      to="/user/book-test"
                      className="inline-flex items-center gap-2 bg-white text-[#1C2B2A] px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      Book Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBanner ? "bg-[#1FAF9A] w-6" : "bg-[#E6F0EE]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI HEALTH ASSISTANT CARD ──────────────────────────────── */}
      <section>
        <div className="bg-gradient-to-br from-[#F4F8F7] to-white border border-[#E6F0EE] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#1FAF9A]/20">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#1C2B2A] mb-1">AI Health Assistant</h3>
            <p className="text-sm text-[#6B7C7B]">
              Need help finding the right test or doctor? Our AI assistant can guide you based on your symptoms.
            </p>
          </div>
          <Link
            to="/user/ai-assistant"
            className="px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Bot className="w-4 h-4" />
            Ask AI
          </Link>
        </div>
      </section>

      {/* ─── RECENT BOOKINGS ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Recent Bookings</h2>
          <Link to="/user/tracking" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6 text-center text-sm text-[#6B7C7B]">
              No recent bookings found.
            </div>
          ) : (
            recentBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white rounded-2xl border border-[#E6F0EE] p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    booking.serviceType === "test" ? "bg-[#1FAF9A]/10" : booking.serviceType === "doctor" ? "bg-blue-50" : "bg-purple-50"
                  }`}>
                    {booking.serviceType === "test" ? (
                      <TestTube className="w-5 h-5 text-[#1FAF9A]" />
                    ) : booking.serviceType === "doctor" ? (
                      <Stethoscope className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Pill className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] text-sm">{booking.testName || booking.serviceType}</h3>
                    <p className="text-xs text-[#6B7C7B]">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={getStatusLabel(booking.bookingStatus)} />
                  <Link
                    to="/user/tracking"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-[#E6F0EE] rounded-lg text-xs text-[#1FAF9A] font-medium hover:border-[#1FAF9A] transition-colors"
                  >
                    Track <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ─── HEALTH TIMELINE PREVIEW ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1C2B2A]">Health Trends</h2>
          <Link to="/user/reports" className="text-sm text-[#1FAF9A] font-medium hover:text-[#0E7C6B] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthTimelines.map((timeline) => {
            const latestValue = timeline.data[timeline.data.length - 1].value;
            const isNormal = latestValue >= timeline.normal.min && latestValue <= timeline.normal.max;
            const trend = timeline.data[timeline.data.length - 1].value - timeline.data[timeline.data.length - 2].value;
            return (
              <div key={timeline.metric} className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] text-sm">{timeline.metric}</h3>
                    <p className="text-xs text-[#6B7C7B]">Normal: {timeline.normal.min}-{timeline.normal.max} {timeline.unit}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isNormal ? "text-[#1FAF9A]" : "text-amber-500"}`}>
                      {latestValue}
                    </div>
                    <div className={`text-xs flex items-center gap-0.5 ${trend > 0 ? "text-red-400" : "text-green-500"}`}>
                      <TrendingUp className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`} />
                      {Math.abs(trend).toFixed(1)} {timeline.unit}
                    </div>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="flex items-end gap-1.5 h-16">
                  {timeline.data.map((point, i) => {
                    const maxVal = Math.max(...timeline.data.map((d) => d.value));
                    const minVal = Math.min(...timeline.data.map((d) => d.value));
                    const range = maxVal - minVal || 1;
                    const height = ((point.value - minVal) / range) * 100;
                    const pointNormal = point.value >= timeline.normal.min && point.value <= timeline.normal.max;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-lg transition-all ${pointNormal ? "bg-[#1FAF9A]/20" : "bg-amber-100"}`}
                          style={{ height: `${Math.max(height, 15)}%` }}
                        >
                          <div
                            className={`w-full h-full rounded-lg ${pointNormal ? "bg-gradient-to-t from-[#1FAF9A] to-[#1FAF9A]/60" : "bg-gradient-to-t from-amber-400 to-amber-200"}`}
                          />
                        </div>
                        <span className="text-[9px] text-[#6B7C7B]">{point.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
