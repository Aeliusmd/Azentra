import { daysBetween } from "@/lib/res/format";

/**
 * Visitors this household has pre-registered.
 *
 * The resident raises a pass and can cancel one; arrival and departure are
 * recorded at the gate by the security officer, so nothing in this portal
 * checks anybody in or out.
 */

export const VISITOR_STATUSES = [
  "Upcoming",
  "Active",
  "Checked In",
  "Checked Out",
  "Expired",
  "Cancelled",
] as const;
export type VisitorStatus = (typeof VISITOR_STATUSES)[number];

export type VisitorPass = {
  id: string;
  name: string;
  phone: string;
  /** ISO day of the visit. */
  date: string;
  /** 24-hour `HH:MM`. */
  arriving: string;
  leaving: string;
  purpose: string;
  /** Plate number where the visitor is driving in. */
  vehicle: string | null;
  notes: string;
  status: VisitorStatus;
};

export const visitorPasses: VisitorPass[] = [
  {
    id: "VP-2026-1184",
    name: "Michael Rodriguez",
    phone: "+1 555 0733",
    date: "2026-08-14",
    arriving: "18:00",
    leaving: "22:00",
    purpose: "Family visit",
    vehicle: "CBA-4471",
    notes: "Parking needed for the evening.",
    status: "Upcoming",
  },
  {
    id: "VP-2026-1150",
    name: "Dilani Weeraratne",
    phone: "+1 555 0918",
    date: "2026-08-08",
    arriving: "10:00",
    leaving: "12:00",
    purpose: "Curtain fitting",
    vehicle: null,
    notes: "",
    status: "Checked Out",
  },
  {
    id: "VP-2026-1102",
    name: "Arjun Mehta",
    phone: "+1 555 0244",
    date: "2026-07-30",
    arriving: "15:00",
    leaving: "17:00",
    purpose: "Friend",
    vehicle: "KL-8820",
    notes: "",
    status: "Expired",
  },
];

/** Passes for visits still ahead — the count the dashboard tile shows. */
export function upcomingPasses(today: string, passes = visitorPasses) {
  return passes
    .filter(
      (pass) =>
        pass.date >= today &&
        (pass.status === "Upcoming" || pass.status === "Active"),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Of those, the ones landing inside the next seven days. */
export function passesThisWeek(today: string, passes = visitorPasses) {
  return upcomingPasses(today, passes).filter(
    (pass) => daysBetween(today, pass.date) <= 7,
  );
}
