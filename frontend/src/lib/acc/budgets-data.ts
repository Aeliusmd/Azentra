import {
  categoryBudgetsFor,
  type CategoryBudget,
} from "@/lib/acc/expense-categories-data";

/**
 * A property's spending plan for a financial year.
 *
 * The categories are the same allocations the Expense Categories page shows —
 * this is the wrapper around them: which year, whose property, and whether the
 * plan is live.
 */

export const BUDGET_STATUSES = ["Draft", "Active", "Closed"] as const;
export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

/** Years a budget can be drawn up for. */
export const BUDGET_YEARS = [2025, 2026, 2027] as const;

/**
 * The contingency fund is allocated but sits outside the operating plan, so it
 * is not counted in the headline total — a year's budget is what the property
 * intends to spend, not what it is holding back.
 */
export const RESERVE_CATEGORY = "Emergency Reserve";

export type AnnualBudget = {
  id: string;
  propertyId: string;
  year: number;
  status: BudgetStatus;
  categories: CategoryBudget[];
  /** Sum of the operating allocations, excluding the reserve. */
  total: number;
  /**
   * Everything allocated, reserve included — the pot the allocation view
   * divides up. Distinct from `total`, which is only what is planned to be
   * spent.
   */
  allocated: number;
  /** Spent against those operating allocations so far. */
  spent: number;
};

/** Operating lines only — everything but the contingency fund. */
export function operatingLines(categories: CategoryBudget[]) {
  return categories.filter((entry) => entry.category !== RESERVE_CATEGORY);
}

function assemble(
  propertyId: string,
  year: number,
  status: BudgetStatus,
  categories: CategoryBudget[],
): AnnualBudget {
  const operating = operatingLines(categories);

  return {
    id: `BUD-${year}-${propertyId}`,
    propertyId,
    year,
    status,
    categories,
    total: operating.reduce((sum, entry) => sum + entry.budget, 0),
    allocated: categories.reduce((sum, entry) => sum + entry.budget, 0),
    spent: operating.reduce((sum, entry) => sum + entry.spent, 0),
  };
}

/** The live plan for each property, drawn from its category allocations. */
export function seedBudgets(propertyIds: string[]): AnnualBudget[] {
  return propertyIds.map((propertyId) =>
    assemble(propertyId, 2026, "Active", categoryBudgetsFor(propertyId)),
  );
}

/** A newly drawn-up plan has no allocations against it yet. */
export function emptyBudget(propertyId: string, year: number): AnnualBudget {
  return assemble(propertyId, year, "Draft", []);
}
