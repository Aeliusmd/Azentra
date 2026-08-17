"use client";

import { useSyncExternalStore } from "react";

/**
 * Transient confirmations for the Accountant portal — "Payment recorded",
 * "Bills generated". Module-level so any view can raise one without threading
 * state through the shell.
 */

export type AccToast = {
  id: number;
  message: string;
};

/** How long a toast stays on screen. */
const LIFETIME = 2600;

let toasts: AccToast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissAccToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showAccToast(message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();

  setTimeout(() => dismissAccToast(id), LIFETIME);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

const EMPTY: AccToast[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useAccToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
