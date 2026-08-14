"use client";

import { useSyncExternalStore } from "react";

import type { FsReportKindId } from "@/lib/fs/reports-data";

/**
 * What has been run lately. The file itself is never kept — a report is a view
 * of the stores at a moment, so downloading a recent one runs it again against
 * today's data rather than handing back a stale copy.
 */

export type FsRecentReport = {
  id: number;
  kind: FsReportKindId;
  title: string;
  /** `MMM D, YYYY` as shown on the row. */
  date: string;
};

const SEED: FsRecentReport[] = [
  {
    id: 1,
    kind: "work-orders",
    title: "Weekly Work Order Summary",
    date: "Aug 11, 2026",
  },
  {
    id: 2,
    kind: "inspections",
    title: "Tower A Fire Inspection Report",
    date: "Aug 10, 2026",
  },
  {
    id: 3,
    kind: "technicians",
    title: "Technician Performance - July",
    date: "Aug 8, 2026",
  },
];

let recent: FsRecentReport[] = SEED;
let nextId = SEED.length + 1;
const listeners = new Set<() => void>();

/** How many rows the panel keeps — older runs fall off the bottom. */
const KEPT = 8;

export function recordReport(
  kind: FsReportKindId,
  title: string,
  date: string,
) {
  recent = [{ id: nextId++, kind, title, date }, ...recent].slice(0, KEPT);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return recent;
}

function getServerSnapshot() {
  return SEED;
}

export function useFsRecentReports() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
