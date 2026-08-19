import { MONTHS } from "@/lib/acc/dashboard-data";
import { CURRENT_PERIOD } from "@/lib/acc/periods";

/**
 * What the property spent — the outgoing side of the ledger.
 *
 * Where an expense came through a supplier it records the net figure the
 * vendor invoice was raised for, which is why the two screens quote different
 * numbers for the same job: the invoice carries VAT, the expense does not.
 */

export const EXPENSE_CATEGORIES = [
  "Maintenance",
  "Utilities",
  "Security",
  "Cleaning",
  "Staff",
  "Insurance",
  "Administration",
  "Landscaping",
  "Emergency Reserve",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

/**
 * Chip row on the list.
 *
 * Not simply `All` plus every category: it is the taxonomy the office filters
 * by, which carries `Emergency Reserve` even in months nothing was drawn from
 * it, and leaves `Landscaping` off.
 */
export const EXPENSE_FILTERS = [
  "All",
  "Maintenance",
  "Utilities",
  "Security",
  "Cleaning",
  "Staff",
  "Insurance",
  "Administration",
  "Emergency Reserve",
] as const;

export const EXPENSE_STATUSES = ["Pending", "Approved", "Paid"] as const;
export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export type AccExpense = {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  description: string;
  /** `Internal` where the cost was not bought in. */
  vendor: string;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  amount: number;
  /** ISO day the cost was incurred. */
  date: string;
  status: ExpenseStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/**
 * `category, description, vendor, amount, day, status`.
 *
 * `{month}` and `{prev}` in the description are filled in from the period — a
 * utility bill is settled this month for last month's supply.
 */
type Row = [ExpenseCategory, string, string, number, number, ExpenseStatus];

const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["Maintenance", "Emergency pipe repair - Tower A", "ABC Plumbing", 147_500, 10, "Paid"],
    ["Cleaning", "Monthly cleaning service - {month}", "CleanPro Services", 250_000, 5, "Approved"],
    ["Maintenance", "Elevator quarterly maintenance", "ElevatorPro Ltd", 180_000, 8, "Paid"],
    ["Utilities", "Tower A electricity bill - {prev}", "National Power Co", 320_000, 3, "Paid"],
    ["Maintenance", "Pool pump repair", "AquaClean Pool Services", 85_000, 12, "Pending"],
    ["Landscaping", "Monthly landscaping - {month}", "GreenScape Ltd", 120_000, 3, "Paid"],
    ["Security", "Security system maintenance", "SecureTech Solutions", 95_000, 6, "Approved"],
    ["Utilities", "Tower B electricity bill - {prev}", "National Power Co", 285_000, 3, "Paid"],
    ["Utilities", "Water utility bill - {prev}", "City Water Board", 180_000, 4, "Paid"],
    ["Insurance", "Property insurance - Q3 2026", "SafeGuard Insurance", 450_000, 1, "Paid"],
    ["Administration", "Office supplies - {month}", "OfficeMax", 35_000, 9, "Approved"],
    ["Staff", "Staff salaries - {month}", "Internal", 850_000, 1, "Paid"],
  ],
  "ocean-view": [
    ["Maintenance", "Block 2 pipe replacement", "AquaFlow Plumbing", 157_600, 9, "Approved"],
    ["Cleaning", "Monthly cleaning service - {month}", "CleanPro Services", 178_000, 5, "Paid"],
    ["Utilities", "Tower 1 electricity bill - {prev}", "National Power Co", 207_600, 4, "Paid"],
    ["Utilities", "Tower 2 electricity bill - {prev}", "National Power Co", 194_000, 4, "Paid"],
    ["Landscaping", "Monthly landscaping - {month}", "GreenScape Ltd", 83_000, 3, "Paid"],
    ["Security", "CCTV maintenance", "SecureTech Solutions", 61_000, 7, "Pending"],
    ["Utilities", "Water utility bill - {prev}", "City Water Board", 115_300, 4, "Paid"],
    ["Insurance", "Property insurance - Q3 2026", "SafeGuard Insurance", 320_000, 1, "Paid"],
    ["Staff", "Staff salaries - {month}", "Internal", 620_000, 1, "Paid"],
  ],
  "garden-heights": [
    ["Security", "Monthly security service", "SecureGuard Lanka", 189_800, 6, "Approved"],
    ["Cleaning", "Monthly cleaning service - {month}", "CleanPro Services", 139_800, 5, "Paid"],
    ["Utilities", "North Wing electricity bill - {prev}", "National Power Co", 159_300, 4, "Paid"],
    ["Landscaping", "Monthly landscaping - {month}", "GreenScape Ltd", 64_400, 3, "Pending"],
    ["Maintenance", "Elevator service call", "ElevatorPro Ltd", 45_800, 11, "Paid"],
    ["Utilities", "Water utility bill - {prev}", "City Water Board", 88_500, 4, "Paid"],
    ["Insurance", "Property insurance - Q3 2026", "SafeGuard Insurance", 245_000, 1, "Paid"],
    ["Staff", "Staff salaries - {month}", "Internal", 480_000, 1, "Paid"],
  ],
};

/**
 * Where each property's expense numbers start. Spaced 1000 apart, and each
 * closed month steps 200 within that, so no two expenses share a number.
 */
const ID_BLOCK: Record<string, number> = {
  sunrise: 2044,
  "ocean-view": 3044,
  "garden-heights": 4044,
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

/** `2026-08` → `August`, and its predecessor `July`. */
function monthNames(period: string) {
  const month = Number(period.split("-")[1]);
  return {
    month: MONTHS[month - 1],
    // Wraps to December when the cycle is January.
    prev: MONTHS[(month + 10) % 12],
  };
}

export function expensesFor(
  propertyId: string,
  period: string,
): AccExpense[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);
  const base = (ID_BLOCK[propertyId] ?? 1) + back * 200;
  const { month, prev } = monthNames(period);

  return rows.map(
    ([category, description, vendor, amount, day, status], index) => ({
      id: `EXP-${base + index}`,
      propertyId,
      category,
      description: description
        .replace("{month}", month)
        .replace("{prev}", prev),
      vendor,
      period,
      // Running costs drift between cycles; deterministic so history is stable.
      amount:
        back === 0
          ? amount
          : Math.round(
              (amount + (((index * 83 + back * 137) % 30_001) - 15_000)) / 100,
            ) * 100,
      date: `${period}-${String(day).padStart(2, "0")}`,
      // A closed cycle has been settled and signed off.
      status: back === 0 ? status : "Paid",
    }),
  );
}

/** Every seeded expense, across all properties and every period on file. */
export function seedExpenses(periods: string[]): AccExpense[] {
  return Object.keys(OPEN_MONTH).flatMap((propertyId) =>
    periods.flatMap((period) => expensesFor(propertyId, period)),
  );
}

export type ExpenseSummary = {
  count: number;
  amount: number;
  paid: number;
  /** Everything not yet settled — approved but unpaid counts here too. */
  pending: number;
};

export function summariseExpenses(list: AccExpense[]): ExpenseSummary {
  const paid = list.filter((expense) => expense.status === "Paid").length;

  return {
    count: list.length,
    amount: list.reduce((sum, expense) => sum + expense.amount, 0),
    paid,
    pending: list.length - paid,
  };
}
