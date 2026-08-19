"use client";

import { useSyncExternalStore } from "react";

import {
  seedExpenses,
  type AccExpense,
  type ExpenseCategory,
} from "@/lib/acc/expenses-data";
import { lkr } from "@/lib/acc/money";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { billingPeriods } from "@/lib/acc/periods";

/**
 * Every expense the accountant can see, held in a module store so one logged
 * here reaches the budget screens too. Resets on reload like the other mock
 * stores.
 */

const seed = seedExpenses(billingPeriods.map((period) => period.id));

let expenses: AccExpense[] = seed;
const listeners = new Set<() => void>();

/** Next free number in a property's block, so logged ids keep counting up. */
function nextId(propertyId: string, period: string) {
  const sameBlock = expenses.filter(
    (expense) =>
      expense.propertyId === propertyId && expense.period === period,
  );

  const highest = sameBlock.reduce((max, expense) => {
    const number = Number(expense.id.split("-")[1]);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);

  return `EXP-${highest + 1}`;
}

export type NewExpenseInput = {
  propertyId: string;
  period: string;
  category: ExpenseCategory;
  description: string;
  vendor: string;
  amount: number;
  date: string;
};

/**
 * Logs a cost. It lands Pending: recording that money was spent is not the
 * same as somebody having approved it.
 */
export function addExpense(input: NewExpenseInput) {
  const expense: AccExpense = {
    id: nextId(input.propertyId, input.period),
    propertyId: input.propertyId,
    category: input.category,
    description: input.description,
    vendor: input.vendor || "Internal",
    period: input.period,
    amount: input.amount,
    date: input.date,
    status: "Pending",
  };

  expenses = [...expenses, expense];
  listeners.forEach((listener) => listener());

  pushAccNotification(
    "Expense",
    "Expense Logged",
    `${expense.id} · ${expense.category} · ${lkr(expense.amount)} — awaiting approval.`,
  );

  return expense;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return expenses;
}

function getServerSnapshot() {
  return seed;
}

export function useAccExpenses() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
