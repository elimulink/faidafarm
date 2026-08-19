import ResearchTable from "../ResearchTable";

export default function FieldSubmissionTable({ rows }) {
  return (
    <ResearchTable
      columns={[
        { key: "id", label: "Record ID" },
        { key: "formName", label: "Form Name" },
        { key: "county", label: "County" },
        { key: "enumerator", label: "Enumerator" },
        { key: "status", label: "Status" },
        { key: "submittedAt", label: "Submitted At" },
        { key: "syncStatus", label: "Sync Status" },
        { key: "review", label: "Supervisor Review" },
      ]}
      rows={rows}
    />
  );
}
