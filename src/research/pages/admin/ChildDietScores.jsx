import ResearchSectionCard from "../../components/ResearchSectionCard";
import { childNutrition } from "../../data/mockResearchData";

export default function ChildDietScores() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-[28px] font-black leading-tight sm:text-2xl">Diet Scores</h1>

      <ResearchSectionCard title="Diet Diversity Analysis">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {childNutrition.map((child) => (
            <div key={child.childId} className="rounded-xl border p-3 sm:p-4">
              <p className="font-bold">{child.childId}</p>
              <p className="text-sm">{child.county}</p>
              <p className="text-sm">Groups: {child.foodGroups}</p>
              <p className="text-sm">MDD: {child.mdd}</p>
            </div>
          ))}
        </div>
      </ResearchSectionCard>
    </div>
  );
}
