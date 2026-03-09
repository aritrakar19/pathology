import { Users, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function DoctorDashboard() {
  const assignedPatients = [
    { id: 1, name: "John Doe", age: 35, test: "Complete Blood Count", status: "In Progress", priority: "Normal" },
    { id: 2, name: "Sarah Wilson", age: 28, test: "Lipid Profile", status: "Completed", priority: "Normal" },
    { id: 3, name: "Michael Chen", age: 42, test: "Thyroid Function", status: "Pending", priority: "Urgent" },
    { id: 4, name: "Emma Davis", age: 31, test: "Liver Function", status: "In Progress", priority: "Normal" },
  ];

  const pendingReports = [
    { id: 1, patient: "Michael Chen", test: "Thyroid Function Test", dueDate: "Mar 3, 2026", priority: "Urgent" },
    { id: 2, patient: "Emma Davis", test: "Liver Function Test", dueDate: "Mar 4, 2026", priority: "Normal" },
    { id: 3, patient: "James Wilson", test: "Complete Blood Count", dueDate: "Mar 4, 2026", priority: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Doctor Dashboard</h1>
        <p className="text-[#6B7C7B]">Welcome back, Dr. John Smith</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">45</h3>
          <p className="text-sm text-[#6B7C7B]">Assigned Patients</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">8</h3>
          <p className="text-sm text-[#6B7C7B]">Pending Reports</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">127</h3>
          <p className="text-sm text-[#6B7C7B]">Completed Reports</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">12</h3>
          <p className="text-sm text-[#6B7C7B]">Today's Appointments</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Assigned Patients</h2>
          <div className="space-y-4">
            {assignedPatients.map((patient) => (
              <div key={patient.id} className="p-4 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2B2A]">{patient.name}</h3>
                      <p className="text-sm text-[#6B7C7B]">Age: {patient.age}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    patient.priority === "Urgent" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {patient.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7C7B]">{patient.test}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    patient.status === "Completed" ? "bg-green-50 text-green-700" :
                    patient.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                    "bg-orange-50 text-orange-700"
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#1C2B2A]">Pending Reports</h2>
            <span className="text-sm text-[#6B7C7B]">{pendingReports.length} pending</span>
          </div>
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report.id} className="p-4 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] mb-1">{report.patient}</h3>
                    <p className="text-sm text-[#6B7C7B]">{report.test}</p>
                  </div>
                  {report.priority === "Urgent" && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7C7B]">Due: {report.dueDate}</span>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white text-xs rounded-lg hover:shadow-lg transition-all">
                    Upload Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all text-left">
            <FileText className="w-6 h-6 mb-2" />
            <p className="font-medium">Upload Report</p>
          </button>
          <button className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all text-left">
            <Users className="w-6 h-6 mb-2" />
            <p className="font-medium">View Patients</p>
          </button>
          <button className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all text-left">
            <Clock className="w-6 h-6 mb-2" />
            <p className="font-medium">Appointments</p>
          </button>
        </div>
      </div>
    </div>
  );
}
