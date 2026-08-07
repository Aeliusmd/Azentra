"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, ShieldUser, Trash2 } from "lucide-react";

import { RoleDetailsModal } from "@/components/roles/role-details-modal";
import {
  RoleFormModal,
  type RoleFormValues,
} from "@/components/roles/role-form-modal";
import { AddButton } from "@/components/ui/add-button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { IconButton } from "@/components/ui/icon-button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { recordAudit } from "@/lib/audit-store";
import type { Role } from "@/lib/roles-data";

const HEADINGS = [
  "Role Name",
  "Description",
  "Users",
  "Permissions",
  "Created",
  "Actions",
];

function slugify(name: string, taken: Role[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "role";

  let id = base;
  let suffix = 2;
  while (taken.some((role) => role.id === id)) id = `${base}-${suffix++}`;
  return id;
}

type FormState = { mode: "create" } | { mode: "edit"; role: Role };

export function RolesView({ roles }: { roles: Role[] }) {
  const [list, setList] = useState(roles);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Role | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        role.description.toLowerCase().includes(term),
    );
  }, [list, query]);

  function handleSubmit(values: RoleFormValues) {
    const name = values.name.trim();

    recordAudit(
      form?.mode === "edit"
        ? {
            action: "Role Updated",
            module: "Roles",
            details: `${name} updated — now holds ${values.permissions.length} permissions`,
          }
        : {
            action: "Role Created",
            module: "Roles",
            details: `${name} created with ${values.permissions.length} permissions`,
          },
    );

    setList((current) => {
      if (form?.mode === "edit") {
        return current.map((role) =>
          role.id === form.role.id
            ? {
                ...role,
                name,
                description: values.description.trim(),
                permissions: values.permissions,
              }
            : role,
        );
      }

      const created: Role = {
        id: slugify(name, current),
        name,
        description: values.description.trim(),
        users: 0,
        permissions: values.permissions,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return [...current, created];
    });

    setForm(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    recordAudit({
      action: "Role Deleted",
      module: "Roles",
      details: `${pendingDelete.name} removed — was assigned to ${pendingDelete.users} user${pendingDelete.users === 1 ? "" : "s"}`,
    });
    setList((current) => current.filter((role) => role.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        subtitle="Create and manage user roles for the property"
        action={
          <AddButton
            label="Create Role"
            onClick={() => setForm({ mode: "create" })}
          />
        }
      />

      <SearchInput
        label="Search roles"
        placeholder="Search roles..."
        value={query}
        onChange={setQuery}
      />

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
              {visible.map((role) => (
                <tr
                  key={role.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className="px-6 py-4 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600"
                      >
                        <ShieldUser className="h-4 w-4" />
                      </span>
                      <span className="text-[13px] font-semibold text-ink">
                        {role.name}
                      </span>
                    </span>
                  </th>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">
                    {role.users}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">
                    {role.permissions.length}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-400">
                    {role.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Eye}
                        label={`View ${role.name}`}
                        onClick={() => setViewing(role)}
                      />
                      <IconButton
                        icon={Pencil}
                        label={`Edit ${role.name}`}
                        onClick={() => setForm({ mode: "edit", role })}
                      />
                      <IconButton
                        icon={Trash2}
                        tone="danger"
                        label={`Delete ${role.name}`}
                        onClick={() => setPendingDelete(role)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-10 text-center text-[13px] text-muted">
            No roles match “{query}”.
          </p>
        )}
      </Card>

      <RoleDetailsModal role={viewing} onClose={() => setViewing(null)} />

      {form && (
        <RoleFormModal
          key={form.mode === "edit" ? form.role.id : "new"}
          role={form.mode === "edit" ? form.role : null}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete Role"
        message={
          pendingDelete?.users
            ? `“${pendingDelete.name}” is assigned to ${pendingDelete.users} user${pendingDelete.users === 1 ? "" : "s"}. Delete it anyway? This cannot be undone.`
            : `Delete “${pendingDelete?.name}”? This cannot be undone.`
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
