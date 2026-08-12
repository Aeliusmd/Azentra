"use client";

import { useSyncExternalStore } from "react";

/**
 * The technician's own app preferences. Module-level so the page and any future
 * consumer agree; resets on reload like the other mock stores.
 */

export type TechSettings = {
  pushNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  soundAlerts: boolean;
  autoStartJob: boolean;
  darkMode: boolean;
};

export type SettingKey = keyof TechSettings;

const initial: TechSettings = {
  pushNotifications: true,
  emailAlerts: true,
  smsAlerts: false,
  soundAlerts: true,
  autoStartJob: false,
  darkMode: false,
};

let settings = initial;
const listeners = new Set<() => void>();

export function setSetting(key: SettingKey, value: boolean) {
  settings = { ...settings, [key]: value };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return settings;
}

function getServerSnapshot() {
  return initial;
}

export function useTechSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
