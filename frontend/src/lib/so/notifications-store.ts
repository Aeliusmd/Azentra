"use client";

import { useSyncExternalStore } from "react";
import {
  CarFront,
  Siren,
  SquareParking,
  TicketX,
  TriangleAlert,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

/**
 * What the gate has been told.
 *
 * Module-level so the topbar bell and the notifications page stay in sync;
 * resets on reload like the other mock stores. Everything here is operational —
 * somebody is coming, something is wrong, a pass has run out.
 */

export const SO_NOTIFICATION_KINDS = [
  "Expected Visitor",
  "Emergency",
  "Pass Expiry",
  "Vehicle",
  "Incident",
  "Parking",
] as const;
export type SoNotificationKind = (typeof SO_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<SoNotificationKind, LucideIcon> = {
  "Expected Visitor": UserRoundPlus,
  Emergency: TriangleAlert,
  "Pass Expiry": TicketX,
  Vehicle: CarFront,
  Incident: Siren,
  Parking: SquareParking,
};

/** Icon tile colours — anything that needs a guard on their feet is red. */
export const KIND_CHIP: Record<SoNotificationKind, string> = {
  "Expected Visitor": "bg-[#eef3f9] text-[#2e6cad]",
  Emergency: "bg-rose-50 text-rose-600",
  "Pass Expiry": "bg-amber-50 text-amber-600",
  Vehicle: "bg-[#eef3f9] text-[#5b7f9c]",
  Incident: "bg-orange-50 text-orange-500",
  Parking: "bg-green-50 text-green-600",
};

export type SoNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "12 minutes ago". */
  time: string;
  kind: SoNotificationKind;
  read: boolean;
};

const seed: SoNotification[] = [
  {
    id: "sn1",
    title: "Medical Emergency",
    detail:
      "Tower C - Unit 1202 reported chest pain. Paramedics called; keep the ramp clear.",
    time: "12 minutes ago",
    kind: "Emergency",
    read: false,
  },
  {
    id: "sn2",
    title: "Approval Requested",
    detail:
      "Jessica White is expected at 18:00 for unit B-210. Awaiting entry approval.",
    time: "25 minutes ago",
    kind: "Expected Visitor",
    read: false,
  },
  {
    id: "sn3",
    title: "Unauthorized Vehicle",
    detail: "Plate WX 1042 parked in bay P-012, which is held for unit A-1205.",
    time: "1 hour ago",
    kind: "Vehicle",
    read: false,
  },
  {
    id: "sn4",
    title: "Visitor Pass Expiring",
    detail: "Pass V-2026-4474 for John Williams lapses at 18:30.",
    time: "2 hours ago",
    kind: "Pass Expiry",
    read: true,
  },
  {
    id: "sn5",
    title: "Incident Updated",
    detail:
      "INC-2026-0212 (Unauthorized Access) moved to Under Investigation by the Property Manager.",
    time: "3 hours ago",
    kind: "Incident",
    read: true,
  },
  {
    id: "sn6",
    title: "Visitor Bay Released",
    detail: "Bay P-011 freed after LB 9920 exited at 15:26.",
    time: "4 hours ago",
    kind: "Parking",
    read: true,
  },
];

let items: SoNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

let pushSeq = 0;

/** Raises a notice from something that just happened at the gate. */
export function pushSoNotification(
  kind: SoNotificationKind,
  title: string,
  detail: string,
) {
  items = [
    {
      id: `sn-new-${++pushSeq}`,
      title,
      detail,
      time: "Just now",
      kind,
      read: false,
    },
    ...items,
  ];
  emit();
}

export function markSoRead(id: string) {
  items = items.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  emit();
}

export function markAllSoRead() {
  items = items.map((item) => ({ ...item, read: true }));
  emit();
}

export function soUnreadCount(list: SoNotification[]) {
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

export function useSoNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
