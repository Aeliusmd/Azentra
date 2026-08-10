"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import { BOOKING_STATUS_TONE, type Booking } from "@/lib/pm/bookings-data";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[17px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="font-semibold text-ink">{value}</span>
    </p>
  );
}

export function BookingDetailsModal({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  if (!booking) return null;

  return (
    <Modal open onClose={onClose} title="Booking Details">
      <div className="px-8 py-7">
        <Pill tone={BOOKING_STATUS_TONE[booking.status]}>{booking.status}</Pill>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <Field label="Facility" value={booking.facility} />
          <Field label="Location" value={booking.location} />
          <Field label="Date" value={booking.date} />
          <Field label="Time" value={booking.time} />
          <Field label="Booked by" value={booking.bookedBy} />
          <Field label="Unit" value={booking.unit} />
          <Field label="Purpose" value={booking.purpose} />
          <Field label="Guests" value={String(booking.guests)} />
        </div>
      </div>
    </Modal>
  );
}
