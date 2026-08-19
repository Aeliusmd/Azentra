"use client";

import { useSyncExternalStore } from "react";

import type { ExpenseCategory } from "@/lib/acc/expenses-data";
import { lkr } from "@/lib/acc/money";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import {
  seedRecurringExpenses,
  type RecurringExpense,
  type RecurringFrequency,
} from "@/lib/acc/recurring-expenses-data";

/**
 * The property's standing costs, held in a module store so a schedule added
 * here stays put while the session lasts. Resets on reload like the other mock
 * stores.
 */

const seed = seedRecurringExpenses();

let schedules: RecurringExpense[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Next free number in a property's block. */
function nextId(propertyId: string) {
  const highest = schedules
    .filter((entry) => entry.propertyId === propertyId)
    .reduce((max, entry) => {
      const number = Number(entry.id.split("-")[1]);
      return Number.isNaN(number) ? max : Math.max(max, number);
    }, 0);

  return `REC-${highest + 1}`;
}

export type NewRecurringInput = {
  propertyId: string;
  name: string;
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  frequency: RecurringFrequency;
  dueDay: number;
};

/** Sets up a standing cost. It starts Active — that is the point of adding it. */
export function addRecurringExpense(input: NewRecurringInput) {
  const schedule: RecurringExpense = {
    id: nextId(input.propertyId),
    propertyId: input.propertyId,
    name: input.name,
    category: input.category,
    vendor: input.vendor || "Internal",
    amount: input.amount,
    frequency: input.frequency,
    dueDay: input.dueDay,
    status: "Active",
  };

  schedules = [...schedules, schedule];
  emit();

  pushAccNotification(
    "Expense",
    "Recurring Expense Added",
    `${schedule.name} · ${schedule.vendor} · ${lkr(schedule.amount)} ${schedule.frequency.toLowerCase()}.`,
  );

  return schedule;
}

/** Stops or restarts a schedule without losing what it was set up as. */
export function toggleRecurringExpense(id: string) {
  schedules = schedules.map((entry) =>
    entry.id === id
      ? { ...entry, status: entry.status === "Active" ? "Paused" : "Active" }
      : entry,
  );
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return schedules;
}

function getServerSnapshot() {
  return seed;
}

export function useAccRecurringExpenses() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
