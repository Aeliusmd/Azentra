"use client";

import { Modal } from "@/components/ui/modal";
import type { ParkingSlot, SlotStatus } from "@/lib/so/parking-data";

/** The status line takes the bay's own colour, so the dialog reads at a glance. */
const STATUS_TONE: Record<SlotStatus, string> = {
  Available: "text-green-600",
  Occupied: "text-[#2e6cad]",
  Reserved: "text-[#5b7c99]",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-[14px] text-muted">{label}</dt>
      <dd className="text-[14px] font-semibold text-ink sm:text-right">
        {value}
      </dd>
    </div>
  );
}

/**
 * One bay, opened from the grid.
 *
 * Read-only. A bay is freed from the allocation table, where the guard can see
 * what else is on the deck before taking a space back.
 */
export function SoSlotModal({
  slot,
  onClose,
}: {
  slot: ParkingSlot;
  onClose: () => void;
}) {
  const { holder } = slot;

  return (
    <Modal open onClose={onClose} title={`Parking Slot ${slot.id}`}>
      <div className="px-5 py-4 sm:px-8 sm:py-5">
        <dl className="divide-y divide-hairline">
          <Row
            label="Status"
            value={
              <span className={STATUS_TONE[slot.status]}>{slot.status}</span>
            }
          />
          <Row label="Floor" value={slot.floor} />
          <Row label="Visitor" value={holder?.name ?? "—"} />
          <Row label="Vehicle" value={holder?.plate ?? "—"} />
          <Row label="Unit" value={holder?.unit ?? "—"} />
          {holder && (
            <Row
              label="Held Until"
              value={`${holder.arrival} - ${holder.departure}`}
            />
          )}
        </dl>
      </div>

      <div className="flex justify-end border-t border-hairline px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-hairline bg-white px-5 py-2.5 text-[14px] font-medium text-ink sm:w-auto transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
