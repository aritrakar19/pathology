import { Search, Edit, Trash2, UserPlus, Mail, Phone } from "lucide-react";

export function ManageDoctors() {
  const doctors = [
    { id: 1, name: "Dr. Sarah Williams", email: "sarah.w@medipath.com", phone: "+1 555-0101", specialty: "Pathology", patients: 45, status: "Active" },
    { id: 2, name: "Dr. Michael Chen", email: "michael.c@medipath.com", phone: "+1 555-0102", specialty: "Radiology", patients: 38, status: "Active" },
    { id: 3, name: "Dr. Emily Brown", email: "emily.b@medipath.com", phone: "+1 555-0103", specialty: "Laboratory", patients: 52, status: "Active" },
    { id: 4, name: "Dr. James Wilson", email: "james.w@medipath.com", phone: "+1 555-0104", specialty: "Pathology", patients: 41, status: "On Leave" },
    { id: 5, name: "Dr. Lisa Anderson", email: "lisa.a@medipath.com", phone: "+1 555-0105", specialty: "Biochemistry", patients: 36, status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Manage Doctors</h1>
          <p className="text-[#6B7C7B]">View and manage all doctors in the system</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
          <UserPlus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7C7B]" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-12 pr-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Specialty</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patients</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                        {doctor.name.charAt(4)}
                      </div>
                      <span className="font-medium text-[#1C2B2A]">{doctor.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                        <Mail className="w-4 h-4" />
                        {doctor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                        <Phone className="w-4 h-4" />
                        {doctor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{doctor.specialty}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{doctor.patients}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      doctor.status === "Active" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                    }`}>
                      {doctor.status}
                    </span>
                  </td>
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
