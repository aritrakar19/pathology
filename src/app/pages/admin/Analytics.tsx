import { TrendingUp, Users, TestTube, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function Analytics() {
  const monthlyData = [
    { month: "Jan", patients: 420, tests: 450, revenue: 45000 },
    { month: "Feb", patients: 480, tests: 520, revenue: 52000 },
    { month: "Mar", patients: 450, tests: 480, revenue: 48000 },
    { month: "Apr", patients: 550, tests: 610, revenue: 61000 },
    { month: "May", patients: 510, tests: 550, revenue: 55000 },
    { month: "Jun", patients: 620, tests: 670, revenue: 67000 },
  ];

  const testDistribution = [
    { name: "Blood Tests", value: 450 },
    { name: "Imaging", value: 180 },
    { name: "Screening", value: 120 },
    { name: "Others", value: 90 },
  ];

  const COLORS = ["#1FAF9A", "#0E7C6B", "#6B7C7B", "#E6F0EE"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Analytics</h1>
        <p className="text-[#6B7C7B]">Detailed insights and performance metrics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">3,050</h3>
          <p className="text-sm text-[#6B7C7B]">Total Patients</p>
          <p className="text-xs text-green-600 mt-2">+18% from last month</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TestTube className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">3,280</h3>
          <p className="text-sm text-[#6B7C7B]">Total Tests</p>
          <p className="text-xs text-green-600 mt-2">+22% from last month</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$328K</h3>
          <p className="text-sm text-[#6B7C7B]">Total Revenue</p>
          <p className="text-xs text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$54.6K</h3>
          <p className="text-sm text-[#6B7C7B]">Avg Monthly Rev</p>
          <p className="text-xs text-[#6B7C7B] mt-2">Last 6 months</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Patient Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EE" />
              <XAxis dataKey="month" stroke="#6B7C7B" />
              <YAxis stroke="#6B7C7B" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#1FAF9A" strokeWidth={3} name="Patients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Test Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={testDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {testDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#1C2B2A] mb-6">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EE" />
            <XAxis dataKey="month" stroke="#6B7C7B" />
            <YAxis stroke="#6B7C7B" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#1FAF9A" radius={[8, 8, 0, 0]} name="Revenue ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
