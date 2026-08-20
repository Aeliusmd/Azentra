"use client";

import { useSyncExternalStore } from "react";

import {
  emptyBudget,
  seedBudgets,
  type AnnualBudget,
} from "@/lib/acc/budgets-data";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { accPropertyName, assignedProperties } from "@/lib/acc/properties";

/**
 * The spending plans on file, held in a module store so one drawn up here
 * stays put while the session lasts. Resets on reload like the other mock
 * stores.
 */

const seed = seedBudgets(assignedProperties.map((property) => property.id));

let budgets: AnnualBudget[] = seed;
const listeners = new Set<() => void>();

/** Whether a plan already exists for this property and year. */
export function budgetExists(propertyId: string, year: number) {
  return budgets.some(
    (budget) => budget.propertyId === propertyId && budget.year === year,
  );
}

/**
 * Draws up a plan for a year. It starts empty and in Draft — the allocations
 * are added afterwards, which is what makes it worth approving.
 */
export function createBudget(propertyId: string, year: number) {
  if (budgetExists(propertyId, year)) return null;

  const budget = emptyBudget(propertyId, year);
  budgets = [...budgets, budget].sort((a, b) => b.year - a.year);
  listeners.forEach((listener) => listener());

  pushAccNotification(
    "Budget",
    "Budget Created",
    `${year} plan drawn up for ${accPropertyName(propertyId)} — awaiting category allocations.`,
  );

  return budget;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return budgets;
}

function getServerSnapshot() {
  return seed;
}

export function useAccBudgets() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
