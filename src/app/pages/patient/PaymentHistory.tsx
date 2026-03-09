import { CreditCard, Download, CheckCircle, Clock, DollarSign } from "lucide-react";

export function PaymentHistory() {
  const payments = [
    { id: 1, invoiceId: "INV-2026-001", test: "Complete Blood Count", amount: "$25", date: "Mar 1, 2026", method: "Credit Card", status: "Paid" },
    { id: 2, invoiceId: "INV-2026-002", test: "Lipid Profile", amount: "$35", date: "Feb 28, 2026", method: "Debit Card", status: "Paid" },
    { id: 3, invoiceId: "INV-2026-003", test: "Thyroid Function Test", amount: "$40", date: "Feb 25, 2026", method: "Credit Card", status: "Paid" },
    { id: 4, invoiceId: "INV-2026-004", test: "X-Ray Chest", amount: "$50", date: "Feb 20, 2026", method: "Insurance", status: "Paid" },
    { id: 5, invoiceId: "INV-2026-005", test: "Diabetes Screening", amount: "$30", date: "Mar 3, 2026", method: "Credit Card", status: "Pending" },
  ];

  const totalPaid = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + parseFloat(p.amount.slice(1)), 0);
  const pending = payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + parseFloat(p.amount.slice(1)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Payment History</h1>
        <p className="text-[#6B7C7B]">View all your payment transactions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">${totalPaid}</h3>
          <p className="text-sm text-[#6B7C7B]">Total Paid</p>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">${pending}</h3>
          <p className="text-sm text-[#6B7C7B]">Pending</p>
        </div>
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">{payments.length}</h3>
          <p className="text-sm text-[#6B7C7B]">Transactions</p>
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-6">All Transactions</h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="p-5 border border-[#E6F0EE] rounded-xl hover:shadow-lg hover:border-[#1FAF9A] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    payment.status === "Paid" ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]" : "bg-orange-50"
                  }`}>
                    {payment.status === "Paid" ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C2B2A] mb-1">{payment.test}</h3>
                    <p className="text-sm text-[#6B7C7B]">Invoice: {payment.invoiceId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#1C2B2A] mb-1">{payment.amount}</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    payment.status === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-[#6B7C7B]">Date</span>
                  <p className="font-medium text-[#1C2B2A]">{payment.date}</p>
                </div>
                <div>
                  <span className="text-[#6B7C7B]">Payment Method</span>
                  <p className="font-medium text-[#1C2B2A]">{payment.method}</p>
                </div>
                <div>
                  <span className="text-[#6B7C7B]">Status</span>
                  <p className="font-medium text-[#1C2B2A]">{payment.status}</p>
                </div>
              </div>
              {payment.status === "Paid" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              )}
              {payment.status === "Pending" && (
                <button className="px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C2B2A] mb-4">Payment Methods</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-[#E6F0EE] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#1C2B2A]">Visa •••• 4242</p>
                <p className="text-sm text-[#6B7C7B]">Expires 12/2027</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">Default</span>
          </div>
          <button className="p-4 border-2 border-dashed border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
