"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

import { BillDetailModal } from "@/components/acc/billing/bill-detail-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { StatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { lkr, lkrK } from "@/lib/acc/money";
import {
  outstandingFor,
  summariseOutstanding,
} from "@/lib/acc/outstanding-data";
import { useAccPayments } from "@/lib/acc/payments-store";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import { sendReminder, useAccUnitBills } from "@/lib/acc/unit-bills-store";

/** `numeric` right-aligns; `centre` is for the reminder tally. */
const HEADINGS: { label: string; numeric?: boolean; centre?: boolean }[] = [
  { label: "Unit" },
  { label: "Resident" },
  { label: "Bill" },
  { label: "Amount", numeric: true },
  { label: "Due Date" },
  { label: "Days Overdue" },
  { label: "Reminders", centre: true },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

const REMIND =
  "flex items-center gap-1.5 rounded-md bg-[#e8eef5] px-3 py-1.5 text-[13px] font-medium text-[#1b3a5c] transition-colors hover:bg-[#dae4ef] focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/** Green while there is still time, amber once the date has passed. */
function OverdueBadge({ days }: { days: number }) {
  if (days === 0) return <StatusPill tone="green">Not due</StatusPill>;
  return (
    <StatusPill tone="amber">
      {days} day{days === 1 ? "" : "s"}
    </StatusPill>
  );
}

/**
 * What residents still owe on the open cycle, worst first. The balance is the
 * bill less whatever has cleared, so verifying a payment settles a row here.
 */
export function AccOutstandingView() {
  const allBills = useAccUnitBills();
  const payments = useAccPayments();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const rowsAll = useMemo(() => {
    const inScope = allBills.filter(
      (bill) => bill.propertyId === propertyId && bill.period === period,
    );
    // Latest overdue first, then the biggest balance — the collection order.
    return outstandingFor(inScope, payments).sort(
      (a, b) => b.daysOverdue - a.daysOverdue || b.balance - a.balance,
    );
  }, [allBills, payments, propertyId, period]);

  const summary = useMemo(() => summariseOutstanding(rowsAll), [rowsAll]);

  const pageCount = Math.max(1, Math.ceil(rowsAll.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = rowsAll.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openBill = allBills.find((bill) => bill.id === openId) ?? null;

  function remind(id: string, resident: string) {
    sendReminder(id);
    showAccToast(`Reminder sent to ${resident}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Outstanding Payments
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Monitor and collect outstanding balances
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Outstanding" value={String(summary.count)} />
        <SummaryTile
          label="Total Amount"
          value={lkrK(summary.amount)}
          tone="red"
        />
        <SummaryTile
          label="Overdue"
          value={String(summary.overdue)}
          tone="red"
        />
        <SummaryTile
          label="Avg Days Overdue"
          value={`${summary.averageDaysOverdue}d`}
          tone="amber"
        />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((row) => (
            <AccRecordRow
              key={row.id}
              id={row.bill}
              title={row.resident}
              subtitle={row.unit}
              status={
                <span className="flex flex-wrap items-center gap-2">
                  <OverdueBadge days={row.daysOverdue} />
                  <button
                    type="button"
                    onClick={() => remind(row.id, row.resident)}
                    className={REMIND}
                  >
                    <Bell aria-hidden="true" className="h-3.5 w-3.5" />
                    Remind
                  </button>
                </span>
              }
              meta={[
                { label: "Amount", value: lkr(row.balance) },
                { label: "Due", value: row.dueDate },
                { label: "Reminders", value: String(row.reminders) },
              ]}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1060px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading.label}
                    scope="col"
                    className={`px-5 py-3.5 text-[12px] font-semibold tracking-wide text-gray-500 uppercase ${
                      heading.numeric
                        ? "text-right"
                        : heading.centre
                          ? "text-center"
                          : ""
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
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className={`${CELL} text-left font-semibold text-ink`}
                  >
                    {row.unit}
                  </th>
                  <td className={`${CELL} text-gray-700`}>{row.resident}</td>
                  <td className={CELL}>
                    <button
                      type="button"
                      onClick={() => setOpenId(row.id)}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {row.bill}
                    </button>
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(row.balance)}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{row.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <OverdueBadge days={row.daysOverdue} />
                  </td>
                  <td className={`${CELL} text-center text-gray-700`}>
                    {row.reminders}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remind(row.id, row.resident)}
                        className={REMIND}
                      >
                        <Bell aria-hidden="true" className="h-3.5 w-3.5" />
                        Remind
                        <span className="sr-only"> {row.resident}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rowsAll.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            Nothing is outstanding for this period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={rowsAll.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="balances"
          />
        )}
      </Card>

      {openBill && (
        <BillDetailModal bill={openBill} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
