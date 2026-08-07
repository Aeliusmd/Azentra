"use client";

import { useMemo, useState } from "react";
import { Eye, Lock, Pencil } from "lucide-react";

import { AssignPermissionsModal } from "@/components/permissions/assign-permissions-modal";
import { PermissionDetailsModal } from "@/components/permissions/permission-details-modal";
import { AddButton } from "@/components/ui/add-button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import {
  MODULE_LABELS,
  rolesWithPermission,
  type Permission,
} from "@/lib/permissions-data";

const HEADINGS = ["Module", "Action", "Description", "Roles", "Actions"];

export function PermissionsView({
  permissions,
  initialAssignments,
}: {
  permissions: Permission[];
  initialAssignments: Record<string, string[]>;
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [query, setQuery] = useState("");
  const [module, setModule] = useState("");
  const [viewing, setViewing] = useState<Permission | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return permissions.filter((permission) => {
      if (module && permission.module !== module) return false;
      if (!term) return true;
      return (
        permission.module.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        permission.description.toLowerCase().includes(term)
      );
    });
  }, [module, permissions, query]);

  function handleSave(role: string, permissionIds: string[]) {
    setAssignments((current) => ({ ...current, [role]: permissionIds }));
    setAssignOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Management"
        subtitle="Configure access permissions across all modules"
        action={
          <AddButton
            label="Assign Permissions"
            icon={Lock}
            onClick={() => setAssignOpen(true)}
          />
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          label="Search permissions"
          placeholder="Search permissions..."
          value={query}
          onChange={setQuery}
        />
        <SelectFilter
          label="Filter by module"
          allLabel="All Modules"
          options={MODULE_LABELS}
          value={module}
          onChange={setModule}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((permission) => {
                const roles = rolesWithPermission(assignments, permission.id);
                return (
                  <tr
                    key={permission.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-left text-[13px] font-semibold text-ink"
                    >
                      {permission.module}
                    </th>
                    <td className="px-6 py-4 text-[13px] font-semibold text-brand-dark">
                      {permission.action}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-600">
                      {permission.description}
                    </td>
                    <td className="px-6 py-4">
                      {roles.length === 0 ? (
                        <span className="text-[13px] text-gray-400">—</span>
                      ) : (
                        <ul className="flex flex-wrap gap-1.5">
                          {roles.map((role) => (
                            <li
                              key={role}
                              className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600"
                            >
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          label={`View ${permission.module} ${permission.action}`}
                          onClick={() => setViewing(permission)}
                        />
                        <IconButton
                          icon={Pencil}
                          label={`Edit role assignments for ${permission.module} ${permission.action}`}
                          onClick={() => setAssignOpen(true)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-10 text-center text-[13px] text-muted">
            No permissions match your filters.
          </p>
        )}
      </Card>

      <PermissionDetailsModal
        permission={viewing}
        roles={viewing ? rolesWithPermission(assignments, viewing.id) : []}
        onClose={() => setViewing(null)}
      />

      {assignOpen && (
        <AssignPermissionsModal
          open
          assignments={assignments}
          onClose={() => setAssignOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
