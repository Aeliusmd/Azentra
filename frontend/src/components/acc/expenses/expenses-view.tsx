"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { AddExpenseModal } from "@/components/acc/expenses/add-expense-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { ExpenseStatusPill } from "@/components/acc/ui/status-pill";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import {
  EXPENSE_FILTERS,
  summariseExpenses,
} from "@/lib/acc/expenses-data";
import { useAccExpenses } from "@/lib/acc/expenses-store";
import { lkr, lkrM } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "ID" },
  { label: "Category" },
  { label: "Description" },
  { label: "Vendor" },
  { label: "Amount", numeric: true },
  { label: "Date" },
  { label: "Status" },
];

const PAGE_SIZE = 12;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

export function AccExpensesView() {
  const allExpenses = useAccExpenses();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const expenses = useMemo(
    () =>
      allExpenses
        .filter(
          (expense) =>
            expense.propertyId === propertyId && expense.period === period,
        )
        .sort((a, b) => a.id.localeCompare(b.id)),
    [allExpenses, propertyId, period],
  );

  const visible = useMemo(
    () =>
      category === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === category),
    [expenses, category],
  );

  // The tiles report the filtered set, so picking a category re-summarises too.
  const summary = useMemo(() => summariseExpenses(visible), [visible]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Expenses
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Track and manage all property expenses
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total" value={String(summary.count)} />
        <SummaryTile label="Amount" value={lkrM(summary.amount)} tone="red" />
        <SummaryTile label="Paid" value={String(summary.paid)} tone="green" />
        <SummaryTile
          label="Pending"
          value={String(summary.pending)}
          tone="amber"
        />
      </div>

      <AccStatusChips
        label="Filter by category"
        options={EXPENSE_FILTERS}
        value={category}
        onChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((expense) => (
            <AccRecordRow
              key={expense.id}
              id={expense.id}
              title={expense.description}
              subtitle={`${expense.category} · ${expense.vendor}`}
              status={<ExpenseStatusPill status={expense.status} />}
              meta={[
                { label: "Amount", value: lkr(expense.amount) },
                { label: "Date", value: expense.date },
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
                      heading.numeric ? "text-right" : ""
                    }`}
                  >
                    {heading.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {rows.map((expense) => (
                <tr
                  key={expense.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className={`${CELL} text-left font-medium text-link`}
                  >
                    {expense.id}
                  </th>
                  <td className={`${CELL} text-gray-700`}>
                    {expense.category}
                  </td>
                  <td className={`${CELL} text-gray-700`}>
                    {expense.description}
                  </td>
                  <td className={`${CELL} text-gray-700`}>{expense.vendor}</td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(expense.amount)}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{expense.date}</td>
                  <td className="px-5 py-3.5">
                    <ExpenseStatusPill status={expense.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            Nothing spent under this category for the period.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="expenses"
          />
        )}
      </Card>

      {addOpen && (
        <AddExpenseModal
          propertyId={propertyId}
          period={period}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
