import {
  Building2,
  CalendarDays,
  Receipt,
  UserRoundCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { balanceOf, type ResidentInvoice } from "@/lib/res/bills-data";
import { upcomingBookings, type FacilityBooking } from "@/lib/res/bookings-data";
import { clockTime, shortDate, weekdayShort } from "@/lib/res/format";
import type { MaintenanceRequest } from "@/lib/res/maintenance-data";
import type { PropertyEvent } from "@/lib/res/property-events-data";
import { isUpcoming, type VisitorPass } from "@/lib/res/visitors-data";

/**
 * The resident's diary.
 *
 * It owns nothing. A visit, a booking, a due date and a building notice already
 * exist elsewhere in the portal — this folds them into one shape so that
 * cancelling a booking or paying a bill removes the entry, rather than leaving
 * a second copy of the date to go stale.
 */

export const CALENDAR_KINDS = [
  "Maintenance",
  "Facility Booking",
  "Visitor",
  "Bill Due",
  "Property Event",
] as const;
export type ResEventKind = (typeof CALENDAR_KINDS)[number];

export const KIND_STYLE: Record<
  ResEventKind,
  { chip: string; dot: string; icon: LucideIcon; tile: string; short: string }
> = {
  Maintenance: {
    chip: "bg-[#eef4fb] text-[#2e6cad]",
    dot: "bg-[#2e6cad]",
    icon: Wrench,
    tile: "bg-[#eef4fb] text-[#2e6cad]",
    short: "Maintenance",
  },
  "Facility Booking": {
    chip: "bg-green-50 text-green-700",
    dot: "bg-green-500",
    icon: Building2,
    tile: "bg-green-50 text-green-600",
    short: "Facility",
  },
  Visitor: {
    chip: "bg-[#eef3f9] text-[#5b7f9c]",
    dot: "bg-[#5b7f9c]",
    icon: UserRoundCheck,
    tile: "bg-[#eef3f9] text-[#5b7f9c]",
    short: "Visitor",
  },
  "Bill Due": {
    chip: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    icon: Receipt,
    tile: "bg-amber-50 text-amber-600",
    short: "Bill",
  },
  "Property Event": {
    chip: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
    icon: CalendarDays,
    tile: "bg-gray-100 text-gray-500",
    short: "Property",
  },
};

export type ResCalendarEvent = {
  id: string;
  title: string;
  kind: ResEventKind;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`, or null when it has no clock time. */
  time: string | null;
  /** Runs the whole day rather than at a moment. */
  allDay: boolean;
  /** Where it stands — `Confirmed`, `Pending`, `Notice`. */
  status: string;
};

/** `7:00 AM`, `All Day`, or nothing at all. */
export function timeLabel(event: ResCalendarEvent) {
  if (event.allDay) return "All Day";
  return event.time ? clockTime(event.time) : "";
}

/** `Thu, Aug 13 7:00 AM` — the line under a title in the upcoming list. */
export function whenLabel(event: ResCalendarEvent) {
  const time = timeLabel(event);
  return time ? `${weekdayShort(event.date)} ${time}` : weekdayShort(event.date);
}

/** What the chip in a month cell reads. */
export function chipLabel(event: ResCalendarEvent) {
  const time = timeLabel(event);
  return time ? `${time} ${event.title}` : event.title;
}

/* --------------------------------- Dates ---------------------------------- */

export const WEEKDAY_HEADS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** `2026, 7, 13` → `2026-08-13`; `month` is zero-based, like `Date`. */
export function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Weeks of seven cells; `null` pads the days outside the month. */
export function monthGrid(year: number, month: number) {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

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

/** `Maria Rodriguez` → `Maria Visits`, the way a diary entry would put it. */
function visitTitle(name: string) {
  return `${name.trim().split(/\s+/)[0]} Visits`;
}

/**
 * Every dated thing on this household's plate, soonest first.
 *
 * Only what is still ahead: a diary is for what is coming, and the month grid
 * draws whichever month is on screen from the same list.
 */
export function buildResCalendar({
  today,
  bookings,
  requests,
  passes,
  invoices,
  events,
}: {
  today: string;
  bookings: FacilityBooking[];
  requests: MaintenanceRequest[];
  passes: VisitorPass[];
  invoices: ResidentInvoice[];
  events: PropertyEvent[];
}): ResCalendarEvent[] {
  const booked: ResCalendarEvent[] = upcomingBookings(today, bookings, [
    "Confirmed",
    "Pending",
  ]).map((booking) => ({
    id: `bk-${booking.id}`,
    title: `${booking.facility} Booking`,
    kind: "Facility Booking",
    date: booking.date,
    time: booking.from,
    allDay: false,
    status: booking.status,
  }));

  // Only a request with a visit booked has anything to put in a diary.
  const visits: ResCalendarEvent[] = requests
    .filter((request) => request.appointment && request.appointment >= today)
    .map((request) => ({
      id: `mr-${request.id}`,
      title: `${request.category} Visit`,
      kind: "Maintenance",
      date: request.appointment!,
      time: request.time,
      allDay: false,
      status: request.status,
    }));

  const visitors: ResCalendarEvent[] = passes
    .filter((pass) => isUpcoming(pass, today))
    .map((pass) => ({
      id: `vp-${pass.id}`,
      title: visitTitle(pass.name),
      kind: "Visitor",
      date: pass.date,
      time: pass.arriving,
      allDay: false,
      status: pass.status,
    }));

  const dues: ResCalendarEvent[] = invoices
    .filter((invoice) => balanceOf(invoice) > 0 && invoice.dueDate >= today)
    .map((invoice) => ({
      id: `bl-${invoice.id}`,
      title: "Bill Due Date",
      kind: "Bill Due",
      date: invoice.dueDate,
      time: null,
      allDay: false,
      status: "Upcoming",
    }));

  const notices: ResCalendarEvent[] = events
    .filter((event) => event.date >= today)
    .map((event) => ({
      id: `pe-${event.id}`,
      title: event.title,
      kind: "Property Event",
      date: event.date,
      time: event.time,
      allDay: event.time === null,
      status: event.status,
    }));

  return [...booked, ...visits, ...visitors, ...dues, ...notices].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""),
  );
}

export function eventsOn(events: ResCalendarEvent[], iso: string) {
  return events.filter((event) => event.date === iso);
}

/** `Aug 13` — used in the accessible name of a day cell. */
export { shortDate };
