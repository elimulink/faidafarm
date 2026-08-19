export default function ResearchStatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  const styles =
    value.includes("complete") ||
    value.includes("achieved") ||
    value.includes("verified") ||
    value.includes("synced") ||
    value.includes("online")
      ? "bg-green-50 text-green-700 border-green-200"
      : value.includes("pending") || value.includes("moderate") || value.includes("queued")
        ? "bg-amber-50 text-amber-700 border-amber-200"
      : value.includes("flag") ||
            value.includes("failed") ||
            value.includes("missing") ||
            value.includes("offline") ||
            value.includes("not")
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}
