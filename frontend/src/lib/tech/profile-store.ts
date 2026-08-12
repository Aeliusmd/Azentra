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
  role: string;
  employeeId: string;
  email: string;
  phone: string;
  emergencyContact: string;
  /** Set by the office — the technician cannot reassign themselves. */
  property: string;
  status: string;
  specializations: string[];
  stats: {
    totalJobs: number;
    completed: number;
    emergencyJobs: number;
    preventiveJobs: number;
  };
};

const initial: TechProfile = {
  name: "John Martinez",
  role: "Technician",
  employeeId: "EMP-TECH-001",
  email: "tech@azentra.com",
  phone: "+1 555 0201",
  emergencyContact: "+1 555 0202",
  property: "Sunrise Residence",
  status: "Active",
  specializations: ["Plumbing", "Electrical", "HVAC"],
  stats: {
    totalJobs: 142,
    completed: 128,
    emergencyJobs: 12,
    preventiveJobs: 18,
  },
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
