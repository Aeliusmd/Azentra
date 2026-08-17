"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in Accountant's own account.
 *
 * Separate from the Admin, Property Manager, Technician and Field Supervisor
 * profile stores so the portals never show each other's identity. Module-level
 * so an edit reaches the topbar immediately; resets on reload.
 */

export type AccProfile = {
  name: string;
  role: string;
  employeeId: string;
  email: string;
  phone: string;
  /** The properties this accountant keeps the books for, set by the office. */
  properties: string[];
  status: string;
};

const initial: AccProfile = {
  name: "Priya Sharma",
  role: "Accountant",
  employeeId: "EMP-ACC-001",
  email: "accounts@azentra.com",
  phone: "+94 77 402 1188",
  properties: [
    "Sunrise Residence",
    "Ocean View Towers",
    "Garden Heights",
  ],
  status: "Active",
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateAccProfile(patch: Partial<AccProfile>) {
  profile = { ...profile, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return profile;
}

function getServerSnapshot() {
  return initial;
}

export function useAccProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Avatar letter for the topbar. */
export function accInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "A";
}

/** "Priya" out of "Priya Sharma". */
export function accFirstName(name: string) {
  return name.trim().split(" ")[0];
}
