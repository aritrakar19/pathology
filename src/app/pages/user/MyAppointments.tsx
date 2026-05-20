import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Stethoscope,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Appointment,
  AppointmentService,
  AppointmentStatus,
} from "../../services/AppointmentService";
import { useUserProfile } from "../../context/ProfileContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  appointment_confirmed: { bg: "bg-blue-50", text: "text-blue-700", label: "Confirmed" },
  reminder_sent: { bg: "bg-amber-50", text: "text-amber-700", label: "Reminder Sent" },
  checked_in: { bg: "bg-purple-50", text: "text-purple-700", label: "Checked In" },
  consultation_started: { bg: "bg-orange-50", text: "text-orange-700", label: "In Progress" },
  completed: { bg: "bg-green-50", text: "text-green-700", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelled" },
};

export function MyAppointments() {
  const { profile } = useUserProfile();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

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
    if (filter === "upcoming")
      return !["completed", "cancelled"].includes(a.appointmentStatus);
    if (filter === "completed") return a.appointmentStatus === "completed";
    if (filter === "cancelled") return a.appointmentStatus === "cancelled";
    return true;
  });

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

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2B2A]">My Appointments</h1>
        <p className="text-sm text-[#6B7C7B] mt-0.5">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters */}
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
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-10 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-bold text-[#1C2B2A] text-base mb-2">
            {filter === "all" ? "No Appointments Yet" : `No ${filter} appointments`}
          </h3>
          <p className="text-sm text-[#6B7C7B] mb-5">
            {filter === "all"
              ? "Book a doctor appointment to get started"
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
            const statusInfo =
              STATUS_COLORS[appt.appointmentStatus] ||
              STATUS_COLORS["appointment_confirmed"];
            const isCancelled = appt.appointmentStatus === "cancelled";
            const isCompleted = appt.appointmentStatus === "completed";

            return (
              <Link
                key={appt.appointmentId}
                to={`/user/track-appointment?id=${appt.appointmentId}`}
                className="w-full text-left bg-white rounded-2xl border border-[#E6F0EE] p-4 hover:shadow-md hover:border-[#1FAF9A]/30 transition-all active:scale-[0.99] block"
              >
                <div className="flex items-start gap-3">
                  {/* Doctor photo */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={appt.doctorPhoto}
                      alt={appt.doctorName}
                      className={`w-14 h-14 rounded-2xl object-cover ${isCancelled ? "opacity-50 grayscale" : ""}`}
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
                      <div>
                        <h3 className="font-bold text-[#1C2B2A] text-sm truncate">
                          {appt.doctorName}
                        </h3>
                        <p className="text-xs text-[#1FAF9A] font-medium">{appt.doctorSpecialization}</p>
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
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="text-xs font-bold text-[#1FAF9A]">
                        ₹{appt.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
