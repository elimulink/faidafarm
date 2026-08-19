import FieldDeviceCard from "../../components/field/FieldDeviceCard";
import { fieldDevices } from "../../data/mockFieldCollectionData";

export default function Devices() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
          Devices
        </h1>
        <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
          Mock field device readiness view for future device management and sync monitoring.
        </p>
      </div>
      <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
        {fieldDevices.map((device) => (
          <FieldDeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
