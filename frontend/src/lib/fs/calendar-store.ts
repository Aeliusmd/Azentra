"use client";

import { useSyncExternalStore } from "react";

import type { CalendarEvent } from "@/lib/fs/calendar-data";

/**
 * Calendar entries that belong to nothing else — the standups and reviews the
 * supervisor keeps, plus anything added from the Add Event dialog. Everything
 * else on the calendar is derived from the work-order, visit, inspection and
 * preventive data. Resets on reload like the other mock stores.
 */

const seed: CalendarEvent[] = [
  {
    id: "EV-01",
    title: "Team Standup Meeting",
    date: "2026-08-12",
    time: "08:00 AM",
    type: "Meeting",
    technician: null,
    place: "Site Office",
    priority: null,
  },
  {
    id: "EV-02",
    title: "WO Review with PM",
    date: "2026-08-12",
    time: "04:00 PM",
    type: "Meeting",
    technician: null,
    place: "Site Office",
    priority: null,
  },
  {
    id: "EV-03",
    title: "Contractor Walkthrough - Lift Service",
    date: "2026-08-13",
    time: "03:30 PM",
    type: "Meeting",
    technician: "Michael Torres",
    place: "Tower A · Elevator 1",
    priority: null,
  },
];

let events: CalendarEvent[] = seed;
const listeners = new Set<() => void>();

let nextId = 0;

export function addCalendarEvent(event: Omit<CalendarEvent, "id">) {
  events = [...events, { ...event, id: `EV-new-${++nextId}` }];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return events;
}

function getServerSnapshot() {
  return seed;
}

export function useFsCalendarEvents() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
