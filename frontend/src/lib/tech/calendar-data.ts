import type { PillTone } from "@/components/pm/ui/pill";
import { JOB_STATUS_TONE, jobLocation, type Job } from "@/lib/tech/jobs-data";
import {
  PM_STATUS_TONE,
  type PreventiveTask,
} from "@/lib/tech/preventive-data";

/**
 * Everything on the technician's calendar: their assigned jobs, their preventive
 * tasks, and any task they add themselves. Derived rather than stored, so the
 * calendar always agrees with My Work and Preventive.
 */

export const TASK_TYPES = [
  "Job",
  "Emergency",
  "Preventive",
  "Personal",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

/** Surface per event kind — emergencies read red, preventive green. */
export const EVENT_SURFACE: Record<TaskType, string> = {
  Job: "border-slate-200 bg-slate-50",
  Emergency: "border-rose-200 bg-rose-50",
  Preventive: "border-green-200 bg-green-50",
  Personal: "border-amber-200 bg-amber-50",
};

export const EVENT_TITLE: Record<TaskType, string> = {
  Job: "text-ink",
  Emergency: "text-rose-700",
  Preventive: "text-ink",
  Personal: "text-ink",
};

export type TechEvent = {
  id: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 24h `HH:MM`. */
  time: string;
  title: string;
  location: string;
  type: TaskType;
  status?: string;
  statusTone?: PillTone;
};

/** Task the technician added to their own calendar. */
export type CalendarTask = {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  type: TaskType;
  description?: string;
};

/** "10:30 AM" -> "10:30". */
export function to24h(display: string) {
  const [clock, meridiem] = display.split(" ");
  if (!meridiem) return clock;

  const [hours, minutes] = clock.split(":").map(Number);
  const hour = meridiem.toUpperCase() === "PM" ? (hours % 12) + 12 : hours % 12;
  return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

const byTime = (a: TechEvent, b: TechEvent) => a.time.localeCompare(b.time);

/** Folds jobs, preventive tasks and personal entries into one event list. */
export function buildEvents(
  jobs: Job[],
  tasks: PreventiveTask[],
  added: CalendarTask[],
): TechEvent[] {
  const fromJobs: TechEvent[] = jobs
    .filter((job) => job.status !== "Completed")
    .map((job) => ({
      id: job.id,
      date: job.date,
      time: to24h(job.time),
      title: job.title,
      location: jobLocation(job),
      type: job.priority === "Emergency" ? "Emergency" : "Job",
      status: job.status,
      statusTone: JOB_STATUS_TONE[job.status],
    }));

  const fromTasks: TechEvent[] = tasks
    .filter((task) => task.status !== "Completed")
    .map((task) => ({
      id: task.id,
      date: task.nextService,
      time: task.time,
      title: task.asset,
      location: task.location,
      type: "Preventive",
      status: task.status,
      statusTone: PM_STATUS_TONE[task.status],
    }));

  const fromAdded: TechEvent[] = added.map((task) => ({
    id: task.id,
    date: task.date,
    time: task.time,
    title: task.title,
    location: task.location,
    type: task.type,
    status: "Planned",
    statusTone: "slate",
  }));

  return [...fromJobs, ...fromTasks, ...fromAdded].sort(byTime);
}

export const eventsOn = (events: TechEvent[], date: string) =>
  events.filter((event) => event.date === date);

/* ------------------------------ Date helpers ------------------------------ */

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

/** `YYYY-MM-DD` for a year/month/day triple, without touching the clock. */
export function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Parses `YYYY-MM-DD` into a local Date at midnight. */
export function fromIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The seven ISO dates of the week (Sun–Sat) containing `iso`. */
export function weekOf(iso: string) {
  const date = fromIso(iso);
  date.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date);
    day.setDate(date.getDate() + index);
    return toIso(day.getFullYear(), day.getMonth(), day.getDate());
  });
}

/** Day numbers for a month, padded with nulls so day 1 lands on its weekday. */
export function monthGrid(year: number, month: number) {
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

/** "2026-08-11" -> "Tue Aug 11 2026". */
export function longDate(iso: string) {
  const date = fromIso(iso);
  return `${WEEKDAYS[date.getDay()]} ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}
