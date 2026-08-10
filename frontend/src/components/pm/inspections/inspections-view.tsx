"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleAlert,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  InspectionDetailsModal,
  InspectionFormModal,
  type InspectionFormValues,
} from "@/components/pm/inspections/inspection-modals";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import {
  INSPECTION_STATUSES,
  INSPECTION_STATUS_TONE,
  inspections as seed,
  nextInspectionId,
  type Inspection,
} from "@/lib/pm/inspections-data";

const FILTERS = ["All", ...INSPECTION_STATUSES] as const;

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[15px] text-muted">
      <Icon aria-hidden="true" className="h-4 w-4 text-gray-400" />
      {children}
    </span>
  );
}

export function InspectionsView() {
  const [list, setList] = useState<Inspection[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Inspection | null>(null);

  const visible = useMemo(
    () =>
      filter === "All" ? list : list.filter((item) => item.status === filter),
    [list, filter],
  );

  function handleCreate(values: InspectionFormValues) {
    setList((current) => [
      {
        id: nextInspectionId(current),
        title: values.title.trim(),
        status: "Scheduled",
        type: values.type,
        location: values.location.trim() || "—",
        inspector: values.inspector.trim() || "Property Manager",
        date: values.date || "—",
        issues: 0,
        checklist: values.checklist
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((label) => ({ label, done: false })),
        notes: "",
      },
      ...current,
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Inspections"
        subtitle="Schedule and manage property inspections"
        action={
          <PmPrimaryButton
            label="Schedule Inspection"
            onClick={() => setFormOpen(true)}
          />
        }
      />

      <FilterChips
        label="Filter inspections by status"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No inspections with this status.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setViewing(item)}
                className="flex w-full items-center gap-4 rounded-xl border border-hairline bg-white px-6 py-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[13px] text-gray-400">
                      {item.id}
                    </span>
                    <Pill tone={INSPECTION_STATUS_TONE[item.status]}>
                      {item.status}
                    </Pill>
                    <Pill>{item.type}</Pill>
                  </span>

                  <span className="mt-2.5 block text-[17px] font-semibold text-ink">
                    {item.title}
                  </span>

                  <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <Meta icon={MapPin}>{item.location}</Meta>
                    <Meta icon={UserRound}>{item.inspector}</Meta>
                    <Meta icon={CalendarDays}>{item.date}</Meta>
                    {item.issues > 0 && (
                      <span className="flex items-center gap-1.5 text-[15px] font-medium text-rose-600">
                        <CircleAlert aria-hidden="true" className="h-4 w-4" />
                        {item.issues} issue{item.issues === 1 ? "" : "s"}
                      </span>
                    )}
                  </span>
                </span>

                <ChevronRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-300"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <InspectionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
      <InspectionDetailsModal
        inspection={viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}
