"use client";

import { Modal } from "@/components/ui/modal";
import {
  eventStamp,
  submittedOn,
  type Complaint,
} from "@/lib/res/complaints-data";
import { longDate } from "@/lib/res/format";

const SECTION = "text-[12px] font-semibold tracking-wider text-muted uppercase";

/**
 * A complaint and everything that has happened to it.
 *
 * The timeline is the record; the status line above it is just the latest entry
 * said plainly. Read-only — a resident raises a complaint, the property manager
 * moves it along.
 */
export function ComplaintDetailModal({
  complaint,
  onClose,
}: {
  complaint: Complaint;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={complaint.id}
      subtitle={complaint.category}
    >
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <h3 className={SECTION}>Description</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">
          {complaint.description}
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-[13px] text-muted">Status</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-ink">
              {complaint.status}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Submitted</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-ink">
              {longDate(submittedOn(complaint))}
            </dd>
          </div>
        </dl>

        <h3 className={`${SECTION} mt-6`}>Timeline</h3>
        <ol className="mt-3">
          {complaint.events.map((event, index) => {
            const latest = index === complaint.events.length - 1;

            return (
              <li key={`${event.date}-${event.time}`} className="flex gap-3">
                {/* The rail is drawn per row so it stops at the last dot. */}
                <span
                  aria-hidden="true"
                  className="flex w-2.5 shrink-0 flex-col items-center"
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                      latest ? "bg-[#2e6cad]" : "bg-gray-300"
                    }`}
                  />
                  {!latest && <span className="w-px flex-1 bg-gray-200" />}
                </span>

                <span className={latest ? "" : "pb-5"}>
                  <span className="block text-[15px] font-semibold text-ink">
                    {event.label}
                  </span>
                  <span className="mt-0.5 block text-[14px] text-muted">
                    {eventStamp(event)}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Modal>
  );
}
