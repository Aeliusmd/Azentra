"use client";

import { useSyncExternalStore } from "react";

import {
  fieldReports as seed,
  nextReportId,
  type FsFieldReport,
  type FsReportType,
} from "@/lib/fs/field-reports-data";

/**
 * Field reports held in a module store so one filed from the form shows up on
 * the list behind it. Resets on reload like the other mock stores.
 */

let reports: FsFieldReport[] = seed;
const listeners = new Set<() => void>();

export type NewFieldReportInput = {
  propertyId: string;
  type: FsReportType;
  location: string;
  author: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  summary: string;
};

export function addFieldReport(input: NewFieldReportInput) {
  const id = nextReportId(reports);

  const report: FsFieldReport = {
    id,
    type: input.type,
    propertyId: input.propertyId,
    // Site-wide summaries are filed without a location.
    location: input.location || "N/A",
    author: input.author,
    date: input.date,
    // Written up and filed in one go — there is no half-finished state here.
    status: "Submitted",
    summary: input.summary,
  };

  reports = [report, ...reports];
  listeners.forEach((listener) => listener());

  return id;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return reports;
}

function getServerSnapshot() {
  return seed;
}

export function useFsFieldReports() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
