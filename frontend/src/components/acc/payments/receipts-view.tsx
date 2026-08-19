"use client";

import { useMemo, useState } from "react";

import { ReceiptModal } from "@/components/acc/payments/receipt-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr, lkrK } from "@/lib/acc/money";
import { isReceipted, receiptNumberFor } from "@/lib/acc/payments-data";
import { useAccPayments } from "@/lib/acc/payments-store";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { useAccUnitBills } from "@/lib/acc/unit-bills-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Receipt #" },
  { label: "Resident" },
  { label: "Unit" },
  { label: "Bill" },
  { label: "Amount", numeric: true },
  { label: "Method" },
  { label: "Date" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * The receipts actually issued this cycle.
 *
 * Fewer rows than Payment History by design: a part payment leaves its bill
 * open and a draft bill has not been sent to anyone, so neither has produced a
 * receipt yet.
 */
export function AccReceiptsView() {
  const allPayments = useAccPayments();
  const bills = useAccUnitBills();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const receipts = useMemo(
    () =>
      allPayments
        .filter(
          (payment) =>
            payment.propertyId === propertyId &&
            payment.period === period &&
            isReceipted(payment, bills),
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((payment) => ({
          payment,
          receipt: receiptNumberFor(payment, bills),
        })),
    [allPayments, bills, propertyId, period],
  );

  const summary = useMemo(
    () => ({
      count: receipts.length,
      value: receipts.reduce((sum, row) => sum + row.payment.amount, 0),
      // The list is date-ordered, so the last row is the most recent receipt.
      latest: receipts.at(-1)?.payment.date ?? "—",
    }),
    [receipts],
  );

  const pageCount = Math.max(1, Math.ceil(receipts.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = receipts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const open = receipts.find((row) => row.payment.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Receipts
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          View and download payment receipts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
        <SummaryTile label="Total Receipts" value={String(summary.count)} />
        <SummaryTile
          label="Total Value"
          value={lkrK(summary.value)}
          tone="green"
        />
        <SummaryTile label="Latest" value={summary.latest} />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map(({ payment, receipt }) => (
            <AccRecordRow
              key={payment.id}
              id={receipt}
              title={payment.resident}
              subtitle={`${payment.unit} · ${payment.bill}`}
              meta={[
                { label: "Amount", value: lkr(payment.amount) },
                { label: "Method", value: payment.method },
                { label: "Date", value: payment.date },
              ]}
              onOpen={() => setOpenId(payment.id)}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left">
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
              {rows.map(({ payment, receipt }) => (
                <tr
                  key={payment.id}
                  onClick={() => setOpenId(payment.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal`}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(payment.id);
                      }}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {receipt}
                    </button>
                  </th>
                  <td className={`${CELL} text-gray-700`}>
                    {payment.resident}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.unit}</td>
                  <td className={`${CELL} text-gray-700`}>{payment.bill}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(payment.amount)}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.method}</td>
                  <td className={`${CELL} text-gray-600`}>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {receipts.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No receipts issued for this period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={receipts.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="receipts"
          />
        )}
      </Card>

      {open && (
        <ReceiptModal
          receipt={open.receipt}
          payment={open.payment}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
