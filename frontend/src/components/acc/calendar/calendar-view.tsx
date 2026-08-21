"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  AccMonthView,
  AccScheduleView,
} from "@/components/acc/calendar/calendar-views";
import { Card } from "@/components/ui/card";
import {
  buildAccCalendar,
  CALENDAR_STYLE,
  keyDates,
  monthLabel,
  toIso,
} from "@/lib/acc/calendar-data";
import { shortDate, TODAY } from "@/lib/acc/dashboard-data";
import { useIsPhone } from "@/hooks/use-media-query";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { useAccRecurringExpenses } from "@/lib/acc/recurring-expenses-store";
import { useAccVendorInvoices } from "@/lib/acc/vendor-invoices-store";

const VIEWS = ["Month", "Week"] as const;
type View = (typeof VIEWS)[number];

/** The month the calendar opens on — the one the portal treats as current. */
const [OPEN_YEAR, OPEN_MONTH] = TODAY.split("-").map(Number);

/**
 * The accountant's financial calendar.
 *
 * Read-only on purpose: a date here belongs to the record that owns it, so it
 * moves by approving the invoice or editing the schedule, not by dragging it
 * across a grid.
 */
export function AccCalendarView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const invoices = useAccVendorInvoices();
  const recurring = useAccRecurringExpenses();

  // A seven-column grid cannot show a whole week on a phone, so the schedule
  // leads there — until the accountant asks for the grid themselves.
  const phone = useIsPhone();
  const [chosenView, setView] = useState<View | null>(null);
  const view = chosenView ?? (phone ? "Week" : "Month");
  /** The month on screen, zero-based like `Date`. */
  const [cursor, setCursor] = useState({
    year: OPEN_YEAR,
    month: OPEN_MONTH - 1,
  });

  const events = useMemo(
    () =>
      buildAccCalendar({
        propertyId,
        year: cursor.year,
        month: cursor.month,
        invoices,
        recurring,
        period,
      }),
    [propertyId, cursor, invoices, recurring, period],
  );

  /** The grid draws one month; the list runs on from it. */
  const inMonth = useMemo(() => {
    const prefix = toIso(cursor.year, cursor.month, 1).slice(0, 7);
    return events.filter((event) => event.date.startsWith(prefix));
  }, [events, cursor]);

  const upcoming = useMemo(() => keyDates(events, TODAY), [events]);

  function step(delta: number) {
    setCursor((current) => {
      const date = new Date(current.year, current.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  const label = monthLabel(cursor.year, cursor.month);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Calendar
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Financial calendar and key dates
          </p>
        </div>

        <div
          role="group"
          aria-label="Calendar view"
          className="inline-flex rounded-lg bg-gray-100 p-1"
        >
          {VIEWS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={`rounded-md px-6 py-1.5 text-[14px] transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                view === option
                  ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "font-medium text-muted hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

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
            {label}
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

        {view === "Month" ? (
          <AccMonthView
            year={cursor.year}
            month={cursor.month}
            today={TODAY}
            events={inMonth}
          />
        ) : (
          <AccScheduleView events={events} />
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-[15px] font-bold text-ink">Upcoming Key Dates</h2>

        {upcoming.length === 0 ? (
          <p className="mt-3 text-[14px] text-muted">
            Nothing falls due after {shortDate(TODAY)}.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {upcoming.map((event) => (
              <li key={event.id} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full border ${CALENDAR_STYLE[event.kind].bar}`}
                />
                <span className="w-[52px] shrink-0 text-[14px] text-muted">
                  {shortDate(event.date)}
                </span>
                <span className="min-w-0 text-[14px] text-ink">
                  {event.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
