"use client";

import { useSyncExternalStore } from "react";

import { lkr } from "@/lib/acc/money";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { billingPeriods } from "@/lib/acc/periods";
import {
  seedVendorInvoices,
  type VendorInvoice,
} from "@/lib/acc/vendor-invoices-data";

/**
 * Supplier invoices, held in a module store so signing one off is visible on
 * the invoice history too. Resets on reload like the other mock stores.
 */

const seed = seedVendorInvoices(billingPeriods.map((period) => period.id));

let invoices: VendorInvoice[] = seed;
const listeners = new Set<() => void>();

/**
 * Signs off a supplier invoice for payment. Approval is the control step: until
 * it happens nobody has agreed the property owes this money.
 */
export function approveVendorInvoice(id: string) {
  const invoice = invoices.find((entry) => entry.id === id);
  if (!invoice || invoice.status !== "Pending Approval") return;

  invoices = invoices.map((entry) =>
    entry.id === id ? { ...entry, status: "Approved" } : entry,
  );
  listeners.forEach((listener) => listener());

  pushAccNotification(
    "Invoice",
    "Vendor Invoice Approved",
    `${invoice.id} · ${invoice.vendor} · ${lkr(invoice.total)} cleared for payment by ${invoice.dueDate}.`,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return invoices;
}

function getServerSnapshot() {
  return seed;
}

export function useAccVendorInvoices() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
