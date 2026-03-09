import { DollarSign, TrendingUp, CreditCard, CheckCircle } from "lucide-react";

export function Payments() {
  const transactions = [
    { id: 1, patient: "John Doe", test: "Complete Blood Count", amount: "$25", date: "Mar 3, 2026", method: "Card", status: "Completed" },
    { id: 2, patient: "Sarah Wilson", test: "MRI Scan", amount: "$350", date: "Mar 3, 2026", method: "Insurance", status: "Completed" },
    { id: 3, patient: "Michael Chen", test: "X-Ray", amount: "$50", date: "Mar 2, 2026", method: "Card", status: "Completed" },
    { id: 4, patient: "Emma Davis", test: "Lipid Profile", amount: "$35", date: "Mar 2, 2026", method: "Cash", status: "Completed" },
    { id: 5, patient: "James Wilson", test: "Full Checkup", amount: "$199", date: "Mar 1, 2026", method: "Card", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Payments Overview</h1>
        <p className="text-[#6B7C7B]">Track all payments and transactions</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$67,500</h3>
          <p className="text-sm text-[#6B7C7B]">Total Revenue</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$8,200</h3>
          <p className="text-sm text-[#6B7C7B]">This Week</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">$1,200</h3>
          <p className="text-sm text-[#6B7C7B]">Pending</p>
        </div>

        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">1,842</h3>
          <p className="text-sm text-[#6B7C7B]">Transactions</p>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Test</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Method</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-[#E6F0EE] hover:bg-[#F4F8F7] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-sm">
                        {transaction.patient.charAt(0)}
                      </div>
                      <span className="text-[#1C2B2A]">{transaction.patient}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{transaction.test}</td>
                  <td className="py-4 px-4 font-semibold text-[#1C2B2A]">{transaction.amount}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{transaction.date}</td>
                  <td className="py-4 px-4 text-[#6B7C7B]">{transaction.method}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      transaction.status === "Completed" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                    }`}>
                      {transaction.status}
                    </span>
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
