import ResearchSectionCard from "../../components/ResearchSectionCard";

const googleMapUrl =
  "https://www.google.com/maps?q=Makueni%20Kajiado%20Narok%20Kenya&z=7&output=embed";

export default function FMNRMap() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-[#111827] sm:text-2xl">
          FMNR Map
        </h1>
        <p className="mt-1 hidden text-[15px] font-medium text-slate-600 sm:block">
          Current field coverage across Makueni, Kajiado, and Narok study areas.
        </p>
      </div>

      <ResearchSectionCard
        title="Geospatial FMNR Coverage"
        subtitle="Temporary Google Maps view until the full GIS integration is connected"
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <iframe
            title="Google map showing Makueni, Kajiado, and Narok FMNR study areas"
            src={googleMapUrl}
            className="h-[320px] w-full border-0 md:h-[520px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="mt-3 grid gap-2 text-sm sm:mt-4 sm:grid-cols-3 sm:gap-3">
          {["Makueni", "Kajiado", "Narok"].map((county) => (
            <div key={county} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
              <p className="font-bold text-slate-900">{county}</p>
              <p className="mt-1 hidden text-slate-600 sm:block">FMNR monitoring county</p>
            </div>
          ))}
        </div>
      </ResearchSectionCard>
    </div>
  );
}
