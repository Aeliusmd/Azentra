"use client";

import { useState } from "react";

import { FacilityImage } from "@/components/res/facilities/facility-image";
import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { bookingsOn, type FacilityBooking } from "@/lib/res/bookings-data";
import { createBooking, useResBookings } from "@/lib/res/bookings-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { longDate, minutesOf, timeRange, timeRangeShort } from "@/lib/res/format";
import type { Facility } from "@/lib/res/facilities-data";
import { showResToast } from "@/lib/res/toast-store";

/**
 * Why a slot cannot be taken, or empty when it can.
 *
 * Checked here rather than left to the confirm button so the resident is told
 * which rule they have hit — "the pool shuts at 9 PM" is useful, a greyed-out
 * button is not.
 */
function problemWith({
  facility,
  date,
  from,
  to,
  guests,
  existing,
}: {
  facility: Facility;
  date: string;
  from: string;
  to: string;
  guests: number;
  existing: FacilityBooking[];
}): string {
  if (!date) return "";
  if (date < TODAY) return "That date has already passed.";
  if (!from || !to) return "";

  if (minutesOf(to) <= minutesOf(from)) {
    return "The end time has to be after the start time.";
  }
  if (
    minutesOf(from) < minutesOf(facility.opens) ||
    minutesOf(to) > minutesOf(facility.closes)
  ) {
    return `${facility.name} is open ${timeRangeShort(facility.opens, facility.closes)}.`;
  }
  if (guests > facility.capacity) {
    return `${facility.name} holds ${facility.capacity} people.`;
  }
  if (guests < 1) return "At least one guest, please.";

  const clash = bookingsOn(existing, facility.name, date).find(
    (booking) =>
      minutesOf(from) < minutesOf(booking.to) &&
      minutesOf(to) > minutesOf(booking.from),
  );
  if (clash) {
    return `You already have ${facility.name} on ${longDate(date)}, ${timeRange(clash.from, clash.to)}.`;
  }

  return "";
}

/** Reserving a slot. Frontend only — nothing is held on a server. */
export function BookFacilityModal({
  facility,
  onClose,
}: {
  facility: Facility;
  onClose: () => void;
}) {
  const existing = useResBookings();

  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");

  const problem = problemWith({ facility, date, from, to, guests, existing });
  const complete = date !== "" && from !== "" && to !== "";
  const ready = complete && problem === "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const booking = createBooking({
      facility: facility.name,
      date,
      from,
      to,
      guests,
    });

    showResToast(
      booking.status === "Confirmed"
        ? `${facility.name} booked for ${longDate(date)}`
        : `${facility.name} requested — awaiting approval`,
    );
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Book ${facility.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <FacilityImage facility={facility} size="thumb" />
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-ink">{facility.name}</p>
              <p className="mt-0.5 text-[13px] text-muted">
                Capacity: {facility.capacity} · {facility.location}
              </p>
            </div>
          </div>

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
              className={`${controlClasses()} px-3.5 py-3`}
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
                className={`${controlClasses()} px-3.5 py-3`}
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
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="bk-guests">Number of Guests</FieldLabel>
            <input
              id="bk-guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={facility.capacity}
              // Any whole number is valid; a coarser step would have the
              // browser silently reject perfectly ordinary counts.
              step={1}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="bk-notes">Purpose / Notes</FieldLabel>
            <textarea
              id="bk-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes..."
              className={`${controlClasses()} resize-y px-3.5 py-3`}
            />
          </div>

          <p className="text-[13px] text-muted">{facility.rules}</p>

          {problem && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700"
            >
              {problem}
            </p>
          )}
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}
