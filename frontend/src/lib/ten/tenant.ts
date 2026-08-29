import { daysBetween } from "@/lib/res/format";

/**
 * The signed-in tenant, the unit they rent, and the lease that says so.
 *
 * One tenant, one unit — so there is no property selector anywhere in this
 * portal. Every screen is scoped to this record by construction rather than by
 * a filter someone could get wrong.
 *
 * A-304 is the same flat the Resident and Accountant portals describe, and this
 * is the same lease the owner sees on their side: David Kim, June 2026 through
 * May 2027 at LKR 85,000. Two portals, one tenancy.
 */

export type Occupancy = "Rented";

export type TenantUnit = {
  /** `A-304` — how the unit is named on every document. */
  number: string;
  building: string;
  floor: number;
  property: string;
  bedrooms: number;
  bathrooms: number;
  /** Internal floor area in square feet. */
  area: number;
  occupancy: Occupancy;
  /** The owner's name, shown so the tenant knows whose flat this is. */
  owner: string;
  /** How to reach the owner about the lease itself. */
  ownerPhone: string;
};

/**
 * Property-controlled. Everything here is set by the property and the lease;
 * none of it is the tenant's to change, which is why no screen in this portal
 * offers an edit for any of these fields.
 */
export const tenantUnit: TenantUnit = {
  number: "A-304",
  building: "Tower A",
  floor: 3,
  property: "Sunrise Residence",
  bedrooms: 2,
  bathrooms: 2,
  area: 1_250,
  occupancy: "Rented",
  owner: "Emily Rodriguez",
  ownerPhone: "+1 555 0505",
};

export type LeaseStatus = "Active" | "Expiring Soon" | "Ended";

export type Lease = {
  /** ISO days bounding the tenancy. */
  start: string;
  end: string;
  /** Monthly rent in LKR. */
  monthlyRent: number;
  /** Refundable security deposit held by the property. */
  deposit: number;
  status: LeaseStatus;
};

export const lease: Lease = {
  start: "2026-06-01",
  end: "2027-05-31",
  monthlyRent: 85_000,
  deposit: 255_000,
  status: "Active",
};

/** Who the tenant calls when something is not theirs to fix. */
export const propertyManager = {
  name: "Sarah Chen",
  role: "Property Manager",
  phone: "+94 11 234 5678",
  email: "sarah.chen@sunriseresidence.lk",
  office: "Ground Floor, Tower A",
  hours: "Mon - Fri, 9:00 AM - 5:00 PM",
};

/**
 * How far through the tenancy today falls, 0-100.
 *
 * Clamped at both ends on purpose: a lease that has not started cannot be
 * negatively complete, and one that has run out cannot be more than finished.
 */
export function leaseProgress(today: string, term: Lease = lease) {
  const total = daysBetween(term.start, term.end);
  if (total <= 0) return 100;

  const elapsed = daysBetween(term.start, today);
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

/** Whole days left on the lease; negative once it has run out. */
export function daysLeftOnLease(today: string, term: Lease = lease) {
  return daysBetween(today, term.end);
}

/** `A-304 · Tower A · Sunrise Residence` — the line under the welcome. */
export function unitLine(unit: TenantUnit = tenantUnit) {
  return `Unit ${unit.number} · ${unit.property}`;
}
