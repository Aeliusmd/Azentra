"use client";

import { useSyncExternalStore } from "react";
import {
  CalendarClock,
  CircleAlert,
  CircleDollarSign,
  FileText,
  PiggyBank,
  ReceiptText,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { TODAY } from "@/lib/acc/dashboard-data";

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
  "Reminder",
] as const;
export type AccNotificationKind = (typeof ACC_NOTIFICATION_KINDS)[number];

export const KIND_ICON: Record<AccNotificationKind, LucideIcon> = {
  Payment: CircleDollarSign,
  Invoice: ReceiptText,
  Overdue: CircleAlert,
  Billing: FileText,
  Expense: CalendarClock,
  Budget: PiggyBank,
  "Meter Reading": Zap,
  Reminder: CircleAlert,
};

/** Icon tile colours — money in is green, money at risk is red. */
export const KIND_CHIP: Record<AccNotificationKind, string> = {
  Payment: "bg-green-50 text-green-600",
  Invoice: "bg-amber-50 text-amber-600",
  Overdue: "bg-rose-50 text-rose-600",
  Billing: "bg-[#eef3f9] text-[#2e6cad]",
  Expense: "bg-amber-50 text-amber-600",
  Budget: "bg-purple-50 text-purple-600",
  "Meter Reading": "bg-[#eef3f9] text-[#2e6cad]",
  Reminder: "bg-rose-50 text-rose-600",
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
  Reminder: "warning",
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

/** Whole days from today to an ISO date — keeps "due in 8 days" honest. */
function daysUntil(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const [thisYear, thisMonth, thisDay] = TODAY.split("-").map(Number);

  return Math.round(
    (Date.UTC(year, month - 1, day) -
      Date.UTC(thisYear, thisMonth - 1, thisDay)) /
      86_400_000,
  );
}

/**
 * What was waiting when the accountant signed in.
 *
 * Not sorted by age: the order is the one the bell built up, and re-sorting it
 * on every render would shuffle the list under a finger already reaching for a
 * row. The figures name records that exist elsewhere in the portal — INV-2046
 * really is the 295,000 CleanPro invoice — so following one up leads somewhere.
 */
const seed: AccNotification[] = [
  {
    id: "an1",
    title: "New Payment Received",
    detail: "Sarah Johnson (B-205) paid LKR 25,200 via Online transfer.",
    time: "2 hours ago",
    kind: "Payment",
    severity: "success",
    read: false,
  },
  {
    id: "an2",
    title: "Bill Generation Completed",
    detail: "August utility bills for Tower A successfully generated (32 units).",
    time: "5 hours ago",
    kind: "Billing",
    severity: "info",
    read: false,
  },
  {
    id: "an3",
    title: "Vendor Invoice Received",
    detail:
      "AquaClean Pool Services submitted invoice INV-2048 for LKR 100,300.",
    time: "1 hour ago",
    kind: "Invoice",
    severity: "info",
    read: false,
  },
  {
    id: "an4",
    title: "Payment Pending Verification",
    detail:
      "Emily Watson (A-101) made cash payment of LKR 20,000. Awaiting verification.",
    time: "3 hours ago",
    kind: "Payment",
    severity: "info",
    read: false,
  },
  {
    id: "an5",
    title: "Budget Threshold Alert",
    detail:
      "Maintenance expenses have reached 76% of annual budget (LKR 3.8M of LKR 5M).",
    time: "Yesterday",
    kind: "Budget",
    severity: "warning",
    read: true,
  },
  {
    id: "an6",
    title: "Invoice Due Reminder",
    detail: `CleanPro Services invoice INV-2046 (LKR 295,000) due in ${daysUntil("2026-08-20")} days.`,
    time: "Yesterday",
    kind: "Invoice",
    severity: "info",
    read: true,
  },
  {
    id: "an7",
    title: "Failed Payment",
    detail: "Online payment from Lisa Chen (B-302) failed. Card declined.",
    time: "2 days ago",
    kind: "Payment",
    severity: "critical",
    read: true,
  },
  {
    id: "an8",
    title: "Utility Reading Missing",
    detail: "Tower C - Unit C-102 electricity reading not submitted for August.",
    time: "3 days ago",
    kind: "Meter Reading",
    severity: "warning",
    read: true,
  },
  {
    id: "an9",
    title: "Overdue Payment Escalated",
    detail:
      "Anna Martinez (B-503) is 2 days overdue on LKR 34,900. Second reminder sent.",
    time: "Yesterday",
    kind: "Overdue",
    severity: "critical",
    read: true,
  },
  {
    id: "an10",
    title: "Month-End Closing Reminder",
    detail: `August month-end closing in ${daysUntil("2026-08-31")} days. Review outstanding items.`,
    time: "2 days ago",
    kind: "Reminder",
    severity: "warning",
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

/* --------------------------------- Filters -------------------------------- */

/**
 * The chip row on the notifications page.
 *
 * Six of them narrow by subject; "Warning" cuts across all of them by how
 * urgently the item reads, because "what needs me today" is a different
 * question from "what is this about" and the accountant asks both.
 */
export const ACC_NOTIFICATION_FILTERS = [
  "All",
  "Payment",
  "Bill",
  "Invoice",
  "Budget",
  "Utility",
  "Warning",
] as const;
export type AccNotificationFilter = (typeof ACC_NOTIFICATION_FILTERS)[number];

/** Which kinds each subject chip covers; "Warning" is handled on severity. */
const FILTER_KINDS: Record<string, AccNotificationKind[]> = {
  Payment: ["Payment"],
  Bill: ["Billing"],
  // A supplier invoice and the expense it becomes are the same paperwork.
  Invoice: ["Invoice", "Expense"],
  Budget: ["Budget"],
  Utility: ["Meter Reading"],
};

export function matchesAccFilter(item: AccNotification, filter: string) {
  if (filter === "All") return true;
  if (filter === "Warning") {
    return item.severity === "critical" || item.severity === "warning";
  }
  return (FILTER_KINDS[filter] ?? []).includes(item.kind);
}
