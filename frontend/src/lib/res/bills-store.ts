"use client";

import { useSyncExternalStore } from "react";

import {
  balanceOf,
  residentInvoices,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import { lkr } from "@/lib/res/format";
import { pushResNotification } from "@/lib/res/notifications-store";
import {
  residentPayments,
  type PaymentMethod,
  type ResidentPayment,
} from "@/lib/res/payments-data";

/**
 * The household's bills and what has been paid against them.
 *
 * Both live in one store because they are two halves of the same fact: settling
 * an invoice writes a payment and moves the invoice's paid figure in the same
 * breath, so the bills list and the payment history can never tell different
 * stories. Frontend only — nothing is charged and nothing leaves the browser.
 */

let invoices: ResidentInvoice[] = residentInvoices;
let payments: ResidentPayment[] = residentPayments;
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
 * Part payment is the property's to arrange, not something a resident can do
 * from here, so the amount is always the outstanding balance. Returns the
 * payment so the caller can show its receipt.
 */
export function payResidentInvoice(
  invoiceId: string,
  method: PaymentMethod,
  today: string,
): ResidentPayment | null {
  const invoice = invoices.find((entry) => entry.id === invoiceId);
  if (!invoice) return null;

  const amount = balanceOf(invoice);
  if (amount <= 0) return null;

  const payment: ResidentPayment = {
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

  pushResNotification(
    "Payment",
    "Payment Received",
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
  return residentInvoices;
}

export function useResInvoices() {
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
  return residentPayments;
}

export function useResPayments() {
  return useSyncExternalStore(
    subscribe,
    paymentSnapshot,
    paymentServerSnapshot,
  );
}
