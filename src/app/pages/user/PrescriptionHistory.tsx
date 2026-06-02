import React, { useEffect, useState } from "react";
import { PrescriptionScan, PrescriptionService } from "../../services/PrescriptionService";
import { useAuth } from "../../context/AuthContext";
import { Loader2, ArrowLeft, Calendar, FileText, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Medicine, PharmacyService } from "../../services/PharmacyService";
import { PrescriptionResults } from "../../components/user/PrescriptionResults";

export function PrescriptionHistory() {
  const { user } = useAuth();
  const [scans, setScans] = useState<PrescriptionScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<PrescriptionScan | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      PrescriptionService.getUserScans(user.uid).then(data => {
        setScans(data);
        setLoading(false);
      });
      PharmacyService.getMedicines().then(meds => setMedicines(meds));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-[#6B7C7B]">Please login to view your prescription history.</p>
        <button onClick={() => navigate("/user-login")} className="mt-4 px-6 py-2 bg-[#1FAF9A] text-white rounded-xl">Login</button>
      </div>
    );
  }

  if (selectedScan) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedScan(null)}
          className="flex items-center text-[#6B7C7B] hover:text-[#1FAF9A] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
        </button>
        <PrescriptionResults 
          scan={selectedScan} 
          availableMedicines={medicines}
          onReset={() => setSelectedScan(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/user/pharmacy" className="p-2 bg-white border border-[#E6F0EE] rounded-xl text-[#6B7C7B] hover:text-[#1FAF9A] hover:border-[#1FAF9A] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B2A]">Prescription History</h1>
            <p className="text-sm text-[#6B7C7B]">View past uploaded prescriptions</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
        </div>
      ) : scans.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#E6F0EE] text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-[#1C2B2A] mb-2">No prescriptions found</h3>
          <p className="text-[#6B7C7B] mb-6">You haven't uploaded any prescriptions yet.</p>
          <Link to="/user/pharmacy" className="px-6 py-2 bg-[#1FAF9A] text-white rounded-xl font-semibold hover:bg-[#0E7C6B] transition-colors shadow-lg shadow-[#1FAF9A]/20">
            Upload Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map(scan => (
            <div 
              key={scan.scanId} 
              className="bg-white p-5 rounded-2xl border border-[#E6F0EE] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between gap-4 group"
              onClick={() => setSelectedScan(scan)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={scan.imageUrl} alt="Prescription" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2B2A] flex items-center gap-2">
                    {scan.doctorName || "Unknown Doctor"}
                    {scan.confidence > 0.8 && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-100 font-medium">Verified</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#6B7C7B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                    {scan.medicines.length > 0 && (
                      <span className="flex items-center gap-1">
                        💊 {scan.medicines.length} Medicines
                      </span>
                    )}
                    {scan.tests.length > 0 && (
                      <span className="flex items-center gap-1">
                        🧪 {scan.tests.length} Tests
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1FAF9A] group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
