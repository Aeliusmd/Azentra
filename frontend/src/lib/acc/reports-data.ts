import { TODAY } from "@/lib/acc/dashboard-data";
import type { AnnualBudget } from "@/lib/acc/budgets-data";
import type { AccExpense } from "@/lib/acc/expenses-data";
import { collectionRate } from "@/lib/acc/money";
import { outstandingFor } from "@/lib/acc/outstanding-data";
import {
  paidAgainstBill,
  type AccPayment,
} from "@/lib/acc/payments-data";
import type { UnitBill } from "@/lib/acc/unit-bills-data";
import type { UtilityReading } from "@/lib/acc/utility-bills-data";

/**
 * The reports the accountant can run.
 *
 * Every one is assembled from the same stores the screens read, so a report is
 * the state of the books at the moment it was run rather than a separate copy
 * that could fall behind them.
 */

export const REPORT_CATEGORIES = [
  "Billing",
  "Payment",
  "Expense",
  "Utility",
  "Budget",
  "Financial",
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

/** Chip row — "All" first, then one per category. */
export const REPORT_FILTERS = ["All", ...REPORT_CATEGORIES] as const;

export type AccReport = {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
};

/** Listed in pairs by category, as the design lays them out. */
export const ACC_REPORTS: AccReport[] = [
  {
    id: "bills-generated",
    title: "Bills Generated Report",
    category: "Billing",
    description: "All bills generated for the selected period",
  },
  {
    id: "collection-rate",
    title: "Collection Rate Report",
    category: "Billing",
    description: "Payment collection rate by tower and unit",
  },
  {
    id: "daily-payments",
    title: "Daily Payments Report",
    category: "Payment",
    description: "Payments received day by day",
  },
  {
    id: "monthly-payment-summary",
    title: "Monthly Payment Summary",
    category: "Payment",
    description: "Aggregated monthly payment totals",
  },
  {
    id: "expense-by-category",
    title: "Expense by Category",
    category: "Expense",
    description: "Expenses grouped by category",
  },
  {
    id: "expense-by-vendor",
    title: "Expense by Vendor",
    category: "Expense",
    description: "Expenses grouped by vendor",
  },
  {
    id: "water-consumption",
    title: "Water Consumption Report",
    category: "Utility",
    description: "Per-unit water usage",
  },
  {
    id: "electricity-consumption",
    title: "Electricity Consumption Report",
    category: "Utility",
    description: "Per-unit electricity usage",
  },
  {
    id: "budget-vs-actual",
    title: "Budget vs Actual Report",
    category: "Budget",
    description: "Budget utilization vs actual spending",
  },
  {
    id: "category-variance",
    title: "Category Variance Report",
    category: "Budget",
    description: "Deviation by budget category",
  },
  {
    id: "monthly-financial-statement",
    title: "Monthly Financial Statement",
    category: "Financial",
    description: "Revenue, expenses, and net balance",
  },
  {
    id: "outstanding-balance",
    title: "Outstanding Balance Report",
    category: "Financial",
    description: "All outstanding resident balances",
  },
];

/** Everything a report may need, scoped to the property and cycle in the header. */
export type ReportSource = {
  property: string;
  periodLabel: string;
  bills: UnitBill[];
  /** Every payment on file for the property, so history reports can look back. */
  allPayments: AccPayment[];
  payments: AccPayment[];
  expenses: AccExpense[];
  readings: UtilityReading[];
  budget: AnnualBudget | null;
};

export type ReportTable = {
  columns: string[];
  rows: (string | number)[][];
  /** `label: value` lines printed above the table. */
  notes: string[];
};

/** Sums a list into `[key, count, amount]` rows, biggest first. */
function groupBy<T>(
  items: T[],
  key: (item: T) => string,
  amount: (item: T) => number,
) {
  const totals = new Map<string, { count: number; amount: number }>();

  for (const item of items) {
    const entry = totals.get(key(item)) ?? { count: 0, amount: 0 };
    entry.count += 1;
    entry.amount += amount(item);
    totals.set(key(item), entry);
  }

  return [...totals.entries()]
    .sort((a, b) => b[1].amount - a[1].amount)
    .map(([name, entry]) => [name, entry.count, entry.amount] as const);
}

export function buildReport(id: string, source: ReportSource): ReportTable {
  const {
    bills,
    payments,
    allPayments,
    expenses,
    readings,
    budget,
  } = source;

  switch (id) {
    case "bills-generated":
      return {
        columns: ["Bill ID", "Unit", "Resident", "Total", "Due", "Status"],
        rows: bills.map((bill) => [
          bill.id,
          bill.unit,
          bill.resident,
          bill.total,
          bill.dueDate,
          bill.status,
        ]),
        notes: [
          `Bills generated: ${bills.length}`,
          `Total billed: ${bills.reduce((sum, bill) => sum + bill.total, 0)}`,
        ],
      };

    case "collection-rate": {
      const rows = bills.map((bill) => {
        const collected = paidAgainstBill(bill, allPayments);
        return [
          // The unit's block is the character before its number.
          bill.unit.split("-")[0],
          bill.unit,
          bill.resident,
          bill.total,
          collected,
          `${collectionRate(collected, bill.total)}%`,
        ];
      });

      const billed = bills.reduce((sum, bill) => sum + bill.total, 0);
      const collected = bills.reduce(
        (sum, bill) => sum + paidAgainstBill(bill, allPayments),
        0,
      );

      return {
        columns: ["Tower", "Unit", "Resident", "Billed", "Collected", "Rate"],
        rows,
        notes: [`Overall collection rate: ${collectionRate(collected, billed)}%`],
      };
    }

    case "daily-payments":
      return {
        columns: ["Date", "Payments", "Amount"],
        rows: groupBy(
          payments,
          (payment) => payment.date,
          (payment) => payment.amount,
        )
          .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
          .map((row) => [...row]),
        notes: [`Payments received: ${payments.length}`],
      };

    case "monthly-payment-summary": {
      const byPeriod = groupBy(
        allPayments,
        (payment) => payment.period,
        (payment) => payment.amount,
      ).sort((a, b) => String(a[0]).localeCompare(String(b[0])));

      return {
        columns: ["Period", "Payments", "Amount"],
        rows: byPeriod.map((row) => [...row]),
        notes: [`Cycles on file: ${byPeriod.length}`],
      };
    }

    case "expense-by-category":
      return {
        columns: ["Category", "Expenses", "Amount"],
        rows: groupBy(
          expenses,
          (expense) => expense.category,
          (expense) => expense.amount,
        ).map((row) => [...row]),
        notes: [
          `Total spent: ${expenses.reduce((sum, e) => sum + e.amount, 0)}`,
        ],
      };

    case "expense-by-vendor":
      return {
        columns: ["Vendor", "Expenses", "Amount"],
        rows: groupBy(
          expenses,
          (expense) => expense.vendor,
          (expense) => expense.amount,
        ).map((row) => [...row]),
        notes: [
          `Total spent: ${expenses.reduce((sum, e) => sum + e.amount, 0)}`,
        ],
      };

    case "water-consumption":
    case "electricity-consumption": {
      const utility = id === "water-consumption" ? "Water" : "Electricity";
      const metered = readings.filter((reading) => reading.type === utility);

      return {
        columns: ["Unit", "Previous", "Current", "Consumption", "Charge"],
        rows: metered.map((reading) => [
          reading.unit,
          reading.previous,
          reading.current,
          reading.consumption,
          reading.charge,
        ]),
        notes: [
          `Total consumption: ${metered.reduce((sum, r) => sum + r.consumption, 0)} units`,
          `Total charged: ${metered.reduce((sum, r) => sum + r.charge, 0)}`,
        ],
      };
    }

    case "budget-vs-actual":
      return {
        columns: ["Category", "Budget", "Spent", "Remaining", "Used"],
        rows: (budget?.categories ?? []).map((entry) => [
          entry.category,
          entry.budget,
          entry.spent,
          entry.remaining,
          `${entry.used}%`,
        ]),
        notes: budget ? [`Operating budget: ${budget.total}`] : ["No budget on file"],
      };

    case "category-variance":
      return {
        columns: ["Category", "Budget", "Spent", "Variance", "Variance %"],
        rows: (budget?.categories ?? []).map((entry) => [
          entry.category,
          entry.budget,
          entry.spent,
          entry.remaining,
          `${entry.budget === 0 ? 0 : Math.round((entry.remaining / entry.budget) * 100)}%`,
        ]),
        notes: budget ? [`Categories: ${budget.categories.length}`] : ["No budget on file"],
      };

    case "monthly-financial-statement": {
      const billed = bills.reduce((sum, bill) => sum + bill.total, 0);
      const collected = bills.reduce(
        (sum, bill) => sum + paidAgainstBill(bill, allPayments),
        0,
      );
      const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        columns: ["Line", "Amount"],
        rows: [
          ["Billed", billed],
          ["Collected", collected],
          ["Outstanding", billed - collected],
          ["Expenses", spent],
          ["Net balance", collected - spent],
        ],
        notes: [`Collection rate: ${collectionRate(collected, billed)}%`],
      };
    }

    case "outstanding-balance": {
      const rows = outstandingFor(bills, allPayments);

      return {
        columns: ["Unit", "Resident", "Bill", "Balance", "Due", "Days Overdue"],
        rows: rows.map((row) => [
          row.unit,
          row.resident,
          row.bill,
          row.balance,
          row.dueDate,
          row.daysOverdue,
        ]),
        notes: [
          `Balances outstanding: ${rows.length}`,
          `Total outstanding: ${rows.reduce((sum, row) => sum + row.balance, 0)}`,
          `As at: ${TODAY}`,
        ],
      };
    }

    default:
      return { columns: [], rows: [], notes: [] };
  }
}
