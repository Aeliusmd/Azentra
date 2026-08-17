"use client";

import { useMemo, useState } from "react";

import { BillDetailModal } from "@/components/acc/billing/bill-detail-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { BillStatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { lkr, lkrK } from "@/lib/acc/money";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { useAccUnitBills } from "@/lib/acc/unit-bills-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Bill ID" },
  { label: "Unit" },
  { label: "Resident" },
  { label: "Period" },
  { label: "Total", numeric: true },
  { label: "Status" },
  { label: "Created" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * Every bill raised in the cycle, in invoice-number order.
 *
 * Reads the same store the Unit Bills page writes to, so a bill generated
 * anywhere appears here — with the running totals across the top that the list
 * itself does not carry.
 */
export function AccBillingHistoryView() {
  const allBills = useAccUnitBills();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const history = useMemo(
    () =>
      allBills
        .filter(
          (bill) => bill.propertyId === propertyId && bill.period === period,
        )
        .sort((a, b) => a.id.localeCompare(b.id)),
    [allBills, propertyId, period],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return history;

    return history.filter((bill) =>
      [bill.id, bill.unit, bill.resident]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [history, search]);

  // The tiles report the filtered set, so searching narrows the summary too.
  const summary = useMemo(
    () => ({
      count: visible.length,
      value: visible.reduce((sum, bill) => sum + bill.total, 0),
      paid: visible.filter((bill) => bill.status === "Paid").length,
      overdue: visible.filter((bill) => bill.status === "Overdue").length,
    }),
    [visible],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openBill = allBills.find((bill) => bill.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Billing History
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Complete history of all generated bills
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total Bills" value={String(summary.count)} />
        <SummaryTile label="Total Value" value={lkrK(summary.value)} />
        <SummaryTile
          label="Paid"
          value={String(summary.paid)}
          tone="green"
        />
        <SummaryTile
          label="Overdue"
          value={String(summary.overdue)}
          tone="red"
        />
      </div>

      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search bills..."
        label="Search billing history"
        className="w-full sm:w-[355px]"
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((bill) => (
            <AccRecordRow
              key={bill.id}
              id={bill.id}
              title={bill.resident}
              subtitle={`${bill.unit} · ${periodLabel(bill.period)}`}
              status={<BillStatusPill status={bill.status} />}
              meta={[
                { label: "Total", value: lkr(bill.total) },
                { label: "Created", value: bill.createdOn },
              ]}
              onOpen={() => setOpenId(bill.id)}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[940px] text-left">
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
              {rows.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => setOpenId(bill.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal`}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(bill.id);
                      }}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {bill.id}
                    </button>
                  </th>
                  <td className={`${CELL} text-gray-700`}>{bill.unit}</td>
                  <td className={`${CELL} text-gray-700`}>{bill.resident}</td>
                  <td className={`${CELL} text-gray-600`}>
                    {periodLabel(bill.period)}
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(bill.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <BillStatusPill status={bill.status} />
                  </td>
                  <td className={`${CELL} text-gray-600`}>{bill.createdOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No bills match that search.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="bills"
          />
        )}
      </Card>

      {openBill && (
        <BillDetailModal bill={openBill} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
