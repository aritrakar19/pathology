import * as React from "react";
import { useState } from "react";
import { Search, FileText, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function TrackReportPage() {
  const [reportId, setReportId] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Mock report data
  const mockReport = {
    id: "RPT-2026-001234",
    patientName: "John Doe",
    testName: "Complete Blood Count (CBC)",
    status: "completed",
    date: "March 1, 2026",
    readyTime: "4 hours",
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C2B2A] mb-4">Track Your Report</h1>
          <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
            Enter your report ID to check the status and download results
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 mb-8">
          <form onSubmit={handleSearch}>
            <label className="block text-[#1C2B2A] mb-2">Report ID</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  placeholder="Enter your report ID (e.g., RPT-2026-001234)"
                  className="w-full pl-12 pr-4 py-4 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all whitespace-nowrap"
              >
                Track Report
              </button>
            </div>
            <p className="text-sm text-[#6B7C7B] mt-2">
              You can find your report ID in the confirmation email or SMS
            </p>
          </form>
        </div>

        {/* Report Result */}
        {searchPerformed && reportId && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[#1C2B2A] mb-1">
                    {mockReport.testName}
                  </h2>
                  <p className="text-[#6B7C7B]">Report ID: {mockReport.id}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="capitalize">{mockReport.status}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-[#6B7C7B] text-sm mb-1">Patient Name</div>
                  <div className="text-[#1C2B2A] font-medium">{mockReport.patientName}</div>
                </div>
                <div>
                  <div className="text-[#6B7C7B] text-sm mb-1">Test Date</div>
                  <div className="text-[#1C2B2A] font-medium">{mockReport.date}</div>
                </div>
                <div>
                  <div className="text-[#6B7C7B] text-sm mb-1">Report Ready In</div>
                  <div className="text-[#1C2B2A] font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {mockReport.readyTime}
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Report (PDF)
              </button>
            </div>

            {/* Report Timeline */}
            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#1C2B2A] mb-6">Report Timeline</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Sample Collected",
                    time: "March 1, 2026 - 9:00 AM",
                    status: "completed",
                  },
                  {
                    title: "Sample Processing",
                    time: "March 1, 2026 - 9:30 AM",
                    status: "completed",
                  },
                  {
                    title: "Analysis Complete",
                    time: "March 1, 2026 - 12:00 PM",
                    status: "completed",
                  },
                  {
                    title: "Report Ready",
                    time: "March 1, 2026 - 1:00 PM",
                    status: "completed",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-[#1FAF9A] text-white"
                          : "bg-[#E6F0EE] text-[#6B7C7B]"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#1C2B2A]">{step.title}</div>
                      <div className="text-sm text-[#6B7C7B]">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                <p className="text-sm text-blue-800">
                  Please consult with your healthcare provider to discuss your test results. 
                  This report should not be used for self-diagnosis or treatment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-[#F4F8F7] rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[#1C2B2A] mb-2">Call Us</h4>
              <p className="text-[#6B7C7B]">+1 (555) 123-4567</p>
              <p className="text-sm text-[#6B7C7B]">Available 24/7</p>
            </div>
            <div>
              <h4 className="font-medium text-[#1C2B2A] mb-2">Email Support</h4>
              <p className="text-[#6B7C7B]">support@medipath.com</p>
              <p className="text-sm text-[#6B7C7B]">Response within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
