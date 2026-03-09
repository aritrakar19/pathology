import { Upload, FileText, User, TestTube } from "lucide-react";

export function UploadReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Upload Reports</h1>
        <p className="text-[#6B7C7B]">Upload and submit test reports for patients</p>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#1C2B2A] mb-2">Patient Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                <select className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent appearance-none">
                  <option>Select Patient</option>
                  <option>John Doe</option>
                  <option>Sarah Wilson</option>
                  <option>Michael Chen</option>
                  <option>Emma Davis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2">Test Type</label>
              <div className="relative">
                <TestTube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
                <select className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent appearance-none">
                  <option>Select Test Type</option>
                  <option>Complete Blood Count (CBC)</option>
                  <option>Lipid Profile</option>
                  <option>Thyroid Function Test</option>
                  <option>Liver Function Test</option>
                  <option>X-Ray</option>
                  <option>MRI Scan</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#1C2B2A] mb-2">Report Summary</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
              placeholder="Enter key findings and summary..."
            />
          </div>

          <div>
            <label className="block text-[#1C2B2A] mb-2">Observations</label>
            <textarea
              rows={6}
              className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
              placeholder="Detailed observations and recommendations..."
            />
          </div>

          <div>
            <label className="block text-[#1C2B2A] mb-2">Upload Report File</label>
            <div className="border-2 border-dashed border-[#E6F0EE] rounded-xl p-12 text-center hover:border-[#1FAF9A] transition-colors">
              <Upload className="w-12 h-12 text-[#6B7C7B] mx-auto mb-4" />
              <p className="text-[#1C2B2A] mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-[#6B7C7B]">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C2B2A] mb-2">Priority</label>
              <select className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1C2B2A] mb-2">Status</label>
              <select className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent">
                <option>Completed</option>
                <option>Pending Review</option>
                <option>Requires Follow-up</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Submit Report
            </button>
            <button
              type="button"
              className="px-6 py-4 bg-white border border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Recently Uploaded Reports</h2>
        <div className="space-y-4">
          {[
            { patient: "John Doe", test: "Complete Blood Count", date: "Mar 3, 2026", status: "Submitted" },
            { patient: "Sarah Wilson", test: "Lipid Profile", date: "Mar 2, 2026", status: "Submitted" },
            { patient: "Michael Chen", test: "X-Ray Chest", date: "Mar 1, 2026", status: "Submitted" },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-[#E6F0EE] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2B2A]">{report.patient}</h3>
                  <p className="text-sm text-[#6B7C7B]">{report.test}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6B7C7B] mb-1">{report.date}</p>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
