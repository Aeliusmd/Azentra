"use client";

import { TYPE_ICON, WEEKDAYS } from "@/components/pm/calendar/calendar-parts";
import {
  EVENT_SURFACE,
  fromIso,
  type CalendarEvent,
} from "@/lib/pm/calendar-data";

function EventCard({ event }: { event: CalendarEvent }) {
  const Icon = TYPE_ICON[event.type];

  return (
    <article className={`rounded-lg border p-3 ${EVENT_SURFACE[event.type]}`}>
      <h3 className="flex items-start gap-1.5 text-[13px] leading-snug font-semibold text-ink">
        <Icon
          aria-hidden="true"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500"
        />
        {event.title}
      </h3>
      <p className="mt-1.5 text-[12px] text-muted">{event.time}</p>
      {event.status && (
        <p className="mt-2 inline-flex rounded bg-white/70 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
          {event.status}
        </p>
      )}
    </article>
  );
}

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
      {/*
        Seven columns across a phone leaves about 50px each, which the event
        cards spill straight out of. Below `md` the week is read as a list of
        days instead; the grid takes over once there is room for it.
      */}
      <ul className="divide-y divide-hairline md:hidden">
        {days.map((iso, index) => {
          const dayEvents = getEvents(iso);
          const isToday = iso === today;

          return (
            <li key={iso} className={isToday ? "bg-brand/5" : ""}>
              <button
                type="button"
                onClick={() => onSelectDay(iso)}
                className="flex w-full items-baseline gap-2 px-4 pt-3.5 pb-1 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
              >
                <span
                  className={`text-[15px] font-bold ${isToday ? "text-brand" : "text-ink"}`}
                >
                  {WEEKDAYS[index]} {fromIso(iso).getDate()}
                </span>
                <span className="ml-auto text-[13px] text-muted">
                  {dayEvents.length === 0
                    ? "Nothing scheduled"
                    : `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`}
                </span>
              </button>

              {dayEvents.length > 0 && (
                <div className="space-y-2.5 px-4 pt-2 pb-4">
                  {dayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[840px]">
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
                  {dayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}

                  {dayEvents.length === 0 && (
                    <p className="text-[12px] text-gray-400">—</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
