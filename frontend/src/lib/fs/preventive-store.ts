"use client";

import { useSyncExternalStore } from "react";

import { TODAY } from "@/lib/fs/dashboard-data";
import {
  nextServiceDate,
  preventiveTasks as seed,
  type PreventiveTask,
} from "@/lib/fs/preventive-data";

/**
 * The servicing rounds the supervisor verifies. Module-level so a checklist
 * ticked on the card is the same round the calendar reads; resets on reload
 * like the other mock stores.
 */

let tasks: PreventiveTask[] = seed;
const listeners = new Set<() => void>();

function update(id: string, patch: Partial<PreventiveTask>) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...patch } : task));
  listeners.forEach((listener) => listener());
}

export function togglePmChecklistItem(id: string, itemId: string) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  update(id, {
    checklist: task.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    ),
  });
}

/**
 * Signs the round off and books the next one a cycle ahead. The ticks stay put
 * — they are the record of what was verified this time round.
 */
export function completePmRound(id: string) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  update(id, {
    lastDone: TODAY,
    nextDate: nextServiceDate(TODAY, task.frequency),
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return tasks;
}

function getServerSnapshot() {
  return seed;
}

export function useFsPreventiveTasks() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
