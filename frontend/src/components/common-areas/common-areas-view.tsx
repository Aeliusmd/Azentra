"use client";

import { useMemo, useState } from "react";

import { FacilityCard } from "@/components/common-areas/facility-card";
import { FacilityDetailsModal } from "@/components/common-areas/facility-details-modal";
import {
  FacilityFormModal,
  type FacilityFormValues,
} from "@/components/common-areas/facility-form-modal";
import { AddButton } from "@/components/ui/add-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { recordAudit } from "@/lib/audit-store";
import {
  FACILITY_CATEGORIES,
  type Facility,
} from "@/lib/common-areas-data";

const PLACEHOLDER_IMAGE = "/community hall.png";

function slugify(name: string, taken: Facility[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "facility";

  let id = base;
  let suffix = 2;
  while (taken.some((facility) => facility.id === id)) {
    id = `${base}-${suffix++}`;
  }
  return id;
}

type FormState = { mode: "add" } | { mode: "edit"; facility: Facility };

export function CommonAreasView({
  facilities,
}: {
  facilities: Facility[];
}) {
  const [list, setList] = useState(facilities);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Facility | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Facility | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return list.filter((facility) => {
      if (category && facility.category !== category) return false;
      if (!term) return true;
      return (
        facility.name.toLowerCase().includes(term) ||
        facility.location.toLowerCase().includes(term) ||
        facility.category.toLowerCase().includes(term)
      );
    });
  }, [category, list, query]);

  function handleSubmit(values: FacilityFormValues) {
    const capacity = Number(values.capacity);
    const name = values.name.trim();

    recordAudit(
      form?.mode === "edit"
        ? {
            action: "Facility Updated",
            module: "Facilities",
            details: `${name} updated — ${values.category}, ${values.location.trim()}, capacity ${capacity}`,
          }
        : {
            action: "Facility Created",
            module: "Facilities",
            details: `${name} added as a ${values.category} facility at ${values.location.trim()} (capacity ${capacity})`,
          },
    );

    setList((current) => {
      if (form?.mode === "edit") {
        return current.map((facility) =>
          facility.id === form.facility.id
            ? {
                ...facility,
                name,
                category: values.category,
                location: values.location.trim(),
                capacity,
                hours: values.hours.trim(),
                bookingRequired: values.bookingRequired,
                description: values.description.trim(),
                image: values.image || facility.image,
              }
            : facility,
        );
      }

      const today = new Date().toISOString().slice(0, 10);
      const created: Facility = {
        id: slugify(name, current),
        name,
        category: values.category,
        location: values.location.trim(),
        capacity,
        hours: values.hours.trim(),
        bookingRequired: values.bookingRequired,
        status: "active",
        image: values.image || PLACEHOLDER_IMAGE,
        lastMaintained: today,
        nextMaintenance: today,
        description: values.description.trim(),
      };
      return [...current, created];
    });

    setForm(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    recordAudit({
      action: "Facility Deleted",
      module: "Facilities",
      details: `${pendingDelete.name} (${pendingDelete.category}, ${pendingDelete.location}) removed`,
    });
    setList((current) =>
      current.filter((facility) => facility.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Common Area Management"
        subtitle="Manage shared facilities and amenities"
        backHref="/admin/buildings"
        backLabel="Back to Building Management"
        action={
          <AddButton
            label="Add Facility"
            onClick={() => setForm({ mode: "add" })}
          />
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          label="Search facilities"
          placeholder="Search facilities..."
          value={query}
          onChange={setQuery}
        />
        <SelectFilter
          label="Filter by category"
          allLabel="All Categories"
          options={[...FACILITY_CATEGORIES]}
          value={category}
          onChange={setCategory}
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-10 text-center text-[13px] text-muted">
          No facilities match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onViewDetails={setSelected}
              onEdit={(target) => setForm({ mode: "edit", facility: target })}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <FacilityDetailsModal
        facility={selected}
        onClose={() => setSelected(null)}
      />

      {form && (
        <FacilityFormModal
          key={form.mode === "edit" ? form.facility.id : "new"}
          facility={form.mode === "edit" ? form.facility : null}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete Facility"
        message={`Delete “${pendingDelete?.name}”? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
