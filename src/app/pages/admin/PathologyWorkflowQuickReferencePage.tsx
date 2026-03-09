import { ClipboardList, Beaker, Upload, CheckCircle, FileCheck, ArrowRight } from "lucide-react";
import { PathologyStatusLegend } from "../../components/PathologyStatusLegend";

export function PathologyWorkflowQuickReferencePage() {
  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <p className="inline-flex items-center rounded-full bg-[#E6F0EE] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1FAF9A] mb-4">
            Admin · Pathology
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1C2B2A] mb-3">
            Pathology Workflow - Quick Reference
          </h1>
          <p className="text-[#6B7C7B] max-w-2xl">
            Fast overview of URLs, sidebar entries, status flow, color codes, key features, and mock data
            for the pathology module.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Access URLs */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#1C2B2A] mb-2">Access URLs</h2>
              <p className="text-sm text-[#6B7C7B] mb-4">
                All pathology workflow screens are accessible through the Admin dashboard.
              </p>

              <h3 className="text-sm font-semibold text-[#1C2B2A] mb-3 uppercase tracking-wide">
                Navigation URLs
              </h3>
              <div className="overflow-hidden rounded-xl border border-[#E6F0EE] bg-[#F9FBFA]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#E6F0EE]/60 text-[#6B7C7B]">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Screen</th>
                      <th className="px-4 py-2 font-semibold">URL Path</th>
                      <th className="px-4 py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6F0EE]">
                    <tr>
                      <td className="px-4 py-2 text-[#1C2B2A]">Sample Collection Queue</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/sample-collection-queue
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">Main queue showing all patients</td>
                    </tr>
                    <tr className="bg-white/70">
                      <td className="px-4 py-2 text-[#1C2B2A]">Sample Collection Form</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/sample-collection/:id
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">
                        Individual sample collection (replace :id with patient ID)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-[#1C2B2A]">Sample Tracking</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/sample-tracking
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">
                        Real-time sample tracking dashboard
                      </td>
                    </tr>
                    <tr className="bg-white/70">
                      <td className="px-4 py-2 text-[#1C2B2A]">Result Entry</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/result-entry
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">Technician result entry form</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-[#1C2B2A]">Doctor Verification</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/doctor-verification
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">Doctor approval interface</td>
                    </tr>
                    <tr className="bg-white/70">
                      <td className="px-4 py-2 text-[#1C2B2A]">Report Generation</td>
                      <td className="px-4 py-2 font-mono text-xs bg-white">
                        /admin/report-generation
                      </td>
                      <td className="px-4 py-2 text-[#6B7C7B]">
                        Final report with distribution options
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Test Flow */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#1C2B2A] mb-2">Quick Test Flow</h2>
              <p className="text-sm text-[#6B7C7B] mb-4">
                To test the complete workflow:
              </p>
              <ol className="space-y-2 text-sm text-[#1C2B2A]">
                <li>
                  1. Navigate to <span className="font-mono text-xs bg-[#F4F8F7] px-1.5 py-0.5 rounded">
                    /admin
                  </span>{" "}
                  (login required)
                </li>
                <li>
                  2. Click <strong>"Sample Collection"</strong> in sidebar → View queue
                </li>
                <li>
                  3. Click <strong>"Collect Sample"</strong> on any patient → Fill form → Save
                </li>
                <li>
                  4. Click <strong>"Sample Tracking"</strong> in sidebar → View sample progress
                </li>
                <li>
                  5. Click <strong>"Result Entry"</strong> in sidebar → Enter test values → Send for
                  approval
                </li>
                <li>
                  6. Click <strong>"Doctor Verification"</strong> in sidebar → Review → Add signature → Approve
                </li>
                <li>
                  7. Click <strong>"Report Generation"</strong> in sidebar → View final report →
                  Download/Share
                </li>
              </ol>
            </section>

            {/* Status Flow & Color Codes */}
            <section className="grid md:grid-cols-2 gap-4">
              {/* Status Flow */}
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-[#1C2B2A] mb-3">Status Flow</h2>
                <div className="bg-[#0B1120] text-[#E5E7EB] rounded-xl px-4 py-3 text-xs sm:text-sm font-mono overflow-x-auto">
                  <span>
                    Pending → In Progress → Collected → In Lab → Processing → Result Ready → Approved
                    → Report Generated
                  </span>
                </div>
              </div>

              {/* Color Codes */}
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-[#1C2B2A] mb-3">Color Codes</h2>
                <ul className="space-y-1.5 text-sm text-[#1C2B2A]">
                  <li>
                    🟡 <strong>Yellow</strong>: Pending, Collected
                  </li>
                  <li>
                    🔵 <strong>Blue</strong>: In Lab
                  </li>
                  <li>
                    🟣 <strong>Purple</strong>: Processing
                  </li>
                  <li>
                    🟢 <strong>Green</strong>: Result Ready, Approved, Normal
                  </li>
                  <li>
                    🔴 <strong>Red</strong>: Abnormal, High, Low
                  </li>
                </ul>
                <PathologyStatusLegend />
              </div>
            </section>

            {/* Key Features by Screen */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#1C2B2A] mb-4">Key Features by Screen</h2>

              <div className="space-y-4 text-sm text-[#1C2B2A]">
                <div>
                  <h3 className="font-semibold mb-1">Sample Collection Queue</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Search patients</li>
                    <li>View booking times</li>
                    <li>Quick actions (Collect, Print, Mark Collected)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Sample Collection</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Select sample type (6 options)</li>
                    <li>Record collector info</li>
                    <li>Add collection notes</li>
                    <li>Print barcode labels</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Sample Tracking</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Status overview cards (4 counters)</li>
                    <li>Real-time location tracking</li>
                    <li>Department filtering</li>
                    <li>Animated processing indicator</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Result Entry</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Auto-calculate normal/abnormal flags</li>
                    <li>Highlight abnormal values</li>
                    <li>Draft save functionality</li>
                    <li>Validation before submission</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Doctor Verification</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Professional report preview</li>
                    <li>Abnormal results summary</li>
                    <li>Add clinical notes</li>
                    <li>Digital signature</li>
                    <li>Approve/Reject/Edit options</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Report Generation</h3>
                  <ul className="list-disc list-inside text-[#6B7C7B] space-y-0.5">
                    <li>Professional lab report layout</li>
                    <li>Multiple distribution methods</li>
                    <li>Download PDF</li>
                    <li>WhatsApp/Email sharing</li>
                    <li>Print functionality</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Sidebar Menu Items */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#1C2B2A] mb-3">Sidebar Menu Items</h2>
              <p className="text-xs text-[#6B7C7B] mb-3">
                The following items have been added to the Admin sidebar:
              </p>
              <ul className="space-y-2 text-sm text-[#1C2B2A]">
                <li className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-[#1FAF9A]" />
                  <span>
                    <strong>Sample Collection</strong> (Beaker icon)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#1FAF9A]" />
                  <span>
                    <strong>Sample Tracking</strong> (ClipboardList icon)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#1FAF9A]" />
                  <span>
                    <strong>Result Entry</strong> (Upload icon)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1FAF9A]" />
                  <span>
                    <strong>Doctor Verification</strong> (CheckCircle icon)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#1FAF9A]" />
                  <span>
                    <strong>Report Generation</strong> (FileCheck icon)
                  </span>
                </li>
              </ul>
            </section>

            {/* Component Files */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#1C2B2A] mb-2">Component Files</h2>
              <p className="text-xs text-[#6B7C7B] mb-3">
                All components are located in <code className="font-mono text-[11px] bg-[#F4F8F7] px-1.5 py-0.5 rounded">
                  /src/app/pages/admin/
                </code>
                :
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#1C2B2A] font-mono">
                <li>SampleCollectionQueue.tsx</li>
                <li>SampleCollectionScreen.tsx</li>
                <li>SampleTrackingScreen.tsx</li>
                <li>ResultEntryScreen.tsx</li>
                <li>DoctorVerificationScreen.tsx</li>
                <li>ReportGenerationScreen.tsx</li>
              </ul>
            </section>

            {/* Mock Patient Data */}
            <section className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#1C2B2A] mb-3">Mock Patient Data</h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B7C7B]">
                <div>
                  <p className="font-semibold text-[#1C2B2A] mb-1">
                    Sample tokens used in mock data:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>T001 through T006</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#1C2B2A] mb-1">Sample IDs:</p>
                  <ul className="list-disc list-inside">
                    <li>SM2026001 through SM2026006</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#1C2B2A] mb-1">Test names:</p>
                  <ul className="list-disc list-inside">
                    <li>Complete Blood Count</li>
                    <li>Lipid Profile</li>
                    <li>Liver Function Test</li>
                    <li>Thyroid Profile</li>
                    <li>Kidney Function Test</li>
                    <li>Diabetes Screening</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-5 text-white">
              <h2 className="text-lg font-semibold mb-2">Run End-to-End Test</h2>
              <p className="text-sm text-white/90 mb-4">
                Use this quick reference while stepping through the pathology flow in the admin
                dashboard.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1FAF9A] text-sm font-semibold hover:shadow-lg transition-all">
                Open Sample Collection Queue
                <ArrowRight className="w-4 h-4" />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

