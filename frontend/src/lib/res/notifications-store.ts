"use client";

import { useSyncExternalStore } from "react";
import {
  Building2,
  CircleDollarSign,
  CreditCard,
  Frown,
  Info,
  Megaphone,
  TriangleAlert,
  UserRoundPlus,
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
  "Complaint",
  "Announcement",
  "Emergency",
] as const;
export type ResNotificationKind = (typeof RES_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<ResNotificationKind, LucideIcon> = {
  Maintenance: Wrench,
  Billing: CreditCard,
  Payment: CircleDollarSign,
  Booking: Building2,
  Visitor: UserRoundPlus,
  Complaint: Frown,
  Announcement: Megaphone,
  Emergency: TriangleAlert,
};

/** Icon tile colours — money in is green, anything urgent is red. */
export const KIND_CHIP: Record<ResNotificationKind, string> = {
  Maintenance: "bg-[#eef4fb] text-[#2e6cad]",
  Billing: "bg-amber-50 text-amber-600",
  Payment: "bg-green-50 text-green-600",
  Booking: "bg-green-50 text-green-600",
  Visitor: "bg-[#eef3f9] text-[#2e6cad]",
  Complaint: "bg-orange-50 text-orange-500",
  Announcement: "bg-[#eef4fb] text-[#2e6cad]",
  Emergency: "bg-rose-50 text-rose-600",
};

export type ResNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "2 days ago". */
  time: string;
  kind: ResNotificationKind;
  read: boolean;
  /** Overrides the kind's glyph, where one entry is unlike its neighbours. */
  icon?: LucideIcon;
  /** Overrides the kind's tile colour, alongside `icon`. */
  chip?: string;
};

/**
 * What was waiting when the resident signed in.
 *
 * The figures name records that exist elsewhere in the portal — MR-2026-0845
 * really is John Perera's plumbing job, CMP-2026-0042 really is the noise
 * complaint — so following one up leads somewhere.
 */
const seed: ResNotification[] = [
  {
    id: "rn1",
    title: "Maintenance Update",
    detail:
      "Technician John Perera has started work on your plumbing request MR-2026-0845",
    time: "10 minutes ago",
    kind: "Maintenance",
    read: false,
  },
  {
    id: "rn2",
    title: "Bill Generated",
    detail:
      "Your August 2026 bill (LKR 29,300) is ready. Due date: August 31, 2026",
    time: "2 days ago",
    kind: "Billing",
    read: true,
  },
  {
    id: "rn3",
    title: "Visitor Approved",
    detail:
      "Maria Rodriguez has been approved for visit on August 15. Parking slot B1-V08 assigned.",
    time: "3 days ago",
    kind: "Visitor",
    read: true,
  },
  {
    id: "rn4",
    title: "Facility Booking Confirmed",
    detail:
      "Your Banquet Hall booking for August 25 (6 PM - 11 PM) has been confirmed.",
    time: "4 days ago",
    kind: "Booking",
    read: true,
  },
  {
    id: "rn5",
    title: "Complaint Update",
    detail:
      "Your noise complaint (CMP-2026-0042) is under review by the Property Manager.",
    time: "3 days ago",
    kind: "Complaint",
    read: false,
  },
  {
    id: "rn6",
    title: "Property Announcement",
    detail:
      "Annual fire drill scheduled for August 20, 2026 from 10 AM - 12 PM. All residents must participate.",
    time: "5 days ago",
    kind: "Announcement",
    read: true,
  },
  {
    id: "rn7",
    title: "Payment Confirmed",
    detail:
      "Your July 2026 bill payment of LKR 28,600 has been received. Receipt is available in Documents.",
    time: "2 weeks ago",
    kind: "Payment",
    read: true,
  },
  {
    id: "rn8",
    title: "Pool Closure Notice",
    detail:
      "Swimming pool will be closed for annual maintenance on August 16-17, 2026.",
    time: "1 week ago",
    kind: "Announcement",
    read: false,
  },
  {
    id: "rn9",
    title: "Scheduled Maintenance",
    detail:
      "Electrical inspection for your unit has been scheduled for August 14 at 2:00 PM with Michael Chen.",
    time: "1 week ago",
    kind: "Maintenance",
    read: true,
  },
  {
    id: "rn10",
    title: "Welcome to Sunrise Residence",
    detail:
      "Welcome to the resident portal! You can manage your apartment, bills, maintenance requests and more from here.",
    time: "March 2024",
    kind: "Announcement",
    read: true,
    // The one that is not really news — dressed down so it does not compete.
    icon: Info,
    chip: "bg-gray-100 text-gray-500",
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

/* --------------------------------- Filters -------------------------------- */

/** The tab row on the notifications page. */
export const RES_NOTIFICATION_TABS = [
  "All",
  "Maintenance",
  "Bills",
  "Visitors",
  "Facilities",
  "Complaints",
  "Announcements",
] as const;
export type ResNotificationTab = (typeof RES_NOTIFICATION_TABS)[number];

/**
 * Which kinds each tab covers.
 *
 * Every kind belongs to exactly one tab, so nothing is reachable only through
 * "All" — a notification nobody can filter to is one nobody will find.
 */
const TAB_KINDS: Record<string, ResNotificationKind[]> = {
  Maintenance: ["Maintenance"],
  // A bill raised and a bill settled are the same conversation.
  Bills: ["Billing", "Payment"],
  Visitors: ["Visitor"],
  Facilities: ["Booking"],
  Complaints: ["Complaint"],
  Announcements: ["Announcement", "Emergency"],
};

export function matchesResTab(item: ResNotification, tab: string) {
  if (tab === "All") return true;
  return (TAB_KINDS[tab] ?? []).includes(item.kind);
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
