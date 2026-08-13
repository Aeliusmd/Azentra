"use client";

import { Check, X } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  RESULT_TONE,
  type FsInspection,
  type InspectionCheck,
} from "@/lib/fs/inspections-data";
import { setInspectionCheck } from "@/lib/fs/inspections-store";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Pass / fail on one line — clicking the set verdict again clears it. */
function CheckRow({
  inspectionId,
  item,
}: {
  inspectionId: string;
  item: InspectionCheck;
}) {
  function judge(passed: boolean) {
    setInspectionCheck(inspectionId, item.id, item.passed === passed ? null : passed);
  }

  const base =
    "flex h-7 w-7 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none";

  return (
    <li className="flex items-center justify-between gap-4">
      <span className="min-w-0 text-[15px] text-gray-600">{item.label}</span>

      <span className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => judge(true)}
          aria-pressed={item.passed === true}
          aria-label={`Pass: ${item.label}`}
          className={`${base} focus-visible:ring-green-500/40 ${
            item.passed === true
              ? "border-green-600 bg-green-600 text-white"
              : "border-hairline text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Check aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => judge(false)}
          aria-pressed={item.passed === false}
          aria-label={`Fail: ${item.label}`}
          className={`${base} focus-visible:ring-rose-500/40 ${
            item.passed === false
              ? "border-[#e0554d] bg-[#e0554d] text-white"
              : "border-hairline text-gray-400 hover:bg-gray-50"
          }`}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </span>
    </li>
  );
}

/**
 * The round in full. The result is never set by hand — it follows the checklist,
 * so a single failed item fails the inspection the moment it is marked.
 */
export function InspectionDetailModal({
  inspection,
  onClose,
}: {
  inspection: FsInspection;
  onClose: () => void;
}) {
  const judged = inspection.checklist.filter(
    (item) => item.passed !== null,
  ).length;

  return (
    <Modal open onClose={onClose} title={`Inspection ${inspection.id}`} size="lg">
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-8 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={RESULT_TONE[inspection.result]}>{inspection.result}</Pill>
          <Pill tone="navy">{inspection.type}</Pill>
        </div>

        <div>
          <h3 className="text-[19px] font-bold text-ink">{inspection.title}</h3>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail
            label="Location"
            value={[inspection.building, inspection.location]
              .filter(Boolean)
              .join(" - ")}
          />
          <Detail
            label="Scheduled"
            value={`${inspection.date} ${inspection.time}`}
          />
          <Detail
            label="Technician"
            value={inspection.technician ?? "Unassigned"}
          />
          <Detail label="Inspector" value="Carlos Rivera" />
          {inspection.workOrderId && (
            <Detail label="Work Order" value={inspection.workOrderId} />
          )}
        </dl>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h4 className={SECTION}>Checklist</h4>
            <span className="text-[13px] font-medium text-muted">
              {judged}/{inspection.checklist.length} checked
            </span>
          </div>

          <ul className="mt-3 space-y-3">
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
    </Modal>
  );
}
