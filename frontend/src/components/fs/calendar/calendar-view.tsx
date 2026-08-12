"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { AddEventModal } from "@/components/fs/calendar/add-event-modal";
import {
  DayView,
  MonthView,
  WeekView,
} from "@/components/fs/calendar/calendar-views";
import { Card } from "@/components/ui/card";
import {
  buildEvents,
  EVENT_TYPES,
  eventsOn,
  fromIso,
  isoOf,
  longDate,
  MONTHS,
  shortDate,
  TYPE_STYLE,
  workWeekOf,
  type CalendarEventType,
} from "@/lib/fs/calendar-data";
import { useFsCalendarEvents } from "@/lib/fs/calendar-store";
import { TODAY } from "@/lib/fs/dashboard-data";
import { inspections } from "@/lib/fs/inspections-data";
import { preventiveTasks } from "@/lib/fs/preventive-data";
import { useFsSiteVisits } from "@/lib/fs/site-visits-store";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

const VIEWS = ["Day", "Week", "Month"] as const;
type View = (typeof VIEWS)[number];

/** Steps the cursor by one day, work week or month. */
function shift(view: View, cursor: string, delta: number) {
  const date = fromIso(cursor);

  if (view === "Month") date.setMonth(date.getMonth() + delta, 1);
  else if (view === "Week") date.setDate(date.getDate() + delta * 7);
  else date.setDate(date.getDate() + delta);

  return isoOf(date);
}

export function FsCalendarView() {
  const orders = useFsWorkOrders();
  const visits = useFsSiteVisits();
  const extras = useFsCalendarEvents();

  const [view, setView] = useState<View>("Week");
  /** The day the calendar is sitting on — drives every view. */
  const [cursor, setCursor] = useState(TODAY);
  const [addOpen, setAddOpen] = useState(false);
  /** Types switched off in the legend. */
  const [hidden, setHidden] = useState<CalendarEventType[]>([]);

  const events = useMemo(
    () =>
      buildEvents({
        orders,
        visits,
        inspections,
        preventive: preventiveTasks,
        extras,
      }).filter((event) => !hidden.includes(event.type)),
    [orders, visits, extras, hidden],
  );

  const days = useMemo(() => workWeekOf(cursor), [cursor]);
  const cursorDate = fromIso(cursor);

  const label =
    view === "Month"
      ? `${MONTHS[cursorDate.getMonth()]} ${cursorDate.getFullYear()}`
      : view === "Week"
        ? `${shortDate(days[0])} – ${shortDate(days[days.length - 1])}`
        : `${cursor === TODAY ? "Today - " : ""}${longDate(cursor).split(", ").slice(1).join(", ")}`;

  function toggleType(type: CalendarEventType) {
    setHidden((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  function selectDay(iso: string) {
    setCursor(iso);
    setView("Day");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Calendar
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage field operations schedule
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Calendar view"
            className="inline-flex rounded-lg border border-hairline bg-white p-1"
          >
            {VIEWS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                aria-pressed={view === option}
                className={`rounded-md px-5 py-2 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  view === option
                    ? "bg-brand text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Legend doubles as the type filter — a dimmed entry is switched off. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {EVENT_TYPES.map((type) => {
          const off = hidden.includes(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              aria-pressed={!off}
              className={`flex items-center gap-2 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                off ? "text-gray-300" : "text-gray-600 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${
                  off ? "bg-gray-200" : TYPE_STYLE[type].dot
                }`}
              />
              {type}
            </button>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-center gap-3 border-b border-hairline px-4 py-3.5">
          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, -1))}
            aria-label={`Previous ${view.toLowerCase()}`}
            className="rounded-lg border border-hairline p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setCursor(TODAY)}
            title="Jump to today"
            className="min-w-[220px] rounded-lg px-3 py-1 text-center text-[15px] font-bold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            {label}
          </button>

          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, 1))}
            aria-label={`Next ${view.toLowerCase()}`}
            className="rounded-lg border border-hairline p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {view === "Week" && (
          <WeekView
            days={days}
            today={TODAY}
            events={events}
            onSelectDay={selectDay}
          />
        )}

        {view === "Month" && (
          <MonthView
            year={cursorDate.getFullYear()}
            month={cursorDate.getMonth()}
            today={TODAY}
            events={events}
            onSelectDay={selectDay}
          />
        )}

        {view === "Day" && <DayView events={eventsOn(events, cursor)} />}
      </Card>

      {addOpen && (
        <AddEventModal date={cursor} onClose={() => setAddOpen(false)} />
      )}
    </div>
  );
}
