/**
 * Formatting for the Resident portal.
 *
 * Deliberately plainer than the staff portals: a resident reads one bill and
 * one due date, not a ledger, so nothing here abbreviates to `4250K` or trims a
 * month to three letters. Full words, full dates.
 */

const GROUPED = new Intl.NumberFormat("en-US");

/** `1250` → `1,250` — counts and areas, which carry no currency. */
export function grouped(value: number) {
  return GROUPED.format(Math.round(value));
}

/** `29300` → `LKR 29,300`. */
export function lkr(amount: number) {
  return `LKR ${GROUPED.format(Math.round(amount))}`;
}

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

/** Local midnight — never `new Date(iso)`, which reads the string as UTC. */
export function fromIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** `2026-08-31` → `August 31, 2026`. */
export function longDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** `2026-08-31` → `Aug 31`. */
export function shortDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  return `${SHORT_MONTHS[month - 1]} ${day}`;
}

/** `07:00` → `7:00 AM`, in the 12-hour form a resident reads off a booking. */
export function clockTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** `21:30` → `09:30 PM` — the padded form a timeline stamp reads in. */
export function clockPadded(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(twelve).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** `07:00`, `09:00` → `7:00 AM - 9:00 AM`. */
export function timeRange(from: string, to: string) {
  return `${clockTime(from)} - ${clockTime(to)}`;
}

/** `2024-03` → `March 2024`, for "Owned since". */
export function monthAndYear(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** Whole days from `TODAY` to an ISO date; negative once it has passed. */
export function daysBetween(from: string, to: string) {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000,
  );
}

/** `06:00` → `6 AM`; keeps the minutes only when there are any. */
export function clockShort(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0
    ? `${twelve} ${suffix}`
    : `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** `06:00`, `21:00` → `6 AM - 9 PM`, the form opening hours are quoted in. */
export function timeRangeShort(from: string, to: string) {
  return `${clockShort(from)} - ${clockShort(to)}`;
}

/** Minutes since midnight, for comparing two `HH:MM` values. */
export function minutesOf(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

/** `Maria Rodriguez` → `MR`, for the avatar beside a name. */
export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LONG_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** `2026-08-13` → `Thu, Aug 13`. */
export function weekdayShort(iso: string) {
  const date = fromIso(iso);
  return `${WEEKDAYS[date.getDay()]}, ${shortDate(iso)}`;
}

/** `2026-08-13` → `Thursday, August 13, 2026`. */
export function longWeekdayDate(iso: string) {
  const date = fromIso(iso);
  return `${LONG_WEEKDAYS[date.getDay()]}, ${longDate(iso)}`;
}
