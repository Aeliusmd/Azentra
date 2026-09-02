"use client";

import { Car } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ParkingSlot, SlotStatus } from "@/lib/so/parking-data";

/**
 * Bay tints.
 *
 * Green is the only one that means "yes, park here" — the two kinds of
 * unavailable are quiet, and differ only enough to tell a car that is here now
 * from one that is coming.
 */
const TILE_TONE: Record<SlotStatus, string> = {
  Available: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  Occupied: "border-hairline bg-gray-50 text-ink hover:bg-gray-100",
  Reserved: "border-[#dbe6f0] bg-[#eef3f9] text-ink hover:bg-[#e4edf6]",
};

const LEGEND_TONE: Record<SlotStatus, string> = {
  Available: "border-green-200 bg-green-50",
  Occupied: "border-hairline bg-gray-50",
  Reserved: "border-[#dbe6f0] bg-[#eef3f9]",
};

const ORDER: SlotStatus[] = ["Available", "Occupied", "Reserved"];

/**
 * The deck, drawn as it is painted.
 *
 * A guard sent to find a car looks for a bay number, not a table row, so the
 * grid is the primary view and the name under each number is what turns a bay
 * into a person.
 */
export function SoParkingGridTab({
  slots,
  onOpen,
}: {
  slots: ParkingSlot[];
  onOpen: (slot: ParkingSlot) => void;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[16px] font-bold text-ink">Visitor Parking Grid</h2>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
        {slots.map((slot) => (
          <li key={slot.id}>
            <button
              type="button"
              onClick={() => onOpen(slot)}
              className={`flex w-full flex-col items-center gap-1 rounded-lg border px-2 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${TILE_TONE[slot.status]}`}
            >
              <Car aria-hidden="true" className="h-4 w-4 opacity-70" />
              <span className="text-[13px] font-semibold">{slot.id}</span>
              {slot.holder && (
                <span className="max-w-full truncate text-[11px] text-muted">
                  {slot.holder.name}
                </span>
              )}
              <span className="sr-only">{slot.status}</span>
            </button>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-4">
        {ORDER.map((status) => (
          <li key={status} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-3.5 w-3.5 rounded border ${LEGEND_TONE[status]}`}
            />
            <span className="text-[13px] text-gray-600">{status}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
