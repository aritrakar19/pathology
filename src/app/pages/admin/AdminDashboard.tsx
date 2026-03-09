import { Users, UserCog, TestTube, FileText, TrendingUp, DollarSign, Activity, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
  ];

  const testData = [
    { month: "Jan", tests: 450 },
    { month: "Feb", tests: 520 },
    { month: "Mar", tests: 480 },
    { month: "Apr", tests: 610 },
    { month: "May", tests: 550 },
    { month: "Jun", tests: 670 },
  ];

  const recentActivities = [
    { id: 1, type: "New Patient", name: "John Doe", time: "2 minutes ago", status: "active" },
    { id: 2, type: "Test Completed", name: "Sarah Wilson - CBC Test", time: "15 minutes ago", status: "completed" },
    { id: 3, type: "Payment Received", name: "$250 from Michael Chen", time: "1 hour ago", status: "success" },
    { id: 4, type: "Appointment Booked", name: "Emma Davis - X-Ray", time: "2 hours ago", status: "pending" },
    { id: 5, type: "Report Generated", name: "Blood Test Report #1234", time: "3 hours ago", status: "completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Admin Dashboard</h1>
        <p className="text-[#6B7C7B]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">2,543</h3>
          <p className="text-sm text-[#6B7C7B]">Total Patients</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TestTube className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">1,842</h3>
          <p className="text-sm text-[#6B7C7B]">Tests This Month</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$67,500</h3>
          <p className="text-sm text-[#6B7C7B]">Revenue This Month</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">24 pending</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">156</h3>
          <p className="text-sm text-[#6B7C7B]">Reports Generated</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EE" />
              <XAxis dataKey="month" stroke="#6B7C7B" />
              <YAxis stroke="#6B7C7B" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1FAF9A" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Tests Performed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EE" />
              <XAxis dataKey="month" stroke="#6B7C7B" />
              <YAxis stroke="#6B7C7B" />
              <Tooltip />
              <Bar dataKey="tests" fill="#1FAF9A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-[#E6F0EE] last:border-0">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.status === "active" ? "bg-blue-50" :
                  activity.status === "completed" ? "bg-green-50" :
                  activity.status === "success" ? "bg-green-50" :
                  "bg-orange-50"
                }`}>
                  <Activity className={`w-5 h-5 ${
                    activity.status === "active" ? "text-blue-600" :
                    activity.status === "completed" ? "text-green-600" :
                    activity.status === "success" ? "text-green-600" :
                    "text-orange-600"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-[#1C2B2A]">{activity.type}</p>
                  <p className="text-sm text-[#6B7C7B]">{activity.name}</p>
                </div>
              </div>
              <span className="text-sm text-[#6B7C7B]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
          <Users className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all">
          <UserCog className="w-5 h-5" />
          <span>Add Doctor</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all">
          <Calendar className="w-5 h-5" />
          <span>Schedule Test</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all">
          <FileText className="w-5 h-5" />
          <span>View Reports</span>
        </button>
      </div>
    </div>
  );
}
