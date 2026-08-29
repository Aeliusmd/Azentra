import { tenantInvoices, type TenantInvoice } from "@/lib/ten/bills-data";

/**
 * What this tenant has paid, and the receipt for each one.
 *
 * A payment always names the invoice it settled, so the bills list and the
 * history describe the same events from two sides — and the payments recorded
 * against an invoice always sum to its `paid` figure.
 *
 * Frontend only: there is no gateway behind the pay flow, no card details are
 * ever asked for, and the bank reference is a mock.
 */

export const PAYMENT_METHODS = [
  "Credit / Debit Card",
  "Bank Transfer",
  "Mobile Payment",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "Completed" | "Processing" | "Failed";

export type TenPayment = {
  id: string;
  /** The invoice this settled. */
  invoiceId: string;
  /** ISO day the money left the tenant's account. */
  date: string;
  method: PaymentMethod;
  amount: number;
  /** Bank or gateway reference, as printed on the receipt. */
  reference: string;
  status: PaymentStatus;
};

/** Newest first — the order the history reads. */
export const tenPayments: TenPayment[] = [
  {
    id: "PAY-2026-0841",
    invoiceId: "TIN-2026-00838",
    date: "2026-08-06",
    method: "Credit / Debit Card",
    amount: 3_000,
    reference: "CRD-6612-4408",
    status: "Completed",
  },
  {
    id: "PAY-2026-0796",
    invoiceId: "TIN-2026-00790",
    date: "2026-07-28",
    method: "Bank Transfer",
    amount: 10_790,
    reference: "TRF-5530-1177",
    status: "Completed",
  },
  {
    id: "PAY-2026-0778",
    invoiceId: "TIN-2026-00771",
    date: "2026-07-18",
    method: "Mobile Payment",
    amount: 2_400,
    reference: "MOB-2204-8830",
    status: "Completed",
  },
  {
    id: "PAY-2026-0760",
    invoiceId: "TIN-2026-00755",
    date: "2026-07-12",
    method: "Credit / Debit Card",
    amount: 3_000,
    reference: "CRD-4471-9902",
    status: "Completed",
  },
  {
    id: "PAY-2026-0719",
    invoiceId: "TIN-2026-00712",
    date: "2026-06-28",
    method: "Bank Transfer",
    amount: 10_190,
    reference: "TRF-3318-6650",
    status: "Completed",
  },
  {
    id: "PAY-2026-0701",
    invoiceId: "TIN-2026-00698",
    date: "2026-06-08",
    method: "Bank Transfer",
    amount: 4_500,
    reference: "TRF-2209-4471",
    status: "Completed",
  },
];

/**
 * A receipt is the payment seen from the tenant's side, so its number is
 * derived from the payment rather than filed separately — the two can never
 * come apart.
 */
export function receiptNumberFor(payment: TenPayment) {
  return payment.id.replace("PAY-", "RCP-");
}

/** Every payment made against one invoice, oldest first. */
export function paymentsForInvoice(
  invoiceId: string,
  payments: TenPayment[] = tenPayments,
) {
  return payments
    .filter((payment) => payment.invoiceId === invoiceId)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The invoice a payment settled, for naming it in the history. */
export function invoiceFor(
  payment: TenPayment,
  invoices: TenantInvoice[] = tenantInvoices,
) {
  return invoices.find((invoice) => invoice.id === payment.invoiceId) ?? null;
}
