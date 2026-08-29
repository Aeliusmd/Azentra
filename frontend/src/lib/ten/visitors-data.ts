import { daysBetween } from "@/lib/res/format";

/**
 * Visitor passes this tenant has raised.
 *
 * A tenant registers who is coming and can call a pass off before they arrive.
 * `Checked In` and `Checked Out` are stamped at the gate by Security and are
 * read-only here — there is no control anywhere in this portal that sets them,
 * because admitting someone to the building is not the tenant's to do. The
 * visitor bay is likewise the property's allocation, not a choice on the form.
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

/** A visitor's car, where they are driving in. */
export type VisitorVehicle = {
  /** `Honda Civic` — make and model as the tenant gave them. */
  model: string;
  plate: string;
};

export type VisitorPass = {
  id: string;
  name: string;
  phone: string;
  /** ISO day of the visit. */
  date: string;
  /** 24-hour `HH:MM` the visitor is expected, and when the pass lapses. */
  from: string;
  to: string;
  /** Why they are coming, in the tenant's words. */
  purpose: string;
  vehicle: VisitorVehicle | null;
  /** Visitor bay allotted by the property, where parking was asked for. */
  parkingBay: string | null;
  status: VisitorStatus;
  /** Stamped by Security at the gate; never set from this portal. */
  checkedInAt: string | null;
  checkedOutAt: string | null;
};

export const tenVisitorPasses: VisitorPass[] = [
  {
    id: "VP-2026-1190",
    name: "Jennifer Park",
    phone: "+1 555 3201",
    date: "2026-08-16",
    from: "15:00",
    to: "18:00",
    purpose: "Friend visit",
    vehicle: { model: "Honda Civic", plate: "JKL 3456" },
    parkingBay: "B1-V05",
    status: "Upcoming",
    checkedInAt: null,
    checkedOutAt: null,
  },
  {
    id: "VP-2026-1184",
    name: "Tom Bradley",
    phone: "+1 555 7788",
    date: "2026-08-14",
    from: "10:00",
    to: "13:00",
    purpose: "Friend visit",
    vehicle: null,
    parkingBay: null,
    status: "Upcoming",
    checkedInAt: null,
    checkedOutAt: null,
  },
  {
    id: "VP-2026-1150",
    name: "Sarah Kim",
    phone: "+1 555 4512",
    date: "2026-08-05",
    from: "14:00",
    to: "20:00",
    purpose: "Family dinner",
    vehicle: { model: "Tesla Model 3", plate: "MNO 7890" },
    parkingBay: "B1-V10",
    status: "Checked Out",
    checkedInAt: "14:12",
    checkedOutAt: "19:38",
  },
  {
    id: "VP-2026-1121",
    name: "Priya Nathan",
    phone: "+1 555 2264",
    date: "2026-07-27",
    from: "18:00",
    to: "22:00",
    purpose: "Friend visit",
    vehicle: null,
    parkingBay: null,
    status: "Expired",
    checkedInAt: null,
    checkedOutAt: null,
  },
  {
    id: "VP-2026-1108",
    name: "Marcus Lee",
    phone: "+1 555 1820",
    date: "2026-07-20",
    from: "12:00",
    to: "14:00",
    purpose: "Delivery",
    vehicle: { model: "Toyota Hiace", plate: "LB 4402" },
    parkingBay: null,
    status: "Cancelled",
    checkedInAt: null,
    checkedOutAt: null,
  },
];

/** `Honda Civic - JKL 3456`, as the row and the pass state it. */
export function vehicleLine(vehicle: VisitorVehicle) {
  return `${vehicle.model} - ${vehicle.plate}`;
}

/** Passes still ahead of the visit date, soonest first. */
export function upcomingPasses(
  today: string,
  passes: VisitorPass[] = tenVisitorPasses,
) {
  return passes
    .filter(
      (pass) =>
        daysBetween(today, pass.date) >= 0 &&
        (pass.status === "Upcoming" || pass.status === "Active"),
    )
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.from.localeCompare(b.from));
}

/** Everything that is not still ahead — the History tab. */
export function pastPasses(
  today: string,
  passes: VisitorPass[] = tenVisitorPasses,
) {
  const upcoming = new Set(upcomingPasses(today, passes).map((pass) => pass.id));
  return passes
    .filter((pass) => !upcoming.has(pass.id))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Passes valid at some point in the next seven days. */
export function passesThisWeek(
  today: string,
  passes: VisitorPass[] = tenVisitorPasses,
) {
  return upcomingPasses(today, passes).filter(
    (pass) => daysBetween(today, pass.date) <= 7,
  );
}

/** A pass can be called off right up until the visitor is admitted. */
export function isCancellablePass(pass: VisitorPass) {
  return pass.status === "Upcoming" || pass.status === "Active";
}
