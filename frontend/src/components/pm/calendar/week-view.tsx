"use client";

import { TYPE_ICON, WEEKDAYS } from "@/components/pm/calendar/calendar-parts";
import {
  EVENT_SURFACE,
  fromIso,
  type CalendarEvent,
} from "@/lib/pm/calendar-data";

export function WeekView({
  days,
  today,
  getEvents,
  onSelectDay,
}: {
  /** Seven ISO dates, Sunday first. */
  days: string[];
  today: string;
  getEvents: (iso: string) => CalendarEvent[];
  onSelectDay: (iso: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-white">
      <div className="grid grid-cols-7 border-b border-hairline">
        {days.map((iso, index) => {
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDay(iso)}
              className={`border-r border-hairline py-3 text-center transition-colors last:border-r-0 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none ${
                isToday ? "bg-brand/5" : ""
              }`}
            >
              <span className="block text-[13px] font-semibold text-muted">
                {WEEKDAYS[index]}
              </span>
              <span
                className={`mt-1 block text-[17px] font-bold ${isToday ? "text-brand" : "text-ink"}`}
              >
                {fromIso(iso).getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-7">
        {days.map((iso) => {
          const dayEvents = getEvents(iso);

          return (
            <div
              key={iso}
              className={`min-h-[320px] space-y-3 border-r border-hairline p-3 last:border-r-0 ${
                iso === today ? "bg-brand/5" : ""
              }`}
            >
              {dayEvents.map((event) => {
                const Icon = TYPE_ICON[event.type];
                return (
                  <article
                    key={event.id}
                    className={`rounded-lg border p-3 ${EVENT_SURFACE[event.type]}`}
                  >
                    <h3 className="flex items-start gap-1.5 text-[13px] leading-snug font-semibold text-ink">
                      <Icon
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500"
                      />
                      {event.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] text-muted">
                      {event.time}
                    </p>
                    {event.status && (
                      <p className="mt-2 inline-flex rounded bg-white/70 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                        {event.status}
                      </p>
                    )}
                  </article>
                );
              })}

              {dayEvents.length === 0 && (
                <p className="text-[12px] text-gray-400">—</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
