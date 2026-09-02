"use client";

import { Modal } from "@/components/ui/modal";
import { VisitStatusPill } from "@/components/so/ui/status-pill";
import { vehicleLine, type SoVisit } from "@/lib/so/visitors-data";

/** One labelled fact from the pass. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-[13px] text-muted">{label}</dt>
      <dd className="text-[14px] font-medium text-ink sm:text-right">
        {value}
      </dd>
    </div>
  );
}

/**
 * The whole of a visit, for the guard who needs to check one detail against
 * what the person at the barrier is telling them.
 *
 * Read-only: admitting somebody happens from the row or the check-in queue, so
 * there is one path to it rather than two that could drift apart.
 */
export function SoVisitorDetailModal({
  visit,
  onClose,
}: {
  visit: SoVisit;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={visit.name} subtitle={visit.phone}>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <dl className="divide-y divide-hairline">
          <Row
            label="Status"
            value={<VisitStatusPill status={visit.status} />}
          />
          <Row label="Visitor ID" value={visit.id} />
          <Row label="Pass Code" value={visit.passCode} />
          <Row
            label="ID Document"
            value={`${visit.idType} · ${visit.idNumber}`}
          />
          <Row label="Resident" value={visit.resident} />
          <Row label="Unit" value={visit.unit} />
          <Row label="Visit Date" value={visit.date} />
          <Row label="Expected Time" value={visit.expectedAt} />
          <Row label="Purpose" value={visit.purpose} />
          <Row
            label="Vehicle"
            value={visit.vehicle ? vehicleLine(visit.vehicle) : "No vehicle"}
          />
          <Row
            label="Parking"
            value={visit.vehicle ? "Bay granted" : "Not required"}
          />
          <Row label="Checked In" value={visit.checkedInAt ?? "—"} />
          <Row label="Checked Out" value={visit.checkedOutAt ?? "—"} />
        </dl>
      </div>
    </Modal>
  );
}
