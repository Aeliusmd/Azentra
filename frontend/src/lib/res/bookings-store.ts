"use client";

import { useSyncExternalStore } from "react";

import {
  facilityBookings,
  type BookingStatus,
  type FacilityBooking,
} from "@/lib/res/bookings-data";
import { longDate, timeRange } from "@/lib/res/format";
import { pushResNotification } from "@/lib/res/notifications-store";

/**
 * The household's facility bookings.
 *
 * Module-level so a reservation made on the Facilities tab shows on My
 * Bookings, the dashboard and the bell at once. Resets on reload like the
 * other mock stores.
 */

let bookings: FacilityBooking[] = facilityBookings;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 445;

/**
 * Reserves a slot.
 *
 * Small bookings are taken on the spot; a large one is held at `Pending`
 * because the property has to look at it first, and telling a resident their
 * eighty-guest party is confirmed when nobody has seen it would be a lie the
 * portal cannot make good on.
 */
const APPROVAL_THRESHOLD = 40;

export function createBooking({
  facility,
  date,
  from,
  to,
  guests,
}: {
  facility: string;
  date: string;
  from: string;
  to: string;
  guests: number;
}): FacilityBooking {
  const status: BookingStatus =
    guests > APPROVAL_THRESHOLD ? "Pending" : "Confirmed";

  const booking: FacilityBooking = {
    id: `BK-2026-0${nextNumber++}`,
    facility,
    date,
    from,
    to,
    guests,
    status,
  };

  bookings = [booking, ...bookings];
  emit();

  pushResNotification(
    "Booking",
    status === "Confirmed" ? "Booking Confirmed" : "Booking Requested",
    `${facility} · ${longDate(date)} · ${timeRange(from, to)}.`,
  );

  return booking;
}

export function cancelBooking(id: string) {
  const booking = bookings.find((entry) => entry.id === id);
  if (!booking) return;

  bookings = bookings.map((entry) =>
    entry.id === id ? { ...entry, status: "Cancelled" } : entry,
  );
  emit();

  pushResNotification(
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
  return facilityBookings;
}

export function useResBookings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
