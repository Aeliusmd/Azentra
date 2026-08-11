"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { AddTaskModal } from "@/components/pm/calendar/add-task-modal";
import {
  Legend,
  MONTHS,
  SHORT_MONTHS,
  ViewSwitch,
  type CalendarViewMode,
} from "@/components/pm/calendar/calendar-parts";
import { DayView } from "@/components/pm/calendar/day-view";
import { MonthView } from "@/components/pm/calendar/month-view";
import { WeekView } from "@/components/pm/calendar/week-view";
import {
  TODAY,
  eventsOn,
  fromIso,
  toIso,
  weekOf,
  type CalendarEvent,
} from "@/lib/pm/calendar-data";

/** Label above the month/week/day arrows. */
function periodLabel(view: CalendarViewMode, cursor: string, days: string[]) {
  const date = fromIso(cursor);

  if (view === "Month")
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  if (view === "Day") {
    return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  const [first, last] = [fromIso(days[0]), fromIso(days[6])];
  const start = `${SHORT_MONTHS[first.getMonth()]} ${first.getDate()}`;
  const end =
    first.getMonth() === last.getMonth()
      ? `${last.getDate()}`
      : `${SHORT_MONTHS[last.getMonth()]} ${last.getDate()}`;

  return `${start} - ${end}, ${last.getFullYear()}`;
}

/** Steps the cursor by one month, week or day. */
function shift(view: CalendarViewMode, cursor: string, delta: number) {
  const date = fromIso(cursor);

  if (view === "Month") date.setMonth(date.getMonth() + delta, 1);
  else if (view === "Week") date.setDate(date.getDate() + delta * 7);
  else date.setDate(date.getDate() + delta);

  return toIso(date.getFullYear(), date.getMonth(), date.getDate());
}

export function CalendarView() {
  const [view, setView] = useState<CalendarViewMode>("Month");
  /** The day the calendar is sitting on — drives every view. */
  const [cursor, setCursor] = useState(TODAY);
  const [addOpen, setAddOpen] = useState(false);
  /** Tasks added in this session, kept alongside the mock events. */
  const [added, setAdded] = useState<CalendarEvent[]>([]);

  const days = useMemo(() => weekOf(cursor), [cursor]);
  const getEvents = useMemo(
    () => (iso: string) => eventsOn(iso, added),
    [added],
  );

  const cursorDate = fromIso(cursor);

  function selectDay(iso: string) {
    setCursor(iso);
    setView("Day");
  }

  function addTask(task: Omit<CalendarEvent, "id">) {
    setAdded((current) => [
      ...current,
      { ...task, id: `local-${current.length + 1}` },
    ]);
    setCursor(task.date);
    setAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Calendar
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Scheduled maintenance, inspections, bookings, and your tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
            Add Task
          </button>

          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, -1))}
            aria-label={`Previous ${view.toLowerCase()}`}
            className="rounded-lg border border-hairline p-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setCursor(TODAY)}
            title="Jump to today"
            className="min-w-[150px] rounded-lg px-2 py-2 text-center text-[17px] font-bold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            {periodLabel(view, cursor, days)}
          </button>

          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, 1))}
            aria-label={`Next ${view.toLowerCase()}`}
            className="rounded-lg border border-hairline p-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ViewSwitch value={view} onChange={setView} />
        <Legend />
      </div>

      {view === "Month" && (
        <MonthView
          year={cursorDate.getFullYear()}
          month={cursorDate.getMonth()}
          today={TODAY}
          selected={cursor}
          getEvents={getEvents}
          onSelectDay={selectDay}
        />
      )}

      {view === "Week" && (
        <WeekView
          days={days}
          today={TODAY}
          getEvents={getEvents}
          onSelectDay={selectDay}
        />
      )}

      {view === "Day" && (
        <DayView
          date={cursor}
          events={getEvents(cursor)}
          onAddTask={() => setAddOpen(true)}
        />
      )}

      {addOpen && (
        <AddTaskModal
          date={cursor}
          onClose={() => setAddOpen(false)}
          onSubmit={addTask}
        />
      )}
    </div>
  );
}
