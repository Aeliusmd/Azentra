"use client";

import { useSyncExternalStore } from "react";

/**
 * Transient confirmations for the technician portal — "Job accepted", "Progress
 * updated". Module-level so any view can raise one without threading state
 * through the shell.
 */

export type Toast = {
  id: number;
  message: string;
};

/** How long a toast stays on screen. */
const LIFETIME = 2600;

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showToast(message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();

  setTimeout(() => dismissToast(id), LIFETIME);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

const EMPTY: Toast[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
