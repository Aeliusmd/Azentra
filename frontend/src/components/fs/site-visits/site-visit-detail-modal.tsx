"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import {
  VISIT_STATUS_TONE,
  type SiteVisit,
} from "@/lib/fs/site-visits-data";
import {
  setSiteVisitStatus,
  toggleVisitCheck,
} from "@/lib/fs/site-visits-store";
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

/** The one move open to the supervisor at each stage of a round. */
function nextStep(visit: SiteVisit) {
  if (visit.status === "Scheduled")
    return { label: "Start Visit", status: "In Progress" as const };
  if (visit.status === "In Progress")
    return { label: "Complete Visit", status: "Completed" as const };
  return null;
}

/** The round in full, with the checklist the supervisor works down on site. */
export function SiteVisitDetailModal({
  visit,
  onClose,
}: {
  visit: SiteVisit;
  onClose: () => void;
}) {
  const step = nextStep(visit);

  function handleStep() {
    if (!step) return;

    setSiteVisitStatus(visit.id, step.status);
    showFsToast(
      step.status === "Completed"
        ? `${visit.id} completed`
        : `${visit.id} started`,
    );
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Site Visit ${visit.id}`} size="lg">
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={VISIT_STATUS_TONE[visit.status]}>{visit.status}</Pill>
          <Pill tone="amber">{visit.purpose}</Pill>
        </div>

        <div>
          <h3 className="text-[19px] font-bold text-ink">{visit.purpose}</h3>
          <p className="mt-1.5 text-[15px] text-muted">{visit.summary}</p>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Location" value={visit.location} />
          <Detail label="Tower" value={visit.building || "—"} />
          <Detail label="Scheduled" value={`${visit.date} ${visit.time}`} />
          <Detail
            label="Participants"
            value={visit.participants?.join(", ") ?? "Carlos Rivera (FS)"}
          />
          {visit.technician && (
            <Detail label="Technician" value={visit.technician} />
          )}
          {visit.workOrderId && (
            <Detail label="Work Order" value={visit.workOrderId} />
          )}
        </dl>

        <section>
          <h4 className={SECTION}>Checklist</h4>
          <ul className="mt-3 space-y-3">
            {visit.checklist.map((item) => (
              <li key={item.id}>
                <Checkbox
                  id={`sv-${item.id}`}
                  label={item.label}
                  checked={item.done}
                  onChange={() => toggleVisitCheck(visit.id, item.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        {visit.observations && (
          <section>
            <h4 className={SECTION}>Observations</h4>
            <p className="mt-2 text-[15px] text-gray-600">
              {visit.observations}
            </p>
          </section>
        )}

        {visit.notes && (
          <section>
            <h4 className={SECTION}>Notes</h4>
            <p className="mt-2 text-[15px] text-gray-600">{visit.notes}</p>
          </section>
        )}

        {visit.followUp && (
          <section>
            <h4 className={SECTION}>Follow-up</h4>
            <p className="mt-2 text-[15px] text-gray-600">{visit.followUp}</p>
          </section>
        )}
      </div>

      {step && (
        <div className="border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
          <button
            type="button"
            onClick={handleStep}
            className="rounded-lg bg-[#2e6cad] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#255a92] focus-visible:ring-2 focus-visible:ring-[#2e6cad]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {step.label}
          </button>
        </div>
      )}
    </Modal>
  );
}
