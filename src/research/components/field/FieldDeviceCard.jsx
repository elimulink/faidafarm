import ResearchStatusBadge from "../ResearchStatusBadge";

export default function FieldDeviceCard({ device }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{device.id}</h3>
          <p className="mt-1 text-sm text-slate-600">{device.enumerator}</p>
        </div>
        <ResearchStatusBadge status={device.status} />
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">County</dt><dd>{device.county}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Last Sync</dt><dd>{device.lastSync}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">App Version</dt><dd>{device.appVersion}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Battery / Network</dt><dd>{device.signal}</dd></div>
      </dl>
    </article>
  );
}
