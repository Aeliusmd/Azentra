"use client";

import { clockNow } from "@/components/ten/maintenance/new-request-modal";
import { showTenToast } from "@/components/ten/ui/toaster";
import { Modal } from "@/components/ui/modal";
import { clockPadded, clockTime, longDate, shortDate } from "@/lib/res/format";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  awaitsConfirmation,
  requestProgress,
  type TenMaintenanceRequest,
  type TimelineEvent,
} from "@/lib/ten/maintenance-data";
import { confirmTenResolution } from "@/lib/ten/maintenance-store";

/** `August 11, 2026 - 10:30 AM`. */
function visitLine(date: string, time: string | null) {
  return time ? `${longDate(date)} - ${clockTime(time)}` : longDate(date);
}

/** One of the four small facts under the description. */
function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-1 text-[15px] font-semibold text-ink">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[14px] font-bold text-ink">{children}</h3>;
}

/**
 * What the property recorded against the request, oldest first.
 *
 * The first stamp is where it began and the last is where it stands, so those
 * two are marked; everything between is a step already passed.
 */
function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="mt-3">
      {events.map((event, index) => {
        const first = index === 0;
        const last = index === events.length - 1;

        const dot = last && !first ? "bg-brand" : first ? "bg-[#2e6cad]" : "bg-gray-300";

        return (
          <li key={`${event.date}-${event.time}-${event.label}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
              />
              {!last && (
                <span aria-hidden="true" className="w-px flex-1 bg-gray-200" />
              )}
            </div>

            <div className={last ? "" : "pb-4"}>
              <p className="text-[14px] text-ink">{event.label}</p>
              <p className="mt-0.5 text-[13px] text-muted">
                {shortDate(event.date)}, {clockPadded(event.time)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * One request in full: what was reported, who is on it, what was fitted and
 * every step the property recorded.
 *
 * Read-only apart from the sign-off. The technician, the booked slot, the
 * materials and the log all arrive from the property and are reported here,
 * never edited.
 */
export function RequestDetailModal({
  request,
  onClose,
}: {
  request: TenMaintenanceRequest;
  onClose: () => void;
}) {
  const progress = requestProgress(request.status);
  const canConfirm = awaitsConfirmation(request);

  function handleConfirm() {
    confirmTenResolution(request.id, TODAY, clockNow());
    showTenToast(`${request.id} confirmed as complete`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={request.id} subtitle={request.category}>
      <div className="max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-8">
        <p className="text-[16px] leading-relaxed text-ink">
          {request.description}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <Fact label="Priority">{request.priority}</Fact>

          <Fact label="Technician">
            {request.technician ? (
              request.technician.name
            ) : (
              <span className="font-normal text-muted">Not assigned yet</span>
            )}
          </Fact>

          <Fact label="Scheduled">
            {request.appointment ? (
              visitLine(request.appointment, request.appointmentTime)
            ) : request.preferredDate ? (
              <span className="font-normal text-muted">
                {visitLine(request.preferredDate, request.preferredTime)}{" "}
                (requested)
              </span>
            ) : (
              <span className="font-normal text-muted">Not scheduled yet</span>
            )}
          </Fact>

          <Fact label="Progress">
            <div className="flex items-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${request.id} progress`}
                className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
              >
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[15px] font-semibold text-ink">
                {progress}%
              </span>
            </div>
          </Fact>
        </div>

        {request.materials.length > 0 && (
          <section className="mt-7">
            <SectionTitle>Materials Used</SectionTitle>
            <dl className="mt-2">
              {request.materials.map((material) => (
                <div
                  key={material.name}
                  className="flex items-baseline justify-between gap-6 py-2"
                >
                  <dt className="text-[15px] text-ink">{material.name}</dt>
                  <dd className="text-right text-[15px] font-semibold text-ink">
                    {material.quantity}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Only shown once the tenant has actually attached something. */}
        {request.photos.length > 0 && (
          <section className="mt-7">
            <SectionTitle>Photos</SectionTitle>
            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {request.photos.map((photo) => (
                <li key={photo.id}>
                  {/* A local object URL, so a plain img is right here. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-[76px] w-full rounded-lg border border-hairline object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-7">
          <SectionTitle>Timeline</SectionTitle>
          <Timeline events={request.timeline} />
        </section>

        {request.completionNote && (
          <section className="mt-7">
            <SectionTitle>Completion</SectionTitle>
            <p className="mt-2 rounded-lg border border-green-200 bg-green-50/60 px-4 py-3 text-[14px] leading-relaxed text-green-900/90">
              {request.completionNote}
            </p>
          </section>
        )}
      </div>

      {/* The tenant's one forward action, and only once the work is done. */}
      {canConfirm && (
        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-green-50 px-5 py-3 text-[15px] font-semibold text-green-700 transition-colors hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            Confirm Completion
          </button>
        </div>
      )}
    </Modal>
  );
}
