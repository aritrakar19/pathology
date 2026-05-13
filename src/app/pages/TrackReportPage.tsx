import * as React from "react";
import { useState } from "react";
import { Search, FileText, Download, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ReportService, Report } from "../services/ReportService";
import { toast } from "sonner";

export function TrackReportPage() {
  const [reportId, setReportId] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId) return;
    
    setLoading(true);
    setSearchPerformed(true);
    try {
      // Find the report locally or by query
      const data = await ReportService.getReportById(reportId);
      if (data) {
        setReport(data);
      } else {
        setReport(null);
        toast.error("Report not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch report.");
    } finally {
      setLoading(false);
    }
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
        {searchPerformed && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
              </div>
            ) : report ? (
              <>
                {/* Status Card */}
                <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-[#1C2B2A] mb-1">
                        {report.testName}
                      </h2>
                      <p className="text-[#6B7C7B]">Report ID: {report.reportId}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-[#6B7C7B] text-sm mb-1">Patient Name</div>
                      <div className="text-[#1C2B2A] font-medium">{report.patientName}</div>
                    </div>
                    <div>
                      <div className="text-[#6B7C7B] text-sm mb-1">Test Date</div>
                      <div className="text-[#1C2B2A] font-medium">{report.date}</div>
                    </div>
                    <div>
                      <div className="text-[#6B7C7B] text-sm mb-1">Doctor</div>
                      <div className="text-[#1C2B2A] font-medium">{report.doctorName || "—"}</div>
                    </div>
                  </div>

                  {report.fileUrl && (
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      download
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Report (PDF)
                    </a>
                  )}
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
              </>
            ) : (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 text-center py-20">
                <AlertCircle className="w-12 h-12 text-[#6B7C7B] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1C2B2A] mb-2">Report Not Found</h3>
                <p className="text-[#6B7C7B]">Please check the Report ID and try again.</p>
              </div>
            )}
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
