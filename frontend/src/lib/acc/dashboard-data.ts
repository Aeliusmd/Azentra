import {
  CalendarClock,
  CircleDollarSign,
  FileText,
  Gauge,
  PiggyBank,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import { collectionRate } from "@/lib/acc/money";
import { CURRENT_PERIOD } from "@/lib/acc/periods";

/**
 * The accountant's ledger, one month at a time.
 *
 * Figures are filed per property and per billing period, because that pair is
 * exactly what the header selectors choose between — switch either and every
 * tile on the dashboard is answering a different question. Everything derived
 * (outstanding, collection rate, budget remaining) is computed from these
 * rather than stored, so the numbers can never drift out of agreement.
 */

/** The day the portal treats as today, shared with the other role portals. */
export const TODAY = "2026-08-12";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** `2026-08-15` → `Aug 15`. */
export function shortDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  return `${SHORT_MONTHS[month - 1]} ${day}`;
}

/* --------------------------------- Ledger --------------------------------- */

export type AccMonthly = {
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  billed: number;
  collected: number;
  expenses: number;
  /** What the property was allocated to spend this month. */
  budget: number;
  billsGenerated: number;
  paid: number;
  pending: number;
  overdue: number;
};

/**
 * Three months per property. Closed months settle near-completely; the open
 * month still carries the bills residents have not got to yet, which is what
 * makes the outstanding and overdue tiles worth looking at.
 */
const LEDGER: Record<string, AccMonthly[]> = {
  sunrise: [
    {
      period: "2026-06",
      billed: 4_310_000,
      collected: 4_150_000,
      expenses: 1_760_000,
      budget: 2_200_000,
      billsGenerated: 322,
      paid: 309,
      pending: 8,
      overdue: 5,
    },
    {
      period: "2026-07",
      billed: 4_180_000,
      collected: 3_995_000,
      expenses: 1_940_000,
      budget: 2_200_000,
      billsGenerated: 318,
      paid: 302,
      pending: 10,
      overdue: 6,
    },
    {
      period: "2026-08",
      billed: 4_250_000,
      collected: 3_480_000,
      expenses: 1_850_000,
      budget: 2_200_000,
      billsGenerated: 320,
      paid: 260,
      pending: 40,
      overdue: 20,
    },
  ],
  "ocean-view": [
    {
      period: "2026-06",
      billed: 3_180_000,
      collected: 3_090_000,
      expenses: 1_265_000,
      budget: 1_600_000,
      billsGenerated: 241,
      paid: 232,
      pending: 6,
      overdue: 3,
    },
    {
      period: "2026-07",
      billed: 3_090_000,
      collected: 2_985_000,
      expenses: 1_395_000,
      budget: 1_600_000,
      billsGenerated: 238,
      paid: 228,
      pending: 7,
      overdue: 3,
    },
    {
      period: "2026-08",
      billed: 3_120_000,
      collected: 2_690_000,
      expenses: 1_340_000,
      budget: 1_600_000,
      billsGenerated: 240,
      paid: 198,
      pending: 28,
      overdue: 14,
    },
  ],
  "garden-heights": [
    {
      period: "2026-06",
      billed: 2_470_000,
      collected: 2_400_000,
      expenses: 995_000,
      budget: 1_250_000,
      billsGenerated: 184,
      paid: 177,
      pending: 5,
      overdue: 2,
    },
    {
      period: "2026-07",
      billed: 2_420_000,
      collected: 2_345_000,
      expenses: 1_105_000,
      budget: 1_250_000,
      billsGenerated: 182,
      paid: 174,
      pending: 5,
      overdue: 3,
    },
    {
      period: "2026-08",
      billed: 2_480_000,
      collected: 1_910_000,
      expenses: 1_050_000,
      budget: 1_250_000,
      billsGenerated: 186,
      paid: 142,
      pending: 31,
      overdue: 13,
    },
  ],
};

/** Every month on file for a property, oldest first — the trend-chart source. */
export function ledgerFor(propertyId: string): AccMonthly[] {
  return LEDGER[propertyId] ?? [];
}

/* ------------------------------ Recent payments ---------------------------- */

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Card",
  "Cash",
  "Online",
] as const;
export type AccPaymentMethod = (typeof PAYMENT_METHODS)[number];

export type AccRecentPayment = {
  id: string;
  resident: string;
  unit: string;
  method: AccPaymentMethod;
  amount: number;
  /** ISO day the money landed. */
  date: string;
};

const RECENT_PAYMENTS: Record<string, AccRecentPayment[]> = {
  sunrise: [
    {
      id: "PAY-2026-0412",
      resident: "Sarah Johnson",
      unit: "Unit B-205",
      method: "Online",
      amount: 25_200,
      date: "2026-08-05",
    },
    {
      id: "PAY-2026-0418",
      resident: "David Lee",
      unit: "Unit C-102",
      method: "Bank Transfer",
      amount: 23_600,
      date: "2026-08-06",
    },
    {
      id: "PAY-2026-0424",
      resident: "Tom Harris",
      unit: "Unit A-501",
      method: "Card",
      amount: 25_700,
      date: "2026-08-07",
    },
  ],
  "ocean-view": [
    {
      id: "PAY-2026-0389",
      resident: "Nadia Fernando",
      unit: "Unit 1-304",
      method: "Bank Transfer",
      amount: 21_400,
      date: "2026-08-04",
    },
    {
      id: "PAY-2026-0401",
      resident: "Ruwan Perera",
      unit: "Unit 2-118",
      method: "Online",
      amount: 19_850,
      date: "2026-08-06",
    },
    {
      id: "PAY-2026-0433",
      resident: "Ayesha Karim",
      unit: "Unit 1-802",
      method: "Card",
      amount: 22_300,
      date: "2026-08-08",
    },
  ],
  "garden-heights": [
    {
      id: "PAY-2026-0376",
      resident: "Mark Silva",
      unit: "Unit N-402",
      method: "Online",
      amount: 18_700,
      date: "2026-08-03",
    },
    {
      id: "PAY-2026-0394",
      resident: "Dilani Weeraratne",
      unit: "Unit S-206",
      method: "Cash",
      amount: 17_250,
      date: "2026-08-05",
    },
    {
      id: "PAY-2026-0427",
      resident: "James Okoro",
      unit: "Unit N-115",
      method: "Bank Transfer",
      amount: 20_100,
      date: "2026-08-07",
    },
  ],
};

/* ------------------------------- Upcoming work ----------------------------- */

export const UPCOMING_KINDS = [
  "Billing",
  "Invoice",
  "Payment Due",
  "Vendor Payment",
  "Meter Reading",
  "Budget Review",
] as const;
export type AccUpcomingKind = (typeof UPCOMING_KINDS)[number];

/** Icon tile per kind — money out is amber, the billing calendar is navy. */
export const UPCOMING_STYLE: Record<
  AccUpcomingKind,
  { icon: LucideIcon; chip: string }
> = {
  Billing: { icon: FileText, chip: "bg-[#eef3f9] text-[#2e6cad]" },
  Invoice: { icon: ReceiptText, chip: "bg-[#eef3f9] text-[#2e6cad]" },
  "Payment Due": { icon: CalendarClock, chip: "bg-[#eef3f9] text-[#2e6cad]" },
  "Vendor Payment": {
    icon: CircleDollarSign,
    chip: "bg-amber-50 text-amber-600",
  },
  "Meter Reading": { icon: Gauge, chip: "bg-amber-50 text-amber-600" },
  "Budget Review": { icon: PiggyBank, chip: "bg-purple-50 text-purple-600" },
};

export type AccUpcomingTask = {
  id: string;
  title: string;
  /** Who or what it concerns — omitted when the title says it all. */
  detail?: string;
  /** ISO day it falls due. */
  date: string;
  /** Only the tasks that move money carry one. */
  amount?: number;
  kind: AccUpcomingKind;
};

const UPCOMING: Record<string, AccUpcomingTask[]> = {
  sunrise: [
    {
      id: "up-sr-1",
      title: "Generate Utility Bills",
      date: "2026-08-15",
      kind: "Billing",
    },
    {
      id: "up-sr-2",
      title: "Vendor Payment - CleanPro",
      detail: "CleanPro Services",
      date: "2026-08-18",
      amount: 295_000,
      kind: "Vendor Payment",
    },
    {
      id: "up-sr-3",
      title: "Vendor Payment - GreenScape",
      detail: "GreenScape Ltd",
      date: "2026-08-18",
      amount: 142_000,
      kind: "Vendor Payment",
    },
  ],
  "ocean-view": [
    {
      id: "up-gv-1",
      title: "Submeter Reading - Block 2",
      detail: "34 units outstanding",
      date: "2026-08-14",
      kind: "Meter Reading",
    },
    {
      id: "up-gv-2",
      title: "Generate Utility Bills",
      date: "2026-08-16",
      kind: "Billing",
    },
    {
      id: "up-gv-3",
      title: "Vendor Payment - AquaFlow",
      detail: "AquaFlow Plumbing",
      date: "2026-08-20",
      amount: 186_000,
      kind: "Vendor Payment",
    },
  ],
  "garden-heights": [
    {
      id: "up-hp-1",
      title: "Invoice Due Date",
      detail: "31 invoices fall due",
      date: "2026-08-15",
      kind: "Payment Due",
    },
    {
      id: "up-hp-2",
      title: "Q3 Budget Review",
      detail: "Finance committee",
      date: "2026-08-21",
      kind: "Budget Review",
    },
    {
      id: "up-hp-3",
      title: "Vendor Payment - SecureGuard",
      detail: "SecureGuard Lanka",
      date: "2026-08-22",
      amount: 224_000,
      kind: "Vendor Payment",
    },
  ],
};

/* -------------------------------- Assembly -------------------------------- */

export type AccDashboard = {
  billed: number;
  collected: number;
  outstanding: number;
  expenses: number;
  billsGenerated: number;
  paid: number;
  pending: number;
  overdue: number;
  /** Bills still owing — pending plus overdue. */
  unpaid: number;
  /** Collected as a whole percent of billed. */
  rate: number;
  budget: number;
  budgetRemaining: number;
  /** How much of the allocation is spent, capped for the meter. */
  budgetUsed: number;
  payments: AccRecentPayment[];
  upcoming: AccUpcomingTask[];
};

const EMPTY_MONTH: AccMonthly = {
  period: CURRENT_PERIOD,
  billed: 0,
  collected: 0,
  expenses: 0,
  budget: 0,
  billsGenerated: 0,
  paid: 0,
  pending: 0,
  overdue: 0,
};

/** Everything the dashboard shows for one property in one billing period. */
export function accDashboardFor(
  propertyId: string,
  periodId: string,
): AccDashboard {
  const months = ledgerFor(propertyId);
  const month =
    months.find((entry) => entry.period === periodId) ??
    months[months.length - 1] ??
    EMPTY_MONTH;

  return {
    billed: month.billed,
    collected: month.collected,
    outstanding: month.billed - month.collected,
    expenses: month.expenses,
    billsGenerated: month.billsGenerated,
    paid: month.paid,
    pending: month.pending,
    overdue: month.overdue,
    unpaid: month.pending + month.overdue,
    rate: collectionRate(month.collected, month.billed),
    budget: month.budget,
    budgetRemaining: month.budget - month.expenses,
    budgetUsed:
      month.budget > 0
        ? Math.min(100, Math.round((month.expenses / month.budget) * 100))
        : 0,
    payments: RECENT_PAYMENTS[propertyId] ?? [],
    upcoming: UPCOMING[propertyId] ?? [],
  };
}
