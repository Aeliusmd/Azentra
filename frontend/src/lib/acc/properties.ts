"use client";

import { useSyncExternalStore } from "react";

/**
 * The properties this Accountant is authorised to bill for.
 *
 * The accountant only ever sees money belonging to a property on this list —
 * every figure on every page is scoped through the selection here. Module-level
 * so the header selector and each page body agree on which books are open;
 * resets on reload like the other mock stores.
 */

export type AccProperty = {
  id: string;
  name: string;
  /** Buildings on site — used by the billing and invoice filters. */
  buildings: string[];
  /**
   * Billable units, and so also the number of unit bills a full cycle raises —
   * which is why this matches the dashboard's "bills generated" count.
   * Divides the common-area total on the allocation screen.
   */
  units: number;
};

export const assignedProperties: AccProperty[] = [
  {
    id: "sunrise",
    name: "Sunrise Residence",
    buildings: ["Tower A", "Tower B", "Common Area"],
    units: 320,
  },
  {
    id: "ocean-view",
    name: "Ocean View Towers",
    buildings: ["Tower 1", "Tower 2", "Common Area"],
    units: 240,
  },
  {
    id: "garden-heights",
    name: "Garden Heights",
    buildings: ["North Wing", "South Wing"],
    units: 186,
  },
];

export const ACC_PROPERTY_NAMES = assignedProperties.map(
  (property) => property.name,
);

export function accPropertyName(id: string) {
  return assignedProperties.find((property) => property.id === id)?.name ?? "—";
}

let selectedId = assignedProperties[0].id;
const listeners = new Set<() => void>();

export function selectAccProperty(id: string) {
  if (id === selectedId) return;
  if (!assignedProperties.some((property) => property.id === id)) return;
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
  return assignedProperties[0].id;
}

export function useSelectedAccProperty() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
