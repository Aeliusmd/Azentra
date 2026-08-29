"use client";

import { useSyncExternalStore } from "react";
import {
  Building2,
  CalendarClock,
  CarFront,
  CircleDollarSign,
  CreditCard,
  Megaphone,
  TriangleAlert,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * What the property has told this tenant.
 *
 * Module-level so the topbar bell and the notifications page stay in sync;
 * resets on reload like the other mock stores.
 */

export const TEN_NOTIFICATION_KINDS = [
  "Maintenance",
  "Appointment",
  "Billing",
  "Payment",
  "Booking",
  "Visitor",
  "Parking",
  "Announcement",
  "Emergency",
] as const;
export type TenNotificationKind = (typeof TEN_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<TenNotificationKind, LucideIcon> = {
  Maintenance: Wrench,
  Appointment: CalendarClock,
  Billing: CreditCard,
  Payment: CircleDollarSign,
  Booking: Building2,
  Visitor: UserRoundPlus,
  Parking: CarFront,
  Announcement: Megaphone,
  Emergency: TriangleAlert,
};

/** Icon tile colours — money settled is green, anything urgent is red. */
export const KIND_CHIP: Record<TenNotificationKind, string> = {
  Maintenance: "bg-[#eef4fb] text-[#2e6cad]",
  Appointment: "bg-[#eef3f9] text-[#5b7f9c]",
  Billing: "bg-amber-50 text-amber-600",
  Payment: "bg-green-50 text-green-600",
  Booking: "bg-green-50 text-green-600",
  Visitor: "bg-[#eef3f9] text-[#2e6cad]",
  Parking: "bg-[#eef3f9] text-[#5b7f9c]",
  Announcement: "bg-[#eef4fb] text-[#2e6cad]",
  Emergency: "bg-rose-50 text-rose-600",
};

export type TenNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "2 days ago". */
  time: string;
  kind: TenNotificationKind;
  read: boolean;
};

/**
 * What was waiting when the tenant signed in.
 *
 * Every figure names a record that exists elsewhere in the portal —
 * MR-2026-0845 really is the plumbing job, TIN-2026-00842 really is the August
 * bill — so following one up leads somewhere.
 */
const seed: TenNotification[] = [
  {
    id: "tn1",
    title: "Technician Assigned",
    detail:
      "Nimal Fernando will attend your electrical request MR-2026-0821 on August 14 at 2:30 PM.",
    time: "25 minutes ago",
    kind: "Maintenance",
    read: false,
  },
  {
    id: "tn2",
    title: "Water Supply Interruption",
    detail:
      "Tower A water will be shut off on August 15, 9:00 AM to 2:00 PM for valve replacement.",
    time: "1 hour ago",
    kind: "Emergency",
    read: false,
  },
  {
    id: "tn3",
    title: "Maintenance Appointment",
    detail:
      "John Perera attended MR-2026-0845 on August 11 at 10:30 AM. Work is under way.",
    time: "3 hours ago",
    kind: "Appointment",
    read: false,
  },
  {
    id: "tn4",
    title: "New Bill Generated",
    detail:
      "Your August 2026 bill (LKR 11,300) is ready. Due date: August 31, 2026.",
    time: "2 days ago",
    kind: "Billing",
    read: true,
  },
  {
    id: "tn5",
    title: "Visitor Pass Created",
    detail:
      "Pass VP-2026-1190 for Jennifer Park on August 16 has been created.",
    time: "3 days ago",
    kind: "Visitor",
    read: true,
  },
  {
    id: "tn6",
    title: "Facility Booking Confirmed",
    detail:
      "Your BBQ Terrace booking for August 22 (5:00 PM - 9:00 PM) has been confirmed.",
    time: "4 days ago",
    kind: "Booking",
    read: true,
  },
  {
    id: "tn7",
    title: "Payment Successful",
    detail:
      "LKR 3,000 received against invoice TIN-2026-00838. Balance remaining: LKR 4,000.",
    time: "6 days ago",
    kind: "Payment",
    read: true,
  },
  {
    id: "tn8",
    title: "New Announcement",
    detail: "Lift B in Tower A will be out of service on August 18 and 19.",
    time: "1 week ago",
    kind: "Announcement",
    read: true,
  },
];

let items: TenNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

let pushSeq = 0;

/**
 * Raises a notice from something the tenant just did.
 *
 * Lands unread and at the top, where the bell will show it — the same place a
 * notice from the property arrives, because to the tenant they read alike.
 */
export function pushTenNotification(
  kind: TenNotificationKind,
  title: string,
  detail: string,
) {
  const item: TenNotification = {
    id: `tn-new-${++pushSeq}`,
    title,
    detail,
    time: "Just now",
    kind,
    read: false,
  };

  items = [item, ...items];
  emit();

  return item;
}

export function markTenRead(id: string) {
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
}

export function markTenUnread(id: string) {
  items = items.map((item) =>
    item.id === id ? { ...item, read: false } : item,
  );
  emit();
}

export function markAllTenRead() {
  items = items.map((item) => (item.read ? item : { ...item, read: true }));
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

export function useTenNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function tenUnreadCount(list: TenNotification[]) {
  return list.filter((item) => !item.read).length;
}
