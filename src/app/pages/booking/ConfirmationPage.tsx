import { CheckCircle, Calendar, Clock, MapPin, Download, Eye, Home, ArrowRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  const date = searchParams.get("date") || "";
  const slot = searchParams.get("slot") || "";

  // Generate random appointment ID
  const appointmentId = `APT${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const getServiceName = () => {
    if (service === "pathology") return "Complete Blood Count (CBC)";
    if (service === "doctor") return "Dr. Sarah Johnson - Cardiology Consultation";
    return "Downtown Medical Center - Full Checkup";
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would download a PDF
    alert("Invoice download would start here");
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={7} steps={steps} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full mb-6 shadow-lg shadow-[#1FAF9A]/25 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-[#6B7C7B]">
            Your appointment has been successfully booked
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Appointment ID</span>
              <span className="font-mono font-bold text-xl">{appointmentId}</span>
            </div>
            <p className="text-white/90">Keep this ID for your records</p>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#6B7C7B] mb-1">Service</p>
                <p className="text-lg font-semibold text-[#1C2B2A]">{getServiceName()}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-[#F4F8F7] rounded-xl">
                  <Calendar className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#6B7C7B] mb-1">Date</p>
                    <p className="font-semibold text-[#1C2B2A]">
                      {date
                        ? new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "To be scheduled"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#F4F8F7] rounded-xl">
                  <Clock className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#6B7C7B] mb-1">Time</p>
                    <p className="font-semibold text-[#1C2B2A]">{slot || "To be confirmed"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#F4F8F7] rounded-xl">
                <MapPin className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7C7B] mb-1">Location</p>
                  <p className="font-semibold text-[#1C2B2A]">
                    Downtown Medical Center
                  </p>
                  <p className="text-sm text-[#6B7C7B] mt-1">
                    123 Main Street, Downtown, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate("/patient/appointments")}
            className="px-6 py-4 bg-white border-2 border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Booking
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
        </div>

        {/* Important Information */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-[#1C2B2A] mb-4">
            Important Information
          </h3>
          <div className="space-y-3 text-sm text-[#6B7C7B]">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-2" />
              <p>
                Please arrive 15 minutes before your scheduled appointment time
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-2" />
              <p>
                Bring a valid photo ID and any previous medical records
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-2" />
              <p>
                A confirmation SMS and email has been sent to your registered contact details
              </p>
            </div>
            {service === "pathology" && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-2" />
                <p>
                  Test results will be available within 4-6 hours and sent to your email
                </p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1FAF9A] flex-shrink-0 mt-2" />
              <p>
                For any changes or cancellations, please call us at +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-6 text-white mb-6">
          <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
          <p className="text-white/90 mb-4">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+15551234567"
              className="px-6 py-3 bg-white text-[#1FAF9A] rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Call: +1 (555) 123-4567
            </a>
            <a
              href="mailto:support@medicalcenter.com"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/20 transition-all font-semibold"
            >
              Email Support
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-white border-2 border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/booking/service-selection")}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all font-semibold flex items-center justify-center gap-2"
          >
            Book Another Appointment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
