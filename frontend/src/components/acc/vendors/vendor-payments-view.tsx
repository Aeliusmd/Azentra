"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { VendorInvoiceModal } from "@/components/acc/invoices/vendor-invoice-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { InvoiceStatusPill } from "@/components/acc/ui/status-pill";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import type { VendorInvoice } from "@/lib/acc/vendor-invoices-data";
import {
  approveVendorInvoice,
  payVendorInvoice,
  useAccVendorInvoices,
} from "@/lib/acc/vendor-invoices-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "ID" },
  { label: "Vendor" },
  { label: "Service" },
  { label: "Total", numeric: true },
  { label: "Due" },
  { label: "Status" },
  { label: "Actions" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";
const ACTION =
  "rounded-md px-4 py-1.5 text-[13px] font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none";

/**
 * The action open on an invoice is whatever the next step in its life is:
 * sign it off, settle it, or nothing because it is already settled.
 */
function RowAction({ invoice }: { invoice: VendorInvoice }) {
  if (invoice.status === "Pending Approval") {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          approveVendorInvoice(invoice.id);
        }}
        className={`${ACTION} bg-[#2e6cad] hover:bg-[#255a92]`}
      >
        Approve
        <span className="sr-only"> {invoice.id}</span>
      </button>
    );
  }

  if (invoice.status === "Approved") {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          payVendorInvoice(invoice.id);
        }}
        className={`${ACTION} bg-brand hover:bg-brand-dark`}
      >
        Pay
        <span className="sr-only"> {invoice.id}</span>
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-[#2f9e63]">
      Paid
      <Check aria-hidden="true" className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * The supplier worklist: what still needs signing off and what is cleared to
 * pay. The invoice record itself lives under Invoices — this is the queue.
 */
export function AccVendorPaymentsView() {
  const allInvoices = useAccVendorInvoices();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const invoices = useMemo(
    () =>
      allInvoices.filter(
        (invoice) =>
          invoice.propertyId === propertyId && invoice.period === period,
      ),
    [allInvoices, propertyId, period],
  );

  const pageCount = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = invoices.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openInvoice =
    invoices.find((invoice) => invoice.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Vendor Invoices
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Track vendor invoices and payments
        </p>
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((invoice) => (
            <AccRecordRow
              key={invoice.id}
              id={invoice.id}
              title={invoice.vendor}
              subtitle={invoice.service}
              status={<InvoiceStatusPill status={invoice.status} />}
              meta={[
                { label: "Total", value: lkr(invoice.total) },
                { label: "Due", value: invoice.dueDate },
              ]}
              action={<RowAction invoice={invoice} />}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading.label}
                    scope="col"
                    className={`px-5 py-3.5 text-[12px] font-semibold tracking-wide text-gray-500 uppercase ${
                      heading.numeric ? "text-right" : ""
                    }`}
                  >
                    {heading.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {rows.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal`}>
                    <button
                      type="button"
                      onClick={() => setOpenId(invoice.id)}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {invoice.id}
                    </button>
                  </th>
                  <td className={`${CELL} text-gray-700`}>{invoice.vendor}</td>
                  <td className={`${CELL} text-gray-700`}>{invoice.service}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(invoice.total)}
                  </td>
                  <td className={`${CELL} text-gray-600`}>
                    {invoice.dueDate}
                  </td>
                  <td className="px-5 py-3.5">
                    <InvoiceStatusPill status={invoice.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowAction invoice={invoice} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No vendor invoices received for this period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={invoices.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="invoices"
          />
        )}
      </Card>

      {openInvoice && (
        <VendorInvoiceModal
          invoice={openInvoice}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
