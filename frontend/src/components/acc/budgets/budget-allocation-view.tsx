"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { useAccBudgets } from "@/lib/acc/budgets-store";
import { lkrM, shortM } from "@/lib/acc/money";
import { useSelectedAccProperty } from "@/lib/acc/properties";

/** Uniform — this screen is about proportion, not pressure. */
const BAR = "#4a7bab";

/**
 * How the year's pot is divided between categories.
 *
 * The total here counts the contingency reserve, unlike the Budgets card:
 * the question is how every allocated rupee is apportioned, and the reserve is
 * one of the slices.
 */
export function AccBudgetAllocationView() {
  const allBudgets = useAccBudgets();
  const propertyId = useSelectedAccProperty();

  // The live plan is the one worth apportioning; drafts have nothing in them.
  const budget = useMemo(
    () =>
      allBudgets
        .filter((entry) => entry.propertyId === propertyId)
        .sort((a, b) => b.year - a.year)
        .find((entry) => entry.categories.length > 0) ?? null,
    [allBudgets, propertyId],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Budget Allocation
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          View how the annual budget is distributed
        </p>
      </div>

      {!budget ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] text-muted">
            No allocations to show for this property yet.
          </p>
        </Card>
      ) : (
        <Card className="p-5 sm:p-8">
          <div className="text-center">
            <p className="text-[12px] font-medium tracking-wide text-muted uppercase">
              Total Annual Budget
            </p>
            <p className="mt-2 text-[32px] leading-none font-bold text-ink">
              {lkrM(budget.allocated)}
            </p>
          </div>

          <ul className="mt-8 space-y-6">
            {budget.categories.map((entry) => {
              const share =
                budget.allocated === 0
                  ? 0
                  : Math.round((entry.budget / budget.allocated) * 100);

              return (
                <li key={entry.category}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-[14px] text-ink">
                      {entry.category}
                    </span>
                    <span className="text-[14px] font-bold text-ink">
                      {share}%
                    </span>
                  </div>

                  <span
                    role="img"
                    aria-label={`${entry.category}: ${share}% of the annual budget`}
                    className="mt-2 block h-2 overflow-hidden rounded-full bg-gray-200"
                  >
                    <span
                      className="block h-full rounded-full transition-[width] duration-300"
                      style={{ width: `${share}%`, background: BAR }}
                    />
                  </span>

                  <p className="mt-2 text-[13px] text-muted">
                    LKR {shortM(entry.budget)} allocated
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
