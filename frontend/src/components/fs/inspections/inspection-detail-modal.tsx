"use client";

import { Check, Minus, X } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  checkTally,
  INSPECTION_STATUS_TONE,
  isScheduled,
  type FsInspection,
  type InspectionCheck,
} from "@/lib/fs/inspections-data";
import {
  completeInspection,
  setInspectionCheck,
} from "@/lib/fs/inspections-store";
import { showFsToast } from "@/lib/fs/toast-store";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Pass, fail, or leave it unmarked — the three verdicts a check can carry. */
const VERDICTS = [
  {
    value: true as const,
    icon: Check,
    label: "Pass",
    on: "border-green-600 text-green-600",
  },
  {
    value: false as const,
    icon: X,
    label: "Fail",
    on: "border-[#e0554d] text-[#e0554d]",
  },
  {
    value: null,
    icon: Minus,
    label: "Not checked",
    on: "border-[#e8a33d] text-[#e8a33d]",
  },
];

function CheckRow({
  inspectionId,
  item,
}: {
  inspectionId: string;
  item: InspectionCheck;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-hairline px-3.5 py-2.5">
      <span className="min-w-0 text-[15px] text-gray-700">{item.label}</span>

      <span className="flex shrink-0 items-center gap-1.5">
        {VERDICTS.map((verdict) => {
          const selected = item.passed === verdict.value;
          const Icon = verdict.icon;

          return (
            <button
              key={verdict.label}
              type="button"
              onClick={() =>
                setInspectionCheck(inspectionId, item.id, verdict.value)
              }
              aria-pressed={selected}
              aria-label={`${verdict.label}: ${item.label}`}
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                selected
                  ? `${verdict.on} bg-white`
                  : "border-hairline text-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </span>
    </li>
  );
}

/**
 * The round in full. Checks are marked one at a time and the supervisor closes
 * the round out themselves — an unmarked check is a check that did not apply,
 * not a round left half done.
 */
export function InspectionDetailModal({
  inspection,
  onClose,
}: {
  inspection: FsInspection;
  onClose: () => void;
}) {
  const open = isScheduled(inspection);
  const tally = checkTally(inspection.checklist);

  function handleComplete() {
    completeInspection(inspection.id);
    showFsToast(`${inspection.id} completed`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Inspection ${inspection.id}`} size="lg">
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={INSPECTION_STATUS_TONE[inspection.status]}>
            {inspection.status}
          </Pill>
          <span className="text-[13px] text-muted">{inspection.type}</span>
        </div>

        <div>
          <h3 className="text-[19px] font-bold text-ink">{inspection.title}</h3>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Location" value={inspection.location} />
          <Detail label="Tower" value={inspection.building || "—"} />
          <Detail
            label="Scheduled"
            value={`${inspection.date} ${inspection.time}`}
          />
          <Detail label="Technician" value={inspection.technician ?? "—"} />
          {inspection.workOrderId && (
            <Detail label="Work Order" value={inspection.workOrderId} />
          )}
        </dl>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h4 className={SECTION}>Checklist</h4>
            <span className="text-[13px] text-muted">
              {tally.passed} passed · {tally.failed} failed
            </span>
          </div>

          <ul className="mt-3 space-y-2.5">
            {inspection.checklist.map((item) => (
              <CheckRow
                key={item.id}
                inspectionId={inspection.id}
                item={item}
              />
            ))}
          </ul>
        </section>

        {inspection.findings && (
          <section>
            <h4 className={SECTION}>Findings</h4>
            <p className="mt-2 text-[15px] text-gray-600">
              {inspection.findings}
            </p>
          </section>
        )}

        {inspection.notes && (
          <section>
            <h4 className={SECTION}>Notes</h4>
            <p className="mt-2 text-[15px] text-gray-600">{inspection.notes}</p>
          </section>
        )}

        {inspection.recommendations && (
          <section>
            <h4 className={SECTION}>Recommendations</h4>
            <p className="mt-2 text-[15px] text-gray-600">
              {inspection.recommendations}
            </p>
          </section>
        )}
      </div>

      {open && (
        <div className="border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
          <button
            type="button"
            onClick={handleComplete}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Complete Inspection
          </button>
        </div>
      )}
    </Modal>
  );
}
