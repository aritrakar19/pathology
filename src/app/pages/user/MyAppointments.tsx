import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Stethoscope,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  MapPin,
  IndianRupee,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Appointment,
  AppointmentService,
  AppointmentStatus,
} from "../../services/AppointmentService";
import { useUserProfile } from "../../context/ProfileContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { toast } from "sonner";

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-gray-50", text: "text-gray-700", label: "Pending" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Approved" },
  rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
  appointment_confirmed: { bg: "bg-blue-50", text: "text-blue-700", label: "Confirmed" },
  reminder_sent: { bg: "bg-amber-50", text: "text-amber-700", label: "Reminder Sent" },
  checked_in: { bg: "bg-purple-50", text: "text-purple-700", label: "Checked In" },
  consultation_started: { bg: "bg-orange-50", text: "text-orange-700", label: "In Progress" },
  completed: { bg: "bg-green-50", text: "text-green-700", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelled" },
};

function generateInvoiceHTML(appt: Appointment): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>Invoice ${appt.humanReadableId || appt.appointmentId.slice(0,8)}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;color:#1C2B2A}.header{background:linear-gradient(135deg,#1FAF9A,#0E7C6B);color:white;padding:28px;border-radius:16px;margin-bottom:24px}.section{background:#F4F8F7;border-radius:12px;padding:20px;margin-bottom:16px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E6F0EE;font-size:13px}.row:last-child{border-bottom:none}.label{color:#6B7C7B}.value{font-weight:600}.green{color:#1FAF9A}.footer{text-align:center;font-size:12px;color:#9BB5B3;margin-top:24px}</style>
</head><body>
<div class="header"><h1>MediPath Health Centre</h1><p>Appointment Invoice · ${appt.humanReadableId || "#" + appt.appointmentId.slice(0,8)}</p></div>
<div class="section"><div class="row"><span class="label">Date</span><span class="value">${appt.appointmentDate}</span></div><div class="row"><span class="label">Time</span><span class="value">${appt.appointmentTime}</span></div><div class="row"><span class="label">Doctor</span><span class="value">${appt.doctorName}</span></div><div class="row"><span class="label">Specialization</span><span class="value">${appt.doctorSpecialization}</span></div></div>
<div class="section"><div class="row"><span class="label">Patient</span><span class="value">${appt.patientName}</span></div>${appt.patientAge?`<div class="row"><span class="label">Age/Gender</span><span class="value">${appt.patientAge} yrs · ${appt.patientGender}</span></div>`:""}<div class="row"><span class="label">Phone</span><span class="value">+91 ${appt.patientPhone}</span></div></div>
<div class="section"><div class="row"><span class="label">Consultation Fee</span><span class="value class="green">₹${appt.consultationFee}</span></div><div class="row"><span class="label">Payment</span><span class="value">${appt.paymentMethod.toUpperCase()} · ${appt.paymentStatus === "cash" ? "Cash at Clinic" : appt.paymentStatus}</span></div></div>
<div class="footer">Thank you for choosing MediPath! · support@medipath.com</div>
</body></html>`;
}

function downloadInvoice(appt: Appointment) {
  const html = generateInvoiceHTML(appt);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice_${appt.humanReadableId || appt.appointmentId.slice(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface CancelDialogProps {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

function CancelDialog({ appointment, onClose, onConfirm, isCancelling }: CancelDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-md z-10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-[#F4F8F7] text-[#6B7C7B]">
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1C2B2A] mb-1">Cancel Appointment?</h3>
            <p className="text-sm text-[#6B7C7B]">
              Are you sure you want to cancel your appointment with{" "}
              <span className="font-semibold text-[#1C2B2A]">{appointment.doctorName}</span> on{" "}
              <span className="font-semibold">{appointment.appointmentDate}</span> at{" "}
              <span className="font-semibold">{appointment.appointmentTime}</span>?
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3 bg-[#F4F8F7] text-[#6B7C7B] font-semibold rounded-xl text-sm hover:bg-[#E6F0EE] transition-all"
            >
              Keep It
            </button>
            <button
              onClick={onConfirm}
              disabled={isCancelling}
              className="py-3 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyAppointments() {
  const { profile } = useUserProfile();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const unsub = AppointmentService.subscribeToUserAppointments(profile.uid, (data) => {
      setAppointments(data);
      setLoading(false);
    });
    return () => unsub();
  }, [profile]);

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return !["completed", "cancelled"].includes(a.appointmentStatus);
    if (filter === "completed") return a.appointmentStatus === "completed";
    if (filter === "cancelled") return a.appointmentStatus === "cancelled";
    return true;
  });

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await AppointmentService.cancelAppointment(cancelTarget.appointmentId);
      toast.success("Appointment cancelled successfully.");
      setCancelTarget(null);
    } catch {
      toast.error("Failed to cancel. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 bg-[#1FAF9A]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#1FAF9A]" />
        </div>
        <p className="text-sm text-[#6B7C7B]">Loading appointments...</p>
      </div>
    );
  }

  const upcomingCount = appointments.filter((a) => !["completed", "cancelled"].includes(a.appointmentStatus)).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">
      {/* Cancel dialog */}
      {cancelTarget && (
        <CancelDialog
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
          isCancelling={isCancelling}
        />
      )}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">My Appointments</h1>
          <p className="text-sm text-[#6B7C7B] mt-0.5">
            {upcomingCount > 0 ? `${upcomingCount} upcoming` : `${appointments.length} total`}
          </p>
        </div>
        <Link
          to="/user/book-doctor"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1FAF9A] bg-[#1FAF9A]/10 px-3 py-2 rounded-xl hover:bg-[#1FAF9A]/20 transition-all"
        >
          <Stethoscope className="w-3.5 h-3.5" /> Book New
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(["all", "upcoming", "completed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === f
                ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-md shadow-[#1FAF9A]/20"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/40"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "upcoming" && upcomingCount > 0 && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-lg">{upcomingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-10 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-bold text-[#1C2B2A] text-base mb-2">
            {filter === "all" ? "No Appointments Yet" : `No ${filter} appointments`}
          </h3>
          <p className="text-sm text-[#6B7C7B] mb-5">
            {filter === "all"
              ? "Book your first doctor appointment to get started"
              : `You have no ${filter} appointments at the moment`}
          </p>
          {filter === "all" && (
            <Link
              to="/user/book-doctor"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
            >
              <Stethoscope className="w-4 h-4" /> Book a Doctor
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appt) => {
            const statusInfo = STATUS_COLORS[appt.appointmentStatus] || STATUS_COLORS["appointment_confirmed"];
            const isCancelled = appt.appointmentStatus === "cancelled";
            const isCompleted = appt.appointmentStatus === "completed";
            const isUpcoming = !isCancelled && !isCompleted;

            return (
              <div
                key={appt.appointmentId}
                className={`bg-white rounded-2xl border transition-all ${
                  isCancelled ? "border-[#E6F0EE] opacity-70" : "border-[#E6F0EE] hover:shadow-md hover:border-[#1FAF9A]/30"
                }`}
              >
                {/* Main clickable area */}
                <Link
                  to={`/user/track-appointment?id=${appt.appointmentId}`}
                  className="flex items-start gap-3 p-4 block"
                >
                  {/* Doctor photo */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={appt.doctorPhoto}
                      alt={appt.doctorName}
                      className={`w-14 h-14 rounded-2xl object-cover ${isCancelled ? "grayscale" : ""}`}
                    />
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {isCancelled && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <XCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[#1C2B2A] text-sm truncate">{appt.doctorName}</p>
                        <p className="text-xs text-[#1FAF9A] font-medium">{appt.doctorSpecialization}</p>
                        {appt.humanReadableId && (
                          <p className="text-[10px] text-[#9BB5B3] mt-0.5">{appt.humanReadableId}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B7C7B] flex-shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7C7B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {appt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {appt.appointmentTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs font-bold text-[#1FAF9A] flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3" />{appt.consultationFee}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Action buttons row */}
                {(isUpcoming || isCompleted) && (
                  <div className={`px-4 pb-3 flex gap-2 ${isUpcoming ? "pt-0" : "pt-0"}`}>
                    {/* Download invoice always shown for confirmed or completed */}
                    <button
                      onClick={(e) => { e.preventDefault(); downloadInvoice(appt); }}
                      className="flex-1 py-2 text-xs font-semibold text-[#6B7C7B] bg-[#F4F8F7] rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#E6F0EE] transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </button>

                    {/* Cancel button — only for upcoming */}
                    {isUpcoming && (
                      <button
                        onClick={(e) => { e.preventDefault(); setCancelTarget(appt); }}
                        className="flex-1 py-2 text-xs font-semibold text-red-500 bg-red-50 rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
