import { Calendar as CalendarIcon, Clock, TestTube } from "lucide-react";

export function DoctorAppointments() {
  const appointments = [
    { id: 1, patient: "John Doe", test: "Complete Blood Count", date: "Mar 4, 2026", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patient: "Sarah Wilson", test: "X-Ray Chest", date: "Mar 4, 2026", time: "10:30 AM", status: "Confirmed" },
    { id: 3, patient: "Michael Chen", test: "Thyroid Test", date: "Mar 4, 2026", time: "02:00 PM", status: "Pending" },
    { id: 4, patient: "Emma Davis", test: "Lipid Profile", date: "Mar 5, 2026", time: "09:30 AM", status: "Confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">My Appointments</h1>
        <p className="text-[#6B7C7B]">View your scheduled appointments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Today</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">3</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">This Week</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">12</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Pending</p>
              <p className="text-2xl font-bold text-[#1C2B2A]">1</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Scheduled Appointments</h2>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-4 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white">
                      {appointment.patient.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2B2A]">{appointment.patient}</h3>
                      <p className="text-sm text-[#6B7C7B] flex items-center gap-1">
                        <TestTube className="w-4 h-4" />
                        {appointment.test}
                      </p>
                    </div>
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
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  appointment.status === "Confirmed" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
