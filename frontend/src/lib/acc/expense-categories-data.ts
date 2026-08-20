import type { ExpenseCategory } from "@/lib/acc/expenses-data";

/**
 * The year's spending allocation, one line per budgeted category.
 *
 * These are annual figures with spend to date against them, not the monthly
 * ledger — which is why the totals here run to tens of millions while a single
 * cycle's expenses come to about three. The categories carrying a budget are
 * exactly the ones the expense list offers as filter chips.
 */

export type CategoryBudget = {
  category: ExpenseCategory;
  budget: number;
  /** Spent against the allocation so far this year. */
  spent: number;
  /** `budget - spent`. */
  remaining: number;
  /** Whole percent of the allocation used. */
  used: number;
};

/** `category, annualBudget, spentToDate`. */
type Row = [ExpenseCategory, number, number];

const ALLOCATIONS: Record<string, Row[]> = {
  sunrise: [
    ["Maintenance", 5_000_000, 3_800_000],
    ["Utilities", 8_000_000, 6_200_000],
    ["Security", 4_000_000, 2_800_000],
    ["Cleaning", 3_000_000, 2_250_000],
    ["Staff", 12_000_000, 8_500_000],
    ["Insurance", 2_000_000, 1_350_000],
    ["Administration", 1_500_000, 980_000],
    ["Emergency Reserve", 1_500_000, 450_000],
  ],
  "ocean-view": [
    ["Maintenance", 3_600_000, 2_520_000],
    ["Utilities", 5_800_000, 4_100_000],
    ["Security", 2_800_000, 1_960_000],
    ["Cleaning", 2_200_000, 1_760_000],
    ["Staff", 8_400_000, 5_880_000],
    ["Insurance", 1_500_000, 1_020_000],
    ["Administration", 1_100_000, 715_000],
    ["Emergency Reserve", 1_200_000, 300_000],
  ],
  "garden-heights": [
    ["Maintenance", 2_400_000, 1_800_000],
    ["Utilities", 3_900_000, 2_925_000],
    ["Security", 2_200_000, 1_694_000],
    ["Cleaning", 1_700_000, 1_190_000],
    ["Staff", 6_200_000, 4_216_000],
    ["Insurance", 1_100_000, 715_000],
    ["Administration", 800_000, 496_000],
    ["Emergency Reserve", 900_000, 180_000],
  ],
};

/**
 * How hard a category is pressing against its allocation.
 *
 * Green up to three quarters, amber past it, red once the budget is gone —
 * so a line that needs attention is visible without reading the numbers.
 */
export type BudgetPressure = "on-track" | "near-limit" | "over";

/** Bar colour per pressure band, shared by every screen that draws one. */
export const PRESSURE_BAR: Record<BudgetPressure, string> = {
  "on-track": "#3f9e63",
  "near-limit": "#e8a33d",
  over: "#e0554d",
};

export function pressureOf(used: number): BudgetPressure {
  if (used >= 100) return "over";
  if (used > 75) return "near-limit";
  return "on-track";
}

/**
 * Remaining and used are computed rather than stored, so the three figures on
 * a card always reconcile with the bar above them.
 */
export function categoryBudgetsFor(propertyId: string): CategoryBudget[] {
  return (ALLOCATIONS[propertyId] ?? []).map(([category, budget, spent]) => ({
    category,
    budget,
    spent,
    remaining: budget - spent,
    used: budget === 0 ? 0 : Math.round((spent / budget) * 100),
  }));
}
