"use client";

import { Modal } from "@/components/ui/modal";
import {
  KIND_STYLE,
  timeLabel,
  type ResCalendarEvent,
} from "@/lib/res/calendar-data";
import { longWeekdayDate } from "@/lib/res/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] text-ink">{value}</dd>
    </div>
  );
}

/**
 * One diary entry, read-only.
 *
 * Whatever it is really — a booking, a visit, a due date — it is changed where
 * it lives, so there is nothing to act on here.
 */
export function EventDetailsModal({
  event,
  onClose,
}: {
  event: ResCalendarEvent;
  onClose: () => void;
}) {
  const style = KIND_STYLE[event.kind];
  const Icon = style.icon;
  const time = timeLabel(event);

  return (
    <Modal open onClose={onClose} title="Event Details">
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${style.tile}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-ink">{event.title}</p>
            <p className="mt-0.5 text-[13px] text-muted">{style.short}</p>
          </div>
        </div>

        <dl className="mt-5">
          <Row label="Date" value={longWeekdayDate(event.date)} />
          {time && <Row label="Time" value={time} />}
          <Row label="Status" value={event.status} />
        </dl>
      </div>
    </Modal>
  );
}
