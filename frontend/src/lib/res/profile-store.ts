"use client";

import { useSyncExternalStore } from "react";

import { initialsOf } from "@/lib/res/format";

/**
 * The signed-in resident's own account.
 *
 * Separate from the staff profile stores so the portals never show each other's
 * identity. Only what a resident may change lives here — the unit, the tower
 * and the resident type are the property's to set and are read from
 * `residentUnit` instead. Resets on reload like the other mock stores.
 */

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

/** Which updates the resident wants to hear about. */
export const ALERT_TOPICS = [
  "Maintenance",
  "Bills",
  "Visitors",
  "Facilities",
  "Complaints",
  "Announcements",
] as const;
export type AlertTopic = (typeof ALERT_TOPICS)[number];

/** What each switch is actually promising to tell them. */
export const ALERT_BLURB: Record<AlertTopic, string> = {
  Maintenance: "Technician assigned, visit scheduled, work completed",
  Bills: "New bills, due-date reminders and payment receipts",
  Visitors: "Passes approved, and when a visitor arrives",
  Facilities: "Booking confirmed, changed or declined",
  Complaints: "Progress on complaints you have raised",
  Announcements: "Notices from the property manager",
};

export type ResProfile = {
  firstName: string;
  lastName: string;
  role: string;
  /** ISO day. */
  dateOfBirth: string;
  nationalId: string;
  email: string;
  phone: string;
  altPhone: string;
  emergency: EmergencyContact;
  alerts: Record<AlertTopic, boolean>;
};

const initial: ResProfile = {
  firstName: "Emily",
  lastName: "Rodriguez",
  role: "Resident",
  dateOfBirth: "1990-05-15",
  nationalId: "NIC-902345678V",
  email: "resident@azentra.com",
  phone: "+1 555 0501",
  altPhone: "",
  emergency: {
    name: "Michael Rodriguez",
    relationship: "Spouse",
    phone: "+1 555 0733",
  },
  alerts: {
    Maintenance: true,
    Bills: true,
    Visitors: true,
    Facilities: true,
    Complaints: true,
    Announcements: false,
  },
};

let profile = initial;
const listeners = new Set<() => void>();

export function updateResProfile(patch: Partial<ResProfile>) {
  profile = { ...profile, ...patch };
  listeners.forEach((listener) => listener());
}

export function setResAlert(topic: AlertTopic, on: boolean) {
  profile = { ...profile, alerts: { ...profile.alerts, [topic]: on } };
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

/**
 * `Emily Rodriguez`.
 *
 * Composed from the two halves the form edits rather than stored alongside
 * them, so a corrected surname reaches the topbar without a second write.
 */
export function resFullName(person: Pick<ResProfile, "firstName" | "lastName">) {
  return `${person.firstName} ${person.lastName}`.trim();
}

/** `ER` — the avatar on the topbar and the profile header. */
export function resInitials(person: Pick<ResProfile, "firstName" | "lastName">) {
  return initialsOf(resFullName(person)) || "R";
}
