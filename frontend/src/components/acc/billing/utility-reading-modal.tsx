"use client";

import { Modal } from "@/components/ui/modal";
import { grouped, lkr } from "@/lib/acc/money";
import type { UtilityReading } from "@/lib/acc/utility-bills-data";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[15px] text-muted">{label}</dt>
      <dd className="mt-1 text-[19px] font-bold text-ink">{value}</dd>
    </div>
  );
}

/** The arithmetic behind one metered charge, laid out the way it is worked. */
export function UtilityReadingModal({
  reading,
  onClose,
}: {
  reading: UtilityReading;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`${reading.type} Reading - ${reading.unit}`}
    >
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Detail
            label="Previous Reading"
            value={grouped(reading.previous)}
          />
          <Detail label="Current Reading" value={grouped(reading.current)} />
          <Detail
            label="Consumption"
            value={`${grouped(reading.consumption)} units`}
          />
          <Detail label="Rate" value={`LKR ${reading.rate}/unit`} />
        </dl>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-hairline pt-5">
          <span className="text-[17px] font-bold text-ink">Total Charge</span>
          <span className="text-[19px] font-bold text-ink">
            {lkr(reading.charge)}
          </span>
        </div>
      </div>
    </Modal>
  );
}
