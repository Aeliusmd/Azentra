"use client";

import { useSyncExternalStore } from "react";

import type { CalendarTask } from "@/lib/tech/calendar-data";

/**
 * Tasks the technician adds to their own calendar. Jobs and preventive visits
 * come from their own stores — only personal entries live here.
 */

let tasks: CalendarTask[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

export function addCalendarTask(task: Omit<CalendarTask, "id">) {
  tasks = [...tasks, { ...task, id: `CT-${nextId++}` }];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return tasks;
}

const EMPTY: CalendarTask[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useCalendarTasks() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
