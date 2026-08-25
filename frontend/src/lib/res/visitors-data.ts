import { daysBetween, minutesOf } from "@/lib/res/format";

/**
 * Visitors this household has pre-registered.
 *
 * The resident raises a pass and can cancel one; arrival and departure are
 * recorded at the gate by the security officer, so nothing in this portal
 * checks anybody in or out.
 */

export const VISITOR_STATUSES = [
  "Approved",
  "Pending",
  "Checked In",
  "Checked Out",
  "Expired",
  "Cancelled",
] as const;
export type VisitorStatus = (typeof VISITOR_STATUSES)[number];

/** Common reasons, offered in the form; a pass may carry its own wording. */
export const VISIT_PURPOSES = [
  "Family visit",
  "Friend",
  "Delivery",
  "Maintenance / Service",
  "Guest stay",
  "Other",
] as const;

/**
 * How long a pass stays valid from the arrival time.
 *
 * The form asks for one time, not two — a resident knows when someone is
 * coming, rarely when they will leave. The window is derived from that so the
 * pass always states an end the gate can hold it to.
 */
export const VISIT_WINDOW_HOURS = 3;

/** Visitor bays the gate can hand out, in the order they are allocated. */
export const VISITOR_BAYS = Array.from(
  { length: 12 },
  (_, index) => `B1-V${String(index + 1).padStart(2, "0")}`,
);

export type VisitorPass = {
  id: string;
  name: string;
  phone: string;
  /** ISO day of the visit. */
  date: string;
  /** 24-hour `HH:MM` the visitor is expected. */
  arriving: string;
  /** Derived from `arriving` — see `VISIT_WINDOW_HOURS`. */
  leaving: string;
  purpose: string;
  /** Make and plate, where the visitor is driving in. */
  vehicle: string | null;
  /** Bay held for them, where parking was asked for. */
  bay: string | null;
  status: VisitorStatus;
};

/** `14:00` plus the pass window, clamped to the end of the day. */
export function windowEnd(arriving: string) {
  const end = minutesOf(arriving) + VISIT_WINDOW_HOURS * 60;
  const capped = Math.min(end, 23 * 60 + 59);
  return `${String(Math.floor(capped / 60)).padStart(2, "0")}:${String(capped % 60).padStart(2, "0")}`;
}

export const visitorPasses: VisitorPass[] = [
  {
    id: "VP-2026-1184",
    name: "Maria Rodriguez",
    phone: "+1 555 6701",
    date: "2026-08-15",
    arriving: "14:00",
    leaving: windowEnd("14:00"),
    purpose: "Family visit",
    vehicle: "Toyota Corolla - DEF 9012",
    bay: "B1-V08",
    status: "Approved",
  },
  {
    id: "VP-2026-1176",
    name: "James Thompson",
    phone: "+1 555 0611",
    date: "2026-08-13",
    arriving: "10:00",
    leaving: windowEnd("10:00"),
    purpose: "Delivery - Furniture",
    vehicle: null,
    bay: null,
    status: "Approved",
  },
  {
    id: "VP-2026-1150",
    name: "Dilani Weeraratne",
    phone: "+1 555 0918",
    date: "2026-08-08",
    arriving: "10:00",
    leaving: windowEnd("10:00"),
    purpose: "Maintenance / Service",
    vehicle: null,
    bay: null,
    status: "Checked Out",
  },
  {
    id: "VP-2026-1102",
    name: "Arjun Mehta",
    phone: "+1 555 0244",
    date: "2026-07-30",
    arriving: "15:00",
    leaving: windowEnd("15:00"),
    purpose: "Friend",
    vehicle: "Nissan Leaf - KL 8820",
    bay: "B1-V03",
    status: "Expired",
  },
];

/** A visit still ahead that has not been called off. */
export function isUpcoming(pass: VisitorPass, today: string) {
  return (
    pass.date >= today &&
    (pass.status === "Approved" ||
      pass.status === "Pending" ||
      pass.status === "Checked In")
  );
}

/** Ahead of today, soonest first. */
export function upcomingPasses(today: string, passes = visitorPasses) {
  return passes
    .filter((pass) => isUpcoming(pass, today))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Everything else — been and gone, expired, or cancelled. Newest first. */
export function pastPasses(today: string, passes = visitorPasses) {
  return passes
    .filter((pass) => !isUpcoming(pass, today))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Of those ahead, the ones landing inside the next seven days. */
export function passesThisWeek(today: string, passes = visitorPasses) {
  return upcomingPasses(today, passes).filter(
    (pass) => daysBetween(today, pass.date) <= 7,
  );
}

/** A pass can be called off while the visit is still ahead. */
export function isCancellablePass(pass: VisitorPass, today: string) {
  return pass.date >= today && (pass.status === "Approved" || pass.status === "Pending");
}

/** First bay not already held on that day, or null once they are all taken. */
export function freeBay(date: string, passes: VisitorPass[]) {
  const taken = new Set(
    passes
      .filter(
        (pass) =>
          pass.date === date && pass.bay && pass.status !== "Cancelled",
      )
      .map((pass) => pass.bay),
  );
  return VISITOR_BAYS.find((bay) => !taken.has(bay)) ?? null;
}
