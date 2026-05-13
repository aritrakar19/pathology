import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Download, Share2, Mail, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { reports } from "../../data/mockData";

export function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // We'll just mock a detailed report structure
  const report = reports.find((r) => r.id === id) || reports[0];

  const parameters = [
    { name: "Hemoglobin", result: 13.5, unit: "g/dL", range: "12.0 - 15.5", status: "normal" },
    { name: "RBC Count", result: 4.8, unit: "mill/mm³", range: "4.2 - 5.4", status: "normal" },
    { name: "WBC Count", result: 11.2, unit: "thou/mm³", range: "4.5 - 11.0", status: "high" },
    { name: "Platelet Count", result: 250, unit: "thou/mm³", range: "150 - 450", status: "normal" },
    { name: "Fasting Blood Sugar", result: 105, unit: "mg/dL", range: "70 - 100", status: "high" },
    { name: "Cholesterol Total", result: 180, unit: "mg/dL", range: "< 200", status: "normal" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] hover:text-[#1FAF9A] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1C2B2A]">Report Details</h1>
            <p className="text-sm text-[#6B7C7B]">{report.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-xl text-sm font-medium hover:bg-[#F4F8F7] hover:text-[#1FAF9A] transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        {/* Report Header Card */}
        <div className="p-6 border-b border-[#E6F0EE] bg-[#F4F8F7]/50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C2B2A]">{report.testName}</h2>
                <p className="text-sm text-[#6B7C7B]">Collected on {report.date}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-[#E6F0EE]">
            <div>
              <p className="text-xs text-[#6B7C7B] uppercase font-bold tracking-wider mb-1">Patient</p>
              <p className="text-sm font-semibold text-[#1C2B2A]">Sarah Johnson</p>
              <p className="text-xs text-[#6B7C7B]">28 Yrs, Female</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7C7B] uppercase font-bold tracking-wider mb-1">Referred By</p>
              <p className="text-sm font-semibold text-[#1C2B2A]">{report.doctor}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7C7B] uppercase font-bold tracking-wider mb-1">Sample ID</p>
              <p className="text-sm font-semibold text-[#1C2B2A]">SID-9238472</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7C7B] uppercase font-bold tracking-wider mb-1">Status</p>
              <p className="text-sm font-bold text-[#1FAF9A] uppercase">{report.status}</p>
            </div>
          </div>
        </div>

        {/* Doctor's Note */}
        <div className="p-6 border-b border-[#E6F0EE]">
          <h3 className="text-sm font-bold text-[#1C2B2A] uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Clinical Notes
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            Slightly elevated WBC count and Fasting Blood Sugar observed. Advised clinical correlation and dietary consultation.
          </div>
        </div>

        {/* Test Results Table */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-[#1C2B2A] uppercase tracking-wider mb-4">Test Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F4F8F7] text-[#6B7C7B] font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Parameter</th>
                  <th className="px-4 py-3 text-right">Result</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3 rounded-r-xl">Biological Ref. Range</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param, i) => (
                  <tr key={i} className="border-b border-[#E6F0EE] last:border-0 hover:bg-[#F4F8F7]/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-[#1C2B2A]">{param.name}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${param.status === 'high' ? 'text-red-500 bg-red-50 px-2 py-1 rounded-md' : 'text-[#1C2B2A]'}`}>
                        {param.result}
                        {param.status === 'high' && <ArrowLeft className="w-3 h-3 rotate-90" />}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#6B7C7B]">{param.unit}</td>
                    <td className="px-4 py-4 text-[#6B7C7B]">{param.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
