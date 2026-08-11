"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in Technician's own account.
 *
 * Separate from the Admin and Property Manager profile stores so the three
 * portals never show each other's identity. Module-level so an edit reaches the
 * topbar immediately; resets on reload like the other mock stores.
 */

export type TechProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
  /** Trade the technician is certified for. */
  specialty: string;
  employeeId: string;
  property: string;
  joined: string;
};

const initial: TechProfile = {
  name: "John Martinez",
  email: "john.martinez@azentra.com",
  phone: "+1 555 0142",
  role: "Technician",
  specialty: "Plumbing & HVAC",
  employeeId: "TECH-014",
  property: "Sunrise Residence",
  joined: "2024-02-05",
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateTechProfile(patch: Partial<TechProfile>) {
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

export function useTechProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Avatar letter for the topbar. */
export function techInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "T";
}

/** "John" out of "John Martinez" — the dashboard greets by first name. */
export function techFirstName(name: string) {
  return name.trim().split(" ")[0];
}
