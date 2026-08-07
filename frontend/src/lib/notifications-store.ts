"use client";

import { useSyncExternalStore } from "react";

import {
  notifications as seed,
  type Notification,
} from "@/lib/notifications-data";

/**
 * Shared notification state.
 *
 * Module-level so the topbar bell and the full notifications page always agree
 * — marking everything read in the dropdown is still read after navigating.
 * Resets on a full reload like the other mock stores.
 */
let items: Notification[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function markAllRead() {
  if (items.every((item) => item.read)) return;
  items = items.map((item) => ({ ...item, read: true }));
  emit();
}

export function markRead(id: string) {
  const target = items.find((item) => item.id === id);
  if (!target || target.read) return;
  items = items.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  emit();
}

export function markUnread(id: string) {
  const target = items.find((item) => item.id === id);
  if (!target || !target.read) return;
  items = items.map((item) =>
    item.id === id ? { ...item, read: false } : item,
  );
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return seed;
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function unreadCount(list: Notification[]) {
  return list.filter((item) => !item.read).length;
}
