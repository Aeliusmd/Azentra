"use client";

import { SoStatusPill, type SoTone } from "@/components/so/ui/status-pill";
import {
  CARD_ACTION,
  CARD_ACTION_QUIET,
  SoRecordCard,
} from "@/components/so/ui/record-card";
import {
  holdDuration,
  slotForVisit,
  type ParkingSlot,
  type SlotStatus,
} from "@/lib/so/parking-data";
import { releaseSoSlot } from "@/lib/so/parking-store";
import type { SoVisit } from "@/lib/so/visitors-data";

/**
 * The parking lists on a phone.
 *
 * The allocation table is eight columns wide, which is three screens on a
 * handset — and Release, the only thing a guard does from it, sits at the far
 * right. These fold each row up so the button is always in reach.
 */

const GREEN = `${CARD_ACTION} bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600/40`;
const ROSE = `${CARD_ACTION} bg-[#e0554d] text-white hover:bg-[#c74941] focus-visible:ring-[#e0554d]/40`;

const SLOT_TONE: Record<SlotStatus, SoTone> = {
  Available: "green",
  Occupied: "blue",
  Reserved: "slate",
};

export function SoParkingRequestCards({
  requests,
  slots,
  onApprove,
  onReject,
}: {
  requests: SoVisit[];
  slots: ParkingSlot[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {requests.map((visit) => {
        const slot = slotForVisit(slots, visit.id);
        const pending = visit.status === "Pending";

        return (
          <li key={visit.id}>
            <SoRecordCard
              badges={
                <SoStatusPill tone={pending ? "amber" : "green"}>
                  <span className="lowercase">{visit.status}</span>
                </SoStatusPill>
              }
              title={visit.name}
              subtitle={`${visit.resident} · Unit ${visit.unit}`}
              rows={[
                {
                  label: "Vehicle",
                  value: visit.vehicle
                    ? `${visit.vehicle.type} · ${visit.vehicle.plate}`
                    : "—",
                },
                {
                  label: "Duration",
                  value: slot?.holder ? holdDuration(slot.holder) : "—",
                },
                {
                  label: "Slot",
                  value: slot ? slot.id : "Not allocated",
                },
              ]}
              actions={
                pending ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onApprove(visit.id)}
                      className={GREEN}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(visit.id)}
                      className={ROSE}
                    >
                      Reject
                    </button>
                  </>
                ) : undefined
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

export function SoAllocationCards({ slots }: { slots: ParkingSlot[] }) {
  return (
    <ul className="space-y-3">
      {slots.map((slot) => {
        const { holder } = slot;

        return (
          <li key={slot.id}>
            <SoRecordCard
              eyebrow={slot.id}
              badges={
                <SoStatusPill tone={SLOT_TONE[slot.status]}>
                  <span className="lowercase">{slot.status}</span>
                </SoStatusPill>
              }
              title={holder?.name ?? "Free"}
              subtitle={holder ? `Unit ${holder.unit}` : undefined}
              rows={
                holder
                  ? [
                      { label: "Vehicle", value: holder.plate },
                      { label: "Arrival", value: holder.arrival },
                      { label: "Departure", value: holder.departure },
                    ]
                  : []
              }
              actions={
                holder ? (
                  <button
                    type="button"
                    onClick={() => releaseSoSlot(slot.id)}
                    className={CARD_ACTION_QUIET}
                  >
                    Release
                  </button>
                ) : undefined
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
