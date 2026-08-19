import { useCallback, useMemo, useState } from "react";
import { Plus, Sprout, Trash2, X } from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import CropPicker from "../../components/farmer/CropPicker";
import { farmCrops as cropDetails } from "../../data/farmerDashboardData";
import { getCrops } from "../../data/cropCatalogue";
import { loadFarmCrops, saveFarmCrops } from "../../farm/cropStorage";

// Agronomic detail exists as mock data for the two crops the demo farm grows.
// Anything the farmer adds beyond those shows without it until the backend can
// supply real records, rather than inventing numbers.
function detailFor(crop) {
  return cropDetails.find((item) => item.name.toLowerCase() === crop.name.toLowerCase()) || null;
}

function useFarmCrops() {
  const [cropIds, setCropIds] = useState(() => loadFarmCrops());

  const commit = useCallback((next) => {
    setCropIds(next);
    saveFarmCrops(next);
  }, []);

  const crops = useMemo(() => getCrops(cropIds), [cropIds]);

  return { cropIds, crops, commit };
}

function AddCropSheet({ open, selected, onClose, onSave }) {
  const [draft, setDraft] = useState(selected);

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#0F1A12]/35"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add crops"
        className="fixed inset-x-0 bottom-0 z-50 flex h-[88svh] flex-col rounded-t-[26px] bg-white shadow-2xl md:inset-0 md:m-auto md:h-[86vh] md:max-w-3xl md:rounded-[26px]"
      >
        <div className="flex items-center justify-between border-b border-[#E7ECE5] px-4 py-3">
          <div>
            <h3 className="text-lg font-bold text-[#182118]">Your crops</h3>
            <p className="text-xs text-[#8A958A]">Add or remove what you grow</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#667164] hover:bg-[#F1F6EE]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CropPicker selected={draft} onChange={setDraft} />
        </div>

        <div className="border-t border-[#E7ECE5] px-4 py-3">
          <button
            type="button"
            disabled={!draft.length}
            onClick={() => onSave(draft)}
            className="w-full rounded-2xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white disabled:bg-[#CFD9CB]"
          >
            Save {draft.length ? `${draft.length} crop${draft.length === 1 ? "" : "s"}` : "crops"}
          </button>
        </div>
      </div>
    </>
  );
}

function EmptyCrops({ onAdd }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6EE]">
        <Sprout className="h-7 w-7 text-[#2F8F46]" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-[#182118]">No crops on your farm yet</h4>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667164]">
        Add what you grow and FaidaFarm will match prices, buyers and alerts to it.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        Add a crop
      </button>
    </div>
  );
}

function CropRow({ crop, onRemove, compact = false }) {
  const detail = detailFor(crop);

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#EEF2EC]">
      <div className="flex items-stretch gap-0">
        <div className={`${compact ? "h-24 w-24" : "h-32 w-32"} shrink-0 bg-[#F1F6EE]`}>
          <img
            src={crop.image}
            alt={crop.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className={`truncate font-bold text-[#182118] ${compact ? "text-lg" : "text-xl"}`}>
                {crop.name}
              </h4>
              <p className="mt-0.5 truncate text-sm text-[#667164]">
                {detail ? detail.stage : crop.category}
                {crop.aliases[0] ? ` · ${crop.aliases[0]}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(crop.id)}
              aria-label={`Remove ${crop.name}`}
              title="Remove crop"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#A9B3A7] transition hover:bg-[#FDF5F3] hover:text-[#C2542F]"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {detail ? (
            <>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <span className="text-[#667164]">
                  Harvest in <span className="font-semibold text-[#182118]">{detail.harvestIn}</span>
                </span>
                <span className="text-[#667164]">
                  Acreage <span className="font-semibold text-[#182118]">{detail.acreage}</span>
                </span>
                <span className="text-[#667164]">
                  Yield <span className="font-semibold text-[#182118]">{detail.expectedYield}</span>
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E6ECE3]">
                  <div
                    className="h-full rounded-full bg-[#2F8F46]"
                    style={{ width: `${detail.progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#344034]">{detail.progress}%</span>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#8A958A]">
              Season length about {crop.seasonDays} days. Planting and yield records will
              appear here once you add them.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function nearestHarvest(crops) {
  const days = crops
    .map((crop) => detailFor(crop))
    .filter(Boolean)
    .map((detail) => Number.parseInt(detail.harvestIn, 10))
    .filter((value) => Number.isFinite(value));

  return days.length ? `${Math.min(...days)} days` : "Not set";
}

function FarmContent({ compact = false }) {
  const { cropIds, crops, commit } = useFarmCrops();
  const [sheetOpen, setSheetOpen] = useState(false);

  const remove = (cropId) => commit(cropIds.filter((id) => id !== cropId));

  const cropList = crops.length ? (
    <div className="space-y-4">
      {crops.map((crop) => (
        <CropRow key={crop.id} crop={crop} onRemove={remove} compact={compact} />
      ))}
    </div>
  ) : (
    <EmptyCrops onAdd={() => setSheetOpen(true)} />
  );

  const addButton = (
    <button
      type="button"
      onClick={() => setSheetOpen(true)}
      className="inline-flex items-center gap-1.5 rounded-2xl border border-[#CFE3C8] bg-white px-3.5 py-2 text-sm font-semibold text-[#166534] transition hover:bg-[#F1F6EE]"
    >
      <Plus className="h-4 w-4" />
      Add crop
    </button>
  );

  const summary = (
    <div className={compact ? "grid grid-cols-3 gap-3" : "space-y-4"}>
      <div className="rounded-2xl border border-[#EEF2EC] p-4">
        <p className="text-sm text-[#667164]">Active crops</p>
        <p className={`mt-2 font-bold text-[#182118] ${compact ? "text-2xl" : "text-3xl"}`}>
          {crops.length}
        </p>
      </div>
      <div className="rounded-2xl border border-[#EEF2EC] p-4">
        <p className="text-sm text-[#667164]">Nearest harvest</p>
        <p className={`mt-2 font-bold text-[#182118] ${compact ? "text-2xl" : "text-3xl"}`}>
          {nearestHarvest(crops)}
        </p>
      </div>
      <div className="rounded-2xl border border-[#EEF2EC] p-4">
        <p className="text-sm text-[#667164]">Farm status</p>
        <p className={`mt-2 font-bold text-[#2F8F46] ${compact ? "text-2xl" : "text-3xl"}`}>
          {crops.length ? "Stable" : "Set up"}
        </p>
      </div>
    </div>
  );

  const sheet = (
    <AddCropSheet
      key={sheetOpen ? "open" : "closed"}
      open={sheetOpen}
      selected={cropIds}
      onClose={() => setSheetOpen(false)}
      onSave={(next) => {
        commit(next);
        setSheetOpen(false);
      }}
    />
  );

  if (compact) {
    return (
      <div className="space-y-4">
        <MobileCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-[#182118]">My crops</h3>
            {addButton}
          </div>
          <div className="mt-4">{cropList}</div>
        </MobileCard>
        <MobileCard>{summary}</MobileCard>
        {sheet}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle action={addButton}>My Crops</SectionTitle>
          <div className="mt-1">{cropList}</div>
        </Card>
      </div>
      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>Farm Summary</SectionTitle>
          {summary}
        </Card>
      </div>
      {sheet}
    </div>
  );
}

export default function MyFarmModule() {
  return (
    <AppShell
      current="my-farm"
      title="My Farm"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Kitui"
      desktopContent={<FarmContent />}
      mobileContent={<FarmContent compact />}
    />
  );
}
