"use client";

import { useMemo, useState } from "react";

import { showTenToast } from "@/components/ten/ui/toaster";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { minutesOf, timeRange, timeRangeShort } from "@/lib/res/format";
import { bookingsOn, clashesWith } from "@/lib/ten/bookings-data";
import { createTenBooking, useTenBookings } from "@/lib/ten/bookings-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import type { Facility } from "@/lib/ten/facilities-data";

const CONTROL = `${controlClasses()} px-3.5 py-3`;

/** Guest count above which the property wants to see a booking first. */
const APPROVAL_THRESHOLD = 40;

/** A slot long enough to be worth booking, offered as the starting suggestion. */
const DEFAULT_SLOT_MINUTES = 120;

function toClock(minutes: number) {
  const hour = Math.floor(minutes / 60);
  return `${String(hour).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Two hours from opening, or closing time where the room shuts sooner. */
function defaultEnd(facility: Facility) {
  return toClock(
    Math.min(
      minutesOf(facility.opens) + DEFAULT_SLOT_MINUTES,
      minutesOf(facility.closes),
    ),
  );
}

/**
 * Reserving a facility.
 *
 * The form enforces the same opening hours the card advertises and refuses a
 * slot somebody already holds, so a tenant is turned away here rather than at
 * the door. What it cannot do is approve anything: a large booking goes off as
 * a request, and the property decides.
 */
export function BookFacilityModal({
  facility,
  onClose,
}: {
  facility: Facility;
  onClose: () => void;
}) {
  const allBookings = useTenBookings();

  const [date, setDate] = useState(TODAY);
  const [from, setFrom] = useState(facility.opens);
  const [to, setTo] = useState(() => defaultEnd(facility));
  const [guests, setGuests] = useState("1");
  const [purpose, setPurpose] = useState("");

  const taken = useMemo(
    () => bookingsOn(facility.name, date, allBookings),
    [facility.name, date, allBookings],
  );

  const guestCount = Number(guests);
  const guestsValid =
    guests !== "" &&
    Number.isInteger(guestCount) &&
    guestCount >= 1 &&
    guestCount <= facility.capacity;

  const orderValid = from !== "" && to !== "" && minutesOf(to) > minutesOf(from);
  const withinHours =
    orderValid &&
    minutesOf(from) >= minutesOf(facility.opens) &&
    minutesOf(to) <= minutesOf(facility.closes);
  const clashes = orderValid && clashesWith(from, to, taken);

  /**
   * One message at a time, and only once there is something to say — the
   * design has no hint text, so a rejection has to explain itself.
   */
  const error = !orderValid
    ? from !== "" && to !== ""
      ? "The end time has to be after the start time."
      : ""
    : !withinHours
      ? `${facility.name} is open ${timeRangeShort(facility.opens, facility.closes)}.`
      : clashes
        ? "That slot is already booked. Please pick another time."
        : !guestsValid
          ? `Enter between 1 and ${facility.capacity} guests.`
          : "";

  const ready = orderValid && withinHours && !clashes && guestsValid;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const booking = createTenBooking({
      facility: facility.name,
      date,
      from,
      to,
      guests: guestCount,
      purpose: purpose.trim() || null,
    });

    showTenToast(
      booking.status === "Confirmed"
        ? `${facility.name} booked · ${timeRange(from, to)}`
        : `${facility.name} requested · awaiting approval`,
    );
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Book ${facility.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[62vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="bk-date" required>
              Date
            </FieldLabel>
            <input
              id="bk-date"
              type="date"
              required
              min={TODAY}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={CONTROL}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="bk-from" required>
                Start Time
              </FieldLabel>
              <input
                id="bk-from"
                type="time"
                required
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className={CONTROL}
              />
            </div>
            <div>
              <FieldLabel htmlFor="bk-to" required>
                End Time
              </FieldLabel>
              <input
                id="bk-to"
                type="time"
                required
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className={CONTROL}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="bk-guests" required>
              Number of Guests
            </FieldLabel>
            <input
              id="bk-guests"
              type="number"
              inputMode="numeric"
              required
              min={1}
              max={facility.capacity}
              step={1}
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className={CONTROL}
            />
          </div>

          <div>
            <FieldLabel htmlFor="bk-purpose">Purpose / Notes</FieldLabel>
            <textarea
              id="bk-purpose"
              rows={3}
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              placeholder="Optional notes..."
              className={`${CONTROL} resize-y`}
            />
          </div>

          {error && (
            <p role="alert" className="text-[13px] text-rose-600">
              {error}
            </p>
          )}

          {/* Said plainly rather than discovered after submitting. */}
          {guestsValid && guestCount > APPROVAL_THRESHOLD && (
            <p className="text-[13px] text-amber-700">
              Bookings over {APPROVAL_THRESHOLD} guests are held for management
              approval.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-hairline px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="flex-1 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}
