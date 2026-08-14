"use client";

import { Pill } from "@/components/pm/ui/pill";
import {
  eventsOn,
  fromIso,
  monthGrid,
  SHORT_MONTHS,
  TYPE_STYLE,
  WEEKDAYS,
  type CalendarEvent,
} from "@/lib/fs/calendar-data";
import { WO_PRIORITY_TONE } from "@/lib/fs/work-orders-data";

/* ------------------------------- Week view -------------------------------- */

function WeekCard({ event }: { event: CalendarEvent }) {
  const style = TYPE_STYLE[event.type];
  const Icon = style.icon;

  return (
    <li className={`rounded-lg border p-3 ${style.card}`}>
      <p className="flex items-start gap-2 text-[13px] font-semibold text-ink">
        <Icon
          aria-hidden="true"
          className={`mt-px h-3.5 w-3.5 shrink-0 ${style.iconColor}`}
        />
        <span className="min-w-0">{event.title}</span>
      </p>
      <p className="mt-1 pl-[22px] text-[12px] text-muted">
        {event.time}
        {event.technician ? ` · ${event.technician}` : ""}
      </p>
      {event.priority && (
        <span className="mt-1.5 inline-block pl-[22px]">
          <Pill tone={WO_PRIORITY_TONE[event.priority]}>{event.priority}</Pill>
        </span>
      )}
    </li>
  );
}

export function WeekView({
  days,
  today,
  events,
  onSelectDay,
}: {
  days: string[];
  today: string;
  events: CalendarEvent[];
  onSelectDay: (iso: string) => void;
}) {
  return (
    <div className="relative overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-5 divide-x divide-hairline">
        {days.map((iso) => {
          const date = fromIso(iso);
          const dayEvents = eventsOn(events, iso);
          const isToday = iso === today;

          return (
            <div key={iso} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelectDay(iso)}
                className={`w-full border-b border-hairline px-3 py-3.5 text-center text-[13px] font-semibold transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  isToday ? "text-brand" : "text-ink"
                }`}
              >
                {`${WEEKDAYS[date.getDay()]} ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`}
              </button>

              {dayEvents.length === 0 ? (
                <p className="px-3 py-6 text-center text-[13px] text-gray-300">
                  —
                </p>
              ) : (
                <ul className="space-y-2.5 p-3">
                  {dayEvents.map((event) => (
                    <WeekCard key={`${event.id}-${event.time}`} event={event} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Month view ------------------------------- */

/** How many chips fit in a month cell before it collapses into a count. */
const MONTH_PREVIEW = 3;

export function MonthView({
  year,
  month,
  today,
  events,
  onSelectDay,
}: {
  year: number;
  month: number;
  today: string;
  events: CalendarEvent[];
  onSelectDay: (iso: string) => void;
}) {
  const weeks = monthGrid(year, month);

  return (
    <div className="relative overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-7 border-b border-hairline">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-center text-[13px] font-semibold text-muted"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="divide-y divide-hairline">
          {weeks.map((week, index) => (
            <div key={index} className="grid grid-cols-7 divide-x divide-hairline">
              {week.map((iso, cell) => {
                if (!iso)
                  return <div key={`empty-${cell}`} className="min-h-[128px]" />;

                const dayEvents = eventsOn(events, iso);
                const isToday = iso === today;

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => onSelectDay(iso)}
                    className="min-h-[128px] p-2 text-left align-top transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none focus-visible:-outline-offset-2"
                  >
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[13px] ${
                        isToday
                          ? "bg-brand font-semibold text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {fromIso(iso).getDate()}
                    </span>

                    <span className="mt-1 block space-y-1">
                      {dayEvents.slice(0, MONTH_PREVIEW).map((event) => (
                        <span
                          key={`${event.id}-${event.time}`}
                          className={`block truncate rounded border px-1.5 py-1 text-[11px] text-ink ${TYPE_STYLE[event.type].card}`}
                        >
                          {event.time} {event.title}
                        </span>
                      ))}

                      {dayEvents.length > MONTH_PREVIEW && (
                        <span className="block px-1 pt-0.5 text-[11px] text-muted">
                          +{dayEvents.length - MONTH_PREVIEW} more
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Day view -------------------------------- */

export function DayView({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="px-6 py-16 text-center text-[15px] text-muted">
        Nothing is scheduled on this day.
      </p>
    );
  }

  return (
    <ul className="space-y-3 p-4 sm:p-5">
      {events.map((event) => {
        const style = TYPE_STYLE[event.type];
        const Icon = style.icon;

        return (
          <li
            key={`${event.id}-${event.time}`}
            className="flex items-center gap-4 rounded-lg border border-hairline px-4 py-3.5"
          >
            <span className="w-[68px] shrink-0 text-[13px] font-medium text-muted">
              {event.time}
            </span>

            <span
              aria-hidden="true"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${style.card}`}
            >
              <Icon className={`h-[18px] w-[18px] ${style.iconColor}`} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-ink">
                {event.title}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-muted">
                {[event.place, event.technician].filter(Boolean).join(" · ") ||
                  event.type}
              </span>
            </span>

            {event.priority && (
              <Pill tone={WO_PRIORITY_TONE[event.priority]}>
                {event.priority}
              </Pill>
            )}
          </li>
        );
      })}
    </ul>
  );
}
