/**
 * Facilities in the building and what this resident has reserved.
 *
 * A booking belongs to the household that made it — there is no view here of
 * who else has the pool, only whether a slot is free.
 */

/** Names must match `facilities`, which is where the details live. */
export type FacilityName = string;

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
  facility: FacilityName;
  /** ISO day of the reservation. */
  date: string;
  /** 24-hour `HH:MM`, formatted for display on the way out. */
  from: string;
  to: string;
  guests: number;
  status: BookingStatus;
};

/** Soonest first — the order the dashboard and the bookings list read. */
export const facilityBookings: FacilityBooking[] = [
  {
    id: "BK-2026-0412",
    facility: "Swimming Pool",
    date: "2026-08-13",
    from: "07:00",
    to: "09:00",
    guests: 2,
    status: "Confirmed",
  },
  {
    id: "BK-2026-0431",
    facility: "Banquet Hall",
    date: "2026-08-25",
    from: "18:00",
    to: "23:00",
    guests: 40,
    status: "Confirmed",
  },
  {
    id: "BK-2026-0388",
    facility: "Gymnasium",
    date: "2026-08-04",
    from: "06:00",
    to: "07:00",
    guests: 1,
    status: "Completed",
  },
  {
    id: "BK-2026-0361",
    facility: "BBQ Terrace",
    date: "2026-07-28",
    from: "17:00",
    to: "18:00",
    guests: 4,
    status: "Cancelled",
  },
];

/** Reservations still ahead of a given day, soonest first. */
export function upcomingBookings(today: string, bookings = facilityBookings) {
  return bookings
    .filter(
      (booking) =>
        booking.date >= today &&
        (booking.status === "Confirmed" || booking.status === "Pending"),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * A booking can be called off while it is still ahead and still stands.
 * Once the day has passed, or the property has already refused it, there is
 * nothing left for the resident to cancel.
 */
export function isCancellable(booking: FacilityBooking, today: string) {
  return (
    booking.date >= today &&
    (booking.status === "Confirmed" || booking.status === "Pending")
  );
}

/** This household's bookings for one facility on one day. */
export function bookingsOn(
  bookings: FacilityBooking[],
  facility: string,
  date: string,
) {
  return bookings.filter(
    (booking) =>
      booking.facility === facility &&
      booking.date === date &&
      booking.status !== "Cancelled" &&
      booking.status !== "Rejected",
  );
}
