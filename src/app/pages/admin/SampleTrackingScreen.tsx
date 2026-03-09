import { Search, Filter } from "lucide-react";

export function SampleTrackingScreen() {
  const samples = [
    { id: 1, sampleId: "SM2026001", patient: "John Doe", test: "Complete Blood Count", department: "Hematology", status: "Collected", collectionTime: "09:15 AM", currentLocation: "Lab Reception" },
    { id: 2, sampleId: "SM2026002", patient: "Sarah Wilson", test: "Lipid Profile", department: "Biochemistry", status: "In Lab", collectionTime: "09:30 AM", currentLocation: "Biochemistry Lab" },
    { id: 3, sampleId: "SM2026003", patient: "Michael Chen", test: "Liver Function Test", department: "Biochemistry", status: "Processing", collectionTime: "09:45 AM", currentLocation: "Analyzer Station" },
    { id: 4, sampleId: "SM2026004", patient: "Emma Davis", test: "Thyroid Profile", department: "Immunology", status: "Result Ready", collectionTime: "10:00 AM", currentLocation: "Quality Check" },
    { id: 5, sampleId: "SM2026005", patient: "James Brown", test: "Kidney Function Test", department: "Biochemistry", status: "In Lab", collectionTime: "10:15 AM", currentLocation: "Biochemistry Lab" },
    { id: 6, sampleId: "SM2026006", patient: "Lisa Garcia", test: "Diabetes Screening", department: "Biochemistry", status: "Collected", collectionTime: "10:30 AM", currentLocation: "Lab Reception" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Collected":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-700 rounded-full"></span>
            Collected
          </span>
        );
      case "In Lab":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-700 rounded-full"></span>
            In Lab
          </span>
        );
      case "Processing":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-700 rounded-full animate-pulse"></span>
            Processing
          </span>
        );
      case "Result Ready":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-700 rounded-full"></span>
            Result Ready
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Sample Tracking</h1>
          <p className="text-[#6B7C7B]">Real-time tracking of all samples</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-xl hover:bg-[#E6F0EE] transition-all">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2B2A]">2</p>
              <p className="text-sm text-[#6B7C7B]">Collected</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2B2A]">2</p>
              <p className="text-sm text-[#6B7C7B]">In Lab</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2B2A]">1</p>
              <p className="text-sm text-[#6B7C7B]">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2B2A]">1</p>
              <p className="text-sm text-[#6B7C7B]">Result Ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
            <input
              type="text"
              placeholder="Search by sample ID, patient name, or test..."
              className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Sample ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Test</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Department</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Collection Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Current Location</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample) => (
                <tr key={sample.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono font-semibold text-[#1FAF9A]">{sample.sampleId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                        {sample.patient.charAt(0)}
                      </div>
                      <span className="font-medium text-[#1C2B2A]">{sample.patient}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{sample.test}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-[#E6F0EE] text-[#1C2B2A] rounded-full text-xs">
                      {sample.department}
                    </span>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(sample.status)}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{sample.collectionTime}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{sample.currentLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
