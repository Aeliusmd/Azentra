"use client";

import { useMemo, useState } from "react";

import { InvoiceDocumentModal } from "@/components/acc/invoices/invoice-document-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { InvoiceStatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import {
  invoiceHistoryFor,
  INVOICE_PARTY_FILTERS,
  summariseInvoices,
} from "@/lib/acc/invoice-history-data";
import { lkr, lkrK } from "@/lib/acc/money";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import {
  accPropertyName,
  useSelectedAccProperty,
} from "@/lib/acc/properties";
import { useAccVendorInvoices } from "@/lib/acc/vendor-invoices-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "ID" },
  { label: "Type" },
  { label: "Vendor/Resident" },
  { label: "Service" },
  { label: "Total", numeric: true },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * Everything invoiced this cycle, both directions — what residents owe the
 * property and what the property owes its suppliers.
 */
export function AccInvoiceHistoryView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [party, setParty] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const vendorInvoices = useAccVendorInvoices();

  const invoices = useMemo(
    () => invoiceHistoryFor(propertyId, period, vendorInvoices),
    [propertyId, period, vendorInvoices],
  );

  const visible = useMemo(
    () =>
      party === "All"
        ? invoices
        : invoices.filter((invoice) => invoice.type === party),
    [invoices, party],
  );

  // The tiles report the filtered set, so switching side re-summarises with it.
  const summary = useMemo(() => summariseInvoices(visible), [visible]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openInvoice = invoices.find((invoice) => invoice.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Invoice History
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Complete history of all invoices
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total" value={String(summary.total)} />
        <SummaryTile label="Total Value" value={lkrK(summary.value)} />
        <SummaryTile label="Paid" value={String(summary.paid)} tone="green" />
        <SummaryTile
          label="Pending"
          value={String(summary.pending)}
          tone="amber"
        />
      </div>

      <AccStatusChips
        label="Filter by invoice type"
        options={INVOICE_PARTY_FILTERS}
        value={party}
        onChange={(value) => {
          setParty(value);
          setPage(1);
        }}
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((invoice) => (
            <AccRecordRow
              key={invoice.id}
              id={invoice.id}
              title={invoice.party}
              subtitle={`${invoice.type} · ${invoice.service}`}
              status={<InvoiceStatusPill status={invoice.status} />}
              meta={[{ label: "Total", value: lkr(invoice.total) }]}
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
                  <td className={`${CELL} text-gray-700`}>{invoice.type}</td>
                  <td className={`${CELL} text-gray-700`}>{invoice.party}</td>
                  <td className={`${CELL} text-gray-700`}>{invoice.service}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(invoice.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <InvoiceStatusPill status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No invoices of this type for the period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="invoices"
          />
        )}
      </Card>

      {openInvoice && (
        <InvoiceDocumentModal
          id={openInvoice.id}
          subtitle={`${openInvoice.party} · ${periodLabel(openInvoice.period)}`}
          details={[
            { label: "Type", value: openInvoice.type },
            {
              label: openInvoice.type === "Resident" ? "Resident" : "Vendor",
              value: openInvoice.party,
            },
            {
              label: openInvoice.type === "Resident" ? "Unit" : "Category",
              value: openInvoice.context,
            },
            { label: "Property", value: accPropertyName(propertyId) },
            { label: "Due Date", value: openInvoice.dueDate },
            {
              label: "Status",
              value: <InvoiceStatusPill status={openInvoice.status} />,
            },
          ]}
          items={[{ label: openInvoice.service, amount: openInvoice.total }]}
          total={openInvoice.total}
          paid={openInvoice.status === "Paid" ? openInvoice.total : 0}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
