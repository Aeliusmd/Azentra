import {
  CalendarCheck,
  ListChecks,
  Megaphone,
  ScanSearch,
  StickyNote,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { PillTone } from "@/components/pm/ui/pill";
import {
  EVENT_COLOR,
  EVENT_TYPES,
  EVENT_TYPE_LABEL,
  type EventType,
  type Priority,
} from "@/lib/pm/calendar-data";

export const TYPE_ICON: Record<EventType, LucideIcon> = {
  Maintenance: Wrench,
  Inspection: ScanSearch,
  Booking: CalendarCheck,
  Announcement: Megaphone,
  Task: ListChecks,
  Note: StickyNote,
};

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
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
export const SHORT_MONTHS = MONTHS.map((month) => month.slice(0, 3));

export const PRIORITY_TONE: Record<Priority, PillTone> = {
  Low: "slate",
  Medium: "amber",
  High: "red",
};

/** Legend across the top of every view. Tasks get a diamond, not a dot. */
export function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {EVENT_TYPES.map((type) => (
        <li key={type} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 ${type === "Task" ? "rotate-45 rounded-[2px]" : "rounded-full"}`}
            style={{ background: EVENT_COLOR[type] }}
          />
          <span className="text-[13px] text-ink">{EVENT_TYPE_LABEL[type]}</span>
        </li>
      ))}
    </ul>
  );
}

/** Day / Week / Month switch. */
export const VIEWS = ["Day", "Week", "Month"] as const;
export type CalendarViewMode = (typeof VIEWS)[number];

export function ViewSwitch({
  value,
  onChange,
}: {
  value: CalendarViewMode;
  onChange: (view: CalendarViewMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Calendar view"
      className="inline-flex rounded-lg bg-gray-100 p-1"
    >
      {VIEWS.map((view) => {
        const active = view === value;
        return (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(view)}
            className={`rounded-md px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none ${
              active
                ? "bg-white text-brand shadow-[0_1px_2px_rgba(16,24,40,0.08)] ring-1 ring-brand/40"
                : "text-muted hover:text-ink"
            }`}
          >
            {view}
          </button>
        );
      })}
    </div>
  );
}
