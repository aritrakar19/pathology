import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  CheckCircle,
  Calendar,
  Clock,
  Download,
  ChevronRight,
  Loader2,
  Home,
  Stethoscope,
  ClipboardList,
  User,
  IndianRupee,
  MapPin,
  Phone,
  BadgeCheck,
} from "lucide-react";
import { Appointment, AppointmentService } from "../../services/AppointmentService";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

function generateInvoiceHTML(appt: Appointment): string {
  const clinicName = "MediPath Health Centre";
  const clinicAddress = "123 Health Avenue, Delhi NCR";
  const clinicPhone = "+91 99999 00000";
  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Appointment Invoice – ${appt.humanReadableId || appt.appointmentId.slice(0, 10)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1C2B2A; background: #fff; padding: 40px; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg,#1FAF9A,#0E7C6B); color: white; padding: 32px; border-radius: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 24px; margin-bottom: 4px; }
    .header p { opacity: 0.85; font-size: 13px; }
    .badge { display: inline-block; background: white; color: #1FAF9A; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: bold; margin-top: 12px; }
    .section { background: #F4F8F7; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6B7C7B; font-weight: 700; margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E6F0EE; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6B7C7B; }
    .row .value { font-weight: 600; text-align: right; max-width: 60%; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 16px; font-weight: 700; }
    .green { color: #1FAF9A; }
    .status-paid { display: inline-block; background: #dcfce7; color: #166534; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
    .status-cash { display: inline-block; background: #fef9c3; color: #854d0e; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
    .footer { text-align: center; font-size: 12px; color: #9BB5B3; margin-top: 24px; line-height: 1.8; }
    .footer strong { color: #1FAF9A; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 ${clinicName}</h1>
    <p>${clinicAddress} · ${clinicPhone}</p>
    <div class="badge">✓ APPOINTMENT CONFIRMED</div>
  </div>

  <div class="section">
    <div class="section-title">Appointment Info</div>
    <div class="row"><span class="label">Appointment ID</span><span class="value green">${appt.humanReadableId || "#" + appt.appointmentId.slice(0, 10)}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${appt.appointmentDate}</span></div>
    <div class="row"><span class="label">Time</span><span class="value">${appt.appointmentTime}</span></div>
    <div class="row"><span class="label">Status</span><span class="value"><span class="status-paid">Confirmed</span></span></div>
    <div class="row"><span class="label">Invoice Generated</span><span class="value">${now}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Doctor Details</div>
    <div class="row"><span class="label">Doctor</span><span class="value">${appt.doctorName}</span></div>
    <div class="row"><span class="label">Specialization</span><span class="value">${appt.doctorSpecialization}</span></div>
    ${appt.doctorHospital ? `<div class="row"><span class="label">Clinic</span><span class="value">${appt.doctorHospital}</span></div>` : ""}
  </div>

  <div class="section">
    <div class="section-title">Patient Details</div>
    <div class="row"><span class="label">Name</span><span class="value">${appt.patientName}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">+91 ${appt.patientPhone}</span></div>
    ${appt.patientAge ? `<div class="row"><span class="label">Age</span><span class="value">${appt.patientAge} yrs</span></div>` : ""}
    ${appt.patientGender ? `<div class="row"><span class="label">Gender</span><span class="value">${appt.patientGender}</span></div>` : ""}
    ${appt.bookingFor && appt.bookingFor !== "Self" ? `<div class="row"><span class="label">Booking For</span><span class="value">${appt.bookingFor} (${appt.relation})</span></div>` : ""}
    ${appt.symptoms ? `<div class="row"><span class="label">Symptoms</span><span class="value">${appt.symptoms}</span></div>` : ""}
  </div>

  <div class="section">
    <div class="section-title">Payment Summary</div>
    <div class="row"><span class="label">Consultation Fee</span><span class="value">₹${appt.consultationFee}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">${appt.paymentMethod.toUpperCase()}</span></div>
    <div class="row"><span class="label">Payment Status</span>
      <span class="value"><span class="${appt.paymentStatus === "paid" ? "status-paid" : "status-cash"}">
        ${appt.paymentStatus === "cash" ? "Cash at Clinic" : appt.paymentStatus.toUpperCase()}
      </span></span>
    </div>
    <div class="total-row"><span>Total Amount</span><span class="green">₹${appt.consultationFee}</span></div>
  </div>

  <div class="footer">
    <strong>Thank you for choosing ${clinicName}!</strong><br />
    For support: support@medipath.com · helpline@medipath.com<br />
    This is a computer-generated invoice and does not require a signature.
  </div>
</body>
</html>`;
}

function handleDownloadInvoice(appointment: Appointment) {
  const html = generateInvoiceHTML(appointment);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice_${appointment.humanReadableId || appointment.appointmentId.slice(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AppointmentSuccess() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("id");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) { setLoading(false); return; }
    AppointmentService.getAppointmentById(appointmentId).then((data) => {
      setAppointment(data);
      setLoading(false);
    });
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-[#1FAF9A]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
        </div>
        <p className="text-sm text-[#6B7C7B]">Loading your booking...</p>
      </div>
    );
  }

  const paymentLabel =
    appointment?.paymentStatus === "paid"
      ? "Paid Online"
      : appointment?.paymentStatus === "cash"
      ? "Cash at Clinic"
      : "Pending";

  const paymentColorClass =
    appointment?.paymentStatus === "paid"
      ? "bg-green-100 text-green-700"
      : appointment?.paymentStatus === "cash"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-4 pb-6">
      {/* ── ANIMATED SUCCESS HEADER */}
      <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-3xl py-10 px-6 relative overflow-hidden text-center shadow-xl shadow-[#1FAF9A]/25">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Check ring animation */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl">
            <CheckCircle className="w-12 h-12 text-[#1FAF9A]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1.5">Appointment Confirmed!</h1>
          <p className="text-white/80 text-sm">Your booking is confirmed successfully.</p>

          {appointment?.humanReadableId && (
            <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{appointment.humanReadableId}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── APPOINTMENT DETAILS CARD */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        {/* Doctor */}
        {appointment && (
          <div className="p-4 flex items-center gap-3 border-b border-[#E6F0EE]">
            <ImageWithFallback
              src={appointment.doctorPhoto}
              alt={appointment.doctorName}
              className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1C2B2A]">{appointment.doctorName}</p>
              <p className="text-sm text-[#1FAF9A] font-medium">{appointment.doctorSpecialization}</p>
              {appointment.doctorHospital && (
                <p className="text-xs text-[#6B7C7B] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {appointment.doctorHospital}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Date / Time / Fee / Payment */}
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 border-b border-r border-[#E6F0EE]">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#1FAF9A]" />
              <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide">Date</p>
            </div>
            <p className="text-sm font-bold text-[#1C2B2A]">{appointment?.appointmentDate || "—"}</p>
          </div>
          <div className="p-4 border-b border-[#E6F0EE]">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#1FAF9A]" />
              <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide">Time</p>
            </div>
            <p className="text-sm font-bold text-[#1C2B2A]">{appointment?.appointmentTime || "—"}</p>
          </div>
          <div className="p-4 border-r border-[#E6F0EE]">
            <div className="flex items-center gap-1.5 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-[#1FAF9A]" />
              <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide">Fee</p>
            </div>
            <p className="text-sm font-bold text-[#1C2B2A]">₹{appointment?.consultationFee || "—"}</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-semibold text-[#6B7C7B] uppercase tracking-wide mb-1">Payment</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${paymentColorClass}`}>
              {paymentLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── PATIENT DETAILS */}
      {appointment && (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-4">
          <p className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Patient Details
          </p>
          <div className="space-y-2">
            {[
              { label: "Name", value: appointment.patientName },
              { label: "Phone", value: `+91 ${appointment.patientPhone}` },
              ...(appointment.patientAge ? [{ label: "Age / Gender", value: `${appointment.patientAge} yrs · ${appointment.patientGender}` }] : []),
              ...(appointment.bookingFor && appointment.bookingFor !== "Self" ? [{ label: "Booking For", value: `${appointment.relation} (Family)` }] : []),
              ...(appointment.symptoms ? [{ label: "Symptoms", value: appointment.symptoms }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[#6B7C7B]">{label}</span>
                <span className="font-semibold text-[#1C2B2A] text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTION BUTTONS */}
      <div className="space-y-3">
        <Link
          to={`/user/track-appointment?id=${appointmentId}`}
          className="w-full py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold
            hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Stethoscope className="w-5 h-5" /> Track Appointment
          <ChevronRight className="w-4 h-4" />
        </Link>

        {appointment && (
          <button
            onClick={() => handleDownloadInvoice(appointment)}
            className="w-full py-4 bg-white border-2 border-[#E6F0EE] text-[#1C2B2A] rounded-2xl font-semibold
              hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Download className="w-5 h-5" /> Download Invoice
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/user/my-appointments"
            className="py-3.5 bg-white border-2 border-[#E6F0EE] text-[#1C2B2A] rounded-2xl font-semibold text-sm
              hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-4 h-4" /> My Appointments
          </Link>
          <Link
            to="/user/home"
            className="py-3.5 bg-white border-2 border-[#E6F0EE] text-[#1C2B2A] rounded-2xl font-semibold text-sm
              hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>

      {/* Help note */}
      <p className="text-center text-xs text-[#9BB5B3] pb-4">
        Appointment confirmation sent. For help: support@medipath.com
      </p>
    </div>
  );
}
