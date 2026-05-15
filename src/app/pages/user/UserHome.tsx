import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  TestTube,
  Stethoscope,
  Pill,
  FileText,
  Bot,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  MapPin,
  Clock,
  Zap,
  Heart,
  Shield,
  Package,
} from "lucide-react";
import { TestCard } from "../../components/user/TestCard";
import { DoctorCard } from "../../components/user/DoctorCard";
import { StatusBadge } from "../../components/user/StatusBadge";
import {
  healthCategories,
  testPackages,
  doctors,
  medicines,
  banners,
} from "../../data/mockData";
import { useUserProfile } from "../../context/ProfileContext";
import { Booking, BookingService } from "../../services/BookingService";

const getStatusLabel = (status: string) => {
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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
    {
      label: "Book Lab Test",
      icon: TestTube,
      path: "/user/book-test",
      emoji: "🧪",
      bg: "bg-gradient-to-br from-[#1FAF9A]/10 to-[#0E7C6B]/5",
      border: "border-[#1FAF9A]/20",
      iconBg: "bg-[#1FAF9A]/10",
      iconColor: "text-[#1FAF9A]",
      tag: "500+ Tests",
    },
    {
      label: "Book Doctor",
      icon: Stethoscope,
      path: "/user/book-doctor",
      emoji: "👨‍⚕️",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50/50",
      border: "border-blue-100",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      tag: "Online & Clinic",
    },
    {
      label: "Pharmacy",
      icon: Pill,
      path: "/user/pharmacy",
      emoji: "💊",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50/50",
      border: "border-purple-100",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      tag: "Fast Delivery",
    },
    {
      label: "My Reports",
      icon: FileText,
      path: "/user/reports",
      emoji: "📄",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50/50",
      border: "border-amber-100",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      tag: "View & Download",
    },
  ];

  const latestBooking = recentBookings[0];
  const hasActiveBooking = latestBooking &&
    !["delivered", "report_generated"].includes(latestBooking.bookingStatus);

  return (
    <div className="space-y-5 md:space-y-8">

      {/* ─── GREETING HEADER ──────────────────────────────────────── */}
      <section className="pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7C7B] font-medium">{getGreeting()} 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1C2B2A] mt-0.5 leading-tight">
              Hello, {firstName}!
            </h1>
            <p className="text-sm text-[#6B7C7B] mt-1">How are you feeling today?</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1FAF9A]/30">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Location pill */}
        <button className="mt-3 flex items-center gap-1.5 text-xs text-[#6B7C7B] bg-white border border-[#E6F0EE] px-3 py-1.5 rounded-full hover:border-[#1FAF9A]/30 transition-colors md:hidden">
          <MapPin className="w-3.5 h-3.5 text-[#1FAF9A]" />
          <span>Delhi NCR</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </section>

      {/* ─── HERO BANNER CAROUSEL ─────────────────────────────────── */}
      <section>
        <div className="relative overflow-hidden rounded-3xl shadow-lg">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.gradient} p-5 md:p-8`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-3xl mb-3">{banner.icon}</div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight">{banner.title}</h2>
                    <p className="text-white/80 text-sm mb-4 max-w-xs">{banner.subtitle}</p>
                    <Link
                      to="/user/book-test"
                      className="inline-flex items-center gap-2 bg-white/95 text-[#1C2B2A] px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="hidden sm:flex w-20 h-20 bg-white/15 rounded-2xl items-center justify-center ml-4 backdrop-blur-sm">
                    <span className="text-4xl">🏥</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentBanner
                    ? "bg-white w-5 h-1.5"
                    : "bg-white/50 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTIVE BOOKING CARD (Continue Journey) ─────────────── */}
      {hasActiveBooking && (
        <section>
          <div className="bg-gradient-to-r from-[#1FAF9A]/8 to-[#0E7C6B]/5 border border-[#1FAF9A]/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Clock className="w-5 h-5 text-[#1FAF9A]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7C7B] font-medium uppercase tracking-wide">Continue Journey</p>
                <h3 className="font-bold text-[#1C2B2A] text-sm mt-0.5">
                  {latestBooking.testName || latestBooking.serviceType}
                </h3>
                <p className="text-xs text-[#1FAF9A] font-medium mt-0.5">
                  {getStatusLabel(latestBooking.bookingStatus)}
                </p>
              </div>
            </div>
            <Link
              to="/user/tracking"
              className="flex items-center gap-1.5 bg-[#1FAF9A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex-shrink-0"
            >
              Track <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── QUICK ACTIONS ─────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                className={`${action.bg} border ${action.border} rounded-2xl p-4 md:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group active:scale-95`}
              >
                <div className={`w-11 h-11 ${action.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <h3 className="font-bold text-[#1C2B2A] text-sm leading-tight">{action.label}</h3>
                <p className="text-[10px] text-[#6B7C7B] mt-1 font-medium">{action.tag}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── HEALTH CATEGORIES ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Health Categories</h2>
          <Link to="/user/book-test" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {healthCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/user/test-category/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-[#E6F0EE] hover:shadow-md hover:border-[#1FAF9A]/30 hover:-translate-y-0.5 transition-all duration-300 min-w-[88px] active:scale-95"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${cat.color}18` }}
              >
                {cat.icon}
              </div>
              <span className="text-[11px] font-semibold text-[#1C2B2A] text-center leading-tight whitespace-nowrap">{cat.name}</span>
              <span className="text-[10px] text-[#6B7C7B]">{cat.testCount}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── POPULAR TESTS ──────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Popular Tests</h2>
          <Link to="/user/book-test" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Horizontal swipe on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
          {testPackages.slice(0, 5).map((test) => (
            <div key={test.id} className="flex-shrink-0 w-64 md:w-auto">
              <TestCard test={test} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── TOP DOCTORS ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Top Doctors</h2>
          <Link to="/user/book-doctor" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
          {doctors.slice(0, 4).map((doc) => (
            <div key={doc.id} className="flex-shrink-0 w-64 md:w-auto">
              <DoctorCard doctor={doc} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── PHARMACY QUICK ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Pharmacy</h2>
          <Link to="/user/pharmacy" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {medicines.slice(0, 6).map((med) => (
            <Link
              key={med.id}
              to="/user/pharmacy"
              className="flex-shrink-0 bg-white border border-[#E6F0EE] rounded-2xl p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-36 active:scale-95"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-2 text-xl">
                💊
              </div>
              <h3 className="font-semibold text-[#1C2B2A] text-xs leading-tight line-clamp-2">{med.name}</h3>
              <p className="text-[10px] text-[#6B7C7B] mt-0.5">{med.category}</p>
              <p className="text-sm font-bold text-[#1FAF9A] mt-1.5">₹{med.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── RECENT BOOKINGS ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Recent Bookings</h2>
          <Link to="/user/tracking" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6F0EE] p-8 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold text-[#1C2B2A] text-sm mb-1">No bookings yet</p>
              <p className="text-xs text-[#6B7C7B] mb-4">Start by booking a lab test or doctor consultation</p>
              <Link
                to="/user/book-test"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
              >
                <TestTube className="w-4 h-4" /> Book Now
              </Link>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <Link
                key={booking.bookingId}
                to="/user/tracking"
                className="bg-white rounded-2xl border border-[#E6F0EE] p-4 flex items-center justify-between hover:shadow-md hover:border-[#1FAF9A]/20 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      booking.serviceType === "test"
                        ? "bg-[#1FAF9A]/10"
                        : booking.serviceType === "doctor"
                        ? "bg-blue-50"
                        : "bg-purple-50"
                    }`}
                  >
                    {booking.serviceType === "test" ? (
                      <TestTube className="w-5 h-5 text-[#1FAF9A]" />
                    ) : booking.serviceType === "doctor" ? (
                      <Stethoscope className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Pill className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] text-sm">
                      {booking.testName || booking.serviceType}
                    </h3>
                    <p className="text-xs text-[#6B7C7B]">
                      {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={getStatusLabel(booking.bookingStatus)} />
                  <ChevronRight className="w-4 h-4 text-[#6B7C7B]" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ─── AI HEALTH ASSISTANT CARD ───────────────────────────────── */}
      <section className="pb-4">
        <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Health Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">Available 24/7</span>
                </div>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              Describe your symptoms and get instant guidance on which tests or doctors you need.
            </p>
            <Link
              to="/user/ai-assistant"
              className="flex items-center justify-center gap-2 bg-white text-[#1FAF9A] py-3 px-6 rounded-2xl font-bold text-sm hover:shadow-xl transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HEALTH PACKAGES PROMO ──────────────────────────────────── */}
      <section className="pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1C2B2A]">Health Packages</h2>
          <Link to="/user/book-test" className="text-sm text-[#1FAF9A] font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { name: "Full Body Checkup", tests: "72 tests", price: "₹1,999", original: "₹5,400", discount: "63% off", emoji: "🩺", bg: "from-[#1FAF9A]/10 to-[#0E7C6B]/5", border: "border-[#1FAF9A]/20" },
            { name: "Diabetes Panel", tests: "12 tests", price: "₹649", original: "₹1,200", discount: "46% off", emoji: "🩸", bg: "from-red-50 to-orange-50/50", border: "border-red-100" },
            { name: "Heart Health", tests: "18 tests", price: "₹899", original: "₹2,100", discount: "57% off", emoji: "❤️", bg: "from-pink-50 to-rose-50/50", border: "border-pink-100" },
            { name: "Thyroid Profile", tests: "6 tests", price: "₹399", original: "₹850", discount: "53% off", emoji: "🦋", bg: "from-purple-50 to-indigo-50/50", border: "border-purple-100" },
          ].map((pkg) => (
            <Link
              key={pkg.name}
              to="/user/book-test"
              className={`flex-shrink-0 bg-gradient-to-br ${pkg.bg} border ${pkg.border} rounded-2xl p-4 w-52 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95`}
            >
              <div className="text-2xl mb-2">{pkg.emoji}</div>
              <h3 className="font-bold text-[#1C2B2A] text-sm leading-tight">{pkg.name}</h3>
              <p className="text-[10px] text-[#6B7C7B] mt-0.5 mb-2">{pkg.tests}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-base font-bold text-[#1C2B2A]">{pkg.price}</p>
                  <p className="text-[10px] text-[#6B7C7B] line-through">{pkg.original}</p>
                </div>
                <span className="text-[10px] font-bold text-[#1FAF9A] bg-[#1FAF9A]/10 px-2 py-0.5 rounded-lg">
                  {pkg.discount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SAFETY & TRUST STRIP ───────────────────────────────────── */}
      <section className="pb-2">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Shield, label: "NABL Certified", sub: "Lab Standards" },
              { icon: Package, label: "Home Collection", sub: "Free Service" },
              { icon: TrendingUp, label: "2M+ Reports", sub: "Delivered" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 bg-[#1FAF9A]/8 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1FAF9A]" />
                </div>
                <p className="text-xs font-bold text-[#1C2B2A] leading-tight">{label}</p>
                <p className="text-[10px] text-[#6B7C7B]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
