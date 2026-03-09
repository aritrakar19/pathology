import { Calendar, FileText, TestTube, Clock, Download, CheckCircle } from "lucide-react";

export function PatientDashboard() {
  const upcomingAppointments = [
    { id: 1, test: "Complete Blood Count", date: "Mar 5, 2026", time: "10:00 AM", location: "Lab A" },
    { id: 2, test: "X-Ray Chest", date: "Mar 8, 2026", time: "02:00 PM", location: "Imaging Center" },
  ];

  const recentReports = [
    { id: 1, test: "Lipid Profile", date: "Mar 1, 2026", status: "Ready", doctor: "Dr. Sarah Williams" },
    { id: 2, test: "Thyroid Function Test", date: "Feb 28, 2026", status: "Ready", doctor: "Dr. Michael Chen" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Patient Dashboard</h1>
        <p className="text-[#6B7C7B]">Welcome back, Sarah Johnson</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">2</h3>
          <p className="text-sm text-[#6B7C7B]">Upcoming Appointments</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">5</h3>
          <p className="text-sm text-[#6B7C7B]">Available Reports</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TestTube className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">8</h3>
          <p className="text-sm text-[#6B7C7B]">Tests Completed</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">1</h3>
          <p className="text-sm text-[#6B7C7B]">Pending Results</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                      <TestTube className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2B2A]">{appointment.test}</h3>
                      <p className="text-sm text-[#6B7C7B]">{appointment.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-[#6B7C7B]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>
                  <button className="text-[#1FAF9A] hover:text-[#0E7C6B]">Reschedule</button>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-[#6B7C7B]">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Recent Reports</h2>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2B2A]">{report.test}</h3>
                      <p className="text-sm text-[#6B7C7B]">{report.doctor}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7C7B]">{report.date}</span>
                  <button className="flex items-center gap-1 text-[#1FAF9A] hover:text-[#0E7C6B]">
                    <Download className="w-4 h-4" />
                    Download
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
            <TestTube className="w-6 h-6 mb-2" />
            <p className="font-medium">Book a Test</p>
          </button>
          <button className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all text-left">
            <FileText className="w-6 h-6 mb-2" />
            <p className="font-medium">View Reports</p>
          </button>
          <button className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all text-left">
            <Calendar className="w-6 h-6 mb-2" />
            <p className="font-medium">Appointments</p>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Health Tip of the Day</h3>
        <p className="text-sm text-blue-800">
          Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body function 
          and can improve test result accuracy. Schedule your blood tests in the morning for best results.
        </p>
      </div>
    </div>
  );
}
