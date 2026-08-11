"use client";

import { MONTHS, WEEKDAYS } from "@/components/pm/calendar/calendar-parts";
import {
  EVENT_SURFACE,
  toIso,
  type CalendarEvent,
} from "@/lib/pm/calendar-data";

const MAX_CHIPS = 3;

/** Day numbers for a month, padded with nulls so day 1 lands on its weekday. */
function buildGrid(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function MonthView({
  year,
  month,
  today,
  selected,
  getEvents,
  onSelectDay,
}: {
  year: number;
  month: number;
  today: string;
  selected: string;
  getEvents: (iso: string) => CalendarEvent[];
  onSelectDay: (iso: string) => void;
}) {
  const cells = buildGrid(year, month);

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-white">
      <div className="grid grid-cols-7 border-b border-hairline">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[13px] font-semibold text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`pad-${index}`}
                className="min-h-[124px] border-r border-b border-hairline bg-gray-50/40 last:border-r-0"
              />
            );
          }

          const iso = toIso(year, month, day);
          const dayEvents = getEvents(iso);
          const isToday = iso === today;
          const isSelected = iso === selected;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDay(iso)}
              aria-label={`${day} ${MONTHS[month]} ${year} — ${dayEvents.length} events`}
              aria-pressed={isSelected}
              className={`flex min-h-[124px] flex-col items-start border-r border-b border-hairline p-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none focus-visible:-outline-offset-2 ${
                isToday ? "bg-brand/5" : "hover:bg-gray-50"
              } ${isSelected && !isToday ? "bg-gray-50" : ""}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[13px] ${
                  isToday
                    ? "bg-brand font-semibold text-white"
                    : "font-medium text-ink"
                }`}
              >
                {day}
              </span>

              <span className="mt-1.5 flex w-full min-w-0 flex-col gap-1">
                {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                  <span
                    key={event.id}
                    title={`${event.time} ${event.title}`}
                    className={`block truncate rounded border px-1.5 py-1 text-[11px] ${EVENT_SURFACE[event.type]}`}
                  >
                    <span className="font-semibold">{event.time}</span>{" "}
                    {event.title}
                  </span>
                ))}

                {dayEvents.length > MAX_CHIPS && (
                  <span className="px-1 text-[11px] text-muted">
                    +{dayEvents.length - MAX_CHIPS} more
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
