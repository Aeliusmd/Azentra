"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in admin's own account.
 *
 * Module-level so an edit on the profile page is reflected by the topbar
 * immediately. Resets on a full reload like the other mock stores; swap for a
 * session/API call when the backend lands.
 */

export type Profile = {
  accountId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  property: string;
};

const initial: Profile = {
  accountId: "2",
  name: "Sarah Chen",
  email: "admin@azentra.com",
  phone: "+1 555 0102",
  role: "Admin",
  status: "active",
  property: "Sunrise Residence",
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateProfile(patch: Partial<Profile>) {
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

export function useProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** First letter of the name, for the avatar circle. */
export function profileInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}
