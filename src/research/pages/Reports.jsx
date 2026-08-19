import ResearchSectionCard from "../components/ResearchSectionCard";

const reports = [
  "Makueni County Brief",
  "Kajiado County Brief",
  "Narok County Brief",
  "Cross-county Policy Brief",
  "Clean Dataset Export",
  "FMNR Practice Intensity Report",
];

export default function Reports() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Reports
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          County briefs, exports, and report outputs.
        </p>
      </div>

      <ResearchSectionCard
        title="Available Outputs"
        subtitle="Buttons are frontend-only until backend export APIs are connected"
      >
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report} className="rounded-xl border border-slate-200 p-3 sm:p-4">
              <h3 className="font-bold text-slate-900">{report}</h3>
              <p className="mt-2 hidden text-sm text-slate-500 sm:block">
                Prepared for download/export integration.
              </p>
              <button className="mt-3 rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800 sm:mt-4">
                Generate
              </button>
            </div>
          ))}
        </div>
      </ResearchSectionCard>
    </div>
  );
}
