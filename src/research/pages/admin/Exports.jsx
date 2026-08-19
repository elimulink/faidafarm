import ResearchSectionCard from "../../components/ResearchSectionCard";

export default function Exports() {
  const exports = [
    "Dataset Export (CSV)",
    "County Report PDF",
    "FMNR Impact Summary",
    "Child Nutrition Report",
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-[28px] font-black leading-tight sm:text-2xl">Exports</h1>

      <ResearchSectionCard title="Data Export Tools">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {exports.map((item) => (
            <div key={item} className="rounded-xl border p-3 sm:p-4">
              <p className="font-semibold">{item}</p>
              <button className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg text-sm">
                Generate
              </button>
            </div>
          ))}
        </div>
      </ResearchSectionCard>
    </div>
  );
}
