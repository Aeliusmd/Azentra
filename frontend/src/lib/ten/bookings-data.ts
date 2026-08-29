import { daysBetween, minutesOf } from "@/lib/res/format";

/**
 * Facilities this tenant has reserved.
 *
 * A tenant books the shared amenities on the same footing as an owner — what
 * they cannot do is approve anyone else's booking or change a facility's rules,
 * so `Confirmed` and `Rejected` arrive from the property and are read-only here.
 */

export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "Rejected",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type FacilityBooking = {
  id: string;
  facility: string;
  /** ISO day of the reservation. */
  date: string;
  /** 24-hour `HH:MM`. */
  from: string;
  to: string;
  guests: number;
  status: BookingStatus;
  /** Why the tenant booked it, in their own words. Optional on the form. */
  purpose: string | null;
  /** What the property said back, where they said anything. */
  note: string | null;
};

export const tenBookings: FacilityBooking[] = [
  {
    id: "BKG-2026-0412",
    facility: "Gymnasium",
    date: "2026-08-14",
    from: "06:00",
    to: "07:30",
    guests: 1,
    purpose: "Morning workout",
    status: "Confirmed",
    note: null,
  },
  {
    id: "BKG-2026-0418",
    facility: "BBQ Terrace",
    date: "2026-08-22",
    from: "17:00",
    to: "21:00",
    guests: 8,
    purpose: "Family get-together",
    status: "Confirmed",
    note: "Please clear the grill before 9:30 PM.",
  },
  {
    id: "BKG-2026-0424",
    facility: "Meeting Room",
    date: "2026-08-28",
    from: "10:00",
    to: "12:00",
    guests: 4,
    purpose: "Remote work call",
    status: "Pending",
    note: null,
  },
  {
    id: "BKG-2026-0377",
    facility: "Swimming Pool",
    date: "2026-07-19",
    from: "16:00",
    to: "18:00",
    guests: 3,
    purpose: "Weekend swim with friends",
    status: "Completed",
    note: null,
  },
  {
    id: "BKG-2026-0361",
    facility: "Banquet Hall",
    date: "2026-07-05",
    from: "18:00",
    to: "22:00",
    guests: 25,
    purpose: "Birthday dinner",
    status: "Completed",
    note: null,
  },
];

/** Reservations still ahead of the tenant, soonest first. */
export function upcomingBookings(
  today: string,
  bookings: FacilityBooking[] = tenBookings,
) {
  return bookings
    .filter(
      (booking) =>
        daysBetween(today, booking.date) >= 0 &&
        (booking.status === "Confirmed" || booking.status === "Pending"),
    )
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.from.localeCompare(b.from));
}

/** Only a reservation that has not happened yet can be called off. */
export function isCancellable(booking: FacilityBooking, today: string) {
  return (
    daysBetween(today, booking.date) >= 0 &&
    (booking.status === "Confirmed" || booking.status === "Pending")
  );
}

/**
 * Slots already taken on a facility for one day.
 *
 * Cancelled and rejected bookings are left out: they hold nothing, and showing
 * them would make a free afternoon look busy.
 */
export function bookingsOn(
  facility: string,
  date: string,
  bookings: FacilityBooking[] = tenBookings,
) {
  return bookings
    .filter(
      (booking) =>
        booking.facility === facility &&
        booking.date === date &&
        booking.status !== "Cancelled" &&
        booking.status !== "Rejected",
    )
    .slice()
    .sort((a, b) => a.from.localeCompare(b.from));
}

/**
 * Whether a proposed slot runs into one already held.
 *
 * Touching ends do not clash — a booking that ends at 10:00 leaves 10:00 free
 * for the next one.
 */
export function clashesWith(
  from: string,
  to: string,
  taken: FacilityBooking[],
) {
  const start = minutesOf(from);
  const end = minutesOf(to);

  return taken.some(
    (booking) =>
      start < minutesOf(booking.to) && end > minutesOf(booking.from),
  );
}
