"use client";

import { useSyncExternalStore } from "react";

/**
 * The tenant's own personal details.
 *
 * Everything here belongs to the *person*: their name, how to reach them, who
 * to call in an emergency, and which notices they want. Their unit, building
 * and lease are the property's records and sit in `tenant.ts`, read-only —
 * there is no path through this store to editing any of them.
 */

/** Which notices the tenant wants, and how they want them. */
export const NOTIFICATION_PREFS = [
  {
    key: "email",
    label: "Email notifications",
    detail: "Send a copy of every notice to your email address.",
  },
  {
    key: "sms",
    label: "SMS alerts",
    detail: "Text the urgent ones — emergencies and technician arrivals.",
  },
  {
    key: "maintenance",
    label: "Maintenance updates",
    detail: "Status changes and visits on your requests.",
  },
  {
    key: "bills",
    label: "Bill reminders",
    detail: "New bills, and a nudge before a due date.",
  },
  {
    key: "facilities",
    label: "Facility bookings",
    detail: "Confirmations and changes to your reservations.",
  },
  {
    key: "visitors",
    label: "Visitor activity",
    detail: "When a pass you raised is used at the gate.",
  },
  {
    key: "announcements",
    label: "Property announcements",
    detail: "Notices from the property. Emergencies always come through.",
  },
] as const;

export type NotificationPrefKey = (typeof NOTIFICATION_PREFS)[number]["key"];

export type TenantProfile = {
  firstName: string;
  lastName: string;
  /** ISO day. */
  dateOfBirth: string;
  nationalId: string;
  /** Set by the property when the lease was signed; not editable here. */
  email: string;
  phone: string;
  /** Object URL of a picked image, or null for the initials avatar. */
  avatar: string | null;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  prefs: Record<NotificationPrefKey, boolean>;
};

const INITIAL: TenantProfile = {
  firstName: "David",
  lastName: "Kim",
  dateOfBirth: "1990-05-14",
  nationalId: "NIC-987654321",
  email: "david.kim@email.com",
  phone: "+94 77 555 0388",
  avatar: null,
  emergencyName: "Grace Kim",
  emergencyRelation: "Spouse",
  emergencyPhone: "+94 77 555 0412",
  prefs: {
    email: true,
    sms: true,
    maintenance: true,
    bills: true,
    facilities: true,
    visitors: false,
    announcements: true,
  },
};

let profile: TenantProfile = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Fields the tenant may change from the Profile screen.
 *
 * `email` is absent on purpose: it is the address the lease was signed against
 * and the one every notice is sent to, so changing it is the property's to do.
 * Nothing about the unit appears here at all.
 */
export type EditableProfile = Pick<
  TenantProfile,
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "nationalId"
  | "phone"
  | "avatar"
  | "emergencyName"
  | "emergencyRelation"
  | "emergencyPhone"
>;

export function updateTenProfile(patch: Partial<EditableProfile>) {
  profile = { ...profile, ...patch };
  emit();
}

export function setTenNotificationPref(
  key: NotificationPrefKey,
  value: boolean,
) {
  profile = { ...profile, prefs: { ...profile.prefs, [key]: value } };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return profile;
}

export function useTenProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => INITIAL);
}

export function tenFullName(person: TenantProfile) {
  return `${person.firstName} ${person.lastName}`;
}

export function tenInitials(person: TenantProfile) {
  return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
}
