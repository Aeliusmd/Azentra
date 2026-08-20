"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { useAccBudgets } from "@/lib/acc/budgets-store";
import { lkr, lkrM } from "@/lib/acc/money";
import { useSelectedAccProperty } from "@/lib/acc/properties";

/**
 * The whole bar is the allocation and the filled part is what has been spent,
 * so the grey showing through is the money still to go. Uniform colour — this
 * is a comparison, not a warning.
 */
const TRACK = "#8f9296";
const FILL = "#5b7f9c";

/** Spend against allocation, category by category, for the year's live plan. */
export function AccBudgetVsActualView() {
  const allBudgets = useAccBudgets();
  const propertyId = useSelectedAccProperty();

  // The live plan is the one worth comparing; drafts have nothing in them.
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
          Budget vs Actual
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Compare actual spending against allocated budget
        </p>
      </div>

      {!budget ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] text-muted">
            No allocations to compare for this property yet.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {budget.categories.map((entry) => (
            <li key={entry.category}>
              <Card className="p-5">
                <h2 className="text-[15px] font-bold text-ink">
                  {entry.category}
                </h2>

                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-[13px] text-muted">
                    Budget: {lkrM(entry.budget)}
                  </span>
                  <span className="text-[13px] text-muted">
                    Actual: {lkrM(entry.spent)}
                  </span>
                </div>

                <span
                  role="img"
                  aria-label={`${entry.category}: ${entry.used}% of the allocation spent`}
                  className="mt-2.5 block h-2.5 overflow-hidden rounded-full"
                  style={{ background: TRACK }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${Math.min(100, entry.used)}%`,
                      background: FILL,
                    }}
                  />
                </span>

                <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-[13px] text-muted">
                    {entry.used}% used
                  </span>
                  <span className="text-[13px] text-muted">
                    {lkr(entry.remaining)} remaining
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
