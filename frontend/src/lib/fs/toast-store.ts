"use client";

import { useSyncExternalStore } from "react";

/**
 * Transient confirmations for the supervisor portal — "Technician assigned",
 * "Job rescheduled". Module-level so any view can raise one without threading
 * state through the shell.
 */

export type FsToast = {
  id: number;
  message: string;
};

/** How long a toast stays on screen. */
const LIFETIME = 2600;

let toasts: FsToast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissFsToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showFsToast(message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();

  setTimeout(() => dismissFsToast(id), LIFETIME);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

const EMPTY: FsToast[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useFsToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
