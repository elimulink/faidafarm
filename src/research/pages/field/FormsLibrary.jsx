import FieldFormCard from "../../components/field/FieldFormCard";
import { fieldForms } from "../../data/mockFieldCollectionData";
import { getFieldForms, saveFieldForm } from "../../fieldStorage/fieldLocalDb";

export default function FormsLibrary() {
  const localForms = getFieldForms();
  const forms = [
    ...localForms.map((form) => ({
      ...form,
      id: form.formId,
      description: form.description || `${form.settings?.round || "Field"} form`,
      duration: form.duration || form.settings?.duration || "Not set",
      assignedRole: form.assignedRole || "Field officer",
      updatedAt: form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "Local draft",
      isLocal: true,
    })),
    ...fieldForms,
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
          Forms Library
        </h1>
        <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
          Kobo/ODK-style field instruments prepared for FMNR monitoring workflows. Locally created forms appear first.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
        {forms.map((form) => (
          <FieldFormCard
            key={form.id}
            form={form}
            onDuplicate={() => {
              const copy = {
                ...form,
                formId: null,
                id: null,
                status: "Draft",
                title: `${form.title} copy`,
                settings: { ...(form.settings || {}), title: `${form.title} copy` },
              };
              saveFieldForm(copy);
              window.location.reload();
            }}
          />
        ))}
      </div>
    </div>
  );
}
