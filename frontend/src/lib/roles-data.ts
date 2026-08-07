/**
 * Mock data for Role Management.
 *
 * Each role stores its actual permission ids so the edit form can pre-fill and
 * the table's Permissions column stays derived rather than hardcoded. The
 * design only gave counts, so which specific permissions each role holds is a
 * plausible guess — the totals match the design exactly.
 *
 * Replace with `src/lib/api.ts` calls when the backend lands.
 */

export type PermissionGroup = {
  key: string;
  label: string;
  actions: string[];
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  { key: "units", label: "Units", actions: ["View", "Create", "Edit", "Delete"] },
  {
    key: "facilities",
    label: "Common Facilities",
    actions: ["View", "Create", "Edit", "Delete"],
  },
  {
    key: "users",
    label: "Users",
    actions: [
      "View",
      "Create",
      "Edit",
      "Disable",
      "Reset Password",
      "Assign Roles",
    ],
  },
  {
    key: "roles",
    label: "Roles",
    actions: ["View", "Create", "Edit", "Delete", "Assign Permissions"],
  },
  {
    key: "reports",
    label: "Reports",
    actions: ["View", "Export PDF", "Export Excel"],
  },
  { key: "audit", label: "Audit Logs", actions: ["View"] },
  {
    key: "settings",
    label: "Settings",
    actions: ["Property Settings", "Notification Settings", "Branding"],
  },
];

/** Stable id for a single permission, e.g. `units:View`. */
export function permissionId(groupKey: string, action: string) {
  return `${groupKey}:${action}`;
}

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) =>
  group.actions.map((action) => permissionId(group.key, action)),
);

/** Every permission except the ones listed — keeps the seeds readable. */
function allExcept(...excluded: string[]) {
  return ALL_PERMISSIONS.filter((id) => !excluded.includes(id));
}

export type Role = {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  createdAt: string;
};

export const roles: Role[] = [
  {
    id: "property-manager",
    name: "Property Manager",
    description: "Full property management access",
    users: 2,
    permissions: allExcept("roles:Delete", "settings:Branding"), // 24
    createdAt: "2023-01-01",
  },
  {
    id: "field-supervisor",
    name: "Field Supervisor",
    description: "Oversees field operations and maintenance",
    users: 3,
    permissions: [
      "units:View",
      "units:Edit",
      "facilities:View",
      "facilities:Create",
      "facilities:Edit",
      "facilities:Delete",
      "users:View",
      "users:Edit",
      "reports:View",
      "reports:Export PDF",
      "audit:View",
      "settings:Notification Settings",
    ], // 12
    createdAt: "2023-01-01",
  },
  {
    id: "technician",
    name: "Technician",
    description: "Handles maintenance and repair work",
    users: 5,
    permissions: [
      "units:View",
      "facilities:View",
      "facilities:Edit",
      "users:View",
      "reports:View",
      "audit:View",
    ], // 6
    createdAt: "2023-01-01",
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Manages financial and billing operations",
    users: 1,
    permissions: [
      "units:View",
      "users:View",
      "reports:View",
      "reports:Export PDF",
      "reports:Export Excel",
      "audit:View",
      "settings:Property Settings",
      "settings:Notification Settings",
    ], // 8
    createdAt: "2023-02-15",
  },
  {
    id: "security-officer",
    name: "Security Officer",
    description: "Manages gate entry and security operations",
    users: 4,
    permissions: ["units:View", "users:View", "reports:View", "audit:View"], // 4
    createdAt: "2023-01-01",
  },
  {
    id: "resident",
    name: "Resident",
    description: "Apartment owner with limited portal access",
    users: 28,
    permissions: [
      "units:View",
      "facilities:View",
      "facilities:Create",
      "reports:View",
    ], // 4
    createdAt: "2023-01-01",
  },
  {
    id: "tenant",
    name: "Tenant",
    description: "Renter with basic portal access",
    users: 15,
    permissions: ["units:View", "facilities:View", "reports:View"], // 3
    createdAt: "2023-01-01",
  },
];
