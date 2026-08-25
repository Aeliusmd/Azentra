"use client";

import { Modal } from "@/components/ui/modal";
import { initialsOf, longDate, timeRange } from "@/lib/res/format";
import type { VisitorPass } from "@/lib/res/visitors-data";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/**
 * The pass as the resident reads it back.
 *
 * Vehicle and parking are only listed when there is something to list — a
 * delivery on foot has no plate, and a row saying so would be noise.
 */
export function VisitorDetailsModal({
  pass,
  onClose,
}: {
  pass: VisitorPass;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title="Visitor Details">
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-[#dee7f0] text-[20px] font-semibold text-[#1b3a5c]"
          >
            {initialsOf(pass.name)}
          </span>
          <div className="min-w-0">
            <p className="text-[19px] font-bold text-ink">{pass.name}</p>
            <p className="mt-0.5 text-[14px] text-muted">{pass.phone}</p>
          </div>
        </div>

        <dl className="mt-6">
          <Row label="Visit Date" value={longDate(pass.date)} />
          <Row label="Time" value={timeRange(pass.arriving, pass.leaving)} />
          <Row label="Purpose" value={pass.purpose} />
          {pass.vehicle && <Row label="Vehicle" value={pass.vehicle} />}
          {pass.bay && <Row label="Parking" value={`Required — ${pass.bay}`} />}
          <Row label="Status" value={pass.status} />
        </dl>
      </div>
    </Modal>
  );
}
