"use client";

import { useSyncExternalStore } from "react";

/**
 * Transient confirmations for the Resident portal — "Request submitted",
 * "Visitor pass created". Module-level so any view can raise one without
 * threading state through the shell.
 */

export type ResToast = {
  id: number;
  message: string;
};

/** How long a toast stays on screen. */
const LIFETIME = 2600;

let toasts: ResToast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissResToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showResToast(message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();

  setTimeout(() => dismissResToast(id), LIFETIME);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

const EMPTY: ResToast[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useResToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
