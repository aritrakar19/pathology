import * as React from "react";
import { useState } from "react";
import { User, Phone, Calendar, FileText, ArrowRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function PatientInfoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  const id = searchParams.get("id") || "1";
  const date = searchParams.get("date") || "";
  const slot = searchParams.get("slot") || "";

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking/payment?service=${service}&id=${id}&date=${date}&slot=${slot}`);
  };

  const isFormValid = formData.name && formData.age && formData.gender && formData.mobile && formData.email;

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={5} steps={steps} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">
            Patient Information
          </h1>
          <p className="text-[#6B7C7B]">
            Please provide patient details for the appointment
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Card */}
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-[#1C2B2A] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient's full name"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-[#1C2B2A] mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    required
                    min="1"
                    max="150"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[#1C2B2A] mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[#1C2B2A] mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    pattern="[0-9+\s\-\(\)]+"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#1C2B2A] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                />
              </div>

              {/* Additional Notes */}
              <div className="md:col-span-2">
                <label className="block text-[#1C2B2A] mb-2">
                  Additional Notes <span className="text-[#6B7C7B] text-sm">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-[#6B7C7B]" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any specific health concerns, symptoms, or special requirements..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Summary */}
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-[#1C2B2A] mb-4">
              Appointment Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7C7B]">Service Type:</span>
                <span className="text-[#1C2B2A] font-medium capitalize">{service}</span>
              </div>
              {date && (
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Date:</span>
                  <span className="text-[#1C2B2A] font-medium">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              )}
              {slot && (
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Time:</span>
                  <span className="text-[#1C2B2A] font-medium">{slot}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-[#E6F0EE] border border-[#E6F0EE] rounded-2xl p-6 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-5 h-5 rounded border-[#1FAF9A] text-[#1FAF9A] focus:ring-2 focus:ring-[#1FAF9A] cursor-pointer"
              />
              <span className="text-sm text-[#6B7C7B]">
                I agree to the{" "}
                <a href="#" className="text-[#1FAF9A] hover:underline font-medium">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#1FAF9A] hover:underline font-medium">
                  Privacy Policy
                </a>
                . I consent to receive appointment reminders via SMS and email.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-white border-2 border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white hover:shadow-lg hover:shadow-[#1FAF9A]/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Payment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
