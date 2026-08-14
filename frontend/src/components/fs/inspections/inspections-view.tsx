"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ListChecks, Plus, UserRound } from "lucide-react";

import { CreateInspectionModal } from "@/components/fs/inspections/create-inspection-modal";
import { InspectionDetailModal } from "@/components/fs/inspections/inspection-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  INSPECTION_STATUS_TONE,
  isScheduled,
  type FsInspection,
} from "@/lib/fs/inspections-data";
import { useFsInspections } from "@/lib/fs/inspections-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";

function InspectionCard({
  inspection,
  onOpen,
}: {
  inspection: FsInspection;
  onOpen: () => void;
}) {
  return (
    <Card className="h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="font-mono text-[13px] text-gray-500">
            {inspection.id}
          </span>
          <Pill tone={INSPECTION_STATUS_TONE[inspection.status]}>
            {inspection.status}
          </Pill>
        </span>

        <span className="mt-2.5 block text-[17px] font-bold text-ink">
          {inspection.title}
        </span>
        <span className="mt-1 block text-[15px] text-muted">
          {[inspection.building, inspection.location]
            .filter(Boolean)
            .join(" - ")}
        </span>

        <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {inspection.date}
          </span>
          {inspection.technician && (
            <span className="flex items-center gap-1.5">
              <UserRound aria-hidden="true" className="h-4 w-4 text-gray-400" />
              {inspection.technician}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <ListChecks aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {inspection.checklist.length} items
          </span>
        </span>
      </button>
    </Card>
  );
}

/**
 * Every inspection on this property: the rounds still to walk first, then the
 * ones already closed out, most recent at the top.
 */
export function FsInspectionsView() {
  const propertyId = useSelectedFsProperty();
  const inspections = useFsInspections();

  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const visible = useMemo(
    () =>
      inspections
        .filter((inspection) => inspection.propertyId === propertyId)
        .sort((a, b) => {
          if (isScheduled(a) !== isScheduled(b)) return isScheduled(a) ? -1 : 1;

          const slot = a.date.localeCompare(b.date);
          return isScheduled(a) ? slot : -slot;
        }),
    [inspections, propertyId],
  );

  const openInspection =
    inspections.find((inspection) => inspection.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Inspections
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage all property inspections
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Inspection
        </button>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No inspections are booked on this property.
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((inspection) => (
            <li key={inspection.id}>
              <InspectionCard
                inspection={inspection}
                onOpen={() => setOpenId(inspection.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {openInspection && (
        <InspectionDetailModal
          inspection={openInspection}
          onClose={() => setOpenId(null)}
        />
      )}

      {createOpen && (
        <CreateInspectionModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
