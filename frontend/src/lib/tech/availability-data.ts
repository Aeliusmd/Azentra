/**
 * The technician's own weekly availability. Mock data — swap for a
 * `src/lib/api.ts` call when the backend lands.
 *
 * Dates are fixed strings rather than derived from the clock so the page renders
 * identically on the server and the client.
 */

export const DAY_STATUSES = ["Available", "Unavailable", "On Leave"] as const;
export type DayStatus = (typeof DAY_STATUSES)[number];

export const DAY_STATUS_DOT: Record<DayStatus, string> = {
  Available: "bg-[#22a35c]",
  Unavailable: "bg-[#e0554d]",
  "On Leave": "bg-[#e8a33d]",
};

export type AvailabilityDay = {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  status: DayStatus;
  /** 24h `HH:MM`; only meaningful while the day is Available. */
  start: string;
  end: string;
  /** Why the day is not workable, e.g. "Annual leave - family event". */
  note?: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2026-08-11" -> "Tue Aug 11 2026". */
export function dayLabel(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAYS[date.getDay()]} ${MONTHS[month - 1]} ${day} ${year}`;
}

/** The default shift a day falls back to. */
export const DEFAULT_SHIFT = { start: "08:00", end: "18:00" };

export const availabilityWeek: AvailabilityDay[] = [
  { date: "2026-08-11", status: "Available", ...DEFAULT_SHIFT },
  { date: "2026-08-12", status: "Available", ...DEFAULT_SHIFT },
  { date: "2026-08-13", status: "Available", ...DEFAULT_SHIFT },
  {
    date: "2026-08-14",
    status: "Unavailable",
    ...DEFAULT_SHIFT,
    note: "Scheduled training session",
  },
  { date: "2026-08-15", status: "Available", ...DEFAULT_SHIFT },
  { date: "2026-08-16", status: "Available", ...DEFAULT_SHIFT },
  {
    date: "2026-08-17",
    status: "On Leave",
    ...DEFAULT_SHIFT,
    note: "Annual leave - family event",
  },
];
