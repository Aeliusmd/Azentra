"use client";

import { useSyncExternalStore } from "react";
import {
  CalendarCheck,
  CircleDollarSign,
  Megaphone,
  Receipt,
  TriangleAlert,
  UserRoundCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * What the property has told this resident.
 *
 * Module-level so the topbar bell and the notifications page stay in sync;
 * resets on reload like the other mock stores.
 */

export const RES_NOTIFICATION_KINDS = [
  "Maintenance",
  "Billing",
  "Payment",
  "Booking",
  "Visitor",
  "Announcement",
  "Emergency",
] as const;
export type ResNotificationKind = (typeof RES_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<ResNotificationKind, LucideIcon> = {
  Maintenance: Wrench,
  Billing: Receipt,
  Payment: CircleDollarSign,
  Booking: CalendarCheck,
  Visitor: UserRoundCheck,
  Announcement: Megaphone,
  Emergency: TriangleAlert,
};

/** Icon tile colours — money is green, anything urgent is red. */
export const KIND_CHIP: Record<ResNotificationKind, string> = {
  Maintenance: "bg-[#eef3f9] text-[#5b7f9c]",
  Billing: "bg-amber-50 text-amber-600",
  Payment: "bg-green-50 text-green-600",
  Booking: "bg-[#eef3f9] text-[#2e6cad]",
  Visitor: "bg-[#eef3f9] text-[#2e6cad]",
  Announcement: "bg-purple-50 text-purple-600",
  Emergency: "bg-rose-50 text-rose-600",
};

export type ResNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "2 hours ago". */
  time: string;
  kind: ResNotificationKind;
  read: boolean;
};

const seed: ResNotification[] = [
  {
    id: "rn1",
    title: "Technician Assigned",
    detail:
      "Ravi Kumar is handling MR-2026-0845 and is due at your unit today.",
    time: "2 hours ago",
    kind: "Maintenance",
    read: false,
  },
  {
    id: "rn2",
    title: "New Invoice Available",
    detail: "BIL-2026-00821 for August · LKR 29,300 · due 31 August.",
    time: "4 hours ago",
    kind: "Billing",
    read: false,
  },
  {
    id: "rn3",
    title: "Booking Confirmed",
    detail: "Swimming Pool · 13 August · 7:00 AM - 9:00 AM.",
    time: "Yesterday",
    kind: "Booking",
    read: false,
  },
  {
    id: "rn4",
    title: "Visitor Pass Created",
    detail: "Maria Rodriguez · 15 August · pass VP-2026-1184.",
    time: "Yesterday",
    kind: "Visitor",
    read: true,
  },
  {
    id: "rn5",
    title: "Water Interruption Notice",
    detail:
      "Tower A water supply is off on 16 August, 9:00 AM to 1:00 PM, for tank cleaning.",
    time: "2 days ago",
    kind: "Announcement",
    read: true,
  },
  {
    id: "rn6",
    title: "Payment Received",
    detail: "LKR 28,600 received against BIL-2026-00612. Thank you.",
    time: "3 days ago",
    kind: "Payment",
    read: true,
  },
];

let items: ResNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markResRead(id: string) {
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
}

export function markAllResRead() {
  items = items.map((item) => ({ ...item, read: true }));
  emit();
}

let pushedId = 0;

/** Raised by the mock actions — submitting a request, booking a facility. */
export function pushResNotification(
  kind: ResNotificationKind,
  title: string,
  detail: string,
) {
  items = [
    {
      id: `rn-pushed-${++pushedId}`,
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

export function resUnreadCount(list: ResNotification[]) {
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

export function useResNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
