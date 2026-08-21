import { residentInvoices, type ResidentInvoice } from "@/lib/res/bills-data";

/**
 * What this household has paid, and the receipt for each one.
 *
 * A payment always names the invoice it settled, so the bills list and the
 * history describe the same events from two sides. Frontend only — there is no
 * gateway behind the pay flow, and the reference is a mock bank reference.
 */

export const PAYMENT_METHODS = [
  "Card",
  "Bank Transfer",
  "Online Payment",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "Completed" | "Processing" | "Failed";

export type ResidentPayment = {
  id: string;
  /** The invoice this settled. */
  invoiceId: string;
  /** ISO day the money left the resident's account. */
  date: string;
  method: PaymentMethod;
  amount: number;
  /** Bank or gateway reference, as printed on the receipt. */
  reference: string;
  status: PaymentStatus;
};

/** Newest first — the order the history reads. */
export const residentPayments: ResidentPayment[] = [
  {
    id: "PAY-2026-0774",
    invoiceId: "FAC-2026-0219",
    date: "2026-08-10",
    method: "Card",
    amount: 15_000,
    reference: "CRD-8841-2290",
    status: "Completed",
  },
  {
    id: "PAY-2026-0918",
    invoiceId: "BIL-2026-00612",
    date: "2026-07-28",
    method: "Bank Transfer",
    amount: 28_600,
    reference: "TRF-4417-0093",
    status: "Completed",
  },
  {
    id: "PAY-2026-0661",
    invoiceId: "BIL-2026-00404",
    date: "2026-06-27",
    method: "Online Payment",
    amount: 27_500,
    reference: "ONL-7712-6640",
    status: "Completed",
  },
  {
    id: "PAY-2026-0602",
    invoiceId: "BIL-2026-00281",
    date: "2026-05-29",
    method: "Bank Transfer",
    amount: 27_100,
    reference: "TRF-3308-5521",
    status: "Completed",
  },
];

/**
 * A receipt is the payment seen from the resident's side, so its number is
 * derived from the payment rather than filed separately — the two can never
 * come apart.
 */
export function receiptNumberFor(payment: ResidentPayment) {
  return payment.id.replace("PAY-", "RCP-");
}

/** Every payment made against one invoice, oldest first. */
export function paymentsForInvoice(
  invoiceId: string,
  payments = residentPayments,
) {
  return payments
    .filter((payment) => payment.invoiceId === invoiceId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The invoice a payment settled, for naming it in the history. */
export function invoiceFor(
  payment: ResidentPayment,
  invoices: ResidentInvoice[] = residentInvoices,
) {
  return invoices.find((invoice) => invoice.id === payment.invoiceId) ?? null;
}
