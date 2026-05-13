import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle, Calendar, Clock, Download, ChevronRight, Loader2 } from "lucide-react";
import { Booking, BookingService } from "../../services/BookingService";

export function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      BookingService.getBookingById(bookingId).then((data) => {
        setBooking(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const handleDownloadInvoice = () => {
    if (!booking) return;

    const invoiceContent = `
=========================================
          MEDIPATH INVOICE
=========================================
Booking ID:      ${booking.bookingId}
Date:            ${new Date().toLocaleDateString()}
Status:          ${booking.paymentStatus?.toUpperCase() || "PENDING"}

Patient Details:
-----------------------------------------
Name:            ${booking.patientName}
Phone:           ${booking.patientPhone || "N/A"}
Email:           ${booking.patientEmail || "N/A"}

Service Details:
-----------------------------------------
Service Type:    ${booking.serviceType.toUpperCase()}
Item/Test:       ${booking.testName || booking.serviceType}
Collection:      ${booking.sampleMethod === "home" ? "Home Sample Collection" : "Visit Lab Center"}
Slot Date:       ${booking.slotDate || "N/A"}
Slot Time:       ${booking.slotTime || "N/A"}

Payment Summary:
-----------------------------------------
Total Amount:    $${booking.amount?.toFixed(2) || "0.00"}
Payment Method:  ${booking.paymentMethod?.toUpperCase() || "N/A"}

=========================================
Thank you for choosing MediPath Diagnostics!
For any queries, contact support@medipath.com
`;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-3xl border border-[#E6F0EE] shadow-lg overflow-hidden text-center">
        {/* Top green section */}
        <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] py-12 px-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
              <CheckCircle className="w-12 h-12 text-[#1FAF9A]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-white/80 text-sm">Your test booking has been successfully placed.</p>
          </div>
        </div>

        {/* Details section */}
        <div className="p-8">
          <div className="bg-[#F4F8F7] rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E6F0EE]">
              <div>
                <p className="text-xs text-[#6B7C7B] uppercase tracking-wider font-semibold mb-1">Booking ID</p>
                <p className="font-bold text-[#1C2B2A]">#{bookingId || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7C7B] uppercase tracking-wider font-semibold mb-1">Status</p>
                <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Confirmed
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[#1C2B2A] text-sm mb-1">{booking?.testName || booking?.serviceType}</h3>
                <p className="text-sm text-[#6B7C7B] capitalize">{booking?.sampleMethod === "home" ? "Home Sample Collection" : "Visit Lab Center"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#1FAF9A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Date</p>
                    <p className="text-sm font-semibold text-[#1C2B2A]">{booking?.slotDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#1FAF9A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Time</p>
                    <p className="text-sm font-semibold text-[#1C2B2A]">{booking?.slotTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              to="/user/tracking"
              className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
            >
              Track Booking <ChevronRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleDownloadInvoice}
              className="w-full py-4 bg-white border-2 border-[#E6F0EE] text-[#1C2B2A] rounded-xl font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download Invoice
            </button>
          </div>
          
          <div className="mt-6">
            <Link to="/user/home" className="text-[#1FAF9A] hover:text-[#0E7C6B] text-sm font-semibold transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
