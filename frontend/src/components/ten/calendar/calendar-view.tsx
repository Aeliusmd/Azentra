"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { EventModal } from "@/components/ten/calendar/event-modal";
import { Card } from "@/components/ui/card";
import { clockTime, longDate, MONTHS, WEEKDAYS } from "@/lib/res/format";
import { useTenInvoices } from "@/lib/ten/bills-store";
import { useTenBookings } from "@/lib/ten/bookings-store";
import {
  eventsOnDay,
  EVENT_TYPES,
  monthGrid,
  monthOf,
  shiftMonth,
  tenCalendarEvents,
  TYPE_CHIP,
  TYPE_DOT,
  TYPE_ICON,
  upcomingEvents,
  type TenCalendarEvent,
} from "@/lib/ten/calendar-data";
import { TODAY } from "@/lib/ten/dashboard-data";
import { useTenRequests } from "@/lib/ten/maintenance-store";
import { useTenVisitors } from "@/lib/ten/visitors-store";

/** How many entries the side panel lists before it stops. */
const PREVIEW = 7;

function monthLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** A row in the side panel — the same shape whichever mode it is in. */
function EventRow({
  event,
  onOpen,
}: {
  event: TenCalendarEvent;
  onOpen: () => void;
}) {
  const Icon = TYPE_ICON[event.type];

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TYPE_CHIP[event.type]}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold text-ink">
            {event.title}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">
            {event.date} · {event.time ? clockTime(event.time) : "All Day"}
          </span>
        </span>
      </button>
    </li>
  );
}

/**
 * The tenant's schedule.
 *
 * Every entry is derived from a record kept elsewhere in the portal — a
 * maintenance visit, a booking, a visitor pass, an unpaid bill's due date, or a
 * notice from the property. Nothing is created here, so the calendar can never
 * disagree with the page the entry came from: cancel a booking on Facilities
 * and its dot goes; pay a bill and its due date stops being due.
 */
export function TenCalendarView() {
  const requests = useTenRequests();
  const bookings = useTenBookings();
  const passes = useTenVisitors();
  const invoices = useTenInvoices();

  const [period, setPeriod] = useState(monthOf(TODAY));
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState<TenCalendarEvent | null>(null);

  const events = useMemo(
    () => tenCalendarEvents(requests, bookings, passes, invoices),
    [requests, bookings, passes, invoices],
  );

  const cells = useMemo(() => monthGrid(period), [period]);

  const selectedEvents = selected ? eventsOnDay(selected, events) : [];
  const upcoming = upcomingEvents(TODAY, events).slice(0, PREVIEW);

  /** The panel follows the selected day, and falls back to what is coming up. */
  const showingDay = selected !== null;
  const panelEvents = showingDay ? selectedEvents : upcoming;

  function goToMonth(step: number) {
    setPeriod((current) => shiftMonth(current, step));
    setSelected(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Calendar
        </h1>
        <p className="mt-1 text-[14px] text-muted">Your schedule at a glance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ------------------------------ Month ------------------------------ */}
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Previous month"
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>

            <h2 className="text-[16px] font-bold text-ink">
              {monthLabel(period)}
            </h2>

            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Next month"
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[13px] font-medium text-muted"
              >
                {day}
              </div>
            ))}

            {cells.map((cell, index) => {
              if (cell.iso === null) {
                return <div key={`pad-${index}`} aria-hidden="true" />;
              }

              const onDay = eventsOnDay(cell.iso, events);
              const isToday = cell.iso === TODAY;
              const isSelected = cell.iso === selected;

              // One dot per type, so three plumbing visits do not read as three
              // different kinds of thing.
              const types = Array.from(new Set(onDay.map((e) => e.type)));

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() =>
                    setSelected((current) =>
                      current === cell.iso ? null : cell.iso,
                    )
                  }
                  aria-label={`${longDate(cell.iso)}${
                    onDay.length > 0
                      ? `, ${onDay.length} event${onDay.length === 1 ? "" : "s"}`
                      : ""
                  }`}
                  aria-pressed={isSelected}
                  className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg text-[14px] transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                    isToday
                      ? "bg-[#4a6f9c] font-semibold text-white"
                      : isSelected
                        ? "bg-gray-100 font-semibold text-ink"
                        : "text-ink hover:bg-gray-50"
                  }`}
                >
                  <span>{cell.day}</span>

                  <span className="flex h-1.5 items-center gap-1">
                    {types.map((type) => (
                      <span
                        key={type}
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${TYPE_DOT[type]}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* ------------------------- Legend and panel ------------------------ */}
        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <h2 className="text-[15px] font-bold text-ink">Event Types</h2>
            <ul className="mt-3 space-y-2.5">
              {EVENT_TYPES.map((type) => (
                <li key={type} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_DOT[type]}`}
                  />
                  <span className="text-[14px] text-ink">{type}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-ink">
                {showingDay ? longDate(selected) : "Upcoming Events"}
              </h2>
              {showingDay && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  Show upcoming
                </button>
              )}
            </div>

            {panelEvents.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-muted">
                {showingDay
                  ? "Nothing scheduled on this day."
                  : "Nothing coming up."}
              </p>
            ) : (
              <ul className="mt-2 space-y-0.5">
                {panelEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onOpen={() => setOpen(event)}
                  />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {open && <EventModal event={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
