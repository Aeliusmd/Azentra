"use client";

import { useSyncExternalStore } from "react";

import { lkr } from "@/lib/res/format";
import {
  balanceOf,
  tenantInvoices,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";
import {
  tenPayments,
  type PaymentMethod,
  type TenPayment,
} from "@/lib/ten/payments-data";

/**
 * The tenant's bills and what has been paid against them.
 *
 * Both live in one store because they are two halves of the same fact: settling
 * an invoice writes a payment and moves the invoice's paid figure in the same
 * breath, so the bills list and the payment history can never tell different
 * stories.
 *
 * Frontend only — no gateway is contacted and nothing is charged. And there is
 * no way in here to raise an invoice, adjust one or write off a balance: what a
 * tenant owes is the property's to decide, and this store only settles it.
 */

let invoices: TenantInvoice[] = tenantInvoices;
let payments: TenPayment[] = tenPayments;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Reference prefixes, so a mock reference looks like the method that made it. */
const REFERENCE_PREFIX: Record<PaymentMethod, string> = {
  "Credit / Debit Card": "CRD",
  "Bank Transfer": "TRF",
  "Mobile Payment": "MOB",
};

let sequence = 0;

/** Deterministic stand-in for a bank reference — no randomness to resume from. */
function nextReference(method: PaymentMethod) {
  const step = ++sequence;
  const left = String(1000 + step * 37).padStart(4, "0");
  const right = String(2000 + step * 113).padStart(4, "0");
  return `${REFERENCE_PREFIX[method]}-${left}-${right}`;
}

/**
 * Settles an invoice in full.
 *
 * The amount is always the outstanding balance rather than a figure the tenant
 * types: a part payment is an arrangement with the property, not something to
 * be improvised at the till. Returns the payment so the caller can show its
 * receipt.
 */
export function payTenInvoice(
  invoiceId: string,
  method: PaymentMethod,
  today: string,
): TenPayment | null {
  const invoice = invoices.find((entry) => entry.id === invoiceId);
  if (!invoice) return null;

  const amount = balanceOf(invoice);
  if (amount <= 0) return null;

  const payment: TenPayment = {
    id: `PAY-2026-${String(9000 + ++sequence).slice(-4)}`,
    invoiceId,
    date: today,
    method,
    amount,
    reference: nextReference(method),
    status: "Completed",
  };

  payments = [payment, ...payments];
  invoices = invoices.map((entry) =>
    entry.id === invoiceId ? { ...entry, paid: entry.paid + amount } : entry,
  );
  emit();

  pushTenNotification(
    "Payment",
    "Payment Successful",
    `${lkr(amount)} received against ${invoiceId}. Thank you.`,
  );

  return payment;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function invoiceSnapshot() {
  return invoices;
}

function invoiceServerSnapshot() {
  return tenantInvoices;
}

export function useTenInvoices() {
  return useSyncExternalStore(
    subscribe,
    invoiceSnapshot,
    invoiceServerSnapshot,
  );
}

function paymentSnapshot() {
  return payments;
}

function paymentServerSnapshot() {
  return tenPayments;
}

export function useTenPayments() {
  return useSyncExternalStore(
    subscribe,
    paymentSnapshot,
    paymentServerSnapshot,
  );
}
