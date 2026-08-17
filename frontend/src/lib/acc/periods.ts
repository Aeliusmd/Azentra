"use client";

import { useSyncExternalStore } from "react";

/**
 * The billing period the accountant is working in.
 *
 * Utilities are billed a month at a time, so the month — not a free date range
 * — is the unit every financial screen is scoped by. Held alongside the
 * property selection so the two together answer "whose books, which month".
 */

export type AccPeriod = {
  /** `2026-08` — the key the mock data is filed under. */
  id: string;
  /** `August 2026` — what the selector shows. */
  label: string;
  /** `Aug` — the chart axis form. */
  short: string;
};

/** Newest first, the way the selector lists them. */
export const billingPeriods: AccPeriod[] = [
  { id: "2026-08", label: "August 2026", short: "Aug" },
  { id: "2026-07", label: "July 2026", short: "Jul" },
  { id: "2026-06", label: "June 2026", short: "Jun" },
];

/** Oldest first — the order a trend chart plots them in. */
export const PERIOD_SERIES = [...billingPeriods].reverse();

/** The month the portal opens on. */
export const CURRENT_PERIOD = billingPeriods[0].id;

export function periodLabel(id: string) {
  return billingPeriods.find((period) => period.id === id)?.label ?? "—";
}

let selectedId = CURRENT_PERIOD;
const listeners = new Set<() => void>();

export function selectAccPeriod(id: string) {
  if (id === selectedId) return;
  if (!billingPeriods.some((period) => period.id === id)) return;
  selectedId = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return selectedId;
}

function getServerSnapshot() {
  return CURRENT_PERIOD;
}

export function useSelectedAccPeriod() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
