"use client";

import { useSyncExternalStore } from "react";
import {
  CalendarCheck,
  CircleAlert,
  Package,
  UserRoundCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Technician notifications. Module-level store so the topbar bell and the
 * notifications page stay in sync; resets on reload like the other mock stores.
 */

export const NOTIFICATION_KINDS = [
  "Job",
  "Material",
  "Supervisor",
  "Preventive",
  "Emergency",
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  Job: Wrench,
  Material: Package,
  Supervisor: UserRoundCheck,
  Preventive: CalendarCheck,
  Emergency: CircleAlert,
};

/** Icon tile colours — emergencies red, material green, the rest navy. */
export const KIND_CHIP: Record<NotificationKind, string> = {
  Job: "bg-[#eef3f9] text-[#2e6cad]",
  Material: "bg-green-50 text-green-600",
  Supervisor: "bg-amber-50 text-amber-600",
  Preventive: "bg-[#eef3f9] text-[#2e6cad]",
  Emergency: "bg-rose-50 text-rose-600",
};

export type TechNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "30 min ago". */
  time: string;
  kind: NotificationKind;
  read: boolean;
};

const seed: TechNotification[] = [
  {
    id: "tn1",
    title: "New Maintenance Job",
    detail:
      "Water leakage reported in Unit A-304. Priority: Emergency. Scheduled: Today 10:30 AM.",
    time: "30 min ago",
    kind: "Job",
    read: false,
  },
  {
    id: "tn2",
    title: "Job Priority Changed",
    detail:
      "Kitchen sink drain job (MT-1032) priority changed from Low to Medium.",
    time: "1 hr ago",
    kind: "Job",
    read: false,
  },
  {
    id: "tn3",
    title: "Material Request Approved",
    detail: "Thermocouple request (RQ-002) approved. Pick up from Warehouse A.",
    time: "2 hrs ago",
    kind: "Material",
    read: true,
  },
  {
    id: "tn4",
    title: "Supervisor Comment",
    detail:
      'Carlos Rivera: "Please prioritize the water heater job first - resident has no hot water."',
    time: "3 hrs ago",
    kind: "Supervisor",
    read: true,
  },
  {
    id: "tn5",
    title: "Job Rescheduled",
    detail:
      "Intercom repair (MT-1039) rescheduled to Aug 13 due to delayed parts delivery.",
    time: "5 hrs ago",
    kind: "Job",
    read: true,
  },
  {
    id: "tn6",
    title: "Preventive Maintenance Due",
    detail: "Gym HVAC quarterly maintenance is overdue. Next due: Aug 10.",
    time: "Yesterday",
    kind: "Preventive",
    read: false,
  },
  {
    id: "tn7",
    title: "Job Completion Approved",
    detail:
      "Lobby chandelier job (MT-1038) approved by Carlos Rivera. Well done!",
    time: "Yesterday",
    kind: "Job",
    read: true,
  },
  {
    id: "tn8",
    title: "Emergency Job Alert",
    detail:
      "Water pipe burst reported in Tower B Unit B-602. Immediate response required.",
    time: "Yesterday",
    kind: "Emergency",
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
