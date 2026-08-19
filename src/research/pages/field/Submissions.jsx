import FieldSubmissionTable from "../../components/field/FieldSubmissionTable";
import ResearchSectionCard from "../../components/ResearchSectionCard";
import { fieldSubmissions } from "../../data/mockFieldCollectionData";

export default function Submissions() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
          Submissions
        </h1>
        <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
          Synced records awaiting review, approval, or quality follow-up.
        </p>
      </div>
      <ResearchSectionCard title="Submission Register" plain>
        <FieldSubmissionTable rows={fieldSubmissions} />
      </ResearchSectionCard>
    </div>
  );
}
