"use client";

import { useState } from "react";
import { Building2, CalendarDays, MapPin } from "lucide-react";

import { BookFacilityModal } from "@/components/ten/facilities/book-modal";
import { FacilityImage } from "@/components/ten/facilities/facility-image";
import { BookingStatusPill } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { longDate, timeRange } from "@/lib/res/format";
import { isCancellable, type FacilityBooking } from "@/lib/ten/bookings-data";
import { cancelTenBooking, useTenBookings } from "@/lib/ten/bookings-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  facilities,
  facilityBlurb,
  facilityByName,
  type Facility,
} from "@/lib/ten/facilities-data";

type Tab = "Book Facility" | "My Bookings";

const TABS: Tab[] = ["Book Facility", "My Bookings"];

/** One bookable room — the whole tile opens its booking form. */
function FacilityCard({
  facility,
  priority,
  onBook,
}: {
  facility: Facility;
  /** Set on the first row, which is above the fold. */
  priority: boolean;
  onBook: () => void;
}) {
  const Icon = facility.icon;

  return (
    <li>
      <Card className="h-full overflow-hidden transition-colors hover:bg-gray-50/70">
        <button
          type="button"
          onClick={onBook}
          className="flex h-full w-full flex-col text-left focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <FacilityImage facility={facility} priority={priority} />

          <span className="flex flex-1 flex-col p-4 sm:p-5">
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#2e6cad]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[16px] font-bold text-ink">
                {facility.name}
              </span>
            </span>

            <span className="mt-3 block flex-1 text-[14px] leading-relaxed text-muted">
              {facilityBlurb(facility)}
            </span>

            <span className="mt-3 flex items-center justify-between gap-3 text-[13px] text-muted">
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="truncate">{facility.location}</span>
              </span>
              <span className="shrink-0">Cap: {facility.capacity}</span>
            </span>
          </span>
        </button>
      </Card>
    </li>
  );
}

function BookingRow({
  booking,
  onCancel,
}: {
  booking: FacilityBooking;
  onCancel: () => void;
}) {
  const facility = facilityByName(booking.facility);
  const Icon = facility?.icon ?? Building2;

  return (
    <li>
      <Card className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#2e6cad]"
          >
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink">{booking.facility}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {longDate(booking.date)} · {timeRange(booking.from, booking.to)}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              {booking.id} · {booking.guests}{" "}
              {booking.guests === 1 ? "guest" : "guests"}
            </p>
            {booking.purpose && (
              <p className="mt-1.5 text-[13px] text-ink">{booking.purpose}</p>
            )}
            {booking.note && (
              <p className="mt-2 text-[13px] text-muted italic">
                {booking.note}
              </p>
            )}
          </div>

          <BookingStatusPill status={booking.status} />
        </div>

        {/* Only a reservation still ahead of the tenant can be called off. */}
        {isCancellable(booking, TODAY) && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </Card>
    </li>
  );
}

/**
 * The building's shared rooms, and what this tenant has reserved.
 *
 * A tenant books the amenities on the same footing as an owner — what they
 * cannot do is approve anyone's booking, reject one, or change a room's rules.
 * `Confirmed` and `Rejected` arrive from the property and are read-only here.
 */
export function TenFacilitiesView() {
  const bookings = useTenBookings();

  const [tab, setTab] = useState<Tab>("Book Facility");
  const [booking, setBooking] = useState<Facility | null>(null);
  const [cancelling, setCancelling] = useState<FacilityBooking | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Facilities
        </h1>
        <p className="mt-1 text-[14px] text-muted">Book common area facilities</p>
      </div>

      <TenTabBar
        label="Facilities"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {tab === "Book Facility" ? (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {facilities.map((facility, index) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              priority={index < 3}
              onBook={() => setBooking(facility)}
            />
          ))}
        </ul>
      ) : bookings.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
          >
            <CalendarDays className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            No bookings yet
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            Pick a facility on the Book Facility tab and your reservation will
            show up here.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {bookings.map((entry) => (
            <BookingRow
              key={entry.id}
              booking={entry}
              onCancel={() => setCancelling(entry)}
            />
          ))}
        </ul>
      )}

      {booking && (
        <BookFacilityModal
          facility={booking}
          onClose={() => setBooking(null)}
        />
      )}

      {cancelling && (
        <ConfirmDialog
          open
          title="Cancel this booking?"
          message={`${cancelling.facility} on ${longDate(cancelling.date)} at ${timeRange(cancelling.from, cancelling.to)} will be released.`}
          confirmLabel="Cancel Booking"
          onConfirm={() => {
            cancelTenBooking(cancelling.id);
            setCancelling(null);
          }}
          onClose={() => setCancelling(null)}
        />
      )}
    </div>
  );
}
