"use client";

import { useSyncExternalStore } from "react";

import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Property Manager notifications. Module-level store so the topbar bell and the
 * notifications page stay in sync; resets on reload like the other mock stores.
 */

export const SEVERITIES = ["Info", "Warning", "Error", "Success"] as const;
export type Severity = (typeof SEVERITIES)[number];

/** Filters offered on the notifications page. */
export const SEVERITY_FILTERS = ["Info", "Warning", "Error"] as const;

export const SEVERITY_DOT: Record<Severity, string> = {
  Info: "bg-[#22a35c]",
  Warning: "bg-[#e8a33d]",
  Error: "bg-rose-500",
  Success: "bg-[#22a35c]",
};

export const SEVERITY_TONE: Record<Severity, PillTone> = {
  Info: "slate",
  Warning: "amber",
  Error: "red",
  Success: "green",
};

export type PmNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: Severity;
  read: boolean;
};

const seed: PmNotification[] = [
  {
    id: "n1",
    title: "Emergency: Water heater malfunction",
    detail: "Water heater in C-102 has completely failed. Hot water not available.",
    time: "2026-08-06 06:30",
    severity: "Error",
    read: false,
  },
  {
    id: "n2",
    title: "New maintenance request",
    detail: "Kitchen sink drain clogged reported by Michael Brown in A-103",
    time: "2026-08-06 11:00",
    severity: "Info",
    read: false,
  },
  {
    id: "n3",
    title: "Technician update",
    detail: "Mike Torres started work on water heater repair in C-102",
    time: "2026-08-06 07:45",
    severity: "Info",
    read: false,
  },
  {
    id: "n4",
    title: "Facility booking request",
    detail: "Amanda Clark requested pool booking for Kids Swimming Party on Aug 12",
    time: "2026-08-05 14:30",
    severity: "Info",
    read: true,
  },
  {
    id: "n5",
    title: "Resident complaint filed",
    detail: "Loud music complaint from John Doe regarding unit A-202",
    time: "2026-08-04 20:15",
    severity: "Warning",
    read: true,
  },
  {
    id: "n6",
    title: "Inspection reminder",
    detail: "Pool Safety Inspection scheduled for tomorrow at 08:30",
    time: "2026-08-06 09:00",
    severity: "Warning",
    read: false,
  },
  {
    id: "n7",
    title: "Work order overdue",
    detail: "WO-006 Intercom system repair has passed its due date",
    time: "2026-08-06 08:00",
    severity: "Error",
    read: false,
  },
  {
    id: "n8",
    title: "Asset service due",
    detail: "Generator - 500kVA preventive service is due on Aug 15",
    time: "2026-08-05 09:30",
    severity: "Warning",
    read: false,
  },
  {
    id: "n9",
    title: "Vendor contract expiring",
    detail: "SecureView Tech contract ended on 2025-06-15",
    time: "2026-08-05 08:00",
    severity: "Info",
    read: false,
  },
  {
    id: "n10",
    title: "Work order completed",
    detail: "WO-007 Replace smoke detector unit marked complete",
    time: "2026-08-02 16:20",
    severity: "Success",
    read: true,
  },
  {
    id: "n11",
    title: "Inspection passed",
    detail: "IN-006 Fire Extinguisher Audit cleared for all towers",
    time: "2026-07-15 15:00",
    severity: "Success",
    read: true,
  },
  {
    id: "n12",
    title: "New resident registered",
    detail: "James Wilson moved into unit B-201",
    time: "2026-07-28 10:00",
    severity: "Info",
    read: true,
  },
];

let items: PmNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markAllRead() {
  if (items.every((item) => item.read)) return;
  items = items.map((item) => ({ ...item, read: true }));
  emit();
}

export function markRead(id: string) {
  const target = items.find((item) => item.id === id);
  if (!target || target.read) return;
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
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

export function usePmNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function unreadCount(list: PmNotification[]) {
  return list.filter((item) => !item.read).length;
}
