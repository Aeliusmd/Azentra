import {
  residentInvoicesFor,
  type InvoiceStatus,
} from "@/lib/acc/resident-invoices-data";
import type { VendorInvoice } from "@/lib/acc/vendor-invoices-data";

/**
 * Both sides of the invoice ledger in one list.
 *
 * Nothing is stored here — the two source lists are folded into a common shape,
 * so an invoice reads the same whether it was raised against a resident or
 * received from a supplier, and neither list can drift out of step with this
 * one.
 */

export const INVOICE_PARTIES = ["Resident", "Vendor"] as const;
export type InvoiceParty = (typeof INVOICE_PARTIES)[number];

/** Filter row order — "All" first, then one chip per side of the ledger. */
export const INVOICE_PARTY_FILTERS = ["All", ...INVOICE_PARTIES] as const;

export type HistoryInvoice = {
  id: string;
  type: InvoiceParty;
  /** The resident or the vendor, whichever side the invoice sits on. */
  party: string;
  /** Unit for a resident, category for a vendor. */
  context: string;
  service: string;
  period: string;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
};

/**
 * Residents first, then vendors, each in invoice-number order.
 *
 * Vendor invoices are passed in rather than read here, because they live in a
 * store the approval action writes to — reading the seed instead would leave
 * this page showing an invoice as pending after it had been signed off.
 */
export function invoiceHistoryFor(
  propertyId: string,
  period: string,
  vendorInvoices: VendorInvoice[],
): HistoryInvoice[] {
  const resident: HistoryInvoice[] = residentInvoicesFor(
    propertyId,
    period,
  ).map((invoice) => ({
    id: invoice.id,
    type: "Resident",
    party: invoice.resident,
    context: invoice.unit,
    service: invoice.service,
    period: invoice.period,
    total: invoice.total,
    dueDate: invoice.dueDate,
    status: invoice.status,
  }));

  const vendor: HistoryInvoice[] = vendorInvoices
    .filter(
      (invoice) =>
        invoice.propertyId === propertyId && invoice.period === period,
    )
    .map((invoice) => ({
      id: invoice.id,
      type: "Vendor",
      party: invoice.vendor,
      context: invoice.category,
      service: invoice.service,
      period: invoice.period,
      total: invoice.total,
      dueDate: invoice.dueDate,
      status: invoice.status,
    }));

  return [...resident, ...vendor];
}

export type InvoiceHistorySummary = {
  total: number;
  value: number;
  paid: number;
  /** Still waiting on sign-off — approved invoices are already through. */
  pending: number;
};

export function summariseInvoices(
  invoices: HistoryInvoice[],
): InvoiceHistorySummary {
  return {
    total: invoices.length,
    value: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
    paid: invoices.filter((invoice) => invoice.status === "Paid").length,
    pending: invoices.filter(
      (invoice) => invoice.status === "Pending Approval",
    ).length,
  };
}
