import { Search, Edit, Trash2, UserPlus, Mail, Phone } from "lucide-react";

export function ManagePatients() {
  const patients = [
    { id: 1, name: "John Doe", email: "john.d@email.com", phone: "+1 555-1001", age: 35, lastVisit: "Mar 1, 2026", tests: 3, status: "Active" },
    { id: 2, name: "Sarah Wilson", email: "sarah.w@email.com", phone: "+1 555-1002", age: 28, lastVisit: "Mar 2, 2026", tests: 5, status: "Active" },
    { id: 3, name: "Michael Chen", email: "michael.c@email.com", phone: "+1 555-1003", age: 42, lastVisit: "Feb 28, 2026", tests: 2, status: "Active" },
    { id: 4, name: "Emma Davis", email: "emma.d@email.com", phone: "+1 555-1004", age: 31, lastVisit: "Mar 3, 2026", tests: 4, status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Manage Patients</h1>
          <p className="text-[#6B7C7B]">View and manage all patients</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
          <UserPlus className="w-5 h-5" />
          Add Patient
        </button>
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Age</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Last Visit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Tests</th>
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
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.age}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.lastVisit}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{patient.tests}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#1FAF9A] hover:bg-[#F4F8F7] rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
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
