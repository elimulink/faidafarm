export default function ResearchSectionCard({ title, subtitle, children, action, plain = false }) {
  if (plain) {
    return (
      <section>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[21px] font-bold leading-tight text-[#111827] sm:text-lg">{title}</h2>
            {subtitle && <p className="mt-1 hidden text-sm font-normal leading-5 text-slate-600 sm:block">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_1px_8px_rgba(15,23,42,0.035)] sm:p-5 sm:shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-4">
        <div>
          <h2 className="text-[21px] font-bold leading-tight text-[#111827] sm:text-lg">{title}</h2>
          {subtitle && <p className="mt-1 hidden text-sm font-normal leading-5 text-slate-600 sm:block">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
