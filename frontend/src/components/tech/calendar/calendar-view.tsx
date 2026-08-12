"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { AddTaskModal } from "@/components/tech/calendar/add-task-modal";
import {
  DayView,
  MonthView,
  WeekView,
} from "@/components/tech/calendar/calendar-views";
import { SegmentedFilter } from "@/components/tech/ui/segmented-filter";
import {
  MONTHS,
  SHORT_MONTHS,
  buildEvents,
  eventsOn,
  fromIso,
  toIso,
  weekOf,
} from "@/lib/tech/calendar-data";
import { addCalendarTask, useCalendarTasks } from "@/lib/tech/calendar-store";
import { TODAY } from "@/lib/tech/dashboard-data";
import { useTechJobs } from "@/lib/tech/jobs-store";
import { usePreventiveTasks } from "@/lib/tech/preventive-store";
import { showToast } from "@/lib/tech/toast-store";

const VIEWS = ["day", "week", "month"] as const;
type View = (typeof VIEWS)[number];

/** Steps the cursor by one day, week or month. */
function shift(view: View, cursor: string, delta: number) {
  const date = fromIso(cursor);

  if (view === "month") date.setMonth(date.getMonth() + delta, 1);
  else if (view === "week") date.setDate(date.getDate() + delta * 7);
  else date.setDate(date.getDate() + delta);

  return toIso(date.getFullYear(), date.getMonth(), date.getDate());
}

export function TechCalendarView() {
  const jobs = useTechJobs();
  const tasks = usePreventiveTasks();
  const added = useCalendarTasks();

  const [view, setView] = useState<View>("week");
  /** The day the calendar is sitting on — drives every view. */
  const [cursor, setCursor] = useState(TODAY);
  const [addOpen, setAddOpen] = useState(false);

  const events = useMemo(
    () => buildEvents(jobs, tasks, added),
    [jobs, tasks, added],
  );
  const days = useMemo(() => weekOf(cursor), [cursor]);
  const cursorDate = fromIso(cursor);

  const label =
    view === "day"
      ? `${SHORT_MONTHS[cursorDate.getMonth()]} ${cursorDate.getDate()}, ${cursorDate.getFullYear()}`
      : `${MONTHS[cursorDate.getMonth()]} ${cursorDate.getFullYear()}`;

  function selectDay(iso: string) {
    setCursor(iso);
    setView("day");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Calendar</h1>
          <p className="mt-1 text-[13px] text-muted">
            Your scheduled work and maintenance tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add Task
          </button>

          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, -1))}
            aria-label={`Previous ${view}`}
            className="rounded-lg border border-hairline p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setCursor(TODAY)}
            title="Jump to today"
            className="min-w-[140px] rounded-lg px-2 py-2 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            {label}
          </button>

          <button
            type="button"
            onClick={() => setCursor(shift(view, cursor, 1))}
            aria-label={`Next ${view}`}
            className="rounded-lg border border-hairline p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <SegmentedFilter
        label="Calendar view"
        options={VIEWS}
        value={view}
        onChange={(value) => setView(value as View)}
      />

      {view === "week" && (
        <WeekView
          days={days}
          today={TODAY}
          events={events}
          onSelectDay={selectDay}
        />
      )}

      {view === "month" && (
        <MonthView
          year={cursorDate.getFullYear()}
          month={cursorDate.getMonth()}
          today={TODAY}
          events={events}
          onSelectDay={selectDay}
        />
      )}

      {view === "day" && (
        <DayView
          date={cursor}
          events={eventsOn(events, cursor)}
          onAddTask={() => setAddOpen(true)}
        />
      )}

      {addOpen && (
        <AddTaskModal
          date={cursor}
          onClose={() => setAddOpen(false)}
          onSubmit={(task) => {
            addCalendarTask(task);
            showToast("Task added");
            setCursor(task.date);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}
