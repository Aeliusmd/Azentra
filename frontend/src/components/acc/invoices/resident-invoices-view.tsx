"use client";

import { useMemo, useState } from "react";

import { InvoiceDocumentModal } from "@/components/acc/invoices/invoice-document-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { InvoiceStatusPill } from "@/components/acc/ui/status-pill";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr } from "@/lib/acc/money";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import {
  accPropertyName,
  useSelectedAccProperty,
} from "@/lib/acc/properties";
import { residentInvoicesFor } from "@/lib/acc/resident-invoices-data";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Invoice ID" },
  { label: "Resident" },
  { label: "Unit" },
  { label: "Service" },
  { label: "Total", numeric: true },
  { label: "Due" },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * The invoices out with residents for the open cycle. The long tail across
 * earlier months lives on Invoice History.
 */
export function AccResidentInvoicesView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const invoices = useMemo(
    () => residentInvoicesFor(propertyId, period),
    [propertyId, period],
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
          Resident Invoices
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Track and manage resident billing invoices
        </p>
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((invoice) => (
            <AccRecordRow
              key={invoice.id}
              id={invoice.id}
              title={invoice.resident}
              subtitle={`${invoice.unit} · ${invoice.service}`}
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
          <table className="w-full min-w-[960px] text-left">
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
                  <td className={`${CELL} text-gray-700`}>
                    {invoice.resident}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{invoice.unit}</td>
                  <td className={`${CELL} text-gray-700`}>{invoice.service}</td>
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
            No resident invoices raised for this period.
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
        <InvoiceDocumentModal
          id={openInvoice.id}
          subtitle={`${openInvoice.unit} · ${periodLabel(openInvoice.period)}`}
          details={[
            { label: "Resident", value: openInvoice.resident },
            { label: "Unit", value: openInvoice.unit },
            { label: "Property", value: accPropertyName(propertyId) },
            { label: "Billing Period", value: periodLabel(openInvoice.period) },
            { label: "Due Date", value: openInvoice.dueDate },
            {
              label: "Status",
              value: <InvoiceStatusPill status={openInvoice.status} />,
            },
          ]}
          items={[
            { label: openInvoice.service, amount: openInvoice.total },
          ]}
          total={openInvoice.total}
          paid={openInvoice.status === "Paid" ? openInvoice.total : 0}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
