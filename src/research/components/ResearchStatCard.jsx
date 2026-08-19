export default function ResearchStatCard({ title, value, note, className = "" }) {
  return (
    <div
      className={`rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_8px_rgba(15,23,42,0.035)] sm:p-5 sm:shadow-sm ${className}`}
    >
      <p className="text-[13px] font-semibold leading-snug text-slate-600 sm:text-sm">{title}</p>
      <h3 className="mt-2 text-[32px] font-bold leading-none text-slate-950 sm:text-2xl">
        {value}
      </h3>
      {note && (
        <p className="mt-2 hidden text-xs leading-snug text-slate-500 sm:block sm:text-sm">
          {note}
        </p>
      )}
    </div>
  );
}
