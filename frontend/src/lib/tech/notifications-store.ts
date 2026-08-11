"use client";

import { useSyncExternalStore } from "react";

import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Technician notifications. Module-level store so the topbar bell and the
 * notifications page stay in sync; resets on reload like the other mock stores.
 */

export const SEVERITIES = ["Info", "Warning", "Error", "Success"] as const;
export type Severity = (typeof SEVERITIES)[number];

/** Filters offered on the notifications page. */
export const SEVERITY_FILTERS = ["Info", "Warning", "Error"] as const;

export const SEVERITY_DOT: Record<Severity, string> = {
  Info: "bg-[#2e6cad]",
  Warning: "bg-[#e8a33d]",
  Error: "bg-rose-500",
  Success: "bg-[#22a35c]",
};

export const SEVERITY_TONE: Record<Severity, PillTone> = {
  Info: "navy",
  Warning: "amber",
  Error: "red",
  Success: "green",
};

export type TechNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: Severity;
  read: boolean;
};

const seed: TechNotification[] = [
  {
    id: "tn1",
    title: "New work order assigned",
    detail: "WO-1042 Water Leakage — Unit A-304, Tower A. Priority: Emergency.",
    time: "2026-08-11 07:05",
    severity: "Error",
    read: false,
  },
  {
    id: "tn2",
    title: "Priority changed",
    detail: "WO-1038 Water Heater Malfunction raised from High to Emergency.",
    time: "2026-08-11 06:40",
    severity: "Warning",
    read: false,
  },
  {
    id: "tn3",
    title: "Preventive maintenance due",
    detail: "Generator 500kVA quarterly service is due on Aug 15.",
    time: "2026-08-10 16:20",
    severity: "Info",
    read: false,
  },
  {
    id: "tn4",
    title: "Schedule changed",
    detail: "WO-1044 Bedroom Power Outlets moved to 02:00 PM today.",
    time: "2026-08-10 14:10",
    severity: "Info",
    read: true,
  },
  {
    id: "tn5",
    title: "Completion approved",
    detail:
      "WO-1031 Lobby chandelier bulb replacement was approved by James Wilson.",
    time: "2026-08-09 17:45",
    severity: "Success",
    read: true,
  },
];

let items = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markRead(id: string) {
  items = items.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  emit();
}

export function markAllRead() {
  items = items.map((item) => (item.read ? item : { ...item, read: true }));
  emit();
}

export function unreadCount(list: TechNotification[]) {
  return list.filter((item) => !item.read).length;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return seed;
}

export function useTechNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
