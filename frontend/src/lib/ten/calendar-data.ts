import {
  Building2,
  CalendarDays,
  Receipt,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { fromIso } from "@/lib/res/format";
import {
  balanceOf,
  isOutstanding,
  tenantInvoices,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import { tenBookings, type FacilityBooking } from "@/lib/ten/bookings-data";
import {
  requestDate,
  tenMaintenanceRequests,
  type TenMaintenanceRequest,
} from "@/lib/ten/maintenance-data";
import {
  tenPropertyEvents,
  type PropertyEvent,
} from "@/lib/ten/property-events-data";
import { tenVisitorPasses, type VisitorPass } from "@/lib/ten/visitors-data";

/**
 * The tenant's diary, folded together from the records themselves.
 *
 * Nothing is scheduled here. Every entry is a maintenance visit, a booking, a
 * visitor pass, a bill's due date or a property notice that already exists
 * somewhere else in the portal — so the calendar cannot show a booking the
 * Facilities page has since cancelled, and a bill paid on the Bills page stops
 * being due here in the same breath.
 */

export const EVENT_TYPES = [
  "Maintenance",
  "Facility Booking",
  "Visitor",
  "Bill Due",
  "Property Event",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** The dot under a day, and the key on the legend. */
export const TYPE_DOT: Record<EventType, string> = {
  Maintenance: "bg-orange-500",
  "Facility Booking": "bg-[#3b82f6]",
  Visitor: "bg-violet-500",
  "Bill Due": "bg-rose-500",
  "Property Event": "bg-[#2eb08a]",
};

/** Tile behind the glyph on a list row. */
export const TYPE_CHIP: Record<EventType, string> = {
  Maintenance: "bg-orange-50 text-orange-500",
  "Facility Booking": "bg-[#eef3f9] text-[#2e6cad]",
  Visitor: "bg-violet-50 text-violet-600",
  "Bill Due": "bg-rose-50 text-rose-500",
  "Property Event": "bg-green-50 text-green-600",
};

export const TYPE_ICON: Record<EventType, LucideIcon> = {
  Maintenance: Wrench,
  "Facility Booking": Building2,
  Visitor: UserRoundPlus,
  "Bill Due": Receipt,
  "Property Event": CalendarDays,
};

export type TenCalendarEvent = {
  /** Unique across the sources, which have overlapping id schemes. */
  id: string;
  title: string;
  type: EventType;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`, or null for an all-day entry. */
  time: string | null;
  /** The underlying record's own status, shown as-is. */
  status: string;
  /** Second line on a detail dialog — what the entry actually refers to. */
  detail: string;
};

/* ------------------------------- Assembling ------------------------------- */

function fromRequests(requests: TenMaintenanceRequest[]): TenCalendarEvent[] {
  return requests
    .filter((request) => request.appointment !== null)
    .map((request) => ({
      id: `cal-mr-${request.id}`,
      // The request record carries no short title, so the category names the
      // entry and the id identifies it.
      title: `${request.category} Visit`,
      type: "Maintenance" as const,
      date: requestDate(request),
      time: request.appointmentTime,
      status: request.status,
      detail: `${request.id} · ${request.location}`,
    }));
}

function fromBookings(bookings: FacilityBooking[]): TenCalendarEvent[] {
  return bookings
    .filter(
      (booking) =>
        booking.status !== "Cancelled" && booking.status !== "Rejected",
    )
    .map((booking) => ({
      id: `cal-bk-${booking.id}`,
      title: booking.facility,
      type: "Facility Booking" as const,
      date: booking.date,
      time: booking.from,
      status: booking.status,
      detail: `${booking.id} · ${booking.guests} guest${
        booking.guests === 1 ? "" : "s"
      }`,
    }));
}

function fromPasses(passes: VisitorPass[]): TenCalendarEvent[] {
  return passes
    .filter((pass) => pass.status !== "Cancelled")
    .map((pass) => ({
      id: `cal-vp-${pass.id}`,
      title: pass.name,
      type: "Visitor" as const,
      date: pass.date,
      time: pass.from,
      status: pass.status,
      detail: `${pass.id} · ${pass.purpose}`,
    }));
}

/**
 * Only bills that still owe something appear. Paying one takes it off the
 * calendar, which is the whole point of deriving this rather than listing it.
 */
function fromInvoices(invoices: TenantInvoice[]): TenCalendarEvent[] {
  return invoices.filter(isOutstanding).map((invoice) => ({
    id: `cal-inv-${invoice.id}`,
    title: `${invoice.type} Due`,
    type: "Bill Due" as const,
    date: invoice.dueDate,
    time: null,
    status: "Due",
    detail: `${invoice.id} · balance ${balanceOf(invoice)}`,
  }));
}

function fromPropertyEvents(events: PropertyEvent[]): TenCalendarEvent[] {
  return events.map((event) => ({
    id: `cal-pe-${event.id}`,
    title: event.title,
    type: "Property Event" as const,
    date: event.date,
    time: event.time,
    status: event.status,
    detail: "Property notice",
  }));
}

/** Earliest first; an all-day entry leads the day it falls on. */
function byWhen(a: TenCalendarEvent, b: TenCalendarEvent) {
  return (
    a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? "")
  );
}

export function tenCalendarEvents(
  requests: TenMaintenanceRequest[] = tenMaintenanceRequests,
  bookings: FacilityBooking[] = tenBookings,
  passes: VisitorPass[] = tenVisitorPasses,
  invoices: TenantInvoice[] = tenantInvoices,
  events: PropertyEvent[] = tenPropertyEvents,
): TenCalendarEvent[] {
  return [
    ...fromRequests(requests),
    ...fromBookings(bookings),
    ...fromPasses(passes),
    ...fromInvoices(invoices),
    ...fromPropertyEvents(events),
  ].sort(byWhen);
}

/* -------------------------------- Selecting ------------------------------- */

export function eventsOnDay(iso: string, events: TenCalendarEvent[]) {
  return events.filter((event) => event.date === iso);
}

/** Today and everything after it, soonest first. */
export function upcomingEvents(today: string, events: TenCalendarEvent[]) {
  return events.filter((event) => event.date >= today);
}

/* --------------------------------- Months --------------------------------- */

/** `2026-08-12` → `2026-08`. */
export function monthOf(iso: string) {
  return iso.slice(0, 7);
}

/** ISO day for a year/month/day, without going through `Date`'s UTC parsing. */
export function isoDay(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type MonthCell = {
  /** ISO day, or null for the padding before the 1st and after the last. */
  iso: string | null;
  day: number | null;
};

/**
 * Six weeks of cells covering one month, padded to whole weeks.
 *
 * Padding is empty rather than showing the neighbouring month's numbers: a
 * tenant reading their own diary does not need August to end in September's
 * dates.
 */
export function monthGrid(period: string): MonthCell[] {
  const [year, month] = period.split("-").map(Number);

  const first = fromIso(isoDay(year, month, 1));
  const leading = first.getDay();
  const days = new Date(year, month, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < leading; i++) cells.push({ iso: null, day: null });
  for (let day = 1; day <= days; day++) {
    cells.push({ iso: isoDay(year, month, day), day });
  }
  while (cells.length % 7 !== 0) cells.push({ iso: null, day: null });

  return cells;
}

/** `2026-08` → `2026-09`, and `2026-12` → `2027-01`. */
export function shiftMonth(period: string, step: number) {
  const [year, month] = period.split("-").map(Number);
  const index = (year * 12 + (month - 1)) + step;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}
