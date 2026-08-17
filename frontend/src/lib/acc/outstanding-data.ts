import { TODAY } from "@/lib/acc/dashboard-data";
import { paidAgainstBill, type AccPayment } from "@/lib/acc/payments-data";
import type { BillStatus, UnitBill } from "@/lib/acc/unit-bills-data";

/**
 * Balances the collections desk is working.
 *
 * Derived from the bills and the payment ledger rather than stored — the amount
 * owed is the bill less what has actually cleared, so a part payment shrinks the
 * row here the moment it is verified.
 */

/**
 * A bill only reaches this list once there is something to chase. Freshly
 * generated and published bills are still with the resident, and a settled one
 * has nothing left owing.
 */
const COLLECTABLE: BillStatus[] = [
  "Draft",
  "Pending",
  "Partially Paid",
  "Overdue",
];

export type OutstandingRow = {
  id: string;
  unit: string;
  resident: string;
  bill: string;
  /** Bill total less everything verified against it. */
  balance: number;
  dueDate: string;
  /** Whole days past the due date; zero when it is not due yet. */
  daysOverdue: number;
  reminders: number;
};

const DAY = 86_400_000;

/** Whole days between two ISO days, negative while the later one is ahead. */
function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / DAY);
}

export function outstandingFor(
  bills: UnitBill[],
  payments: AccPayment[],
): OutstandingRow[] {
  return bills
    .filter((bill) => COLLECTABLE.includes(bill.status))
    .map((bill) => ({
      id: bill.id,
      unit: bill.unit,
      resident: bill.resident,
      bill: bill.id,
      balance: bill.total - paidAgainstBill(bill, payments),
      dueDate: bill.dueDate,
      daysOverdue: Math.max(0, daysBetween(bill.dueDate, TODAY)),
      reminders: bill.reminders,
    }))
    .filter((row) => row.balance > 0);
}

export type OutstandingSummary = {
  count: number;
  amount: number;
  overdue: number;
  /** Mean age of the balances that are actually late, in whole days. */
  averageDaysOverdue: number;
};

export function summariseOutstanding(
  rows: OutstandingRow[],
): OutstandingSummary {
  const late = rows.filter((row) => row.daysOverdue > 0);

  return {
    count: rows.length,
    amount: rows.reduce((sum, row) => sum + row.balance, 0),
    overdue: late.length,
    averageDaysOverdue:
      late.length === 0
        ? 0
        : Math.round(
            late.reduce((sum, row) => sum + row.daysOverdue, 0) / late.length,
          ),
  };
}
