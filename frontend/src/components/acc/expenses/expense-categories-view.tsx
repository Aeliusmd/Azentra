"use client";

import { useMemo } from "react";

import { Meter } from "@/components/acc/dashboard/summary-tiles";
import { Card } from "@/components/ui/card";
import {
  categoryBudgetsFor,
  pressureOf,
  type BudgetPressure,
} from "@/lib/acc/expense-categories-data";
import { lkrK, lkrM } from "@/lib/acc/money";
import { useSelectedAccProperty } from "@/lib/acc/properties";

/** Bar and badge share a colour, so the two read as one signal. */
const PRESSURE: Record<BudgetPressure, { bar: string; badge: string }> = {
  "on-track": { bar: "#3f9e63", badge: "bg-green-50 text-green-700" },
  "near-limit": { bar: "#e8a33d", badge: "bg-[#fdf6dd] text-[#96751c]" },
  over: { bar: "#e0554d", badge: "bg-rose-50 text-rose-600" },
};

function Figure({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div>
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd
        className={`mt-1.5 text-[17px] font-bold ${green ? "text-[#2f9e63]" : "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The year's allocation per category with what is left of it.
 *
 * Annual figures, not the open cycle — this is the envelope every month's
 * expenses are drawn from.
 */
export function AccExpenseCategoriesView() {
  const propertyId = useSelectedAccProperty();

  const budgets = useMemo(
    () => categoryBudgetsFor(propertyId),
    [propertyId],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Expense Categories
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Budget allocation and spending by category
        </p>
      </div>

      {budgets.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] text-muted">
            No category budgets set for this property.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {budgets.map((entry) => {
            const tone = PRESSURE[pressureOf(entry.used)];

            return (
              <li key={entry.category}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[17px] font-bold text-ink">
                      {entry.category}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap ${tone.badge}`}
                    >
                      {entry.used}% used
                    </span>
                  </div>

                  <div className="mt-4">
                    <Meter
                      value={Math.min(100, entry.used)}
                      color={tone.bar}
                      label={`${entry.category} budget used`}
                    />
                  </div>

                  <dl className="mt-5 grid grid-cols-3 gap-4">
                    <Figure label="Budget" value={lkrM(entry.budget)} />
                    <Figure label="Spent" value={lkrM(entry.spent)} />
                    <Figure
                      label="Remaining"
                      value={lkrK(entry.remaining)}
                      green={entry.remaining >= 0}
                    />
                  </dl>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
