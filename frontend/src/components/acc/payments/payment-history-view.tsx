"use client";

import { useMemo, useState } from "react";

import { ReceiptModal } from "@/components/acc/payments/receipt-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { PaymentStatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr, lkrK } from "@/lib/acc/money";
import {
  PAYMENT_METHOD_FILTERS,
  receiptNumberFor,
} from "@/lib/acc/payments-data";
import { useAccPayments } from "@/lib/acc/payments-store";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { useAccUnitBills } from "@/lib/acc/unit-bills-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Receipt" },
  { label: "Resident" },
  { label: "Amount", numeric: true },
  { label: "Method" },
  { label: "Ref" },
  { label: "Date" },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * Every payment in the cycle with the receipt it was issued under — the record
 * a resident is handed, rather than the internal payment number.
 */
export function AccPaymentHistoryView() {
  const allPayments = useAccPayments();
  const bills = useAccUnitBills();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [method, setMethod] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const history = useMemo(
    () =>
      allPayments
        .filter(
          (payment) =>
            payment.propertyId === propertyId && payment.period === period,
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
        .map((payment) => ({
          payment,
          receipt: receiptNumberFor(payment, bills),
        })),
    [allPayments, bills, propertyId, period],
  );

  const visible = useMemo(
    () =>
      method === "All"
        ? history
        : history.filter((row) => row.payment.method === method),
    [history, method],
  );

  // The tiles report the filtered set, so picking a method re-summarises too.
  const summary = useMemo(() => {
    const value = visible.reduce((sum, row) => sum + row.payment.amount, 0);
    return {
      count: visible.length,
      value,
      verified: visible.filter((row) => row.payment.status === "Verified")
        .length,
      average: visible.length === 0 ? 0 : value / visible.length,
    };
  }, [visible]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const open = history.find((row) => row.payment.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Payment History
        </h1>
        <p className="mt-1 text-[14px] text-muted">Complete payment records</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total Payments" value={String(summary.count)} />
        <SummaryTile
          label="Total Amount"
          value={lkrK(summary.value)}
          tone="green"
        />
        <SummaryTile
          label="Verified"
          value={String(summary.verified)}
          tone="green"
        />
        {/* One decimal — whole thousands would round the average away. */}
        <SummaryTile label="Avg Payment" value={lkrK(summary.average, 1)} />
      </div>

      <AccStatusChips
        label="Filter by payment method"
        options={PAYMENT_METHOD_FILTERS}
        value={method}
        onChange={(value) => {
          setMethod(value);
          setPage(1);
        }}
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map(({ payment, receipt }) => (
            <AccRecordRow
              key={payment.id}
              id={receipt}
              title={payment.resident}
              subtitle={`${payment.unit} · ${payment.method}`}
              status={<PaymentStatusPill status={payment.status} />}
              meta={[
                { label: "Amount", value: lkr(payment.amount) },
                { label: "Ref", value: payment.reference || "—" },
                { label: "Date", value: payment.date },
              ]}
              onOpen={() => setOpenId(payment.id)}
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
                    {payment.resident} ({payment.unit})
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(payment.amount)}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.method}</td>
                  <td className={`${CELL} text-muted`}>
                    {payment.reference || "—"}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{payment.date}</td>
                  <td className="px-5 py-3.5">
                    <PaymentStatusPill status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No payments taken by that method this period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="payments"
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
