"use client";

import {
  IncidentSeverityPill,
  IncidentStatusPill,
} from "@/components/so/incidents/incident-pills";
import { Modal } from "@/components/ui/modal";
import type { Incident } from "@/lib/so/incidents-data";
import { setSoIncidentStatus } from "@/lib/so/incidents-store";

/**
 * One labelled fact, stacked.
 *
 * Label above value rather than side by side: the account of an incident runs
 * to several lines, and a two-column list turns those into a narrow ragged
 * column against a wall of labels.
 */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] leading-relaxed text-ink">{value}</dd>
    </div>
  );
}

/**
 * The whole of a report.
 *
 * The account itself is fixed — a guard reads it, they do not revise it. The
 * only thing this dialog can change is where the report stands, and only while
 * it is still open, which is why a settled report offers nothing but Close.
 */
export function SoIncidentDetailModal({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  const open = incident.status === "Investigating";

  // A closed report was not necessarily put right, so it is not "resolved".
  const settledLabel = incident.status === "Resolved" ? "Resolved" : "Closed";

  function move(status: "Resolved" | "Closed") {
    setSoIncidentStatus(incident.id, status);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Incident ${incident.id}`}>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center gap-2">
          <IncidentSeverityPill severity={incident.severity} />
          <IncidentStatusPill status={incident.status} />
        </div>

        <dl className="mt-5 space-y-4">
          <Field label="Type" value={incident.type} />
          <Field
            label="Date & Time"
            value={`${incident.date} at ${incident.time}`}
          />
          <Field label="Location" value={incident.location} />
          <Field label="Description" value={incident.description} />
          <Field
            label="People Involved"
            value={incident.peopleInvolved || "Nobody identified"}
          />
          <Field
            label="Action Taken"
            value={incident.actionTaken || "No action recorded at the time."}
          />
          <Field label="Reported By" value={incident.reportedBy} />

          {incident.settledAt && (
            <>
              <Field label={`${settledLabel} At`} value={incident.settledAt} />
              <Field
                label={`${settledLabel === "Resolved" ? "Resolution" : "Closing"} Notes`}
                value={incident.settlementNotes}
              />
            </>
          )}
        </dl>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-hairline px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
        {open && (
          <>
            <button
              type="button"
              onClick={() => move("Resolved")}
              className="w-full rounded-lg border border-green-200 bg-green-50 px-5 py-2.5 text-[14px] font-semibold text-green-700 sm:w-auto transition-colors hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-600/30 focus-visible:outline-none"
            >
              Mark Resolved
            </button>
            <button
              type="button"
              onClick={() => move("Closed")}
              className="w-full rounded-lg bg-green-600 px-5 py-2.5 text-[14px] font-semibold text-white sm:w-auto transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Close Report
            </button>
          </>
        )}

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
