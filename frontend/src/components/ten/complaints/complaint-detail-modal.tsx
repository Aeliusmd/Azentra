"use client";

import { MessageSquare } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { clockPadded, shortDate } from "@/lib/res/format";
import type { ComplaintEvent, TenComplaint } from "@/lib/ten/complaints-data";

/**
 * What the property recorded against the complaint, oldest first.
 *
 * The first stamp is where it began and the last is where it stands, so those
 * two are marked; everything between is a step already passed.
 */
function Timeline({ events }: { events: ComplaintEvent[] }) {
  return (
    <ol className="mt-3">
      {events.map((event, index) => {
        const first = index === 0;
        const last = index === events.length - 1;
        const dot =
          last && !first ? "bg-brand" : first ? "bg-[#2e6cad]" : "bg-gray-300";

        return (
          <li
            key={`${event.date}-${event.time}-${event.label}`}
            className="flex gap-3"
          >
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
 * One complaint in full: what was reported, every step the property recorded,
 * and what they wrote back.
 *
 * Read-only throughout — a tenant raises a complaint and follows it; moving it
 * along and answering it are the property's, so there is no control here that
 * does either.
 */
export function ComplaintDetailModal({
  complaint,
  onClose,
}: {
  complaint: TenComplaint;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={complaint.id}
      subtitle={complaint.category}
    >
      <div className="max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-8">
        <p className="text-[16px] leading-relaxed text-ink">
          {complaint.description}
        </p>

        {complaint.attachments.length > 0 && (
          <section className="mt-6">
            <h3 className="text-[14px] font-bold text-ink">Evidence</h3>
            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {complaint.attachments.map((file) =>
                file.name.toLowerCase().endsWith(".pdf") ? (
                  <li key={file.id}>
                    <span className="flex h-[76px] w-full items-center justify-center rounded-lg border border-hairline bg-gray-50 px-2 text-center text-[11px] break-all text-gray-500">
                      {file.name}
                    </span>
                  </li>
                ) : (
                  <li key={file.id}>
                    {/* A local object URL, so a plain img is right here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-[76px] w-full rounded-lg border border-hairline object-cover"
                    />
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

        <section className="mt-6">
          <h3 className="text-[14px] font-bold text-ink">Timeline</h3>
          <Timeline events={complaint.timeline} />
        </section>

        {complaint.response && (
          <section className="mt-6">
            <h3 className="text-[14px] font-bold text-ink">
              Management Response
            </h3>
            <div className="mt-2 rounded-lg border border-hairline bg-gray-50/70 px-4 py-3">
              <p className="flex gap-2 text-[14px] leading-relaxed text-ink">
                <MessageSquare
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                />
                <span>{complaint.response}</span>
              </p>
              {complaint.respondedBy && (
                <p className="mt-2 pl-6 text-[13px] text-muted">
                  — {complaint.respondedBy}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
