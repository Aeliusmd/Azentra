"use client";

import { lkrK } from "@/lib/acc/money";
import {
  CALENDAR_STYLE,
  eventsOn,
  fromIso,
  monthGrid,
  weekdayDate,
  WEEKDAYS,
  type AccCalendarEvent,
} from "@/lib/acc/calendar-data";

/* ------------------------------- Month view ------------------------------- */

/** How many chips fit in a cell before the rest collapse into a count. */
const CELL_PREVIEW = 3;

export function AccMonthView({
  year,
  month,
  today,
  events,
}: {
  year: number;
  month: number;
  today: string;
  events: AccCalendarEvent[];
}) {
  const weeks = monthGrid(year, month);

  return (
    // Seven readable columns need the width; below that the grid scrolls
    // rather than crushing a day's chips into an unreadable sliver.
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-hairline">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-center text-[13px] font-medium text-muted"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="divide-y divide-hairline">
          {weeks.map((week, index) => (
            <div
              key={index}
              className="grid grid-cols-7 divide-x divide-hairline"
            >
              {week.map((iso, cell) => {
                if (!iso) {
                  return <div key={`pad-${cell}`} className="min-h-[92px]" />;
                }

                const dayEvents = eventsOn(events, iso);

                return (
                  <div key={iso} className="min-h-[92px] p-2 align-top">
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[13px] ${
                        iso === today
                          ? "bg-[#1b3a5c] font-semibold text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {fromIso(iso).getDate()}
                    </span>

                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, CELL_PREVIEW).map((event) => (
                        <p
                          key={event.id}
                          title={event.title}
                          className={`truncate rounded border px-1.5 py-0.5 text-[11px] ${CALENDAR_STYLE[event.kind].bar}`}
                        >
                          {event.title}
                        </p>
                      ))}

                      {dayEvents.length > CELL_PREVIEW && (
                        <p className="px-1 text-[11px] text-muted">
                          +{dayEvents.length - CELL_PREVIEW} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Schedule view ----------------------------- */

/**
 * The same events read as a list — the form that survives a phone, and the only
 * one that can show a standing charge falling in the month after this one.
 */
export function AccScheduleView({ events }: { events: AccCalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="px-6 py-16 text-center text-[15px] text-muted">
        Nothing is scheduled from this month onwards.
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-5">
      <p className="px-1 pb-3 text-[13px] text-muted">
        Week view — browse days for event details
      </p>

      <ul className="divide-y divide-hairline">
        {events.map((event) => {
          const style = CALENDAR_STYLE[event.kind];
          const Icon = style.icon;

          return (
            <li
              key={event.id}
              className="flex items-start gap-3 py-3.5 sm:items-center sm:gap-4"
            >
              <Icon
                aria-hidden="true"
                className={`mt-0.5 h-[18px] w-[18px] shrink-0 sm:mt-0 ${style.iconColor}`}
              />

              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">
                  {event.title}
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  {weekdayDate(event.date)}
                </p>
              </div>

              {event.amount !== undefined && (
                <p className="shrink-0 text-[14px] font-medium text-ink">
                  {lkrK(event.amount)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
