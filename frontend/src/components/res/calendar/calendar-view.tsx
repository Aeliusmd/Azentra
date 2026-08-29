"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { EventDetailsModal } from "@/components/res/calendar/event-modal";
import { Card } from "@/components/ui/card";
import { useResInvoices } from "@/lib/res/bills-store";
import { useResBookings } from "@/lib/res/bookings-store";
import {
  buildResCalendar,
  CALENDAR_KINDS,
  chipLabel,
  eventsOn,
  KIND_STYLE,
  monthGrid,
  toIso,
  whenLabel,
  WEEKDAY_HEADS,
  type ResCalendarEvent,
} from "@/lib/res/calendar-data";
import { TODAY } from "@/lib/res/dashboard-data";
import { fromIso, MONTHS } from "@/lib/res/format";
import { useResRequests } from "@/lib/res/maintenance-store";
import { propertyEvents } from "@/lib/res/property-events-data";
import { useResVisitors } from "@/lib/res/visitors-store";

/** Statuses that read as good news; everything else stays quiet. */
const GOOD = ["confirmed", "approved", "paid"];
const WARN = ["pending", "overdue"];

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (GOOD.includes(value)) return "bg-green-50 text-green-700";
  if (WARN.includes(value)) return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-500";
}

/** How many chips fit in a day cell before the rest collapse into a count. */
const CELL_PREVIEW = 2;

/**
 * The resident's diary.
 *
 * Everything on it belongs to something else in the portal, so it can only ever
 * agree with the page it came from — cancel a booking and the entry goes.
 */
export function ResCalendarView() {
  const bookings = useResBookings();
  const requests = useResRequests();
  const passes = useResVisitors();
  const invoices = useResInvoices();

  const [openId, setOpenId] = useState<string | null>(null);
  /** The month on screen, zero-based like `Date`. */
  const [cursor, setCursor] = useState(() => {
    const [year, month] = TODAY.split("-").map(Number);
    return { year, month: month - 1 };
  });

  const events = useMemo(
    () =>
      buildResCalendar({
        today: TODAY,
        bookings,
        requests,
        passes,
        invoices,
        events: propertyEvents,
      }),
    [bookings, requests, passes, invoices],
  );

  /** The grid draws one month; the list below runs on past it. */
  const inMonth = useMemo(() => {
    const prefix = toIso(cursor.year, cursor.month, 1).slice(0, 7);
    return events.filter((event) => event.date.startsWith(prefix));
  }, [events, cursor]);

  const weeks = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor],
  );

  const open = events.find((event) => event.id === openId) ?? null;

  function step(delta: number) {
    setCursor((current) => {
      const date = new Date(current.year, current.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Calendar
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Your schedule at Sunrise Residence
        </p>
      </div>

      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {CALENDAR_KINDS.map((kind) => (
          <li key={kind} className="flex items-center gap-2 text-[13px] text-muted">
            <span
              aria-hidden="true"
              className={`h-3 w-3 rounded-sm ${KIND_STYLE[kind].chip}`}
            />
            {kind}
          </li>
        ))}
      </ul>

      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3.5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous month"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>

          <h2 aria-live="polite" className="text-[15px] font-bold text-ink">
            {MONTHS[cursor.month]} {cursor.year}
          </h2>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next month"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Seven readable columns need the width; below that the grid scrolls. */}
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-7 border-b border-hairline">
              {WEEKDAY_HEADS.map((day) => (
                <div
                  key={day}
                  className="px-3 py-2.5 text-center text-[11px] font-medium tracking-wide text-muted"
                >
                  {day}
                </div>
              ))}
            </div>

            <div>
              {weeks.map((week, index) => (
                <div key={index} className="grid grid-cols-7">
                  {week.map((iso, cell) => {
                    if (!iso) {
                      return (
                        <div key={`pad-${cell}`} className="min-h-[88px]" />
                      );
                    }

                    const dayEvents = eventsOn(inMonth, iso);

                    return (
                      <div key={iso} className="min-h-[88px] p-1.5 align-top">
                        <span
                          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[13px] ${
                            iso === TODAY
                              ? "bg-[#1b3a5c] font-semibold text-white"
                              : "text-gray-500"
                          }`}
                        >
                          {fromIso(iso).getDate()}
                        </span>

                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, CELL_PREVIEW).map((event) => (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => setOpenId(event.id)}
                              aria-haspopup="dialog"
                              title={chipLabel(event)}
                              className={`block w-full truncate rounded px-1.5 py-1 text-left text-[11px] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${KIND_STYLE[event.kind].chip}`}
                            >
                              {chipLabel(event)}
                            </button>
                          ))}

                          {dayEvents.length > CELL_PREVIEW && (
                            <p className="px-1 text-[11px] text-muted">
                              +{dayEvents.length - CELL_PREVIEW} more
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="border-b border-hairline px-4 py-4 sm:px-5">
          <h2 className="text-[15px] font-bold text-ink">Upcoming Events</h2>
        </div>

        {events.length === 0 ? (
          <p className="px-6 py-12 text-center text-[14px] text-muted">
            Nothing coming up.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {events.map((event: ResCalendarEvent) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(event.id)}
                  aria-haspopup="dialog"
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full ${KIND_STYLE[event.kind].dot}`}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">
                      {event.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {whenLabel(event)}
                    </span>
                  </span>

                  {/* Lower-cased in the list, as written in the record. */}
                  <span
                    className={`shrink-0 rounded px-2 py-1 text-[12px] lowercase ${statusTone(event.status)}`}
                  >
                    {event.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <EventDetailsModal event={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
