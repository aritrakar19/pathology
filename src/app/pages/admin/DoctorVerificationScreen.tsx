import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Edit, X, ArrowLeft, AlertTriangle, User, Calendar } from "lucide-react";

export function DoctorVerificationScreen() {
  const navigate = useNavigate();
  
  const [patientInfo] = useState({
    sampleId: "SM2026003",
    patientName: "Michael Chen",
    age: 42,
    gender: "Male",
    testName: "Liver Function Test",
    reportDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  });

  const [results] = useState([
    { id: 1, testName: "Total Bilirubin", normalRange: "0.1 - 1.2", resultValue: "0.9", unit: "mg/dL", flag: "Normal" },
    { id: 2, testName: "Direct Bilirubin", normalRange: "0.0 - 0.3", resultValue: "0.2", unit: "mg/dL", flag: "Normal" },
    { id: 3, testName: "SGOT (AST)", normalRange: "5 - 40", resultValue: "52", unit: "U/L", flag: "High" },
    { id: 4, testName: "SGPT (ALT)", normalRange: "7 - 56", resultValue: "68", unit: "U/L", flag: "High" },
    { id: 5, testName: "Alkaline Phosphatase", normalRange: "44 - 147", resultValue: "98", unit: "U/L", flag: "Normal" },
    { id: 6, testName: "Total Protein", normalRange: "6.0 - 8.3", resultValue: "7.2", unit: "g/dL", flag: "Normal" },
    { id: 7, testName: "Albumin", normalRange: "3.5 - 5.5", resultValue: "4.1", unit: "g/dL", flag: "Normal" },
    { id: 8, testName: "Globulin", normalRange: "2.0 - 3.5", resultValue: "3.1", unit: "g/dL", flag: "Normal" },
  ]);

  const [signature, setSignature] = useState("");
  const [comments, setComments] = useState("");
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const abnormalResults = results.filter(r => r.flag === "High" || r.flag === "Low");

  const handleApprove = () => {
    if (!signature) {
      alert("Please add your digital signature before approving.");
      setShowSignatureModal(true);
      return;
    }
    alert("Report approved and ready for generation!");
    navigate("/admin/report-generation");
  };

  const handleEdit = () => {
    navigate("/admin/result-entry");
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      alert("Report rejected. Technician will be notified.");
      navigate("/admin/sample-tracking");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/sample-tracking")}
          className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Doctor Verification</h1>
          <p className="text-[#6B7C7B]">Review and approve test results</p>
        </div>
      </div>

      {/* Report Preview Card */}
      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="border-b border-[#E6F0EE] pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C2B2A]">MediPath Diagnostics</h2>
                <p className="text-sm text-[#6B7C7B]">Pathology & Diagnostic Center</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6B7C7B]">Report Date</p>
              <p className="font-semibold text-[#1C2B2A]">{patientInfo.reportDate}</p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-[#F4F8F7] rounded-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#1FAF9A]" />
              <div>
                <p className="text-xs text-[#6B7C7B]">Patient Name</p>
                <p className="font-semibold text-[#1C2B2A]">{patientInfo.patientName}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-[#6B7C7B]">Age</p>
                <p className="font-medium text-[#1C2B2A]">{patientInfo.age} years</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7C7B]">Gender</p>
                <p className="font-medium text-[#1C2B2A]">{patientInfo.gender}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#6B7C7B]">Sample ID</p>
              <p className="font-mono font-semibold text-[#1FAF9A]">{patientInfo.sampleId}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7C7B]">Test Name</p>
              <p className="font-semibold text-[#1C2B2A]">{patientInfo.testName}</p>
            </div>
          </div>
        </div>

        {/* Abnormal Results Alert */}
        {abnormalResults.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 mb-2">
                  {abnormalResults.length} Abnormal Result{abnormalResults.length > 1 ? 's' : ''} Detected
                </p>
                <ul className="space-y-1">
                  {abnormalResults.map(result => (
                    <li key={result.id} className="text-sm text-red-700">
                      • {result.testName}: {result.resultValue} {result.unit} ({result.flag})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4">Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E6F0EE]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Test Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Result</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Normal Range</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A]">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr 
                    key={result.id} 
                    className={`border-b border-[#E6F0EE] ${
                      result.flag === "High" || result.flag === "Low" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-[#1C2B2A]">{result.testName}</td>
                    <td className="py-3 px-4 font-semibold text-[#1C2B2A]">{result.resultValue}</td>
                    <td className="py-3 px-4 text-[#6B7C7B]">{result.unit}</td>
                    <td className="py-3 px-4 text-[#6B7C7B]">{result.normalRange}</td>
                    <td className="py-3 px-4">
                      {result.flag === "Normal" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Normal
                        </span>
                      )}
                      {result.flag === "High" && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          ↑ High
                        </span>
                      )}
                      {result.flag === "Low" && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          ↓ Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Comments */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1C2B2A] mb-2">
            Doctor's Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any clinical notes or recommendations..."
            rows={4}
            className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
          />
        </div>

        {/* Digital Signature */}
        <div className="border-t border-[#E6F0EE] pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7C7B] mb-1">Digital Signature</p>
              {signature ? (
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#1FAF9A] text-lg italic">{signature}</p>
                  <button
                    onClick={() => setShowSignatureModal(true)}
                    className="text-[#6B7C7B] hover:text-[#1FAF9A] text-sm underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="px-4 py-2 border-2 border-dashed border-[#E6F0EE] rounded-lg text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-colors"
                >
                  Add Signature
                </button>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6B7C7B]">Verified By</p>
              <p className="font-semibold text-[#1C2B2A]">Dr. John Smith</p>
              <p className="text-xs text-[#6B7C7B]">MD, Pathology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleReject}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-all"
        >
          <X className="w-5 h-5" />
          Reject
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-xl hover:bg-[#E6F0EE] transition-all"
        >
          <Edit className="w-5 h-5" />
          Edit Results
        </button>
        <button
          onClick={handleApprove}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
        >
          <CheckCircle className="w-5 h-5" />
          Approve & Generate Report
        </button>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">Add Digital Signature</h3>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your signature"
              className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent mb-6 text-lg italic"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 px-4 py-2 bg-[#F4F8F7] text-[#6B7C7B] rounded-xl hover:bg-[#E6F0EE] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
