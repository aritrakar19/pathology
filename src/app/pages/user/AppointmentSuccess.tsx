import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import {
  CheckCircle,
  Calendar,
  Clock,
  Download,
  ChevronRight,
  Loader2,
  Home,
  Stethoscope,
} from "lucide-react";
import { Appointment, AppointmentService } from "../../services/AppointmentService";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function AppointmentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get("id");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      AppointmentService.getAppointmentById(appointmentId).then((data) => {
        setAppointment(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [appointmentId]);

  const handleDownloadInvoice = () => {
    if (!appointment) return;

    const content = `
=========================================
        MEDIPATH APPOINTMENT INVOICE
=========================================
Appointment ID:  ${appointment.appointmentId}
Date:            ${new Date().toLocaleDateString("en-IN")}
Status:          ${appointment.appointmentStatus.replace(/_/g, " ").toUpperCase()}

Doctor Details:
-----------------------------------------
Name:            ${appointment.doctorName}
Specialization:  ${appointment.doctorSpecialization}

Patient Details:
-----------------------------------------
Name:            ${appointment.patientName}
Phone:           ${appointment.patientPhone}
${appointment.patientAge ? `Age:             ${appointment.patientAge} yrs` : ""}
${appointment.patientGender ? `Gender:          ${appointment.patientGender}` : ""}

Appointment Details:
-----------------------------------------
Date:            ${appointment.appointmentDate}
Time:            ${appointment.appointmentTime}
Payment Method:  ${appointment.paymentMethod.toUpperCase()}
Payment Status:  ${appointment.paymentStatus.toUpperCase()}

Payment Summary:
-----------------------------------------
Consultation Fee: ₹${appointment.consultationFee}

=========================================
Thank you for choosing MediPath!
For queries: support@medipath.com
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Appointment_${appointment.appointmentId.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      {/* ── SUCCESS CARD ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#E6F0EE] shadow-lg overflow-hidden">
        {/* Green header */}
        <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] py-12 px-6 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-xl">
              <CheckCircle className="w-12 h-12 text-[#1FAF9A]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Appointment Confirmed!</h1>
            <p className="text-white/80 text-sm">
              Your appointment has been booked successfully.
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          {/* Booking ID & Status */}
          <div className="bg-[#F4F8F7] rounded-2xl p-4 mb-5">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#E6F0EE]">
              <div>
                <p className="text-[11px] text-[#6B7C7B] uppercase tracking-wider font-semibold mb-0.5">Booking ID</p>
                <p className="font-bold text-[#1C2B2A] text-sm">#{appointmentId?.substring(0, 10) || "N/A"}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Confirmed
              </div>
            </div>

            {/* Doctor info */}
            {appointment && (
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#E6F0EE]">
                <ImageWithFallback
                  src={appointment.doctorPhoto}
                  alt={appointment.doctorName}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-[#1C2B2A] text-sm">{appointment.doctorName}</p>
                  <p className="text-xs text-[#1FAF9A]">{appointment.doctorSpecialization}</p>
                </div>
              </div>
            )}

            {/* Date/Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#1FAF9A]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7C7B]">Date</p>
                  <p className="text-sm font-bold text-[#1C2B2A]">
                    {appointment?.appointmentDate || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#1FAF9A]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7C7B]">Time</p>
                  <p className="text-sm font-bold text-[#1C2B2A]">
                    {appointment?.appointmentTime || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fee */}
          {appointment && (
            <div className="flex justify-between items-center bg-[#F4F8F7] rounded-xl px-4 py-3 mb-5">
              <div>
                <p className="text-xs text-[#6B7C7B]">Consultation Fee</p>
                <p className="font-bold text-[#1C2B2A]">₹{appointment.consultationFee}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7C7B]">Payment</p>
                <p className={`text-xs font-bold capitalize px-2 py-0.5 rounded-lg ${
                  appointment.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : appointment.paymentStatus === "cash"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {appointment.paymentStatus === "cash" ? "Cash at Clinic" : appointment.paymentStatus}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              to={`/user/track-appointment?id=${appointmentId}`}
              className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-5 h-5" /> Track Appointment
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDownloadInvoice}
              className="w-full py-4 bg-white border-2 border-[#E6F0EE] text-[#1C2B2A] rounded-2xl font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download Invoice
            </button>
          </div>

          <Link
            to="/user/home"
            className="flex items-center justify-center gap-1.5 mt-5 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
