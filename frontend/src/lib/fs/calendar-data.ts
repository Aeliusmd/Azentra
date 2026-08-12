import {
  CalendarCheck,
  MapPin,
  Search,
  Siren,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { FsInspection } from "@/lib/fs/inspections-data";
import type { PreventiveTask } from "@/lib/fs/preventive-data";
import type { SiteVisit } from "@/lib/fs/site-visits-data";
import {
  minutesOf,
  type FsWorkOrder,
  type FsWorkOrderPriority,
} from "@/lib/fs/work-orders-data";

/**
 * The calendar does not own any data: it folds work orders, site visits,
 * inspections, preventive rounds and the supervisor's own entries into one
 * shape, so a job rescheduled anywhere moves here too.
 */

export const EVENT_TYPES = [
  "Emergency",
  "Maintenance",
  "Site Visit",
  "Inspection",
  "Preventive",
  "Meeting",
] as const;
export type CalendarEventType = (typeof EVENT_TYPES)[number];

export const TYPE_STYLE: Record<
  CalendarEventType,
  { dot: string; card: string; icon: LucideIcon; iconColor: string }
> = {
  Emergency: {
    dot: "bg-[#e0554d]",
    card: "border-rose-200 bg-rose-50/70",
    icon: Siren,
    iconColor: "text-rose-600",
  },
  Maintenance: {
    dot: "bg-brand",
    card: "border-green-200 bg-green-50/70",
    icon: Wrench,
    iconColor: "text-green-600",
  },
  "Site Visit": {
    dot: "bg-[#e8a33d]",
    card: "border-amber-200 bg-amber-50/70",
    icon: MapPin,
    iconColor: "text-amber-600",
  },
  Inspection: {
    dot: "bg-[#5b7f9c]",
    card: "border-[#dbe6f0] bg-[#f2f6fa]",
    icon: Search,
    iconColor: "text-[#5b7f9c]",
  },
  Preventive: {
    dot: "bg-[#2e6cad]",
    card: "border-[#d5e3f4] bg-[#eef4fb]",
    icon: CalendarCheck,
    iconColor: "text-[#2e6cad]",
  },
  Meeting: {
    dot: "bg-[#7c8794]",
    card: "border-hairline bg-white",
    icon: Users,
    iconColor: "text-gray-500",
  },
};

export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 12h `HH:MM AM`. */
  time: string;
  type: CalendarEventType;
  technician: string | null;
  /** Short where-line under the title. */
  place: string;
  priority: FsWorkOrderPriority | null;
};

/* --------------------------------- Dates ---------------------------------- */

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SHORT_MONTHS = MONTHS.map((month) => month.slice(0, 3));

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toIso(year: number, month: number, day: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
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

/** `Aug 12, 2026`. */
export function shortDate(iso: string) {
  const date = fromIso(iso);
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** `Wednesday, August 12, 2026`. */
export function longDate(iso: string) {
  const date = fromIso(iso);
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];
  return `${weekday}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Monday to Friday around a date — field work is rostered on the work week. */
export function workWeekOf(iso: string) {
  const date = fromIso(iso);
  // Sunday counts as belonging to the week that just ended.
  const offset = date.getDay() === 0 ? -6 : 1 - date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() + offset);

  return Array.from({ length: 5 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return isoOf(day);
  });
}

/** Weeks of seven cells; `null` pads the days outside the month. */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, index) => toIso(year, month, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
}

/* -------------------------------- Building -------------------------------- */

function place(building: string, location: string) {
  return [building, location].filter(Boolean).join(" · ");
}

/**
 * Every scheduled thing on the supervisor's plate, across the properties they
 * cover. Unscheduled work has no slot, so it never reaches the calendar.
 */
export function buildEvents({
  orders,
  visits,
  inspections,
  preventive,
  extras,
}: {
  orders: FsWorkOrder[];
  visits: SiteVisit[];
  inspections: FsInspection[];
  preventive: PreventiveTask[];
  extras: CalendarEvent[];
}): CalendarEvent[] {
  const jobs: CalendarEvent[] = orders
    .filter((order) => order.scheduledDate && order.scheduledTime)
    .map((order) => ({
      id: order.id,
      title: order.title,
      date: order.scheduledDate!,
      time: order.scheduledTime!,
      type: order.workType === "Emergency" ? "Emergency" : "Maintenance",
      technician: order.technician,
      place: place(order.building, order.location),
      priority: order.priority,
    }));

  const rounds: CalendarEvent[] = visits.map((visit) => ({
    id: visit.id,
    // The summary is a sentence — too long for a chip, so the purpose leads.
    title: `Site Visit - ${visit.purpose}`,
    date: visit.date,
    time: visit.time,
    type: "Site Visit",
    technician: visit.technician,
    place: place(visit.building, visit.location),
    priority: null,
  }));

  const checks: CalendarEvent[] = inspections.map((inspection) => ({
    id: inspection.id,
    title: inspection.title,
    date: inspection.date,
    time: inspection.time,
    type: "Inspection",
    technician: inspection.technician,
    place: place(inspection.building, inspection.location),
    priority: null,
  }));

  const servicing: CalendarEvent[] = preventive.map((task) => ({
    id: task.id,
    title: task.title,
    date: task.nextDate,
    time: task.time,
    type: "Preventive",
    technician: task.technician,
    place: place(task.building, task.location),
    priority: null,
  }));

  return [...jobs, ...rounds, ...checks, ...servicing, ...extras];
}

/** Earliest first — every view reads down the day. */
export function byTime(a: CalendarEvent, b: CalendarEvent) {
  return minutesOf(a.time) - minutesOf(b.time);
}

export function eventsOn(events: CalendarEvent[], iso: string) {
  return events.filter((event) => event.date === iso).sort(byTime);
}
