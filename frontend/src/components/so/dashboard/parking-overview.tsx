import { SquareParking } from "lucide-react";

import { Panel } from "@/components/so/dashboard/panel";
import { SO_BASE } from "@/lib/so/nav";
import {
  countSlots,
  type ParkingSlot,
  type SlotStatus,
} from "@/lib/so/parking-data";

/** Bay tints — green is free, red is taken, blue is held for somebody. */
const BAY_TONE: Record<SlotStatus, string> = {
  Available: "border-green-200 bg-green-50 text-green-700",
  Occupied: "border-rose-200 bg-rose-50 text-rose-700",
  Reserved: "border-[#cfe0ef] bg-[#eef3f9] text-[#2e6cad]",
};

const COUNT_TONE: Record<SlotStatus, string> = {
  Available: "text-green-600",
  Occupied: "text-rose-600",
  Reserved: "text-[#2e6cad]",
};

const ORDER: SlotStatus[] = ["Available", "Occupied", "Reserved"];

/**
 * The visitor deck at a glance.
 *
 * The bay map is the point: a guard being asked "is there space?" wants to see
 * which bay, not just how many. Hovering a tile names what is in it.
 */
export function SoParkingOverview({ slots }: { slots: ParkingSlot[] }) {
  return (
    <Panel title="Parking Overview" href={`${SO_BASE}/parking`}>
      <div className="px-5 pb-5">
        <dl className="grid grid-cols-3 gap-3 pb-5 text-center">
          {ORDER.map((status) => (
            <div key={status}>
              <dd
                className={`text-[24px] leading-tight font-bold ${COUNT_TONE[status]}`}
              >
                {countSlots(slots, status)}
              </dd>
              <dt className="mt-0.5 text-[13px] text-muted">{status}</dt>
            </div>
          ))}
        </dl>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
          {slots.map((slot) => (
            <li key={slot.id}>
              <span
                title={
                  slot.holder
                    ? `${slot.id} · ${slot.holder.name} · ${slot.holder.plate}`
                    : `${slot.id} · free`
                }
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 ${BAY_TONE[slot.status]}`}
              >
                <SquareParking aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">{slot.id}</span>
                <span className="sr-only">{slot.status}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
