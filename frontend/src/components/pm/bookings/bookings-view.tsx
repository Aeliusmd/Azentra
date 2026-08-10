"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Clock, UserRound, Users } from "lucide-react";

import { BookingDetailsModal } from "@/components/pm/bookings/booking-details-modal";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_TONE,
  bookingTitle,
  bookings as seed,
  type Booking,
} from "@/lib/pm/bookings-data";

const FILTERS = ["All", ...BOOKING_STATUSES] as const;

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[15px] text-muted">
      <Icon aria-hidden="true" className="h-4 w-4 text-gray-400" />
      {children}
    </span>
  );
}

export function BookingsView() {
  const [filter, setFilter] = useState<string>("All");
  const [viewing, setViewing] = useState<Booking | null>(null);

  const visible = useMemo(
    () =>
      filter === "All"
        ? seed
        : seed.filter((booking) => booking.status === filter),
    [filter],
  );

  const pending = seed.filter((booking) => booking.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Facility Bookings
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Approve and manage community facility reservations
        </p>
      </div>

      <FilterChips
        label="Filter bookings by status"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        trailing={`${pending} pending`}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No bookings with this status.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((booking) => (
            <li key={booking.id}>
              <button
                type="button"
                onClick={() => setViewing(booking)}
                className="flex w-full items-center gap-4 rounded-xl border border-hairline bg-white px-6 py-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[13px] text-gray-400">
                      {booking.id}
                    </span>
                    <Pill tone={BOOKING_STATUS_TONE[booking.status]}>
                      {booking.status}
                    </Pill>
                  </span>

                  <span className="mt-2.5 block text-[17px] font-semibold text-ink">
                    {bookingTitle(booking)}
                  </span>

                  <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <Meta icon={UserRound}>
                      {booking.bookedBy} ({booking.unit})
                    </Meta>
                    <Meta icon={CalendarDays}>{booking.date}</Meta>
                    <Meta icon={Clock}>{booking.time}</Meta>
                    <Meta icon={Users}>{booking.guests} guests</Meta>
                  </span>
                </span>

                <ChevronRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-300"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <BookingDetailsModal booking={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
