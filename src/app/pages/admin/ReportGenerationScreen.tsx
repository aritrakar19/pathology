import { Download, Send, Mail, ArrowLeft, User, Calendar, Printer, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export function ReportGenerationScreen() {
  const navigate = useNavigate();

  const patientInfo = {
    sampleId: "SM2026003",
    patientName: "Michael Chen",
    patientId: "PAT2026042",
    age: 42,
    gender: "Male",
    testName: "Liver Function Test",
    reportDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    collectionDate: "March 8, 2026",
    referredBy: "Dr. Sarah Williams",
  };

  const results = [
    { id: 1, testName: "Total Bilirubin", normalRange: "0.1 - 1.2", resultValue: "0.9", unit: "mg/dL", flag: "Normal" },
    { id: 2, testName: "Direct Bilirubin", normalRange: "0.0 - 0.3", resultValue: "0.2", unit: "mg/dL", flag: "Normal" },
    { id: 3, testName: "SGOT (AST)", normalRange: "5 - 40", resultValue: "52", unit: "U/L", flag: "High" },
    { id: 4, testName: "SGPT (ALT)", normalRange: "7 - 56", resultValue: "68", unit: "U/L", flag: "High" },
    { id: 5, testName: "Alkaline Phosphatase", normalRange: "44 - 147", resultValue: "98", unit: "U/L", flag: "Normal" },
    { id: 6, testName: "Total Protein", normalRange: "6.0 - 8.3", resultValue: "7.2", unit: "g/dL", flag: "Normal" },
    { id: 7, testName: "Albumin", normalRange: "3.5 - 5.5", resultValue: "4.1", unit: "g/dL", flag: "Normal" },
    { id: 8, testName: "Globulin", normalRange: "2.0 - 3.5", resultValue: "3.1", unit: "g/dL", flag: "Normal" },
  ];

  const doctorComments = "The liver enzymes (SGOT and SGPT) are slightly elevated. Recommend follow-up testing and lifestyle modifications. Patient should avoid alcohol and maintain a healthy diet.";

  const handleDownloadPDF = () => {
    alert("Downloading PDF report...");
  };

  const handleSendWhatsApp = () => {
    const phone = prompt("Enter patient's WhatsApp number:");
    if (phone) {
      alert(`Report will be sent to ${phone} via WhatsApp`);
    }
  };

  const handleSendEmail = () => {
    const email = prompt("Enter patient's email address:");
    if (email) {
      alert(`Report will be sent to ${email}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/sample-tracking")}
            className="p-2 text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">Report Generation</h1>
            <p className="text-[#6B7C7B]">Final report ready for distribution</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6F0EE] text-[#6B7C7B] rounded-xl hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Report Approved & Ready</h2>
            <p className="text-sm opacity-90">This report has been verified by Dr. John Smith and is ready for distribution</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E6F0EE] rounded-2xl shadow-sm overflow-hidden">
            {/* Report Content */}
            <div className="p-8">
              {/* Lab Header */}
              <div className="border-b-2 border-[#1FAF9A] pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">M</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1C2B2A]">MediPath Diagnostics</h2>
                      <p className="text-sm text-[#6B7C7B]">Pathology & Diagnostic Center</p>
                      <p className="text-xs text-[#6B7C7B]">123 Medical Plaza, Healthcare City | +1 555-HEALTH</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Title */}
              <div className="text-center mb-6 pb-4 border-b border-[#E6F0EE]">
                <h3 className="text-2xl font-bold text-[#1C2B2A] mb-1">LABORATORY REPORT</h3>
                <p className="text-sm text-[#6B7C7B]">{patientInfo.testName}</p>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-[#F4F8F7] rounded-xl">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Patient Name</p>
                    <p className="font-semibold text-[#1C2B2A]">{patientInfo.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Patient ID</p>
                    <p className="font-mono text-sm text-[#1C2B2A]">{patientInfo.patientId}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-[#6B7C7B]">Age</p>
                      <p className="text-sm text-[#1C2B2A]">{patientInfo.age} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7C7B]">Gender</p>
                      <p className="text-sm text-[#1C2B2A]">{patientInfo.gender}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Sample ID</p>
                    <p className="font-mono font-semibold text-[#1FAF9A]">{patientInfo.sampleId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Collection Date</p>
                    <p className="text-sm text-[#1C2B2A]">{patientInfo.collectionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Report Date</p>
                    <p className="text-sm text-[#1C2B2A]">{patientInfo.reportDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7C7B]">Referred By</p>
                    <p className="text-sm text-[#1C2B2A]">{patientInfo.referredBy}</p>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#1C2B2A] mb-4">Test Results</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#E6F0EE]">
                        <th className="text-left py-3 px-2 font-semibold text-[#1C2B2A]">Test Parameter</th>
                        <th className="text-left py-3 px-2 font-semibold text-[#1C2B2A]">Result</th>
                        <th className="text-left py-3 px-2 font-semibold text-[#1C2B2A]">Unit</th>
                        <th className="text-left py-3 px-2 font-semibold text-[#1C2B2A]">Normal Range</th>
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
                          <td className="py-3 px-2 font-medium text-[#1C2B2A]">{result.testName}</td>
                          <td className="py-3 px-2">
                            <span className={`font-semibold ${
                              result.flag === "High" || result.flag === "Low" ? "text-red-600" : "text-[#1C2B2A]"
                            }`}>
                              {result.resultValue}
                              {(result.flag === "High" || result.flag === "Low") && (
                                <span className="ml-1 text-xs">
                                  {result.flag === "High" ? "↑" : "↓"}
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-[#6B7C7B]">{result.unit}</td>
                          <td className="py-3 px-2 text-[#6B7C7B]">{result.normalRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Comments */}
              {doctorComments && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#1C2B2A] mb-2">Clinical Notes:</h4>
                  <p className="text-sm text-[#6B7C7B] leading-relaxed">{doctorComments}</p>
                </div>
              )}

              {/* Note */}
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> These results should be correlated clinically. Please consult your physician for interpretation and treatment.
                </p>
              </div>

              {/* Footer with Signature */}
              <div className="border-t border-[#E6F0EE] pt-6 mt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[#6B7C7B] mb-2">Verified & Approved By:</p>
                    <p className="text-2xl font-bold text-[#1FAF9A] italic mb-1">Dr. John Smith</p>
                    <p className="text-sm text-[#6B7C7B]">MD, Pathology</p>
                    <p className="text-xs text-[#6B7C7B]">License No: PATH-12345</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B7C7B]">Report Generated on</p>
                    <p className="text-sm font-medium text-[#1C2B2A]">{patientInfo.reportDate}</p>
                    <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs inline-block">
                      ✓ Digitally Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-4 border-t border-[#E6F0EE] text-center">
                <p className="text-xs text-[#6B7C7B]">
                  This is a computer-generated report and does not require a physical signature.
                </p>
                <p className="text-xs text-[#6B7C7B] mt-1">
                  For queries, contact us at reports@medipath.com | +1 555-HEALTH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 space-y-4 sticky top-6">
            <h3 className="text-lg font-semibold text-[#1C2B2A] mb-4">Distribution Options</h3>

            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Download PDF</p>
                <p className="text-xs opacity-90">Save to device</p>
              </div>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#25D366] text-[#25D366] rounded-xl hover:bg-green-50 transition-all"
            >
              <Send className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Send WhatsApp</p>
                <p className="text-xs opacity-75">Quick delivery</p>
              </div>
            </button>

            <button
              onClick={handleSendEmail}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#1FAF9A] text-[#1FAF9A] rounded-xl hover:bg-[#E6F0EE] transition-all"
            >
              <Mail className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Send Email</p>
                <p className="text-xs opacity-75">Professional delivery</p>
              </div>
            </button>

            <div className="pt-4 border-t border-[#E6F0EE]">
              <h4 className="text-sm font-semibold text-[#1C2B2A] mb-3">Report Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Status:</span>
                  <span className="font-medium text-green-600">Approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Sample ID:</span>
                  <span className="font-mono font-medium text-[#1C2B2A]">{patientInfo.sampleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Test Count:</span>
                  <span className="font-medium text-[#1C2B2A]">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7C7B]">Abnormal:</span>
                  <span className="font-medium text-red-600">
                    {results.filter(r => r.flag === "High" || r.flag === "Low").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
