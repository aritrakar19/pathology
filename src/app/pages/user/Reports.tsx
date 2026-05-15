import React, { useState } from "react";
import { Download, Eye, FileText, Search, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { StatusBadge } from "../../components/user/StatusBadge";
import { reports } from "../../data/mockData";

export function Reports() {
  const [filter, setFilter] = useState("Recent");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = reports.filter((r) => {
    const matchesSearch = r.testName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "Abnormal") return r.status === "Ready";
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2B2A]">Reports</h1>
        <p className="text-sm text-[#6B7C7B] mt-0.5">View and download your test reports</p>
      </div>

      {/* ── SEARCH ─────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E6F0EE] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all"
        />
      </div>

      {/* ── FILTER PILLS ───────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["Recent", "Older", "Abnormal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white shadow-md shadow-[#1FAF9A]/20"
                : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── REPORT CARDS ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6F0EE] p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-[#1C2B2A] text-sm mb-1">No reports found</h3>
            <p className="text-xs text-[#6B7C7B]">Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-[#E6F0EE] p-4 hover:shadow-md hover:border-[#1FAF9A]/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A]/10 to-[#0E7C6B]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#1FAF9A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1C2B2A] text-sm truncate">{r.testName}</h3>
                  <p className="text-xs text-[#6B7C7B] mt-0.5">{r.date}</p>
                  <p className="text-xs text-[#6B7C7B]">{r.doctor}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E6F0EE]">
                <span className="text-xs text-[#6B7C7B]">Size: {r.fileSize}</span>
                {r.status === "Ready" ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/user/report-details/${r.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 border border-[#E6F0EE] text-[#1C2B2A] rounded-xl text-xs font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-xs font-semibold hover:shadow-md transition-all">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7C7B]">
                    <span>Processing...</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
