"use client";

import { useMemo, useState } from "react";

import { AccRecordRow } from "@/components/acc/ui/record-row";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr, lkrK } from "@/lib/acc/money";
import {
  oldestDate,
  rejectPayment,
  useAccPayments,
  verifyPayment,
} from "@/lib/acc/payments-store";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "ID" },
  { label: "Resident" },
  { label: "Unit" },
  { label: "Amount", numeric: true },
  { label: "Method" },
  { label: "Ref" },
  { label: "Date" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

const ACTION =
  "rounded-md px-4 py-1.5 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/**
 * The verification queue: money the accountant has been told about but has not
 * confirmed arrived. Nothing here counts against a bill until it is verified,
 * which is why a resident can appear both here and on the overdue reports.
 */
export function AccPendingPaymentsView() {
  const allPayments = useAccPayments();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);

  const pending = useMemo(
    () =>
      allPayments
        .filter(
          (payment) =>
            payment.propertyId === propertyId &&
            payment.period === period &&
            payment.status === "Pending",
        )
        // Longest-waiting first — that is the one holding up the cycle.
        .sort((a, b) => a.date.localeCompare(b.date)),
    [allPayments, propertyId, period],
  );

  const value = pending.reduce((sum, payment) => sum + payment.amount, 0);
  const oldest = oldestDate(pending);

  const pageCount = Math.max(1, Math.ceil(pending.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = pending.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function verify(id: string) {
    verifyPayment(id);
    showAccToast(`${id} verified`);
  }

  function reject(id: string) {
    rejectPayment(id);
    showAccToast(`${id} rejected`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Pending Payments
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Payments awaiting verification
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
        <SummaryTile
          label="Pending"
          value={String(pending.length)}
          tone="amber"
        />
        <SummaryTile label="Total Value" value={lkrK(value)} />
        <SummaryTile label="Oldest" value={oldest || "—"} />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((payment) => (
            <AccRecordRow
              key={payment.id}
              id={payment.id}
              title={payment.resident}
              subtitle={`${payment.unit} · ${payment.method}`}
              status={
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => verify(payment.id)}
                    className={`${ACTION} bg-brand text-white hover:bg-brand-dark`}
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(payment.id)}
                    className={`${ACTION} bg-rose-50 text-rose-600 hover:bg-rose-100`}
                  >
                    Reject
                  </button>
                </span>
              }
              meta={[
                { label: "Amount", value: lkr(payment.amount) },
                { label: "Ref", value: payment.reference || "—" },
                { label: "Date", value: payment.date },
              ]}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1040px] text-left">
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
                <th
                  scope="col"
                  className="px-5 py-3.5 text-right text-[12px] font-semibold tracking-wide text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {rows.map((payment) => (
                <tr
                  key={payment.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className={`${CELL} text-left font-medium text-link`}
                  >
                    {payment.id}
                  </th>
                  <td className={`${CELL} text-gray-700`}>
                    {payment.resident}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.unit}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(payment.amount)}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.method}</td>
                  <td className={`${CELL} text-muted`}>
                    {payment.reference || "—"}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{payment.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => verify(payment.id)}
                        className={`${ACTION} bg-brand text-white hover:bg-brand-dark`}
                      >
                        Verify
                        <span className="sr-only"> {payment.id}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => reject(payment.id)}
                        className={`${ACTION} bg-rose-50 text-rose-600 hover:bg-rose-100`}
                      >
                        Reject
                        <span className="sr-only"> {payment.id}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pending.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            Nothing is awaiting verification.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={pending.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="payments"
          />
        )}
      </Card>
    </div>
  );
}
