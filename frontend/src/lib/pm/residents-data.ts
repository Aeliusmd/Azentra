import type { PillTone } from "@/components/pm/ui/pill";
import { maintenanceRequests } from "@/lib/pm/maintenance-data";
import { users, type User, type UserStatus } from "@/lib/users-data";

/**
 * Residents of the assigned property.
 *
 * Reuses the Admin user list rather than duplicating it — a Property Manager
 * only sees the residents and tenants, never staff accounts.
 */

export const RESIDENT_ROLES = ["Resident", "Tenant"] as const;
export type ResidentRole = (typeof RESIDENT_ROLES)[number];

export type Resident = User;

export const residents: Resident[] = users.filter(
  (user): user is Resident =>
    user.role === "Resident" || user.role === "Tenant",
);

export const RESIDENT_STATUS_TONE: Record<UserStatus, PillTone> = {
  active: "green",
  inactive: "amber",
  disabled: "red",
};

/** Maintenance requests this resident has raised — used on the profile card. */
export function requestsFor(name: string) {
  return maintenanceRequests.filter((request) => request.resident === name);
}
