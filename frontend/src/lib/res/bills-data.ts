import { daysBetween, MONTHS } from "@/lib/res/format";

/**
 * What this unit has been billed.
 *
 * Only the amount charged and what has been paid against it are stored; the
 * balance and whether it is overdue are worked out from those and the date, so
 * a bill can never show a status that contradicts its own numbers.
 *
 * `BIL-2026-00821` is the same invoice the Accountant portal raised for A-304 —
 * same total, same due date.
 */

export const INVOICE_TYPES = [
  "Maintenance Charge",
  "Electricity",
  "Water",
  "Common Area Charge",
  "Facility Charge",
  "Other",
] as const;
export type InvoiceType = (typeof INVOICE_TYPES)[number];

/**
 * `Pending` rather than "Unpaid": a bill that is simply not due yet is not a
 * failing, and a resident should not be told off by their own dashboard.
 */
export type InvoiceStatus =
  | "Pending"
  | "Partially Paid"
  | "Paid"
  | "Overdue";

/** One line on an invoice — what it is and what it came to. */
export type InvoiceLine = {
  label: string;
  /** Shown where the charge is metered, e.g. `280 units @ LKR 25`. */
  basis?: string;
  amount: number;
};

export type ResidentInvoice = {
  id: string;
  /** `2026-08`, the month being billed. */
  period: string;
  type: InvoiceType;
  lines: InvoiceLine[];
  /** Sum of the lines. */
  subtotal: number;
  /** Credits or corrections; negative reduces the bill. */
  adjustment: number;
  /** `subtotal + adjustment`. */
  total: number;
  paid: number;
  /** ISO day payment is expected. */
  dueDate: string;
  /** ISO day the invoice was raised. */
  issued: string;
};

const INVOICES: ResidentInvoice[] = [
  {
    id: "BIL-2026-00821",
    period: "2026-08",
    type: "Maintenance Charge",
    lines: [
      { label: "Monthly Maintenance", amount: 12_500 },
      { label: "Water", basis: "280 units @ LKR 25", amount: 7_000 },
      { label: "Electricity", basis: "650 units @ LKR 65", amount: 6_500 },
      { label: "Common Area Charge", amount: 2_400 },
      { label: "Sinking Fund", amount: 900 },
    ],
    subtotal: 29_300,
    adjustment: 0,
    total: 29_300,
    paid: 0,
    dueDate: "2026-08-31",
    issued: "2026-08-01",
  },
  {
    id: "BIL-2026-00612",
    period: "2026-07",
    type: "Maintenance Charge",
    lines: [
      { label: "Monthly Maintenance", amount: 12_500 },
      { label: "Water", basis: "265 units @ LKR 25", amount: 6_625 },
      { label: "Electricity", basis: "610 units @ LKR 65", amount: 6_175 },
      { label: "Common Area Charge", amount: 2_400 },
      { label: "Sinking Fund", amount: 900 },
    ],
    subtotal: 28_600,
    adjustment: 0,
    total: 28_600,
    paid: 28_600,
    dueDate: "2026-07-31",
    issued: "2026-07-01",
  },
  {
    id: "BIL-2026-00404",
    period: "2026-06",
    type: "Maintenance Charge",
    lines: [
      { label: "Monthly Maintenance", amount: 12_500 },
      { label: "Water", basis: "251 units @ LKR 25", amount: 6_275 },
      { label: "Electricity", basis: "588 units @ LKR 65", amount: 5_820 },
      { label: "Common Area Charge", amount: 2_400 },
      { label: "Sinking Fund", amount: 900 },
    ],
    subtotal: 27_895,
    adjustment: -395,
    total: 27_500,
    paid: 27_500,
    dueDate: "2026-06-30",
    issued: "2026-06-01",
  },
  {
    id: "FAC-2026-0219",
    period: "2026-08",
    type: "Facility Charge",
    lines: [{ label: "Banquet Hall booking · 25 Aug", amount: 15_000 }],
    subtotal: 15_000,
    adjustment: 0,
    total: 15_000,
    paid: 15_000,
    dueDate: "2026-09-05",
    issued: "2026-08-08",
  },
  {
    id: "BIL-2026-00281",
    period: "2026-05",
    type: "Maintenance Charge",
    lines: [
      { label: "Monthly Maintenance", amount: 12_500 },
      { label: "Water", basis: "244 units @ LKR 25", amount: 6_100 },
      { label: "Electricity", basis: "572 units @ LKR 65", amount: 5_200 },
      { label: "Common Area Charge", amount: 2_400 },
      { label: "Sinking Fund", amount: 900 },
    ],
    subtotal: 27_100,
    adjustment: 0,
    total: 27_100,
    paid: 27_100,
    dueDate: "2026-05-31",
    issued: "2026-05-01",
  },
];

/** Still owed on an invoice. */
export function balanceOf(invoice: ResidentInvoice) {
  return Math.max(0, invoice.total - invoice.paid);
}

/**
 * Worked out rather than stored, so an invoice cannot be marked Paid while it
 * still carries a balance — or sit at Unpaid a month after its due date.
 */
export function statusOf(invoice: ResidentInvoice, today: string): InvoiceStatus {
  const balance = balanceOf(invoice);
  if (balance === 0) return "Paid";
  if (daysBetween(today, invoice.dueDate) < 0) return "Overdue";
  return invoice.paid > 0 ? "Partially Paid" : "Pending";
}

/** Newest first — the order the bills list reads. */
export const residentInvoices = [...INVOICES].sort((a, b) =>
  b.issued.localeCompare(a.issued),
);

/** Everything still owed across every open invoice. */
export function outstandingTotal(invoices = residentInvoices) {
  return invoices.reduce((sum, invoice) => sum + balanceOf(invoice), 0);
}

/** The next bill falling due, which is the one the dashboard leads with. */
export function nextDueInvoice(
  today: string,
  invoices = residentInvoices,
): ResidentInvoice | null {
  return (
    invoices
      .filter((invoice) => balanceOf(invoice) > 0)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] ?? null
  );
}

/** The billing cycle the portal is sitting in. */
export const CURRENT_PERIOD = "2026-08";

/**
 * This cycle's bill, still to be settled — what a resident means by "my bill".
 */
export function currentBills(period = CURRENT_PERIOD, invoices = residentInvoices) {
  return invoices.filter(
    (invoice) => invoice.period === period && balanceOf(invoice) > 0,
  );
}

/**
 * Everything still owed, whatever cycle it came from.
 *
 * The same as the current bill while nothing has been carried over — and the
 * moment something is missed, this is the tab that says so.
 */
export function outstandingBills(invoices = residentInvoices) {
  return invoices
    .filter((invoice) => balanceOf(invoice) > 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/** `2026-08` → `August 2026`, the label beside an invoice number. */
export function periodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
