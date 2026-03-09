import { useState } from "react";
import { useNavigate } from "react-router";
import { Save, Send, ArrowLeft, AlertTriangle } from "lucide-react";

interface TestResult {
  id: number;
  testName: string;
  normalRange: string;
  resultValue: string;
  unit: string;
  flag: "Normal" | "High" | "Low" | "";
}

export function ResultEntryScreen() {
  const navigate = useNavigate();
  
  const [patientInfo] = useState({
    sampleId: "SM2026003",
    patientName: "Michael Chen",
    age: 42,
    gender: "Male",
    testName: "Liver Function Test",
  });

  const [results, setResults] = useState<TestResult[]>([
    { id: 1, testName: "Total Bilirubin", normalRange: "0.1 - 1.2", resultValue: "", unit: "mg/dL", flag: "" },
    { id: 2, testName: "Direct Bilirubin", normalRange: "0.0 - 0.3", resultValue: "", unit: "mg/dL", flag: "" },
    { id: 3, testName: "SGOT (AST)", normalRange: "5 - 40", resultValue: "", unit: "U/L", flag: "" },
    { id: 4, testName: "SGPT (ALT)", normalRange: "7 - 56", resultValue: "", unit: "U/L", flag: "" },
    { id: 5, testName: "Alkaline Phosphatase", normalRange: "44 - 147", resultValue: "", unit: "U/L", flag: "" },
    { id: 6, testName: "Total Protein", normalRange: "6.0 - 8.3", resultValue: "", unit: "g/dL", flag: "" },
    { id: 7, testName: "Albumin", normalRange: "3.5 - 5.5", resultValue: "", unit: "g/dL", flag: "" },
    { id: 8, testName: "Globulin", normalRange: "2.0 - 3.5", resultValue: "", unit: "g/dL", flag: "" },
  ]);

  const checkFlag = (value: string, range: string): "Normal" | "High" | "Low" | "" => {
    if (!value) return "";
    const numValue = parseFloat(value);
    const [min, max] = range.split(" - ").map(parseFloat);
    
    if (numValue < min) return "Low";
    if (numValue > max) return "High";
    return "Normal";
  };

  const handleResultChange = (id: number, value: string) => {
    setResults(results.map(result => {
      if (result.id === id) {
        const flag = checkFlag(value, result.normalRange);
        return { ...result, resultValue: value, flag };
      }
      return result;
    }));
  };

  const handleSave = () => {
    alert("Results saved as draft!");
  };

  const handleSendForApproval = () => {
    const allFilled = results.every(r => r.resultValue);
    if (!allFilled) {
      alert("Please fill all test results before sending for approval.");
      return;
    }
    alert("Results sent for doctor approval!");
    navigate("/admin/sample-tracking");
  };

  const abnormalCount = results.filter(r => r.flag === "High" || r.flag === "Low").length;

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
          <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Result Entry</h1>
          <p className="text-[#6B7C7B]">Enter test results for technician analysis</p>
        </div>
      </div>

      {/* Patient Info Banner */}
      <div className="bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
              {patientInfo.patientName.charAt(0)}
            </div>
            <div>
              <p className="text-xl font-bold">{patientInfo.patientName}</p>
              <p className="text-sm opacity-90">{patientInfo.age} years • {patientInfo.gender}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Sample ID</p>
            <p className="text-xl font-mono font-bold">{patientInfo.sampleId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Test Name</p>
            <p className="font-semibold">{patientInfo.testName}</p>
          </div>
        </div>
      </div>

      {/* Abnormal Results Alert */}
      {abnormalCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800">
              <span className="font-semibold">{abnormalCount} abnormal result{abnormalCount > 1 ? 's' : ''} detected.</span> Please review before sending for approval.
            </p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-[#1C2B2A] mb-6">Test Results</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6F0EE]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A] w-1/4">Test Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A] w-1/6">Normal Range</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A] w-1/6">Result Value</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A] w-1/6">Unit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1C2B2A] w-1/6">Flag</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr 
                  key={result.id} 
                  className={`border-b border-[#E6F0EE] transition-colors ${
                    result.flag === "High" || result.flag === "Low" 
                      ? "bg-red-50" 
                      : result.flag === "Normal" 
                      ? "bg-green-50" 
                      : "hover:bg-[#F4F8F7]"
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#1C2B2A]">{result.testName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#6B7C7B]">{result.normalRange}</span>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={result.resultValue}
                      onChange={(e) => handleResultChange(result.id, e.target.value)}
                      placeholder="Enter value"
                      className="w-full px-3 py-2 bg-white border border-[#E6F0EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#6B7C7B]">{result.unit}</span>
                  </td>
                  <td className="py-4 px-4">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-xl hover:bg-[#E6F0EE] transition-all"
        >
          <Save className="w-5 h-5" />
          Save Draft
        </button>
        <button
          onClick={handleSendForApproval}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
        >
          <Send className="w-5 h-5" />
          Send For Approval
        </button>
      </div>
    </div>
  );
}
