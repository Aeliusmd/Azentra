"use client";

import { useSyncExternalStore } from "react";

import { longDate, timeRange } from "@/lib/res/format";
import {
  tenBookings,
  type BookingStatus,
  type FacilityBooking,
} from "@/lib/ten/bookings-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";

/**
 * The tenant's facility bookings.
 *
 * Module-level so a reservation made on the Book Facility tab shows on My
 * Bookings, the dashboard and the bell at once.
 *
 * Two writes, and only two: making a reservation and calling one off. Approving
 * somebody's booking, rejecting one, or changing a facility's rules are the
 * property's, and none of them has a path through here.
 */

let bookings: FacilityBooking[] = tenBookings;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 425;

/**
 * Guest count above which the property wants to look at a booking first.
 */
const APPROVAL_THRESHOLD = 40;

/**
 * Reserves a slot.
 *
 * Small bookings are taken on the spot; a large one is held at `Pending`
 * because the property has to look at it first — telling a tenant their
 * eighty-guest party is confirmed when nobody has seen it would be a promise
 * this portal cannot make good on.
 */
export function createTenBooking({
  facility,
  date,
  from,
  to,
  guests,
  purpose,
}: {
  facility: string;
  date: string;
  from: string;
  to: string;
  guests: number;
  purpose: string | null;
}): FacilityBooking {
  const status: BookingStatus =
    guests > APPROVAL_THRESHOLD ? "Pending" : "Confirmed";

  const booking: FacilityBooking = {
    id: `BKG-2026-0${nextNumber++}`,
    facility,
    date,
    from,
    to,
    guests,
    status,
    purpose,
    note: null,
  };

  bookings = [booking, ...bookings];
  emit();

  pushTenNotification(
    "Booking",
    status === "Confirmed" ? "Facility Booking Confirmed" : "Booking Requested",
    `${facility} · ${longDate(date)} · ${timeRange(from, to)}.`,
  );

  return booking;
}

/** Calls a reservation off and releases the slot. */
export function cancelTenBooking(id: string) {
  const booking = bookings.find((entry) => entry.id === id);
  if (!booking) return;

  bookings = bookings.map((entry) =>
    entry.id === id ? { ...entry, status: "Cancelled" } : entry,
  );
  emit();

  pushTenNotification(
    "Booking",
    "Booking Cancelled",
    `${booking.facility} · ${longDate(booking.date)} has been released.`,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return bookings;
}

function getServerSnapshot() {
  return tenBookings;
}

export function useTenBookings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
