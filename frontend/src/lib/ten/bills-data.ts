import { daysBetween, MONTHS } from "@/lib/res/format";

/**
 * What this tenant has been billed.
 *
 * Only charges the *tenant* is responsible for appear here. The owner's
 * obligations on A-304 — the sinking-fund levy, the building's capital
 * contributions, the owner's share of common-area works — are billed to the
 * owner and never reach this list, so a tenant is never shown a balance that
 * is not theirs to settle.
 *
 * Only the amount charged and what has been paid against it are stored; the
 * balance and whether it is overdue are worked out from those and the date, so
 * a bill cannot show a status that contradicts its own numbers.
 */

export const INVOICE_TYPES = [
  "Electricity",
  "Water",
  "Utility Charges",
  "Tenant Service Charge",
  "Facility Charge",
  "Tenant Maintenance Charge",
  "Other",
] as const;
export type InvoiceType = (typeof INVOICE_TYPES)[number];

/**
 * `Unpaid` covers everything still owed but not yet late; `Overdue` is derived
 * from the due date rather than stored, so it can never go stale.
 */
export type InvoiceStatus = "Unpaid" | "Partially Paid" | "Paid" | "Overdue";

/** One line on an invoice — what it is and what it came to. */
export type InvoiceLine = {
  label: string;
  amount: number;
};

export type TenantInvoice = {
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

const INVOICES: TenantInvoice[] = [
  {
    id: "TIN-2026-00842",
    period: "2026-08",
    type: "Utility Charges",
    lines: [
      { label: "Electricity - 248 kWh", amount: 4_800 },
      { label: "Water - 14 units", amount: 1_750 },
      { label: "Common utility share", amount: 1_250 },
      { label: "Tenant service charge", amount: 3_500 },
    ],
    subtotal: 11_300,
    adjustment: 0,
    total: 11_300,
    paid: 0,
    dueDate: "2026-08-31",
    issued: "2026-08-01",
  },
  {
    id: "TIN-2026-00838",
    period: "2026-08",
    type: "Facility Charge",
    lines: [
      { label: "Banquet Hall - 4 hours", amount: 6_000 },
      { label: "Cleaning fee", amount: 1_500 },
    ],
    subtotal: 7_500,
    adjustment: -500,
    total: 7_000,
    paid: 3_000,
    dueDate: "2026-09-10",
    issued: "2026-08-05",
  },
  {
    id: "TIN-2026-00790",
    period: "2026-07",
    type: "Utility Charges",
    lines: [
      { label: "Electricity - 231 kWh", amount: 4_420 },
      { label: "Water - 13 units", amount: 1_620 },
      { label: "Common utility share", amount: 1_250 },
      { label: "Tenant service charge", amount: 3_500 },
    ],
    subtotal: 10_790,
    adjustment: 0,
    total: 10_790,
    paid: 10_790,
    dueDate: "2026-07-31",
    issued: "2026-07-01",
  },
  {
    id: "TIN-2026-00771",
    period: "2026-07",
    type: "Tenant Maintenance Charge",
    lines: [{ label: "Replacement door latch - guest bathroom", amount: 2_400 }],
    subtotal: 2_400,
    adjustment: 0,
    total: 2_400,
    paid: 2_400,
    dueDate: "2026-07-20",
    issued: "2026-07-02",
  },
  {
    id: "TIN-2026-00755",
    period: "2026-07",
    type: "Facility Charge",
    lines: [{ label: "BBQ Terrace - 3 hours", amount: 3_000 }],
    subtotal: 3_000,
    adjustment: 0,
    total: 3_000,
    paid: 3_000,
    dueDate: "2026-07-15",
    issued: "2026-07-04",
  },
  {
    id: "TIN-2026-00712",
    period: "2026-06",
    type: "Utility Charges",
    lines: [
      { label: "Electricity - 205 kWh", amount: 3_960 },
      { label: "Water - 12 units", amount: 1_480 },
      { label: "Common utility share", amount: 1_250 },
      { label: "Tenant service charge", amount: 3_500 },
    ],
    subtotal: 10_190,
    adjustment: 0,
    total: 10_190,
    paid: 10_190,
    dueDate: "2026-06-30",
    issued: "2026-06-01",
  },
  {
    id: "TIN-2026-00698",
    period: "2026-06",
    type: "Other",
    lines: [{ label: "Move-in key fob and access cards", amount: 4_500 }],
    subtotal: 4_500,
    adjustment: 0,
    total: 4_500,
    paid: 4_500,
    dueDate: "2026-06-10",
    issued: "2026-06-01",
  },
];

export const tenantInvoices = INVOICES;

/** What is still owed on an invoice. */
export function balanceOf(invoice: TenantInvoice) {
  return Math.max(0, invoice.total - invoice.paid);
}

/**
 * Derived, never stored — an invoice describes its own state from its numbers
 * and the date, so paying one is enough to move it.
 */
export function statusOf(invoice: TenantInvoice, today: string): InvoiceStatus {
  if (balanceOf(invoice) === 0) return "Paid";
  if (daysBetween(today, invoice.dueDate) < 0) return "Overdue";
  return invoice.paid > 0 ? "Partially Paid" : "Unpaid";
}

/** Anything with money still on it. */
export function isOutstanding(invoice: TenantInvoice) {
  return balanceOf(invoice) > 0;
}

/** Total the tenant currently owes across every open invoice. */
export function totalOutstanding(invoices: TenantInvoice[] = INVOICES) {
  return invoices.reduce((sum, invoice) => sum + balanceOf(invoice), 0);
}

/** The open invoice falling due soonest — the one the dashboard leads with. */
export function nextDueInvoice(
  invoices: TenantInvoice[] = INVOICES,
): TenantInvoice | null {
  const open = invoices
    .filter(isOutstanding)
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return open[0] ?? null;
}

export function paidInvoices(invoices: TenantInvoice[] = INVOICES) {
  return invoices.filter((invoice) => balanceOf(invoice) === 0);
}

/** `2026-08` → `August 2026`, the way a billing period is labelled. */
export function periodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
