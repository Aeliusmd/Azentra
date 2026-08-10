"use client";

import { useSyncExternalStore } from "react";

/**
 * The properties assigned to the signed-in Property Manager.
 *
 * Module-level store so the header selector and the page body always agree;
 * resets on reload like the other mock stores.
 */

export type PmProperty = {
  id: string;
  name: string;
};

export const assignedProperties: PmProperty[] = [
  { id: "sunrise", name: "Sunrise Residence" },
  { id: "green-valley", name: "Green Valley Towers" },
];

let selectedId = assignedProperties[0].id;
const listeners = new Set<() => void>();

export function selectProperty(id: string) {
  if (id === selectedId) return;
  if (!assignedProperties.some((item) => item.id === id)) return;
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

export function useSelectedPropertyId() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
