import { useState } from "react";
import { CreditCard, Smartphone, Building, Wallet, CheckCircle, ArrowRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  const id = searchParams.get("id") || "1";
  const date = searchParams.get("date") || "";
  const slot = searchParams.get("slot") || "";

  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      description: "Pay using UPI apps",
      icon: Smartphone,
      popular: true,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, Amex",
      icon: CreditCard,
      popular: false,
    },
    {
      id: "netbanking",
      name: "Net Banking",
      description: "All major banks supported",
      icon: Building,
      popular: false,
    },
    {
      id: "cash",
      name: "Cash on Visit",
      description: "Pay at the center",
      icon: Wallet,
      popular: false,
    },
  ];

  // Mock pricing
  const pricing = {
    consultationFee: service === "pathology" ? 25 : service === "doctor" ? 80 : 100,
    tax: service === "pathology" ? 2 : service === "doctor" ? 6 : 8,
    discount: 0,
  };

  const total = pricing.consultationFee + pricing.tax - pricing.discount;

  const handlePayment = () => {
    // Simulate payment processing
    navigate(`/booking/confirmation?service=${service}&id=${id}&date=${date}&slot=${slot}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={6} steps={steps} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">
            Payment Details
          </h1>
          <p className="text-[#6B7C7B]">
            Choose your preferred payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h3 className="font-semibold text-[#1C2B2A] mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-[#1FAF9A] bg-[#E6F0EE]"
                          : "border-[#E6F0EE] hover:border-[#1FAF9A] hover:bg-[#F4F8F7]"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]"
                            : "bg-[#F4F8F7]"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-[#6B7C7B]"}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#1C2B2A]">{method.name}</p>
                          {method.popular && (
                            <span className="px-2 py-0.5 bg-[#1FAF9A] text-white text-xs rounded-full font-semibold">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6B7C7B]">{method.description}</p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "border-[#1FAF9A] bg-[#1FAF9A]"
                            : "border-[#E6F0EE]"
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            {selectedPayment === "card" && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="font-semibold text-[#1C2B2A] mb-4">
                  Card Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#1C2B2A] mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1C2B2A] mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1C2B2A] mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#1C2B2A] mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === "upi" && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="font-semibold text-[#1C2B2A] mb-4">
                  UPI Details
                </h3>
                <div>
                  <label className="block text-[#1C2B2A] mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {selectedPayment === "netbanking" && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="font-semibold text-[#1C2B2A] mb-4">
                  Select Your Bank
                </h3>
                <select className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent">
                  <option>Choose your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 sticky top-8">
              <h3 className="font-semibold text-[#1C2B2A] mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#E6F0EE]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7C7B]">Service Type:</span>
                  <span className="text-[#1C2B2A] font-medium capitalize">{service}</span>
                </div>
                {date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7C7B]">Date:</span>
                    <span className="text-[#1C2B2A] font-medium">
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )}
                {slot && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7C7B]">Time:</span>
                    <span className="text-[#1C2B2A] font-medium">{slot}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Consultation Fee</span>
                  <span className="text-[#1C2B2A] font-medium">${pricing.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Tax & Fees</span>
                  <span className="text-[#1C2B2A] font-medium">${pricing.tax}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">-${pricing.discount}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 border-[#E6F0EE] mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#1C2B2A]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#1FAF9A]">${total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedPayment}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedPayment
                    ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white hover:shadow-lg hover:shadow-[#1FAF9A]/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedPayment === "cash" ? "Confirm Booking" : "Pay Now"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-center text-[#6B7C7B] mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
