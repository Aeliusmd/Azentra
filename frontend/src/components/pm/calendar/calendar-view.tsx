"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  EVENT_COLOR,
  EVENT_TYPES,
  TODAY,
  eventsOn,
  toIso,
} from "@/lib/pm/calendar-data";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const [START_YEAR, START_MONTH] = [
  Number(TODAY.slice(0, 4)),
  Number(TODAY.slice(5, 7)) - 1,
];

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

export function CalendarView() {
  const [year, setYear] = useState(START_YEAR);
  const [month, setMonth] = useState(START_MONTH);
  const [selected, setSelected] = useState(TODAY);

  const cells = useMemo(() => buildGrid(year, month), [year, month]);
  const selectedEvents = eventsOn(selected);

  function step(delta: number) {
    const next = month + delta;
    if (next < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (next > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(next);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">Calendar</h1>
        <p className="mt-1 text-[15px] text-muted">
          Maintenance, inspections, bookings, and property events
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-semibold text-ink">
              {MONTHS[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous month"
                className="rounded-md border border-hairline p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setYear(START_YEAR);
                  setMonth(START_MONTH);
                  setSelected(TODAY);
                }}
                className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next month"
                className="rounded-md border border-hairline p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="pb-2 text-center text-xs font-semibold tracking-wide text-gray-400 uppercase"
              >
                {day}
              </div>
            ))}

            {cells.map((day, index) => {
              if (day === null) {
                return <div key={`pad-${index}`} className="aspect-square" />;
              }

              const iso = toIso(year, month, day);
              const dayEvents = eventsOn(iso);
              const isSelected = iso === selected;

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  aria-pressed={isSelected}
                  aria-label={`${day} ${MONTHS[month]} — ${dayEvents.length} events`}
                  className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg text-[15px] transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none ${
                    isSelected
                      ? "bg-brand font-semibold text-white"
                      : "text-ink hover:bg-gray-50"
                  }`}
                >
                  {day}

                  <span className="flex h-1.5 items-center gap-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: isSelected
                            ? "#ffffff"
                            : EVENT_COLOR[event.type],
                        }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[17px] font-semibold text-ink">{selected}</h2>

          {selectedEvents.length === 0 ? (
            <p className="mt-4 text-[15px] text-muted">
              No events scheduled on this day.
            </p>
          ) : (
            <ul className="mt-4 space-y-5">
              {selectedEvents.map((event) => (
                <li key={event.id} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: EVENT_COLOR[event.type] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-gray-500">
                      {event.time}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold text-ink">
                      {event.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {event.type}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 border-t border-hairline pt-5">
            <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Event Types
            </h3>
            <ul className="mt-3 space-y-2.5">
              {EVENT_TYPES.map((type) => (
                <li key={type} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: EVENT_COLOR[type] }}
                  />
                  <span className="text-[15px] text-ink">{type}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
