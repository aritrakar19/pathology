import React, { useState, useEffect, useRef } from "react";
import { FileText, Download, Eye, Upload, Loader2 } from "lucide-react";
import { ReportService, Report } from "../../services/ReportService";
import { toast } from "sonner";
import { BookingService, Booking } from "../../services/BookingService";

export function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const unsubReports = ReportService.subscribeToAllReports((data) => {
      setReports(data);
      setLoading(false);
    });
    
    // Fetch bookings to auto-assign a user to the uploaded report for demonstration
    const unsubBookings = BookingService.subscribeToAllBookings((bookings) => {
      if (bookings.length > 0) {
        setRecentBooking(bookings[0]);
      }
    });

    return () => {
      unsubReports();
      unsubBookings();
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!recentBooking) {
      toast.error("No booking found to attach report to.");
      return;
    }

    setUploading(true);
    try {
      const fileUrl = await ReportService.uploadReportFile(file);
      
      await ReportService.createReport({
        bookingId: recentBooking.bookingId,
        userId: recentBooking.userId,
        patientName: recentBooking.patientName,
        testName: recentBooking.testName || "Laboratory Test",
        status: "Ready",
        fileUrl,
        fileSize: (file.size / 1024).toFixed(2) + " KB",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      });
      
      toast.success("Report uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload report.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Reports Management</h1>
          <p className="text-[#6B7C7B]">View and manage all test reports</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {uploading ? "Uploading..." : "Upload Report"}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          accept="application/pdf,image/*" 
          onChange={handleUpload} 
        />
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Report ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Test</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1FAF9A]" /></td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#6B7C7B]">No reports found</td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.reportId} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1FAF9A]">{report.reportId.substring(0, 8)}</td>
                  <td className="py-4 px-4 text-[#1C2B2A]">{report.patientName}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.testName}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.doctorName || "—"}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      report.status === "Ready" ? "bg-green-50 text-green-700" :
                      report.status === "Processing" ? "bg-blue-50 text-blue-700" :
                      "bg-orange-50 text-orange-700"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {report.fileUrl && (
                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      {report.fileUrl && (
                        <a href={report.fileUrl} download className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
