"use client";

import { useSyncExternalStore } from "react";

/**
 * The supervisor's own preferences. Module-level so a saved change reaches the
 * pages that read it — the calendar opens on the view chosen here — and resets
 * on reload like the other mock stores.
 */

export const CALENDAR_VIEWS = ["Day", "Week", "Month"] as const;
export type FsCalendarView = (typeof CALENDAR_VIEWS)[number];

/** The zones the office operates in. */
export const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Colombo",
  "Australia/Sydney",
] as const;

export type FsSettings = {
  push: boolean;
  email: boolean;
  emergency: boolean;
  dailyDigest: boolean;
  calendarView: FsCalendarView;
  timezone: string;
  autoAssign: boolean;
};

const initial: FsSettings = {
  push: true,
  email: true,
  emergency: true,
  dailyDigest: false,
  calendarView: "Day",
  timezone: "America/New_York",
  autoAssign: false,
};

let settings = initial;
const listeners = new Set<() => void>();

export function saveFsSettings(next: FsSettings) {
  settings = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return settings;
}

function getServerSnapshot() {
  return initial;
}

export function useFsSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
