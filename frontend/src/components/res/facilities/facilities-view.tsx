"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, UserRound, Users } from "lucide-react";

import { BookFacilityModal } from "@/components/res/facilities/book-modal";
import { FacilityImage } from "@/components/res/facilities/facility-image";
import { BookingStatusPill } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { isCancellable } from "@/lib/res/bookings-data";
import { cancelBooking, useResBookings } from "@/lib/res/bookings-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { longDate, timeRange } from "@/lib/res/format";
import {
  facilities,
  facilityBlurb,
  facilityByName,
  type Facility,
} from "@/lib/res/facilities-data";

type Tab = "Book a Facility" | "My Bookings";

/**
 * How many photos load eagerly. Two rows of the widest grid — on a tall screen
 * both are above the fold, and leaving the second to lazy-load makes it the
 * last thing to paint.
 */
const EAGER_ROW = 6;

function FacilityCard({
  facility,
  onBook,
  priority,
}: {
  facility: Facility;
  onBook: () => void;
  priority: boolean;
}) {
  const Icon = facility.icon;

  return (
    <li>
      <Card className="flex h-full flex-col overflow-hidden">
        <FacilityImage facility={facility} priority={priority} />

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h2 className="flex items-center gap-2.5 text-[16px] font-bold text-ink">
            <Icon aria-hidden="true" className="h-[18px] w-[18px] text-[#2e6cad]" />
            {facility.name}
          </h2>

          <p className="mt-2.5 text-[14px] text-muted">
            {facilityBlurb(facility)}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-4 w-4 text-gray-400" />
              {facility.location}
            </span>
            <span className="flex items-center gap-1.5">
              <UserRound aria-hidden="true" className="h-4 w-4 text-gray-400" />
              Capacity: {facility.capacity}
            </span>
          </div>

          {/* Pushed down so the buttons line up across a row of tiles. */}
          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={onBook}
              className="w-full rounded-lg bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Book Now
              <span className="sr-only"> — {facility.name}</span>
            </button>
          </div>
        </div>
      </Card>
    </li>
  );
}

/**
 * The building's shared spaces, and what this household has reserved.
 *
 * A resident sees whether a slot is free, never who else has it — the other
 * households' bookings are none of their business.
 */
export function ResFacilitiesView() {
  const bookings = useResBookings();

  const [tab, setTab] = useState<Tab>("Book a Facility");
  const [booking, setBooking] = useState<Facility | null>(null);

  /** Soonest first for what is ahead, then the past most-recent first. */
  const mine = useMemo(() => {
    const ahead = bookings
      .filter((entry) => entry.date >= TODAY)
      .sort((a, b) => a.date.localeCompare(b.date));
    const past = bookings
      .filter((entry) => entry.date < TODAY)
      .sort((a, b) => b.date.localeCompare(a.date));
    return [...ahead, ...past];
  }, [bookings]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Facilities
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Book common area facilities at Sunrise Residence
        </p>
      </div>

      <ResTabBar
        label="Facilities"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Book a Facility", label: "Book a Facility" },
          { id: "My Bookings", label: "My Bookings" },
        ]}
      />

      {tab === "Book a Facility" ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {facilities.map((facility, index) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              priority={index < EAGER_ROW}
              onBook={() => setBooking(facility)}
            />
          ))}
        </ul>
      ) : mine.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-ink">No bookings yet</p>
          <p className="mt-1 text-[14px] text-muted">
            Reserve a facility and it will appear here.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-hairline">
            {mine.map((entry) => {
              const facility = facilityByName(entry.facility);

              return (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5"
                >
                  {facility ? (
                    <FacilityImage facility={facility} size="thumb" />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#5b7f9c]"
                    >
                      <Users className="h-6 w-6" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink">
                      {entry.facility}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays
                          aria-hidden="true"
                          className="h-4 w-4 text-gray-400"
                        />
                        {longDate(entry.date)} ·{" "}
                        {timeRange(entry.from, entry.to)}
                      </span>
                      <span>
                        {entry.guests} guest{entry.guests === 1 ? "" : "s"}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <BookingStatusPill status={entry.status} />
                    {isCancellable(entry, TODAY) && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(entry.id)}
                        className="rounded-lg border border-hairline px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                      >
                        Cancel
                        <span className="sr-only">
                          {" "}
                          {entry.facility} on {longDate(entry.date)}
                        </span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {booking && (
        <BookFacilityModal
          facility={booking}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  );
}
