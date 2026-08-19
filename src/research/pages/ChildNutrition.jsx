import ResearchStatCard from "../components/ResearchStatCard";
import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchTable from "../components/ResearchTable";
import { childNutrition, researchStats } from "../data/mockResearchData";

const columns = [
  { key: "childId", label: "Child ID" },
  { key: "county", label: "County" },
  { key: "ageGroup", label: "Age" },
  { key: "foodGroups", label: "Groups" },
  { key: "mdd", label: "MDD" },
  { key: "fmnrLinkedFood", label: "FMNR Food" },
];

export default function ChildNutrition() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Child Nutrition
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          Diet diversity and MDD tracking.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <ResearchStatCard title="Children assessed" value={researchStats.childrenAssessed} />
        <ResearchStatCard
          title="MDD achieved"
          value={`${researchStats.mddAchieved}%`}
          note="Ages 6-23 months"
        />
        <ResearchStatCard
          title="FMNR food benefit"
          value={`${researchStats.fmnrFoodBenefit}%`}
          className="col-span-2 md:col-span-1"
        />
      </div>

      <ResearchSectionCard
        title="24-hour Recall"
        subtitle="MDD applies formally to children aged 6-23 months"
        plain
      >
        <ResearchTable columns={columns} rows={childNutrition} />
      </ResearchSectionCard>
    </div>
  );
}
