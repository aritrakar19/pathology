import * as React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Printer, Save, ArrowLeft, User, TestTube, Calendar, Clock } from "lucide-react";

export function SampleCollectionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    sampleType: "Blood",
    collectorName: "",
    notes: "",
  });

  // Mock patient data
  const patientData = {
    tokenNumber: "T003",
    patientName: "Michael Chen",
    patientAge: 42,
    patientGender: "Male",
    testName: "Liver Function Test",
    bookingTime: "09:30 AM",
  };

  const sampleTypes = ["Blood", "Urine", "Stool", "Serum", "Saliva", "Tissue"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save logic
    alert("Sample collected successfully!");
    navigate("/admin/sample-collection-queue");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/sample-collection-queue")}
          className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Sample Collection</h1>
          <p className="text-[#6B7C7B]">Collect and process patient sample</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#1C2B2A] mb-4">Patient Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-2xl">
                  {patientData.patientName.charAt(0)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Patient Name</p>
                    <p className="font-medium text-[#1C2B2A]">{patientData.patientName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center text-[#1FAF9A] flex-shrink-0">
                    <span className="font-mono font-bold text-sm">#</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Token Number</p>
                    <p className="font-mono font-semibold text-[#1FAF9A]">{patientData.tokenNumber}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Age</p>
                    <p className="font-medium text-[#1C2B2A]">{patientData.patientAge} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Gender</p>
                    <p className="font-medium text-[#1C2B2A]">{patientData.patientGender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TestTube className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Test Name</p>
                    <p className="font-medium text-[#1C2B2A]">{patientData.testName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Booking Time</p>
                    <p className="font-medium text-[#1C2B2A]">{patientData.bookingTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Collection Date</p>
                    <p className="font-medium text-[#1C2B2A]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#1C2B2A] mb-6">Collection Details</h2>

            <div className="space-y-6">
              {/* Sample Type */}
              <div>
                <label className="block text-sm font-medium text-[#1C2B2A] mb-3">
                  Sample Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sampleTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, sampleType: type })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        formData.sampleType === type
                          ? "border-[#1FAF9A] bg-[#E6F0EE] text-[#1FAF9A] font-medium"
                          : "border-[#E6F0EE] bg-white text-[#6B7C7B] hover:border-[#1FAF9A]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collector Name */}
              <div>
                <label className="block text-sm font-medium text-[#1C2B2A] mb-2">
                  Collector Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.collectorName}
                  onChange={(e) => setFormData({ ...formData, collectorName: e.target.value })}
                  placeholder="Enter collector name"
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                />
              </div>

              {/* Collection Time */}
              <div>
                <label className="block text-sm font-medium text-[#1C2B2A] mb-2">
                  Collection Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#1C2B2A] mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any special notes or observations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-xl hover:bg-[#E6F0EE] transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Print Barcode
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Sample
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
