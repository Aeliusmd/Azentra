"use client";

import { useSyncExternalStore } from "react";
import {
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Package,
  Siren,
  TriangleAlert,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Field Supervisor notifications. Module-level store so the topbar bell and the
 * notifications page stay in sync; resets on reload like the other mock stores.
 */

export const FS_NOTIFICATION_KINDS = [
  "Work Order",
  "Technician",
  "Overdue",
  "Parts",
  "Inspection",
  "Emergency",
  "Schedule",
] as const;
export type FsNotificationKind = (typeof FS_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<FsNotificationKind, LucideIcon> = {
  "Work Order": ClipboardList,
  Technician: UserRoundCheck,
  Overdue: TriangleAlert,
  Parts: Package,
  Inspection: ClipboardCheck,
  Emergency: Siren,
  Schedule: CalendarClock,
};

/** Icon tile colours — emergencies and overdue red, the rest navy or green. */
export const KIND_CHIP: Record<FsNotificationKind, string> = {
  "Work Order": "bg-[#eef3f9] text-[#2e6cad]",
  Technician: "bg-green-50 text-green-600",
  Overdue: "bg-rose-50 text-rose-600",
  Parts: "bg-purple-50 text-purple-600",
  Inspection: "bg-amber-50 text-amber-600",
  Emergency: "bg-rose-50 text-rose-600",
  Schedule: "bg-[#eef3f9] text-[#2e6cad]",
};

export type FsNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "15 min ago". */
  time: string;
  kind: FsNotificationKind;
  read: boolean;
};

const seed: FsNotification[] = [
  {
    id: "fn1",
    title: "Emergency Maintenance Reported",
    detail:
      "Fire alarm panel fault in Tower B (WO-1053). No technician assigned yet.",
    time: "15 min ago",
    kind: "Emergency",
    read: false,
  },
  {
    id: "fn2",
    title: "New Work Order",
    detail: "Kitchen sink clogged in Unit A-102 (WO-1054) needs assignment.",
    time: "40 min ago",
    kind: "Work Order",
    read: false,
  },
  {
    id: "fn3",
    title: "Technician Started Job",
    detail: "Ravi Patel started the parking gate sensor repair (WO-1045).",
    time: "1 hr ago",
    kind: "Technician",
    read: false,
  },
  {
    id: "fn4",
    title: "Waiting for Parts",
    detail:
      "Gym treadmill belt (WO-1051) is on back order — supplier ETA 15 Aug.",
    time: "2 hrs ago",
    kind: "Parts",
    read: false,
  },
  {
    id: "fn5",
    title: "Job Overdue",
    detail: "Roof drain cleaning (WO-1035) passed its due date on 10 Aug.",
    time: "3 hrs ago",
    kind: "Overdue",
    read: false,
  },
  {
    id: "fn6",
    title: "Inspection Required",
    detail:
      "Kitchen tap replacement (WO-1052) is awaiting your sign-off inspection.",
    time: "5 hrs ago",
    kind: "Inspection",
    read: true,
  },
  {
    id: "fn7",
    title: "Technician Accepted Job",
    detail: "John Perera accepted the water heater replacement (WO-1048).",
    time: "Yesterday",
    kind: "Technician",
    read: true,
  },
  {
    id: "fn8",
    title: "Schedule Conflict",
    detail:
      "Michael Torres has two jobs booked at 09:00 AM on 13 Aug (WO-1049, WO-1035).",
    time: "Yesterday",
    kind: "Schedule",
    read: true,
  },
  {
    id: "fn9",
    title: "Technician Unavailable",
    detail: "Omar Haddad is on leave until 15 Aug — HVAC cover needed.",
    time: "2 days ago",
    kind: "Technician",
    read: true,
  },
  {
    id: "fn10",
    title: "Technician Completed Job",
    detail: "Ahmed Khan completed the chiller filter cleaning (WO-1039).",
    time: "4 days ago",
    kind: "Work Order",
    read: true,
  },
];

let items: FsNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

let pushedId = 0;

/** Raised by the portal itself, e.g. when an emergency job is created. */
export function pushFsNotification(entry: {
  title: string;
  detail: string;
  kind: FsNotificationKind;
}) {
  items = [
    { ...entry, id: `fn-new-${++pushedId}`, time: "Just now", read: false },
    ...items,
  ];
  emit();
}

export function markRead(id: string) {
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
}

export function markUnread(id: string) {
  items = items.map((item) =>
    item.id === id ? { ...item, read: false } : item,
  );
  emit();
}

export function markAllRead() {
  items = items.map((item) => (item.read ? item : { ...item, read: true }));
  emit();
}

export function unreadCount(list: FsNotification[]) {
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

export function useFsNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
