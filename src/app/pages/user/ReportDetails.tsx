import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Download, Share2, Mail, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { reports } from "../../data/mockData";

export function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = reports.find((r) => r.id === id) || reports[0];

  const parameters = [
    { name: "Hemoglobin", result: 13.5, unit: "g/dL", range: "12.0 - 15.5", status: "normal" },
    { name: "RBC Count", result: 4.8, unit: "mill/mm³", range: "4.2 - 5.4", status: "normal" },
    { name: "WBC Count", result: 11.2, unit: "thou/mm³", range: "4.5 - 11.0", status: "high" },
    { name: "Platelet Count", result: 250, unit: "thou/mm³", range: "150 - 450", status: "normal" },
    { name: "Fasting Blood Sugar", result: 105, unit: "mg/dL", range: "70 - 100", status: "high" },
    { name: "Cholesterol Total", result: 180, unit: "mg/dL", range: "< 200", status: "normal" },
  ];

  const abnormalCount = parameters.filter((p) => p.status === "high").length;

  return (
    <div className="max-w-3xl mx-auto pb-28 md:pb-8 space-y-4">
      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] hover:border-[#1FAF9A]/30 transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-[#1C2B2A] leading-tight truncate">{report.testName}</h1>
          <p className="text-xs text-[#6B7C7B]">Report ID: {report.id}</p>
        </div>
      </div>

      {/* ── REPORT SUMMARY CARD ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        {/* Green accent header */}
        <div className="bg-gradient-to-r from-[#1FAF9A]/8 to-[#0E7C6B]/4 border-b border-[#E6F0EE] p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1FAF9A]/25 flex-shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#1C2B2A] text-base">{report.testName}</h2>
              <p className="text-sm text-[#6B7C7B]">Collected on {report.date}</p>
              <p className="text-xs text-[#1FAF9A] font-semibold mt-1">{report.status}</p>
            </div>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="p-4 grid grid-cols-2 gap-3 border-b border-[#E6F0EE]">
          {[
            { label: "Patient", value: "Sarah Johnson", sub: "28 Yrs, Female" },
            { label: "Referred By", value: report.doctor, sub: "" },
            { label: "Sample ID", value: "SID-9238472", sub: "" },
            { label: "File Size", value: report.fileSize, sub: "" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#F4F8F7] rounded-xl p-3">
              <p className="text-[10px] text-[#6B7C7B] uppercase font-bold tracking-wider mb-1">{label}</p>
              <p className="text-sm font-semibold text-[#1C2B2A] leading-tight">{value}</p>
              {sub && <p className="text-[11px] text-[#6B7C7B] mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Abnormal Alert */}
        {abnormalCount > 0 && (
          <div className="mx-4 mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {abnormalCount} parameter{abnormalCount > 1 ? "s" : ""} out of range
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Slightly elevated WBC count and Fasting Blood Sugar observed. Consult your doctor.
              </p>
            </div>
          </div>
        )}

        {/* Parameters List - Mobile friendly vertical list */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-bold text-[#6B7C7B] uppercase tracking-wider mb-3">Test Parameters</h3>
          {parameters.map((param, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                param.status === "high"
                  ? "bg-red-50 border-red-100"
                  : "bg-[#F4F8F7] border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {param.status === "high" ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#1FAF9A] flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#1C2B2A]">{param.name}</p>
                  <p className="text-[10px] text-[#6B7C7B]">Range: {param.range} {param.unit}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-base font-bold ${param.status === "high" ? "text-red-500" : "text-[#1C2B2A]"}`}>
                  {param.result}
                </p>
                <p className="text-[10px] text-[#6B7C7B]">{param.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-xl border-t border-[#E6F0EE] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-[#E6F0EE] text-[#6B7C7B] rounded-2xl font-semibold text-sm hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all active:scale-95">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-[#E6F0EE] text-[#6B7C7B] rounded-2xl font-semibold text-sm hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all active:scale-95">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all active:scale-95">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
