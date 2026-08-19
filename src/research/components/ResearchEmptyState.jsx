export default function ResearchEmptyState({
  title = "No data yet",
  message = "Records will appear here once field data is synced.",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
