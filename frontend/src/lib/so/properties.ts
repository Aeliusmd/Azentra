"use client";

import { useSyncExternalStore } from "react";

import { guardedProperties } from "@/lib/so/properties-data";

/**
 * Which property the portal is currently watching.
 *
 * Module-level so the dashboard's selector and every page body agree on which
 * site is being looked at; resets on reload like the other mock stores. The
 * property list itself is server-safe and lives in `properties-data.ts`.
 */

let selectedId = guardedProperties[0].id;
const listeners = new Set<() => void>();

export function selectSoProperty(id: string) {
  if (id === selectedId) return;
  if (!guardedProperties.some((property) => property.id === id)) return;
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
  return guardedProperties[0].id;
}

export function useSelectedSoProperty() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
