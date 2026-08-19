import ResearchStatusBadge from "./ResearchStatusBadge";

export default function ResearchTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-4 text-left font-semibold text-slate-700 sm:px-4 sm:py-3.5">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, index) => (
              <tr key={row.id || row.plotId || row.childId || index} className="hover:bg-green-50/40">
                {columns.map((col) => {
                  const value = row[col.key];
                  const isStatus = ["status", "surveyStatus", "mdd", "gps", "observation"].includes(
                    col.key
                  );
                  return (
                    <td key={col.key} className="px-4 py-4 font-normal text-slate-800 sm:px-4 sm:py-3.5">
                      {isStatus ? <ResearchStatusBadge status={value} /> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
