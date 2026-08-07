/**
 * Mock data for Permission Management.
 *
 * NOTE — this catalog does not match the one in `roles-data.ts`. The Role
 * Management design showed 26 permissions across 7 modules (including Units,
 * Users→View and Roles→View); this page's design shows 20 across 6, and its
 * role chips imply different per-role totals for every role. Both are modelled
 * as designed, kept separate on purpose, and should be reconciled into one
 * catalog once the backend defines which is authoritative.
 */

export type PermissionAction = {
  action: string;
  description: string;
};

export type PermissionModule = {
  key: string;
  label: string;
  actions: PermissionAction[];
};

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    key: "facilities",
    label: "Common Facilities",
    actions: [
      { action: "Create", description: "Create common area facilities" },
      { action: "Edit", description: "Edit facility details" },
      { action: "Delete", description: "Delete facilities" },
      { action: "View", description: "View facilities" },
    ],
  },
  {
    key: "users",
    label: "Users",
    actions: [
      { action: "Create", description: "Create user accounts" },
      { action: "Edit", description: "Edit user profiles" },
      { action: "Disable", description: "Disable user accounts" },
      { action: "Reset Password", description: "Reset user passwords" },
      { action: "Assign Roles", description: "Assign roles to users" },
    ],
  },
  {
    key: "roles",
    label: "Roles",
    actions: [
      { action: "Create", description: "Create custom roles" },
      { action: "Edit", description: "Edit role details" },
      { action: "Delete", description: "Delete roles" },
      { action: "Assign Permissions", description: "Assign permissions to roles" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    actions: [
      { action: "View", description: "View reports" },
      { action: "Export PDF", description: "Export reports as PDF" },
      { action: "Export Excel", description: "Export reports as Excel" },
    ],
  },
  {
    key: "audit",
    label: "Audit Logs",
    actions: [{ action: "View", description: "View audit logs" }],
  },
  {
    key: "settings",
    label: "Settings",
    actions: [
      { action: "Property Settings", description: "Configure property settings" },
      { action: "Notification Settings", description: "Configure notifications" },
      { action: "Branding", description: "Configure branding" },
    ],
  },
];

export type Permission = {
  id: string;
  moduleKey: string;
  module: string;
  action: string;
  description: string;
};

/** Flattened catalog — one row per permission, in design order. */
export const permissions: Permission[] = PERMISSION_MODULES.flatMap((module) =>
  module.actions.map(({ action, description }) => ({
    id: `${module.key}:${action}`,
    moduleKey: module.key,
    module: module.label,
    action,
    description,
  })),
);

export const MODULE_LABELS = PERMISSION_MODULES.map((module) => module.label);

/** Roles that can be assigned permissions, in the order chips should render. */
export const ASSIGNABLE_ROLES = [
  "Property Manager",
  "Field Supervisor",
  "Technician",
  "Accountant",
  "Security Officer",
  "Resident",
  "Tenant",
];

const ALL_IDS = permissions.map((permission) => permission.id);

/** Which permissions each role holds, taken from the design's role chips. */
export const rolePermissions: Record<string, string[]> = {
  "Property Manager": ALL_IDS,
  "Field Supervisor": [
    "facilities:Edit",
    "facilities:View",
    "users:Edit",
    "users:Reset Password",
    "settings:Notification Settings",
  ],
  Technician: ["facilities:View"],
  Accountant: ["reports:View", "reports:Export PDF", "reports:Export Excel"],
  "Security Officer": [],
  Resident: ["facilities:View"],
  Tenant: ["facilities:View"],
};

/** Roles holding a given permission, in `ASSIGNABLE_ROLES` order. */
export function rolesWithPermission(
  assignments: Record<string, string[]>,
  permissionId: string,
) {
  return ASSIGNABLE_ROLES.filter((role) =>
    assignments[role]?.includes(permissionId),
  );
}
