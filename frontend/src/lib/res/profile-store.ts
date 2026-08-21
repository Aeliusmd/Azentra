"use client";

import { useSyncExternalStore } from "react";

/**
 * The signed-in resident's own account.
 *
 * Separate from the staff profile stores so the portals never show each other's
 * identity. Only the fields a resident may change live here — the unit, the
 * building and the resident type are the property's to set and are read from
 * `residentUnit` instead. Resets on reload like the other mock stores.
 */

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type ResProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  emergency: EmergencyContact;
};

const initial: ResProfile = {
  name: "Emily Rodriguez",
  role: "Resident",
  email: "resident@azentra.com",
  phone: "+1 555 0501",
  emergency: {
    name: "Michael Rodriguez",
    relationship: "Spouse",
    phone: "+1 555 0733",
  },
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateResProfile(patch: Partial<ResProfile>) {
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

export function useResProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Avatar letter for the topbar. */
export function resInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "R";
}

/** `Emily Rodriguez` → `ER`, for the larger avatar on the dashboard. */
export function resInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "R";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

/** `Emily` out of `Emily Rodriguez` — the welcome line. */
export function resFirstName(name: string) {
  return name.trim().split(" ")[0];
}
