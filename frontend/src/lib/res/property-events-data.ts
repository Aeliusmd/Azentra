/**
 * Things the property has told everybody about — a shutdown, a meeting.
 *
 * Not the resident's own diary, but they land in it: a gym closed for
 * resurfacing is exactly the sort of thing worth seeing before walking down
 * there. Read-only; residents do not schedule building events.
 */

export type PropertyEvent = {
  id: string;
  title: string;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`, or null when it runs all day. */
  time: string | null;
  /** How the notice reads on the list — `Notice`, `Upcoming`. */
  status: string;
};

export const propertyEvents: PropertyEvent[] = [
  {
    id: "PE-1",
    title: "Gym Floor Maintenance",
    date: "2026-08-16",
    time: null,
    status: "Notice",
  },
  {
    id: "PE-2",
    title: "Property Community Meeting",
    date: "2026-08-20",
    time: "19:00",
    status: "Upcoming",
  },
];
