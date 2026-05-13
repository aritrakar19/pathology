import React, { useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";
import { Link } from "react-router";
import { StatusBadge } from "../../components/user/StatusBadge";
import { reports } from "../../data/mockData";

export function Reports() {
  const [filter, setFilter] = useState("Recent");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = reports.filter((r) => {
    const matchesSearch = r.testName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === "Recent") return true;
    if (filter === "Older") return true; // Just mock
    if (filter === "Abnormal") return r.status === "Ready"; // Mock abnormal
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Report History</h1>
          <p className="text-sm text-[#6B7C7B]">View and download your test reports</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#E6F0EE] rounded-xl text-sm focus:outline-none focus:border-[#1FAF9A] w-full sm:w-auto"
            />
          </div>
          <div className="flex gap-2">
            {["Recent", "Older", "Abnormal"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? "bg-[#1FAF9A] text-white" : "bg-white border border-[#E6F0EE] text-[#6B7C7B] hover:border-[#1FAF9A]"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-[#E6F0EE] p-4 md:p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1FAF9A]/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#1FAF9A]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1C2B2A] text-sm">{r.testName}</h3>
                <p className="text-xs text-[#6B7C7B]">{r.date} • {r.doctor}</p>
                <p className="text-xs text-[#6B7C7B]">Size: {r.fileSize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={r.status} />
              {r.status === "Ready" && (
                <>
                  <Link to={`/user/report-details/${r.id}`} className="px-3 py-1.5 border border-[#E6F0EE] text-[#1C2B2A] rounded-lg text-xs font-semibold hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
