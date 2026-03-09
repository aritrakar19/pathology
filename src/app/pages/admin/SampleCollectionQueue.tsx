import { Search, Printer, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router";

export function SampleCollectionQueue() {
  const queue = [
    { id: 1, tokenNumber: "T001", patientName: "John Doe", testName: "Complete Blood Count", bookingTime: "09:00 AM", status: "Pending" },
    { id: 2, tokenNumber: "T002", patientName: "Sarah Wilson", testName: "Lipid Profile", bookingTime: "09:15 AM", status: "Pending" },
    { id: 3, tokenNumber: "T003", patientName: "Michael Chen", testName: "Liver Function Test", bookingTime: "09:30 AM", status: "In Progress" },
    { id: 4, tokenNumber: "T004", patientName: "Emma Davis", testName: "Thyroid Profile", bookingTime: "09:45 AM", status: "Pending" },
    { id: 5, tokenNumber: "T005", patientName: "James Brown", testName: "Kidney Function Test", bookingTime: "10:00 AM", status: "Collected" },
    { id: 6, tokenNumber: "T006", patientName: "Lisa Garcia", testName: "Diabetes Screening", bookingTime: "10:15 AM", status: "Pending" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>;
      case "In Progress":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">In Progress</span>;
      case "Collected":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Collected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Sample Collection Queue</h1>
          <p className="text-[#6B7C7B]">Manage patient sample collection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-[#E6F0EE] rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1FAF9A]" />
              <span className="text-sm text-[#6B7C7B]">Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
              placeholder="Search by token number, patient name, or test..."
              className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Token Number</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patient Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Test Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Booking Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Collection Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono font-semibold text-[#1FAF9A]">{item.tokenNumber}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                        {item.patientName.charAt(0)}
                      </div>
                      <span className="font-medium text-[#1C2B2A]">{item.patientName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{item.testName}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{item.bookingTime}</td>
                  <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {item.status === "Pending" && (
                        <Link
                          to={`/admin/sample-collection/${item.id}`}
                          className="px-4 py-2 bg-[#1FAF9A] text-white rounded-lg hover:bg-[#0E7C6B] transition-colors text-sm"
                        >
                          Collect Sample
                        </Link>
                      )}
                      {item.status === "In Progress" && (
                        <>
                          <button className="px-4 py-2 bg-[#1FAF9A] text-white rounded-lg hover:bg-[#0E7C6B] transition-colors text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Mark Collected
                          </button>
                          <button className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                            <Printer className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {item.status === "Collected" && (
                        <button className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
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
