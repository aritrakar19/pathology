import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  Appointment,
  AppointmentService,
  AppointmentStatus,
} from "../../services/AppointmentService";
import { useUserProfile } from "../../context/ProfileContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const TIMELINE_STEPS: {
  key: AppointmentStatus;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    key: "appointment_confirmed",
    label: "Appointment Confirmed",
    desc: "Your booking is confirmed",
    icon: "✅",
  },
  {
    key: "reminder_sent",
    label: "Reminder Sent",
    desc: "We sent you a reminder",
    icon: "🔔",
  },
  {
    key: "checked_in",
    label: "Checked In",
    desc: "Patient has checked in at the clinic",
    icon: "🏥",
  },
  {
    key: "consultation_started",
    label: "Consultation Started",
    desc: "Doctor is consulting now",
    icon: "👨‍⚕️",
  },
  {
    key: "completed",
    label: "Completed",
    desc: "Consultation done successfully",
    icon: "🎉",
  },
];

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  appointment_confirmed: "bg-blue-100 text-blue-700",
  reminder_sent: "bg-amber-100 text-amber-700",
  checked_in: "bg-purple-100 text-purple-700",
  consultation_started: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function AppointmentTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const appointmentId = searchParams.get("id");

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    // Realtime subscription via onSnapshot
    const unsub = AppointmentService.subscribeToAppointment(appointmentId, (data) => {
      setAppointment(data);
      setLoading(false);
    });

    return () => unsub();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 bg-[#1FAF9A]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#1FAF9A]" />
        </div>
        <p className="text-sm text-[#6B7C7B]">Loading appointment...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-5xl">📋</p>
        <h2 className="text-lg font-bold text-[#1C2B2A]">Appointment not found</h2>
        <Link to="/user/my-appointments" className="text-[#1FAF9A] text-sm font-medium">
          ← My Appointments
        </Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex(
    (s) => s.key === appointment.appointmentStatus
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* ── APPOINTMENT SUMMARY ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <div className="flex items-start gap-4">
          <ImageWithFallback
            src={appointment.doctorPhoto}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-[#1C2B2A] text-base">{appointment.doctorName}</h1>
            <p className="text-sm text-[#1FAF9A]">{appointment.doctorSpecialization}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7C7B]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {appointment.appointmentDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {appointment.appointmentTime}
              </span>
            </div>
          </div>
          <div
            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${
              STATUS_COLORS[appointment.appointmentStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            {appointment.appointmentStatus.replace(/_/g, " ")}
          </div>
        </div>

        {/* ID & fee */}
        <div className="mt-4 pt-4 border-t border-[#E6F0EE] flex justify-between text-xs text-[#6B7C7B]">
          <span>
            ID:{" "}
            <span className="font-bold text-[#1C2B2A]">
              #{appointment.appointmentId.substring(0, 10)}
            </span>
          </span>
          <span>
            Fee:{" "}
            <span className="font-bold text-[#1FAF9A]">₹{appointment.consultationFee}</span>
          </span>
        </div>
      </div>

      {/* ── REALTIME TRACKING TIMELINE ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h2 className="font-bold text-[#1C2B2A] mb-5 flex items-center gap-2">
          📍 Appointment Timeline
          <span className="ml-auto text-[10px] text-[#6B7C7B] font-normal">Live Updates</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </h2>

        {appointment.appointmentStatus === "cancelled" ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">❌</p>
            <p className="font-bold text-red-500">Appointment Cancelled</p>
            <p className="text-sm text-[#6B7C7B] mt-1">This appointment was cancelled.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => {
              const isComplete = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              const isPending = i > currentStepIndex;
              const timelineEvent = appointment.timeline?.find((t) => t.status === step.key);

              return (
                <div key={step.key} className="flex items-start gap-4">
                  {/* Node + connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 ${
                        isCurrent
                          ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white shadow-lg shadow-[#1FAF9A]/30 ring-4 ring-[#1FAF9A]/20"
                          : isComplete
                          ? "bg-[#1FAF9A] text-white"
                          : "bg-[#F4F8F7] text-[#6B7C7B] border border-[#E6F0EE]"
                      }`}
                    >
                      {isComplete && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isCurrent ? (
                        <span>{step.icon}</span>
                      ) : (
                        <Circle className="w-4 h-4 opacity-40" />
                      )}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-10 mt-1 rounded-full transition-all duration-500 ${
                          isComplete ? "bg-gradient-to-b from-[#1FAF9A] to-[#1FAF9A]/30" : "bg-[#E6F0EE]"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 flex-1 min-w-0 pt-1.5">
                    <h4
                      className={`font-semibold text-sm transition-colors ${
                        isComplete ? "text-[#1C2B2A]" : "text-[#9BB5B3]"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCurrent
                          ? "text-[#1FAF9A] font-medium"
                          : "text-[#6B7C7B]"
                      }`}
                    >
                      {isCurrent
                        ? "Currently at this stage"
                        : timelineEvent
                        ? new Date(timelineEvent.timestamp).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : isPending
                        ? step.desc
                        : "Completed"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Patient info */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5">
        <h3 className="font-bold text-[#1C2B2A] text-sm mb-3">Patient Details</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: "Name", value: appointment.patientName },
            { label: "Phone", value: appointment.patientPhone },
            ...(appointment.patientAge ? [{ label: "Age", value: `${appointment.patientAge} yrs` }] : []),
            ...(appointment.patientGender ? [{ label: "Gender", value: appointment.patientGender }] : []),
            ...(appointment.symptoms ? [{ label: "Symptoms", value: appointment.symptoms }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#6B7C7B]">{label}</span>
              <span className="font-semibold text-[#1C2B2A] text-right max-w-[60%] truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Go home */}
      <Link
        to="/user/home"
        className="flex items-center justify-center gap-2 text-sm text-[#6B7C7B] hover:text-[#1FAF9A] font-medium transition-colors py-2"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
