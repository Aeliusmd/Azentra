"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { BudgetDetailsModal } from "@/components/acc/budgets/budget-details-modal";
import { CreateBudgetModal } from "@/components/acc/budgets/create-budget-modal";
import { Meter } from "@/components/acc/dashboard/summary-tiles";
import { Card } from "@/components/ui/card";
import { operatingLines } from "@/lib/acc/budgets-data";
import { useAccBudgets } from "@/lib/acc/budgets-store";
import { lkrM, shortM } from "@/lib/acc/money";
import {
  accPropertyName,
  useSelectedAccProperty,
} from "@/lib/acc/properties";

/** Uniform on this screen — the plan is being read, not policed. */
const BAR = "#5b7f9c";

/** How many allocations the card previews before deferring to the full list. */
const PREVIEW = 5;

const STATUS_TONE = {
  Active: "text-[#2f9e63]",
  Draft: "text-[#96751c]",
  Closed: "text-gray-500",
} as const;

export function AccBudgetsView() {
  const allBudgets = useAccBudgets();
  const propertyId = useSelectedAccProperty();

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const budgets = useMemo(
    () =>
      allBudgets
        .filter((budget) => budget.propertyId === propertyId)
        .sort((a, b) => b.year - a.year),
    [allBudgets, propertyId],
  );

  const openBudget = budgets.find((budget) => budget.id === detailsId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Budgets
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Annual budget planning and tracking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] text-muted">
            No budget drawn up for this property yet.
          </p>
        </Card>
      ) : (
        <ul className="space-y-5">
          {budgets.map((budget) => {
            const lines = operatingLines(budget.categories);

            return (
              <li key={budget.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[17px] font-bold text-ink">
                        {budget.year} Annual Budget
                      </h2>
                      <p className="mt-1 text-[14px] text-muted">
                        {accPropertyName(budget.propertyId)} ·{" "}
                        <span
                          className={`font-medium ${STATUS_TONE[budget.status]}`}
                        >
                          {budget.status}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[13px] text-muted">Total Budget</p>
                      <p className="mt-1 text-[24px] leading-none font-bold text-ink">
                        {lkrM(budget.total)}
                      </p>
                    </div>
                  </div>

                  {lines.length === 0 ? (
                    <p className="mt-6 text-[14px] text-muted">
                      No categories allocated yet.
                    </p>
                  ) : (
                    <>
                      <ul className="mt-5 space-y-4">
                        {lines.slice(0, PREVIEW).map((entry) => (
                          <li key={entry.category}>
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="text-[14px] text-ink">
                                {entry.category}
                              </span>
                              <span className="text-[14px] font-bold text-ink">
                                {lkrM(entry.spent)} / {shortM(entry.budget)}
                              </span>
                            </div>
                            <div className="mt-2">
                              <Meter
                                value={Math.min(100, entry.used)}
                                color={BAR}
                                label={`${entry.category} budget used`}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => setDetailsId(budget.id)}
                        aria-haspopup="dialog"
                        className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                      >
                        View all categories
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {openBudget && (
        <BudgetDetailsModal
          budget={openBudget}
          onClose={() => setDetailsId(null)}
        />
      )}

      {createOpen && (
        <CreateBudgetModal
          propertyId={propertyId}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
}
