"use client";

import { Pencil, Trash2 } from "lucide-react";

import {
  CategoryChip,
  FacilityImage,
  StatusPill,
} from "@/components/common-areas/facility-visuals";
import type { Facility } from "@/lib/common-areas-data";

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-[7px] text-[13px]">
      <span className="text-gray-600">{label}</span>
      <span
        className={
          accent ? "font-semibold text-[#3fae63]" : "font-medium text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function FacilityCard({
  facility,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  facility: Facility;
  onViewDetails: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
  onDelete: (facility: Facility) => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-hairline bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="relative h-[110px]">
        <FacilityImage src={facility.image} alt={facility.name} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent"
        />
        <StatusPill status={facility.status} className="absolute top-3 right-3" />
        <h3 className="absolute bottom-2.5 left-4 text-[15px] font-semibold text-white">
          {facility.name}
        </h3>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip category={facility.category} />
          <span aria-hidden="true" className="text-gray-300">
            ·
          </span>
          <span className="text-xs text-muted">{facility.location}</span>
        </div>

        <div className="mt-2">
          <Row label="Capacity" value={`${facility.capacity} people`} />
          <Row label="Hours" value={facility.hours} />
          <Row
            label="Booking"
            value={facility.bookingRequired ? "Required" : "Walk-in"}
            accent={facility.bookingRequired}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(facility)}
            className="flex-1 rounded-md border border-emerald-300 py-2.5 text-center text-[13px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEdit(facility)}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md border border-hairline text-gray-400 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Edit {facility.name}</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(facility)}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md border border-hairline text-gray-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Delete {facility.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
