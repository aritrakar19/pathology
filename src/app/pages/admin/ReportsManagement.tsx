import { FileText, Download, Eye, Upload } from "lucide-react";

export function ReportsManagement() {
  const reports = [
    { id: 1, reportId: "RPT-2026-001234", patient: "John Doe", test: "Complete Blood Count", date: "Mar 3, 2026", status: "Completed", doctor: "Dr. Sarah Williams" },
    { id: 2, reportId: "RPT-2026-001235", patient: "Sarah Wilson", test: "Lipid Profile", date: "Mar 3, 2026", status: "Processing", doctor: "Dr. Michael Chen" },
    { id: 3, reportId: "RPT-2026-001236", patient: "Michael Chen", test: "X-Ray Chest", date: "Mar 2, 2026", status: "Completed", doctor: "Dr. Emily Brown" },
    { id: 4, reportId: "RPT-2026-001237", patient: "Emma Davis", test: "Thyroid Function", date: "Mar 2, 2026", status: "Pending", doctor: "Dr. Sarah Williams" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Reports Management</h1>
          <p className="text-[#6B7C7B]">View and manage all test reports</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
          <Upload className="w-5 h-5" />
          Upload Report
        </button>
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
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1FAF9A]">{report.reportId}</td>
                  <td className="py-4 px-4 text-[#1C2B2A]">{report.patient}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.test}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.doctor}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{report.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      report.status === "Completed" ? "bg-green-50 text-green-700" :
                      report.status === "Processing" ? "bg-blue-50 text-blue-700" :
                      "bg-orange-50 text-orange-700"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
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
