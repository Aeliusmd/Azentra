"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { RecordPaymentModal } from "@/components/acc/payments/record-payment-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { PaymentStatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr, lkrK } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import {
  summarisePayments,
  useAccPayments,
} from "@/lib/acc/payments-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "ID" },
  { label: "Resident" },
  { label: "Unit" },
  { label: "Bill" },
  { label: "Amount", numeric: true },
  { label: "Method" },
  { label: "Date" },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

export function AccPaymentsView() {
  const allPayments = useAccPayments();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);
  const [recordOpen, setRecordOpen] = useState(false);

  const payments = useMemo(
    () =>
      allPayments
        .filter(
          (payment) =>
            payment.propertyId === propertyId && payment.period === period,
        )
        .sort((a, b) => a.id.localeCompare(b.id)),
    [allPayments, propertyId, period],
  );

  const summary = useMemo(() => summarisePayments(payments), [payments]);

  const pageCount = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = payments.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Payments
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Record and manage all resident payments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRecordOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total Payments" value={String(summary.count)} />
        <SummaryTile
          label="Total Value"
          value={lkrK(summary.value)}
          tone="green"
        />
        <SummaryTile
          label="Verified"
          value={String(summary.verified)}
          tone="green"
        />
        <SummaryTile
          label="Pending"
          value={String(summary.pending)}
          tone="amber"
        />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((payment) => (
            <AccRecordRow
              key={payment.id}
              id={payment.id}
              title={payment.resident}
              subtitle={`${payment.unit} · ${payment.bill}`}
              status={<PaymentStatusPill status={payment.status} />}
              meta={[
                { label: "Amount", value: lkr(payment.amount) },
                { label: "Method", value: payment.method },
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
                  <td className={`${CELL} text-gray-700`}>{payment.bill}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(payment.amount)}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{payment.method}</td>
                  <td className={`${CELL} text-gray-600`}>{payment.date}</td>
                  <td className="px-5 py-3.5">
                    <PaymentStatusPill status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No payments recorded for this period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={payments.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="payments"
          />
        )}
      </Card>

      {recordOpen && (
        <RecordPaymentModal
          propertyId={propertyId}
          period={period}
          onClose={() => setRecordOpen(false)}
        />
      )}
    </div>
  );
}
