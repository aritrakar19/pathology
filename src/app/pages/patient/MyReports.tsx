import { FileText, Download, Eye, CheckCircle, Clock } from "lucide-react";

export function MyReports() {
  const reports = [
    { id: 1, reportId: "RPT-2026-001234", test: "Lipid Profile", date: "Mar 1, 2026", doctor: "Dr. Sarah Williams", status: "Ready" },
    { id: 2, reportId: "RPT-2026-001235", test: "Thyroid Function Test", date: "Feb 28, 2026", doctor: "Dr. Michael Chen", status: "Ready" },
    { id: 3, reportId: "RPT-2026-001236", test: "Complete Blood Count", date: "Feb 25, 2026", doctor: "Dr. Sarah Williams", status: "Ready" },
    { id: 4, reportId: "RPT-2026-001237", test: "X-Ray Chest", date: "Feb 20, 2026", doctor: "Dr. Emily Brown", status: "Ready" },
    { id: 5, reportId: "RPT-2026-001238", test: "Diabetes Screening", date: "Mar 3, 2026", doctor: "Dr. Sarah Williams", status: "Processing" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">My Reports</h1>
        <p className="text-[#6B7C7B]">Access and download your test reports</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Total Reports</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Ready to Download</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">4</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Processing</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">1</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">All Reports</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="p-5 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] mb-1">{report.test}</h3>
                    <p className="text-sm text-[#6B7C7B]">Report ID: {report.reportId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                  report.status === "Ready" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                }`}>
                  {report.status === "Ready" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {report.status}
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-[#6B7C7B]">Date</span>
                  <p className="font-medium text-[#1C2B2A]">{report.date}</p>
                </div>
                <div>
                  <span className="text-[#6B7C7B]">Doctor</span>
                  <p className="font-medium text-[#1C2B2A]">{report.doctor}</p>
                </div>
                <div>
                  <span className="text-[#6B7C7B]">Status</span>
                  <p className="font-medium text-[#1C2B2A]">{report.status}</p>
                </div>
              </div>
              {report.status === "Ready" && (
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              )}
              {report.status === "Processing" && (
                <div className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Report is being processed. Expected within 4-6 hours.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
        <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
          <p className="text-sm text-blue-800">
            Please consult with your healthcare provider to discuss your test results. 
            These reports should not be used for self-diagnosis or treatment. Keep your 
            reports secure and share only with authorized medical professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
