"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in Field Supervisor's own account.
 *
 * Separate from the Admin, Property Manager and Technician profile stores so the
 * portals never show each other's identity. Module-level so an edit reaches the
 * topbar immediately; resets on reload like the other mock stores.
 */

export type FsProfile = {
  name: string;
  role: string;
  employeeId: string;
  email: string;
  phone: string;
  /** The properties this supervisor covers, set by the office. */
  properties: string[];
  status: string;
  /** Trades the supervisor can sign off on. */
  specializations: string[];
};

const initial: FsProfile = {
  name: "Carlos Rivera",
  role: "Field Supervisor",
  employeeId: "EMP-FS-001",
  email: "supervisor@azentra.com",
  phone: "+1 555 0301",
  properties: ["Sunrise Residence", "Green Valley Towers"],
  status: "Active",
  specializations: ["Plumbing", "Electrical", "HVAC", "Safety"],
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateFsProfile(patch: Partial<FsProfile>) {
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

export function useFsProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Avatar letter for the topbar. */
export function fsInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "S";
}

/** "Carlos" out of "Carlos Rivera". */
export function fsFirstName(name: string) {
  return name.trim().split(" ")[0];
}
