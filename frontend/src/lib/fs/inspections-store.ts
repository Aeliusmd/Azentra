"use client";

import { useSyncExternalStore } from "react";

import {
  inspectionChecksFor,
  inspections as seed,
  nextInspectionId,
  type FsInspection,
  type InspectionType,
} from "@/lib/fs/inspections-data";
import { propertyName } from "@/lib/fs/properties";
import { splitLocation } from "@/lib/fs/work-orders-data";

/**
 * Inspections held in a module store so a check ticked in the dialog updates
 * the card behind it and the calendar alongside. Resets on reload like the
 * other mock stores.
 */

let list: FsInspection[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export type NewInspectionInput = {
  propertyId: string;
  type: InspectionType;
  /** Free text like `Tower A - Roof Level`; split into building and space. */
  location: string;
  technician: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
};

export function addInspection(input: NewInspectionInput) {
  const id = nextInspectionId(list);
  const { building, location } = splitLocation(input.location);

  const inspection: FsInspection = {
    id,
    title: `${input.type} Inspection - ${input.location}`,
    type: input.type,
    propertyId: input.propertyId,
    property: propertyName(input.propertyId),
    building,
    location,
    workOrderId: null,
    technician: input.technician || null,
    date: input.date,
    // The form books the day; the round is walked whenever the morning allows.
    time: "09:00 AM",
    status: "Scheduled",
    checklist: inspectionChecksFor(input.type, id),
    findings: "",
    notes: "",
    recommendations: "",
    photos: [],
  };

  list = [inspection, ...list];
  emit();

  return id;
}

/** Marks one check pass, fail, or back to unmarked. */
export function setInspectionCheck(
  id: string,
  itemId: string,
  passed: boolean | null,
) {
  list = list.map((inspection) =>
    inspection.id === id
      ? {
          ...inspection,
          checklist: inspection.checklist.map((item) =>
            item.id === itemId ? { ...item, passed } : item,
          ),
        }
      : inspection,
  );

  emit();
}

/**
 * Closes the round out. Deliberately not derived from the checklist: a round
 * can be closed with items left unmarked — not every check applies on the day —
 * so it is the supervisor who says it is done.
 */
export function completeInspection(id: string) {
  list = list.map((inspection) =>
    inspection.id === id
      ? { ...inspection, status: "Completed" as const }
      : inspection,
  );

  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return list;
}

function getServerSnapshot() {
  return seed;
}

export function useFsInspections() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
