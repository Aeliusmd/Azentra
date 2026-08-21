import {
  CalendarCheck,
  CalendarX2,
  CircleDollarSign,
  Clock,
  FilePlus2,
  Gauge,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { accDashboardFor, MONTHS, SHORT_MONTHS } from "@/lib/acc/dashboard-data";
import {
  nextPaymentDate,
  type RecurringExpense,
} from "@/lib/acc/recurring-expenses-data";
import type { VendorInvoice } from "@/lib/acc/vendor-invoices-data";

/**
 * The accountant's financial calendar.
 *
 * It owns no records of its own. Every mark on it is something already on file
 * somewhere else — a vendor invoice falling due, a standing charge coming round
 * again, the cycle's own closing date — folded into one shape. Approve an
 * invoice or pause a schedule and the calendar changes with it, because there
 * is no second copy of the date to go stale.
 */

export const CALENDAR_KINDS = [
  "Billing",
  "Vendor Payment",
  "Invoice Due",
  "Recurring",
  "Meter Reading",
  "Budget Review",
  "Month-End",
] as const;
export type AccCalendarKind = (typeof CALENDAR_KINDS)[number];

/**
 * Colour carries the meaning: green is money going out on schedule, amber is
 * money owed that nobody has released yet, red is the hard cut-off, and the
 * navy family is the billing cycle's own routine.
 */
export const CALENDAR_STYLE: Record<
  AccCalendarKind,
  { bar: string; icon: LucideIcon; iconColor: string }
> = {
  Billing: {
    bar: "border-[#dbe6f0] bg-[#eff4f9] text-[#1b3a5c]",
    icon: FilePlus2,
    iconColor: "text-[#2e6cad]",
  },
  "Vendor Payment": {
    bar: "border-green-200 bg-green-50 text-green-700",
    icon: CircleDollarSign,
    iconColor: "text-green-600",
  },
  "Invoice Due": {
    bar: "border-amber-200 bg-amber-50 text-amber-700",
    icon: CalendarCheck,
    iconColor: "text-amber-600",
  },
  Recurring: {
    bar: "border-[#e0dcf3] bg-[#f3f1fb] text-purple-700",
    icon: RefreshCw,
    iconColor: "text-purple-500",
  },
  "Meter Reading": {
    bar: "border-[#dbe6f0] bg-[#eff4f9] text-[#1b3a5c]",
    icon: Gauge,
    iconColor: "text-[#2e6cad]",
  },
  "Budget Review": {
    bar: "border-[#dbe6f0] bg-[#eff4f9] text-[#1b3a5c]",
    icon: Clock,
    iconColor: "text-[#5b7f9c]",
  },
  "Month-End": {
    bar: "border-rose-200 bg-rose-50 text-rose-700",
    icon: CalendarX2,
    iconColor: "text-rose-600",
  },
};

export type AccCalendarEvent = {
  id: string;
  title: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  kind: AccCalendarKind;
  /** Only the entries that move money carry one. */
  amount?: number;
};

/* --------------------------------- Dates ---------------------------------- */

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** `2026, 7, 15` → `2026-08-15`; `month` is zero-based, like `Date`. */
export function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Local midnight for an ISO date — never `new Date(iso)`, which reads as UTC. */
export function fromIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isoOf(date: Date) {
  return toIso(date.getFullYear(), date.getMonth(), date.getDate());
}

/** How long a month runs — day 0 of the next one is the last of this one. */
export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** `2026-08-15` → `Sat, Aug 15`. */
export function weekdayDate(iso: string) {
  const date = fromIso(iso);
  return `${WEEKDAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** `August 2026`. */
export function monthLabel(year: number, month: number) {
  return `${MONTHS[month]} ${year}`;
}

/** Weeks of seven cells; `null` pads the days outside the month. */
export function monthGrid(year: number, month: number) {
  const lead = new Date(year, month, 1).getDay();
  const days = daysInMonth(year, month);

  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, index) => toIso(year, month, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
}

/* -------------------------------- Building -------------------------------- */

/**
 * Trailing words that say what kind of company a supplier is rather than which
 * one — dead weight in a calendar chip only wide enough for a few words.
 */
const SUFFIXES = [
  "Pool Services",
  "Services",
  "Solutions",
  "Lanka",
  "Ltd",
  "Co",
  "Board",
];

/** `CleanPro Services` → `CleanPro`; `ABC Plumbing` is already short enough. */
export function shortVendor(vendor: string) {
  const suffix = SUFFIXES.find(
    (candidate) =>
      vendor.endsWith(` ${candidate}`) &&
      vendor.length > candidate.length + 1 + 2,
  );
  return suffix ? vendor.slice(0, -(suffix.length + 1)) : vendor;
}

/**
 * The cycle's own dates, which fall on the same days every month.
 *
 * Generated for whichever month is on screen rather than stored, so paging
 * forward shows the next cycle instead of an empty grid, and February's closing
 * lands on the 28th without anyone maintaining a list.
 */
const MILESTONES: {
  /** Day of the month, or `last` for whatever the final day works out to be. */
  day: number | "last";
  kind: AccCalendarKind;
  title: string;
}[] = [
  { day: 15, kind: "Billing", title: "Generate Utility Bills" },
  { day: 20, kind: "Budget Review", title: "Budget Review Meeting" },
  { day: 30, kind: "Meter Reading", title: "Utility Meter Reading" },
  { day: "last", kind: "Month-End", title: "Month-End Closing" },
];

function milestonesFor(year: number, month: number): AccCalendarEvent[] {
  const last = daysInMonth(year, month);

  return MILESTONES.map((milestone) => {
    // A reading round set for the 30th still happens in February.
    const day = milestone.day === "last" ? last : Math.min(milestone.day, last);

    return {
      id: `cycle-${milestone.kind}-${toIso(year, month, day)}`,
      title: milestone.title,
      date: toIso(year, month, day),
      kind: milestone.kind,
    };
  });
}

/**
 * Everything scheduled for one property, from the displayed month onwards.
 *
 * The cycle milestones are drawn for the month on screen; the rest carry their
 * own dates and are shown wherever they fall, which is how a standing charge
 * due next month reaches the list without the grid pretending it is this one.
 */
export function buildAccCalendar({
  propertyId,
  year,
  month,
  invoices,
  recurring,
  period,
}: {
  propertyId: string;
  year: number;
  month: number;
  invoices: VendorInvoice[];
  recurring: RecurringExpense[];
  period: string;
}): AccCalendarEvent[] {
  /**
   * Payments the accountant has already lined up. These come from the same
   * upcoming list the dashboard shows, so the two screens name the same date.
   */
  const scheduled = accDashboardFor(propertyId, period).upcoming.filter(
    (task) => task.kind === "Vendor Payment",
  );

  const payments: AccCalendarEvent[] = scheduled.map((task) => ({
    id: `pay-${task.id}`,
    title: task.title,
    date: task.date,
    kind: "Vendor Payment",
    amount: task.amount,
  }));

  /** Suppliers already in the payment run — marking them twice would misread. */
  const inTheRun = new Set(
    scheduled.map((task) => task.detail).filter(Boolean) as string[],
  );

  const dues: AccCalendarEvent[] = invoices
    .filter(
      (invoice) =>
        invoice.propertyId === propertyId &&
        invoice.status !== "Paid" &&
        !inTheRun.has(invoice.vendor),
    )
    .map((invoice) => ({
      id: `due-${invoice.id}`,
      title: `Invoice Due - ${shortVendor(invoice.vendor)}`,
      date: invoice.dueDate,
      kind: "Invoice Due",
      // The gross figure — what the supplier is actually owed.
      amount: invoice.total,
    }));

  const standing: AccCalendarEvent[] = recurring
    .filter(
      (schedule) =>
        schedule.propertyId === propertyId && schedule.status === "Active",
    )
    .map((schedule) => ({
      id: `rec-${schedule.id}`,
      title: `Recurring: ${schedule.name}`,
      date: nextPaymentDate(period, schedule.dueDay, schedule.frequency),
      kind: "Recurring",
      amount: schedule.amount,
    }));

  return [
    ...milestonesFor(year, month),
    ...payments,
    ...dues,
    ...standing,
  ].sort(byDate);
}

/** Earliest first — both views read forwards. */
export function byDate(a: AccCalendarEvent, b: AccCalendarEvent) {
  return a.date.localeCompare(b.date);
}

export function eventsOn(events: AccCalendarEvent[], iso: string) {
  return events.filter((event) => event.date === iso);
}

/** What is coming up next, for the summary list under the grid. */
export function keyDates(
  events: AccCalendarEvent[],
  today: string,
  limit = 5,
): AccCalendarEvent[] {
  return events.filter((event) => event.date >= today).slice(0, limit);
}
