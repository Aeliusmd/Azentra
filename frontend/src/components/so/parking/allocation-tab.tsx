"use client";

import { SoAllocationCards } from "@/components/so/parking/parking-cards";
import { SoStatusPill, type SoTone } from "@/components/so/ui/status-pill";
import { SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import type { ParkingSlot, SlotStatus } from "@/lib/so/parking-data";
import { releaseSoSlot } from "@/lib/so/parking-store";

const COLUMNS = [
  { label: "Slot" },
  { label: "Visitor" },
  { label: "Vehicle" },
  { label: "Apartment" },
  { label: "Arrival" },
  { label: "Departure" },
  { label: "Status" },
  { label: "Action", align: "right" as const },
];

const STATUS_TONE: Record<SlotStatus, SoTone> = {
  Available: "green",
  Occupied: "blue",
  Reserved: "slate",
};

/** A free bay has nothing to say in most columns, and says so with a dash. */
const DASH = <span className="text-muted">-</span>;

/**
 * Every bay on the deck, free ones included.
 *
 * The empty rows earn their place: a guard scanning for a space wants to read
 * down one column rather than work out which numbers are missing from a list.
 */
export function SoAllocationTab({ slots }: { slots: ParkingSlot[] }) {
  return (
    <>
      <div className="md:hidden">
        <SoAllocationCards slots={slots} />
      </div>

      <Card className="hidden md:block">
        <SoTable columns={COLUMNS} minWidth="min-w-[1040px]">
          {slots.map((slot) => {
            const { holder } = slot;

            return (
              <tr
                key={slot.id}
                className="transition-colors hover:bg-gray-50/70"
              >
                <th
                  scope="row"
                  className="px-5 py-3.5 text-left font-mono text-[13px] font-normal text-gray-600"
                >
                  {slot.id}
                </th>

                <td className="px-5 py-3.5 text-[14px] text-ink">
                  {holder?.name ?? DASH}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {holder?.plate ?? DASH}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {holder?.unit ?? DASH}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {holder?.arrival ?? DASH}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {holder?.departure ?? DASH}
                </td>

                <td className="px-5 py-3.5">
                  <SoStatusPill tone={STATUS_TONE[slot.status]}>
                    <span className="lowercase">{slot.status}</span>
                  </SoStatusPill>
                </td>

                <td className="px-5 py-3.5 text-right">
                  {slot.status !== "Available" && (
                    <button
                      type="button"
                      onClick={() => releaseSoSlot(slot.id)}
                      className="rounded-md border border-hairline bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      Release
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </SoTable>
      </Card>
    </>
  );
}
