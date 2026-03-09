import { Calendar as CalendarIcon, Clock, TestTube, MapPin } from "lucide-react";

export function PatientAppointments() {
  const appointments = [
    { id: 1, test: "Complete Blood Count", date: "Mar 5, 2026", time: "10:00 AM", location: "Lab A", doctor: "Dr. Sarah Williams", status: "Confirmed" },
    { id: 2, test: "X-Ray Chest", date: "Mar 8, 2026", time: "02:00 PM", location: "Imaging Center", doctor: "Dr. Michael Chen", status: "Confirmed" },
    { id: 3, test: "Lipid Profile", date: "Mar 1, 2026", time: "09:00 AM", location: "Lab B", doctor: "Dr. Sarah Williams", status: "Completed" },
    { id: 4, test: "Thyroid Test", date: "Feb 28, 2026", time: "11:30 AM", location: "Lab A", doctor: "Dr. Emily Brown", status: "Completed" },
  ];

  const upcoming = appointments.filter(a => a.status === "Confirmed");
  const past = appointments.filter(a => a.status === "Completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">My Appointments</h1>
        <p className="text-[#6B7C7B]">View and manage your test appointments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">{upcoming.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Completed</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">{past.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Total</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((appointment) => (
              <div key={appointment.id} className="p-5 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                      <TestTube className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2B2A] mb-1">{appointment.test}</h3>
                      <p className="text-sm text-[#6B7C7B]">{appointment.doctor}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    {appointment.status}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-[#6B7C7B]">
                    <CalendarIcon className="w-4 h-4" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7C7B]">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7C7B]">
                    <MapPin className="w-4 h-4" />
                    {appointment.location}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 bg-white border border-[#E6F0EE] text-red-500 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#6B7C7B]">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No upcoming appointments</p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
              Book a Test
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Past Appointments</h2>
        <div className="space-y-4">
          {past.map((appointment) => (
            <div key={appointment.id} className="p-5 border border-[#E6F0EE] rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F4F8F7] rounded-xl flex items-center justify-center">
                    <TestTube className="w-5 h-5 text-[#6B7C7B]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1C2B2A] mb-1">{appointment.test}</h3>
                    <p className="text-sm text-[#6B7C7B]">{appointment.doctor}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {appointment.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#6B7C7B]">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {appointment.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {appointment.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {appointment.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
