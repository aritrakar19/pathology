import { Search, Eye, FileText } from "lucide-react";

export function MyPatients() {
  const patients = [
    { id: 1, name: "John Doe", age: 35, gender: "Male", tests: 3, lastVisit: "Mar 1, 2026", status: "Active" },
    { id: 2, name: "Sarah Wilson", age: 28, gender: "Female", tests: 5, lastVisit: "Mar 2, 2026", status: "Active" },
    { id: 3, name: "Michael Chen", age: 42, gender: "Male", tests: 2, lastVisit: "Feb 28, 2026", status: "Active" },
    { id: 4, name: "Emma Davis", age: 31, gender: "Female", tests: 4, lastVisit: "Mar 3, 2026", status: "Active" },
    { id: 5, name: "James Wilson", age: 38, gender: "Male", tests: 6, lastVisit: "Feb 25, 2026", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">My Patients</h1>
        <p className="text-[#6B7C7B]">View and manage your assigned patients</p>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Age</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Gender</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Tests Conducted</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Last Visit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                        {patient.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#1C2B2A]">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.age}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.gender}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.tests}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.lastVisit}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
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
