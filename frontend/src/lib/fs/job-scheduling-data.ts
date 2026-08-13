import { TODAY } from "@/lib/fs/dashboard-data";
import {
  minutesOf,
  sourceOf,
  type FsWorkOrder,
  type FsWorkType,
} from "@/lib/fs/work-orders-data";

/**
 * The scheduling board's own read of a work order: what kind of job it is, and
 * whether it falls in the window the supervisor is looking at.
 *
 * Nothing is stored here — a booked job *is* a work order with a slot, so the
 * board and the work-order list stay the same record: scheduling from this page
 * and rescheduling from the detail dialog move the one row.
 */

export const JOB_TYPES = [
  "Direct",
  "Maintenance Request",
  "Planned Work",
] as const;
export type FsJobType = (typeof JOB_TYPES)[number];

/** Work types that mean planned servicing rather than a one-off fix. */
const PLANNED_TYPES: FsWorkType[] = ["Preventive", "Inspection"];

/** How the job reached the schedule — stated on the job, or read off its source. */
export function jobTypeOf(order: FsWorkOrder): FsJobType {
  if (order.workType && PLANNED_TYPES.includes(order.workType))
    return "Planned Work";

  const source = sourceOf(order);
  if (source === "Preventive Schedule" || source === "Inspection Finding")
    return "Planned Work";
  if (source === "Maintenance Request") return "Maintenance Request";

  return "Direct";
}

/**
 * The window the board is looking at. `Upcoming` leads because a schedule is
 * read forwards — work already behind the supervisor lives on the work-order
 * list, and only `All` brings it back.
 */
export const SCHEDULE_RANGES = [
  "Upcoming",
  "Today",
  "Next 7 Days",
  "Unscheduled",
  "All",
] as const;
export type FsScheduleRange = (typeof SCHEDULE_RANGES)[number];

const DAY_MS = 86_400_000;

/** Whole days from today to an ISO date; negative once the date has passed. */
export function daysFromToday(date: string) {
  return Math.round((Date.parse(date) - Date.parse(TODAY)) / DAY_MS);
}

export function inRange(order: FsWorkOrder, range: FsScheduleRange) {
  if (range === "All") return true;
  if (range === "Unscheduled") return order.scheduledDate === null;
  if (!order.scheduledDate) return false;
  if (range === "Today") return order.scheduledDate === TODAY;

  const days = daysFromToday(order.scheduledDate);
  return range === "Upcoming" ? days >= 0 : days >= 0 && days <= 7;
}

/** Earliest slot first; jobs still waiting for one sit at the end of the list. */
export function bySlot(a: FsWorkOrder, b: FsWorkOrder) {
  return (
    (a.scheduledDate ?? "9999-99-99").localeCompare(
      b.scheduledDate ?? "9999-99-99",
    ) || minutesOf(a.scheduledTime) - minutesOf(b.scheduledTime)
  );
}
