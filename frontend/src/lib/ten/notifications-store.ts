"use client";

import { useSyncExternalStore } from "react";
import {
  Building2,
  CalendarClock,
  CarFront,
  CircleDollarSign,
  CreditCard,
  Frown,
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
  "Complaint",
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
  Complaint: Frown,
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
  Complaint: "bg-orange-50 text-orange-500",
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
    title: "Maintenance Update",
    detail:
      "Technician John Perera has started work on your plumbing request MR-2026-0845",
    time: "10 minutes ago",
    kind: "Maintenance",
    read: false,
  },
  {
    id: "tn2",
    title: "Bill Generated",
    detail:
      "Your August 2026 utility bill (LKR 11,300) is ready. Due date: August 31, 2026.",
    time: "2 days ago",
    kind: "Billing",
    read: true,
  },
  {
    id: "tn3",
    title: "Lease Expiry Reminder",
    detail:
      "Your lease will expire in 9 months on May 31, 2027. Please contact your landlord if you wish to renew.",
    time: "1 week ago",
    kind: "Announcement",
    read: true,
  },
  {
    id: "tn4",
    title: "Visitor Approved",
    detail:
      "Jennifer Park has been approved for visit on August 16. Parking slot B1-V05 assigned.",
    time: "3 days ago",
    kind: "Visitor",
    read: false,
  },
  {
    id: "tn5",
    title: "Facility Booking Confirmed",
    detail:
      "Your BBQ Terrace booking for August 22 (5 PM - 9 PM) has been confirmed.",
    time: "4 days ago",
    kind: "Booking",
    read: true,
  },
  {
    id: "tn6",
    title: "Complaint Update",
    detail:
      "Your noise complaint (CMP-2026-0045) is under review by the Property Manager.",
    time: "3 days ago",
    kind: "Complaint",
    read: false,
  },
  {
    id: "tn7",
    title: "Property Announcement",
    detail:
      "Annual fire drill scheduled for August 20, 2026 from 10 AM - 12 PM. All residents and tenants must participate.",
    time: "5 days ago",
    kind: "Announcement",
    read: true,
  },
  {
    id: "tn8",
    title: "Payment Confirmed",
    detail:
      "Your July 2026 bill payment of LKR 10,790 has been received. Receipt is available in Documents.",
    time: "2 weeks ago",
    kind: "Payment",
    read: true,
  },
];

/**
 * The filters across the top of the notifications screen.
 *
 * A tab covers the kinds a tenant would think of as one thing — an appointment
 * is maintenance to them, and a receipt is a bill. Kinds outside every tab
 * (announcements, emergencies, parking) still show under "All", which is why
 * "All" is not simply the union of the rest.
 */
export const TEN_NOTIFICATION_TABS = [
  "All",
  "Maintenance",
  "Bills",
  "Visitors",
  "Facilities",
  "Complaints",
] as const;
export type TenNotificationTab = (typeof TEN_NOTIFICATION_TABS)[number];

const TAB_KINDS: Record<string, TenNotificationKind[]> = {
  Maintenance: ["Maintenance", "Appointment"],
  Bills: ["Billing", "Payment"],
  Visitors: ["Visitor"],
  Facilities: ["Booking"],
  Complaints: ["Complaint"],
};

export function notificationsForTab(
  tab: TenNotificationTab,
  list: TenNotification[],
) {
  if (tab === "All") return list;
  const kinds = TAB_KINDS[tab] ?? [];
  return list.filter((item) => kinds.includes(item.kind));
}

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
