"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in Property Manager's own account.
 *
 * Separate from the Admin `profile-store` so the two dashboards never show each
 * other's identity. Module-level so an edit on the profile page reaches the
 * topbar immediately; resets on reload like the other mock stores.
 */

export type PmProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
  property: string;
  joined: string;
};

const initial: PmProfile = {
  name: "James Wilson",
  email: "manager@azentra.com",
  phone: "+1 555 0103",
  role: "Property Manager",
  property: "Sunrise Residence",
  joined: "2023-03-15",
};

let profile = initial;
const listeners = new Set<() => void>();

export function updatePmProfile(patch: Partial<PmProfile>) {
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

export function usePmProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** First letter of the name, for the avatar circle. */
export function pmInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}
