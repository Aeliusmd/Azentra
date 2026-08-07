"use client";

import { useMemo, useState } from "react";

import { TowerCard } from "@/components/buildings/tower-card";
import { TowerDetailsModal } from "@/components/buildings/tower-details-modal";
import {
  TowerFormModal,
  type TowerFormValues,
} from "@/components/buildings/tower-form-modal";
import { AddButton } from "@/components/ui/add-button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { recordAudit } from "@/lib/audit-store";
import type { Tower, TowerTheme } from "@/lib/buildings-data";

const THEME_CYCLE: TowerTheme[] = ["orange", "teal", "crimson", "purple"];

function slugify(name: string, taken: Tower[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "tower";

  let slug = base;
  let suffix = 2;
  while (taken.some((tower) => tower.slug === slug)) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

type FormState = { mode: "add" } | { mode: "edit"; tower: Tower };

export function TowersView({ towers }: { towers: Tower[] }) {
  const [towerList, setTowerList] = useState(towers);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Tower | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return towerList;
    return towerList.filter(
      (tower) =>
        tower.name.toLowerCase().includes(term) ||
        tower.status.toLowerCase().includes(term) ||
        tower.amenities.some((amenity) =>
          amenity.toLowerCase().includes(term),
        ),
    );
  }, [query, towerList]);

  function handleSubmit(values: TowerFormValues) {
    const floors = Number(values.floors);
    const totalUnits = floors * Number(values.unitsPerFloor);
    const name = values.name.trim();

    recordAudit(
      form?.mode === "edit"
        ? {
            action: "Tower Updated",
            module: "Units",
            details: `${name} updated — ${floors} floors, ${totalUnits} units, status ${values.status}`,
          }
        : {
            action: "Tower Created",
            module: "Units",
            details: `${name} created with ${floors} floors and ${totalUnits} units`,
          },
    );

    setTowerList((list) => {
      if (form?.mode === "edit") {
        return list.map((tower) =>
          tower.slug === form.tower.slug
            ? {
                ...tower,
                name,
                floors,
                totalUnits,
                // Occupied and maintenance are unchanged, so vacant absorbs
                // the new total.
                vacant: Math.max(
                  0,
                  totalUnits - tower.occupied - tower.maintenance,
                ),
                status: values.status,
                amenities: values.amenities,
              }
            : tower,
        );
      }

      const created: Tower = {
        slug: slugify(name, list),
        name,
        floors,
        totalUnits,
        occupied: 0,
        vacant: totalUnits,
        maintenance: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        status: values.status,
        amenities: values.amenities,
        theme: THEME_CYCLE[list.length % THEME_CYCLE.length],
      };
      return [...list, created];
    });

    setForm(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tower Management"
        subtitle="Manage residential towers and buildings"
        backHref="/admin/buildings"
        backLabel="Back to Building Management"
        action={
          <AddButton label="Add Tower" onClick={() => setForm({ mode: "add" })} />
        }
      />

      <SearchInput
        label="Search towers"
        placeholder="Search towers..."
        value={query}
        onChange={setQuery}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-10 text-center text-[13px] text-muted">
          No towers match “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((tower) => (
            <TowerCard
              key={tower.slug}
              tower={tower}
              onViewDetails={setSelected}
              onEdit={(target) => setForm({ mode: "edit", tower: target })}
            />
          ))}
        </div>
      )}

      <TowerDetailsModal tower={selected} onClose={() => setSelected(null)} />

      {form && (
        <TowerFormModal
          key={form.mode === "edit" ? form.tower.slug : "new"}
          tower={form.mode === "edit" ? form.tower : null}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
