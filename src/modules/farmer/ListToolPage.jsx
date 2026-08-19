// Registering a tool or service to offer on FaidaFarm.
//
// Submitting does not publish. Every listing is held for review by a person at
// FaidaFarm, because a farmer paying a deposit to a supplier they found here is
// trusting the badge next to that supplier's name.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Info, Upload, X } from "lucide-react";
import { AppShell, Card, MobileCard } from "../../components/farmer/FarmerShared";
import { TOOL_CATEGORIES } from "../../data/toolsData";
import { submitListing } from "../../tools/listingStorage";

const PRICE_UNITS = ["per day", "per acre", "per hour", "per km", "each", "kit"];

const EMPTY = {
  name: "",
  brand: "",
  category: "hire",
  priceAmount: "",
  priceUnit: "per day",
  county: "",
  phone: "",
  businessName: "",
  summary: "",
  description: "",
};

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#182118]">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-[#8A958A]">{hint}</span> : null}
      <span className="mt-1.5 block">{children}</span>
      {error ? <span className="mt-1 block text-xs font-semibold text-[#C2542F]">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[#E4EAE1] bg-white px-4 py-3 text-sm text-[#182118] outline-none placeholder:text-[#8A958A] focus:border-[#2F8F46]";

function validate(form, photos) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Give the tool or service a name.";
  if (!form.priceAmount || Number(form.priceAmount) <= 0) errors.priceAmount = "Enter what you charge.";
  if (!form.county.trim()) errors.county = "Where is it available?";
  if (!/^\+?[0-9\s-]{9,}$/.test(form.phone.trim())) errors.phone = "Enter a phone number farmers can call.";
  if (!form.businessName.trim()) errors.businessName = "Who is offering it?";
  if (!form.summary.trim()) errors.summary = "One line telling farmers what it does.";
  if (!photos.length) errors.photos = "Add at least one photo of the actual item.";

  return errors;
}

function SubmittedPanel({ listing, compact = false }) {
  return (
    <div className="rounded-[24px] border border-[#DCEAD5] bg-[#F7FBF5] p-6 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
        <CheckCircle2 className="h-7 w-7 text-[#2F8F46]" />
      </span>
      <h2 className={`mt-4 font-bold text-[#14311D] ${compact ? "text-[22px]" : "text-[26px]"}`}>
        Sent for approval
      </h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-6 text-[#3F5442]">
        <strong>{listing.name}</strong> is with the FaidaFarm team. Someone checks that the
        business and the equipment are real before it goes live, usually within two working
        days. You will see it under Your listings once approved.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/tools-services"
          className="rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to tools
        </Link>
      </div>
    </div>
  );
}

function ListingForm({ compact = false }) {
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const addPhotos = (fileList) => {
    const incoming = Array.from(fileList || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 4 - photos.length)
      .map((file) => ({
        id: `${file.name}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    if (incoming.length) {
      setPhotos((current) => [...current, ...incoming]);
    }
  };

  const removePhoto = (id) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((photo) => photo.id !== id);
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const found = validate(form, photos);
    setErrors(found);

    if (Object.keys(found).length) {
      return;
    }

    // Photos are not persisted: object URLs die with the page, and the real
    // upload belongs to the backend. Only the count is recorded.
    setSubmitted(submitListing({ ...form, photoCount: photos.length }));
  };

  if (submitted) {
    return <SubmittedPanel listing={submitted} compact={compact} />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => navigate("/tools-services")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534]"
      >
        <ArrowLeft className="h-4 w-4" />
        All tools
      </button>

      <div>
        <h1 className={`font-bold leading-tight text-[#182118] ${compact ? "text-[26px]" : "text-[32px]"}`}>
          Offer a tool or service
        </h1>
        <p className="mt-2 max-w-[56ch] text-sm leading-6 text-[#667164]">
          List equipment for hire or sale, or a service you provide. Farmers will see your
          name and phone number, so use details you are happy to be contacted on.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-[22px] border border-[#E4EBDD] bg-[#F7FBF5] p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2F8F46]" />
        <p className="text-sm leading-6 text-[#3F5442]">
          Every listing is checked by the FaidaFarm team before it appears. We confirm the
          business exists and the equipment is really yours to offer, because farmers pay
          deposits on the strength of that badge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="What are you offering?" error={errors.name}>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Tractor with plough"
          />
        </Field>

        <Field label="Make or brand" hint="Optional, but farmers search for it">
          <input
            className={inputClass}
            value={form.brand}
            onChange={(event) => update("brand", event.target.value)}
            placeholder="Massey Ferguson 275"
          />
        </Field>

        <Field label="Listing type">
          <select
            className={inputClass}
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
          >
            {TOOL_CATEGORIES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} - {option.blurb}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price" error={errors.priceAmount}>
          <span className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              min="0"
              inputMode="numeric"
              value={form.priceAmount}
              onChange={(event) => update("priceAmount", event.target.value)}
              placeholder="3500"
            />
            <select
              className={`${inputClass} w-[128px] shrink-0`}
              value={form.priceUnit}
              onChange={(event) => update("priceUnit", event.target.value)}
            >
              {PRICE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </span>
        </Field>

        <Field label="Business or your name" error={errors.businessName}>
          <input
            className={inputClass}
            value={form.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            placeholder="Kitui Farm Machinery"
          />
        </Field>

        <Field label="County" error={errors.county}>
          <input
            className={inputClass}
            value={form.county}
            onChange={(event) => update("county", event.target.value)}
            placeholder="Kitui"
          />
        </Field>

        <Field label="Phone number" hint="Farmers will call or WhatsApp this" error={errors.phone}>
          <input
            className={inputClass}
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+254 7xx xxx xxx"
          />
        </Field>
      </div>

      <Field label="One line summary" error={errors.summary}>
        <input
          className={inputClass}
          value={form.summary}
          onChange={(event) => update("summary", event.target.value)}
          placeholder="Ploughing and harrowing with an operator included"
        />
      </Field>

      <Field label="Full description" hint="Condition, what is included, how to book">
        <textarea
          rows={4}
          className={`${inputClass} resize-y`}
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="120 hp tractor with plough and harrow. Hired with operator and fuel. Book two weeks before the rains."
        />
      </Field>

      <Field
        label="Photos"
        hint="Up to 4 photos of the actual item, not a catalogue picture"
        error={errors.photos}
      >
        <div>
          <label className="flex cursor-pointer items-center gap-3 rounded-[22px] border border-dashed border-[#CFE3C8] bg-[#F7FBF5] px-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#166534]">
              <Upload size={18} />
            </span>
            <span className="text-sm font-semibold text-[#20562B]">
              {photos.length ? `${photos.length} of 4 added` : "Add photos"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                addPhotos(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          {photos.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {photos.map((photo) => (
                <span key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-20 w-20 rounded-2xl border border-[#E4EAE1] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={`Remove ${photo.name}`}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#E4EAE1] bg-white text-[#4C574D]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Field>

      <button
        type="submit"
        className="w-full rounded-2xl bg-[#166534] px-5 py-4 text-sm font-semibold text-white"
      >
        Send for approval
      </button>
      <p className="text-center text-xs text-[#8A958A]">
        Submitting does not publish the listing. It is reviewed first.
      </p>
    </form>
  );
}

export default function ListToolPage() {
  return (
    <AppShell
      current="tools-services"
      title="Offer a tool"
      subtitle="Tools & Services"
      mobileSubtitle="Tools"
      desktopContent={
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 xl:col-start-3">
            <Card>
              <ListingForm />
            </Card>
          </div>
        </div>
      }
      mobileContent={
        <MobileCard>
          <ListingForm compact />
        </MobileCard>
      }
    />
  );
}
