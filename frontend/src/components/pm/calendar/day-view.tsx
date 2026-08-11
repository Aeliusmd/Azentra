"use client";

import { Plus } from "lucide-react";

import {
  PRIORITY_TONE,
  SHORT_MONTHS,
  TYPE_ICON,
  WEEKDAYS,
} from "@/components/pm/calendar/calendar-parts";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  EVENT_SURFACE,
  fromIso,
  type CalendarEvent,
} from "@/lib/pm/calendar-data";

function longDate(iso: string) {
  const date = fromIso(iso);
  return `${WEEKDAYS[date.getDay()]} ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

export function DayView({
  date,
  events,
  onAddTask,
}: {
  date: string;
  events: CalendarEvent[];
  onAddTask: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[17px] font-semibold text-ink">{longDate(date)}</h2>
        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 text-[15px] text-muted">
          Nothing scheduled on this day.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {events.map((event) => {
            const Icon = TYPE_ICON[event.type];
            return (
              <li
                key={event.id}
                className={`flex gap-5 rounded-lg border p-4 ${EVENT_SURFACE[event.type]}`}
              >
                <span className="w-14 shrink-0 pt-0.5 text-[13px] font-bold text-ink">
                  {event.time}
                </span>

                <div className="min-w-0 flex-1 border-l border-black/5 pl-5">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-gray-500"
                    />
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="mt-1 text-[13px] text-muted">
                      {event.description}
                    </p>
                  )}

                  {(event.priority || event.status) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {event.priority && (
                        <Pill tone={PRIORITY_TONE[event.priority]}>
                          {event.priority}
                        </Pill>
                      )}
                      {event.status && (
                        <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink">
                          {event.status}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
