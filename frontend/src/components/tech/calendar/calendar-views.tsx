"use client";

import { Plus } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  EVENT_SURFACE,
  EVENT_TITLE,
  WEEKDAYS,
  eventsOn,
  fromIso,
  longDate,
  monthGrid,
  toIso,
  type TechEvent,
} from "@/lib/tech/calendar-data";

/* ---------------------------------- Week ---------------------------------- */

export function WeekView({
  days,
  today,
  events,
  onSelectDay,
}: {
  /** Seven ISO dates, Sunday first. */
  days: string[];
  today: string;
  events: TechEvent[];
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
          const dayEvents = eventsOn(events, iso);
          const isToday = iso === today;

          return (
            <li key={iso} className={isToday ? "bg-gray-50/60" : ""}>
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
                    ? "No events"
                    : `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`}
                </span>
              </button>

              {dayEvents.length > 0 && (
                <div className="space-y-2.5 px-4 pt-2 pb-4">
                  {dayEvents.map((event) => (
                    <WeekEventCard key={event.id} event={event} />
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
                    isToday ? "bg-gray-50" : ""
                  }`}
                >
                  <span className="block text-[13px] text-muted">
                    {WEEKDAYS[index]}
                  </span>
                  <span
                    className={`mt-0.5 block text-[17px] font-bold ${isToday ? "text-brand" : "text-ink"}`}
                  >
                    {fromIso(iso).getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-7">
            {days.map((iso) => {
              const dayEvents = eventsOn(events, iso);

              return (
                <div
                  key={iso}
                  className={`min-h-[340px] space-y-3 border-r border-hairline p-3 last:border-r-0 ${
                    iso === today ? "bg-gray-50/60" : ""
                  }`}
                >
                  {dayEvents.length === 0 ? (
                    <p className="pt-6 text-center text-[13px] text-gray-400">
                      No events
                    </p>
                  ) : (
                    dayEvents.map((event) => (
                      <WeekEventCard key={event.id} event={event} />
                    ))
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

function WeekEventCard({ event }: { event: TechEvent }) {
  return (
    <article
      className={`rounded-lg border p-2.5 ${EVENT_SURFACE[event.type]}`}
    >
      <h3
        className={`text-[13px] leading-snug font-semibold ${EVENT_TITLE[event.type]}`}
      >
        {event.title}
      </h3>
      <p className="mt-1 text-[12px] leading-snug text-muted">
        {event.time} | {event.location}
      </p>
      {event.status && (
        <p className="mt-2">
          <Pill tone={event.statusTone}>{event.status}</Pill>
        </p>
      )}
    </article>
  );
}

/* ---------------------------------- Month --------------------------------- */

const MAX_CHIPS = 2;

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
  events: TechEvent[];
  onSelectDay: (iso: string) => void;
}) {
  const cells = monthGrid(year, month);

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-white">
      <div className="grid grid-cols-7 border-b border-hairline">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-3 text-center text-[13px] text-muted">
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
                className="min-h-[104px] border-r border-b border-hairline last:border-r-0"
              />
            );
          }

          const iso = toIso(year, month, day);
          const dayEvents = eventsOn(events, iso);
          const isToday = iso === today;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDay(iso)}
              aria-label={`${iso} — ${dayEvents.length} events`}
              className={`flex min-h-[104px] flex-col items-start border-r border-b border-hairline p-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none focus-visible:-outline-offset-2 ${
                isToday ? "bg-gray-50" : "hover:bg-gray-50/70"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[13px] ${
                  isToday
                    ? "bg-[#2e6cad] font-semibold text-white"
                    : "text-muted"
                }`}
              >
                {day}
              </span>

              <span className="mt-1 flex w-full min-w-0 flex-col gap-1">
                {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                  <span
                    key={event.id}
                    title={`${event.time} ${event.title}`}
                    className={`block truncate rounded border px-1.5 py-0.5 text-[11px] ${EVENT_SURFACE[event.type]} ${EVENT_TITLE[event.type]}`}
                  >
                    {event.time} {event.title}
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

/* ----------------------------------- Day ---------------------------------- */

export function DayView({
  date,
  events,
  onAddTask,
}: {
  date: string;
  events: TechEvent[];
  onAddTask: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[15px] font-bold text-ink">{longDate(date)}</h2>
        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {events.length === 0 ? (
        <p className="py-12 text-center text-[15px] text-muted">
          Nothing scheduled on this day.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className={`flex gap-5 rounded-lg border p-4 ${EVENT_SURFACE[event.type]}`}
            >
              <span className="w-12 shrink-0 pt-0.5 text-[13px] font-semibold text-ink">
                {event.time}
              </span>

              <div className="min-w-0 flex-1">
                <h3
                  className={`text-[15px] font-bold ${EVENT_TITLE[event.type]}`}
                >
                  {event.title}
                </h3>
                <p className="mt-0.5 text-[13px] text-muted">
                  {event.location}
                </p>
                {event.status && (
                  <p className="mt-2">
                    <Pill tone={event.statusTone}>{event.status}</Pill>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
