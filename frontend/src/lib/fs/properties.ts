"use client";

import { useSyncExternalStore } from "react";

/**
 * The properties this Field Supervisor covers.
 *
 * Module-level store so the dashboard selector and every page body agree on
 * which site is being looked at; resets on reload like the other mock stores.
 */

export type FsProperty = {
  id: string;
  name: string;
  /** Buildings on site — used by the location filters. */
  buildings: string[];
};

export const supervisedProperties: FsProperty[] = [
  {
    id: "sunrise",
    name: "Sunrise Residence",
    buildings: ["Tower A", "Tower B", "Common Area"],
  },
  {
    id: "green-valley",
    name: "Green Valley Towers",
    buildings: ["Block 1", "Block 2", "Common Area"],
  },
];

export const PROPERTY_NAMES = supervisedProperties.map(
  (property) => property.name,
);

export function propertyName(id: string) {
  return (
    supervisedProperties.find((property) => property.id === id)?.name ?? "—"
  );
}

let selectedId = supervisedProperties[0].id;
const listeners = new Set<() => void>();

export function selectFsProperty(id: string) {
  if (id === selectedId) return;
  if (!supervisedProperties.some((property) => property.id === id)) return;
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
  return supervisedProperties[0].id;
}

export function useSelectedFsProperty() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
