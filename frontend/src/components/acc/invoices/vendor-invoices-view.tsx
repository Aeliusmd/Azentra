"use client";

import { useMemo, useState } from "react";

import { VendorInvoiceModal } from "@/components/acc/invoices/vendor-invoice-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { InvoiceStatusPill } from "@/components/acc/ui/status-pill";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { useAccVendorInvoices } from "@/lib/acc/vendor-invoices-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Invoice ID" },
  { label: "Vendor" },
  { label: "Category" },
  { label: "Service" },
  { label: "WO Ref" },
  { label: "Total", numeric: true },
  { label: "Due" },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * What the property owes its suppliers this cycle. Mirrors the resident
 * invoice list, with the vendor and its category standing in for the resident
 * and their unit.
 */
export function AccVendorInvoicesView() {
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
          Track and manage supplier invoices
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
              subtitle={`${invoice.category} · ${invoice.service}`}
              status={<InvoiceStatusPill status={invoice.status} />}
              meta={[
                { label: "Total", value: lkr(invoice.total) },
                { label: "Due", value: invoice.dueDate },
              ]}
              onOpen={() => setOpenId(invoice.id)}
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
                  onClick={() => setOpenId(invoice.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal`}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(invoice.id);
                      }}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {invoice.id}
                    </button>
                  </th>
                  <td className={`${CELL} font-semibold text-ink`}>
                    {invoice.vendor}
                  </td>
                  <td className={`${CELL} text-gray-700`}>
                    {invoice.category}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{invoice.service}</td>
                  <td className={`${CELL} text-muted`}>
                    {invoice.workOrder ?? "\u2014"}
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(invoice.total)}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{invoice.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <InvoiceStatusPill status={invoice.status} />
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
