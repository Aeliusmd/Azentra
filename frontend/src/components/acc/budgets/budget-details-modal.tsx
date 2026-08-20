"use client";

import { Meter } from "@/components/acc/dashboard/summary-tiles";
import { Modal } from "@/components/ui/modal";
import type { AnnualBudget } from "@/lib/acc/budgets-data";
import { PRESSURE_BAR, pressureOf } from "@/lib/acc/expense-categories-data";
import { lkr, lkrK, shortM } from "@/lib/acc/money";

/**
 * Every allocation on a year's plan, with what is left of each.
 *
 * The reserve is listed here even though it sits outside the headline total —
 * the point of the sheet is to show the whole plan, and the footer says which
 * part of it is the operating budget.
 */
export function BudgetDetailsModal({
  budget,
  onClose,
}: {
  budget: AnnualBudget;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={`${budget.year} Budget Details`}
    >
      <div className="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
        <ul className="space-y-4">
          {budget.categories.map((entry) => (
            <li
              key={entry.category}
              className="rounded-lg border border-hairline p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-[15px] font-bold text-ink">
                  {entry.category}
                </span>
                <span className="text-[15px] font-bold text-ink">
                  {lkrK(entry.spent)} / {shortM(entry.budget)}
                </span>
              </div>

              <div className="mt-3">
                <Meter
                  value={Math.min(100, entry.used)}
                  color={PRESSURE_BAR[pressureOf(entry.used)]}
                  label={`${entry.category} budget used`}
                />
              </div>

              <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-[13px] text-muted">
                  {entry.used}% used
                </span>
                <span className="text-[13px] text-muted">
                  {lkr(entry.remaining)} remaining
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-hairline px-5 py-5 sm:px-8">
        <span className="text-[15px] font-bold text-ink">Total Budget</span>
        <span className="text-[17px] font-bold text-ink">
          {lkr(budget.total)}
        </span>
      </div>
    </Modal>
  );
}
