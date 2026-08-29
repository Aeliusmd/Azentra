"use client";

import { useSyncExternalStore } from "react";

/**
 * The tenant's own contact details.
 *
 * Only the fields a tenant may actually change live here — phone, avatar and
 * the emergency contact. Their unit, building and lease are the property's
 * records and sit in `tenant.ts`, read-only, so there is no path through this
 * store to editing them.
 */

export type TenantProfile = {
  firstName: string;
  lastName: string;
  /** Set by the property when the lease was signed; not editable here. */
  email: string;
  phone: string;
  /** Object URL of a picked image, or null for the initials avatar. */
  avatar: string | null;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
};

const INITIAL: TenantProfile = {
  firstName: "David",
  lastName: "Kim",
  email: "david.kim@email.com",
  phone: "+94 77 555 0388",
  avatar: null,
  emergencyName: "Grace Kim",
  emergencyRelation: "Spouse",
  emergencyPhone: "+94 77 555 0412",
};

let profile: TenantProfile = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Fields the tenant is allowed to change from the Profile screen. */
export type EditableProfile = Pick<
  TenantProfile,
  "phone" | "avatar" | "emergencyName" | "emergencyRelation" | "emergencyPhone"
>;

export function updateTenProfile(patch: Partial<EditableProfile>) {
  profile = { ...profile, ...patch };
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
