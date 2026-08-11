"use client";

import { useSyncExternalStore } from "react";

import {
  availabilityWeek,
  type AvailabilityDay,
} from "@/lib/tech/availability-data";

/**
 * The technician's own availability. Module-level so an edit is visible
 * everywhere at once; resets on reload like the other mock stores.
 */

let week: AvailabilityDay[] = availabilityWeek;
const listeners = new Set<() => void>();

export function updateAvailability(
  date: string,
  patch: Partial<AvailabilityDay>,
) {
  week = week.map((day) => (day.date === date ? { ...day, ...patch } : day));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return week;
}

function getServerSnapshot() {
  return availabilityWeek;
}

export function useAvailability() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
