import React from "react";
import { PrescriptionScan } from "../../services/PrescriptionService";
import { Medicine } from "../../services/PharmacyService";
import { CheckCircle, AlertCircle, ShoppingCart, Activity } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";

interface PrescriptionResultsProps {
  scan: PrescriptionScan;
  availableMedicines: Medicine[];
  onReset: () => void;
}

export function PrescriptionResults({ scan, availableMedicines, onReset }: PrescriptionResultsProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getMatchedMedicine = (medName: string) => {
    return availableMedicines.find(m => 
      m.name.toLowerCase().includes(medName.toLowerCase()) || 
      medName.toLowerCase().includes(m.name.toLowerCase()) ||
      m.genericName.toLowerCase().includes(medName.toLowerCase())
    );
  };

  const handleAddAll = () => {
    scan.medicines.forEach(med => {
      const match = getMatchedMedicine(med.name);
      if (match && match.inStock) {
        addToCart(match);
      }
    });
  };

  const handleBookTests = () => {
    navigate("/user/book-test", { state: { suggestedTests: scan.tests } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1C2B2A]">Prescription Analysis</h2>
        <button onClick={onReset} className="text-sm font-medium text-[#1FAF9A] hover:underline">
          Upload Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6F0EE] shadow-sm">
            <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4">Extracted Medicines</h3>
            {scan.medicines.length === 0 ? (
              <p className="text-[#6B7C7B]">No medicines detected.</p>
            ) : (
              <div className="space-y-3">
                {scan.medicines.map((med, idx) => {
                  const match = getMatchedMedicine(med.name);
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                      <div>
                        <div className="font-bold text-[#1C2B2A]">{med.name}</div>
                        <div className="text-sm text-[#6B7C7B] flex gap-2 mt-1">
                          <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{med.dosage}</span>
                          <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{med.frequency}</span>
                          <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{med.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {match ? (
                          match.inStock ? (
                            <>
                              <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
                                <CheckCircle className="w-4 h-4 mr-1" /> Available (₹{match.price})
                              </div>
                              <button 
                                onClick={() => addToCart(match)}
                                className="p-2 bg-[#1FAF9A] text-white rounded-lg hover:bg-[#0E7C6B] transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center text-sm text-red-600 bg-red-50 px-2 py-1 rounded font-medium">
                              <AlertCircle className="w-4 h-4 mr-1" /> Out of Stock
                            </div>
                          )
                        ) : (
                          <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" /> Not Found
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {scan.medicines.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleAddAll}
                  className="px-4 py-2 bg-[#1C2B2A] text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                >
                  Add Available to Cart
                </button>
              </div>
            )}
          </div>
          
          {scan.tests && scan.tests.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-[#E6F0EE] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recommended Tests
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {scan.tests.map((test, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                    {test}
                  </span>
                ))}
              </div>
              <button 
                onClick={handleBookTests}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Tests
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6F0EE] shadow-sm">
            <h3 className="font-semibold text-[#1C2B2A] mb-4">Prescription Summary</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[#6B7C7B]">Doctor</p>
                <p className="font-medium text-[#1C2B2A]">{scan.doctorName || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[#6B7C7B]">Hospital/Clinic</p>
                <p className="font-medium text-[#1C2B2A]">{scan.hospitalClinic || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[#6B7C7B]">Diagnosis</p>
                <p className="font-medium text-[#1C2B2A]">{scan.diagnosis || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[#6B7C7B]">Notes</p>
                <p className="font-medium text-[#1C2B2A]">{scan.notes || "None"}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-[#6B7C7B]">AI Confidence</p>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#1C2B2A]">{(scan.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${scan.confidence > 0.8 ? 'bg-green-500' : scan.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${scan.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src={scan.imageUrl} alt="Scanned Prescription" className="w-full h-auto object-contain max-h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
