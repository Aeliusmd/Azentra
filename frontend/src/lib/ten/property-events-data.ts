/**
 * Things the property has told everybody about — a shutdown, a meeting.
 *
 * Not the tenant's own diary, but they land in it: a pool closed for cleaning
 * is exactly the sort of thing worth seeing before walking down there.
 * Read-only — tenants do not schedule building events, and there is no writer
 * for this list anywhere in the portal.
 */

export type PropertyEvent = {
  id: string;
  title: string;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`, or null when it runs all day. */
  time: string | null;
  /** How the notice reads on the list — `Notice`, `Scheduled`. */
  status: string;
};

export const tenPropertyEvents: PropertyEvent[] = [
  {
    id: "PE-1",
    title: "Pool Maintenance",
    date: "2026-08-16",
    time: null,
    status: "Notice",
  },
  {
    id: "PE-2",
    title: "Community Meeting",
    date: "2026-08-20",
    time: "19:00",
    status: "Scheduled",
  },
];
