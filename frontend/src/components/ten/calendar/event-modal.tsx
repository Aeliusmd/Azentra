"use client";

import { Modal } from "@/components/ui/modal";
import { clockTime } from "@/lib/res/format";
import type { TenCalendarEvent } from "@/lib/ten/calendar-data";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] font-bold text-ink">{value}</dd>
    </div>
  );
}

/**
 * One diary entry.
 *
 * Read-only: every field here belongs to a record kept somewhere else — a
 * request, a booking, a pass, a bill — and this dialog reports it rather than
 * editing it.
 */
export function EventModal({
  event,
  onClose,
}: {
  event: TenCalendarEvent;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={event.title}>
      <div className="px-5 py-4 sm:px-8 sm:py-5">
        <dl>
          <Row label="Date" value={event.date} />
          <Row
            label="Time"
            value={event.time ? clockTime(event.time) : "All Day"}
          />
          <Row label="Type" value={event.type} />
          <Row label="Status" value={event.status} />
        </dl>
      </div>
    </Modal>
  );
}
