"use client";

import { useSyncExternalStore } from "react";
import {
  Banknote,
  CalendarClock,
  FileText,
  Gauge,
  PiggyBank,
  ReceiptText,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

/**
 * Accountant notifications. Module-level store so the topbar bell and the
 * notifications page stay in sync; resets on reload like the other mock stores.
 */

export const ACC_NOTIFICATION_KINDS = [
  "Payment",
  "Invoice",
  "Overdue",
  "Billing",
  "Expense",
  "Budget",
  "Meter Reading",
] as const;
export type AccNotificationKind = (typeof ACC_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<AccNotificationKind, LucideIcon> = {
  Payment: Banknote,
  Invoice: ReceiptText,
  Overdue: TriangleAlert,
  Billing: FileText,
  Expense: CalendarClock,
  Budget: PiggyBank,
  "Meter Reading": Gauge,
};

/** Icon tile colours — money in is green, money at risk is red. */
export const KIND_CHIP: Record<AccNotificationKind, string> = {
  Payment: "bg-green-50 text-green-600",
  Invoice: "bg-[#eef3f9] text-[#2e6cad]",
  Overdue: "bg-rose-50 text-rose-600",
  Billing: "bg-[#eef3f9] text-[#2e6cad]",
  Expense: "bg-amber-50 text-amber-600",
  Budget: "bg-purple-50 text-purple-600",
  "Meter Reading": "bg-amber-50 text-amber-600",
};

/**
 * How loudly a notification reads, independent of what it is about: the same
 * kind can be good or bad news — a payment clearing and a payment failing are
 * both `Payment`.
 */
export const ACC_SEVERITIES = ["critical", "warning", "info", "success"] as const;
export type AccSeverity = (typeof ACC_SEVERITIES)[number];

/** Where a pushed notification lands when it does not state its own severity. */
export const KIND_SEVERITY: Record<AccNotificationKind, AccSeverity> = {
  Overdue: "critical",
  Budget: "warning",
  "Meter Reading": "warning",
  Invoice: "info",
  Billing: "info",
  Expense: "info",
  Payment: "success",
};

export type AccNotification = {
  id: string;
  title: string;
  detail: string;
  /** Relative label, e.g. "20 min ago". */
  time: string;
  kind: AccNotificationKind;
  severity: AccSeverity;
  read: boolean;
};

const seed: AccNotification[] = [
  {
    id: "an1",
    title: "20 Invoices Now Overdue",
    detail:
      "Sunrise Residence · August cycle · LKR 268,400 past the 10 Aug due date.",
    time: "20 min ago",
    kind: "Overdue",
    severity: "critical",
    read: false,
  },
  {
    id: "an2",
    title: "Payment Received",
    detail: "Tom Harris · Unit A-501 · LKR 25,700 by card against INV-2026-0788.",
    time: "1 hour ago",
    kind: "Payment",
    severity: "success",
    read: false,
  },
  {
    id: "an3",
    title: "Meter Readings Due",
    detail:
      "Tower B submeters have not been read for the August cycle — 34 units outstanding.",
    time: "3 hours ago",
    kind: "Meter Reading",
    severity: "warning",
    read: false,
  },
  {
    id: "an4",
    title: "Maintenance Budget at 84%",
    detail:
      "Sunrise Residence has LKR 350,000 left of the LKR 2,200,000 August allocation.",
    time: "Yesterday",
    kind: "Budget",
    severity: "warning",
    read: true,
  },
  {
    id: "an5",
    title: "Vendor Invoice Logged",
    detail: "CleanPro Services · LKR 295,000 · scheduled for payment on 18 Aug.",
    time: "Yesterday",
    kind: "Expense",
    severity: "info",
    read: true,
  },
  {
    id: "an6",
    title: "July Billing Cycle Closed",
    detail: "318 invoices issued, 312 settled — collection rate 94.5%.",
    time: "2 days ago",
    kind: "Billing",
    severity: "info",
    read: true,
  },
];

let items: AccNotification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markRead(id: string) {
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
}

export function markAllRead() {
  items = items.map((item) => ({ ...item, read: true }));
  emit();
}

let pushedId = 0;

/** Raised by the mock actions — recording a payment, generating a bill run. */
export function pushAccNotification(
  kind: AccNotificationKind,
  title: string,
  detail: string,
  severity: AccSeverity = KIND_SEVERITY[kind],
) {
  items = [
    {
      id: `an-pushed-${++pushedId}`,
      title,
      detail,
      time: "Just now",
      kind,
      severity,
      read: false,
    },
    ...items,
  ];
  emit();
}

export function unreadCount(list: AccNotification[]) {
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

export function useAccNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
