"use client";

import { useMemo, useState } from "react";
import { Ban, Check, Eye, Lock, Pencil, UserRoundPlus } from "lucide-react";

import { ResetPasswordModal } from "@/components/users/reset-password-modal";
import {
  UserFormModal,
  type UserFormValues,
} from "@/components/users/user-form-modal";
import {
  STATUS_PILL,
  UserProfileModal,
} from "@/components/users/user-profile-modal";
import { AddButton } from "@/components/ui/add-button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import {
  USER_ROLES,
  USER_STATUSES,
  initialOf,
  type User,
} from "@/lib/users-data";

const HEADINGS = [
  "Name",
  "Email",
  "Role",
  "Unit",
  "Tower",
  "Status",
  "Last Login",
  "Actions",
];

function slugify(name: string, taken: User[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "user";

  let id = base;
  let suffix = 2;
  while (taken.some((user) => user.id === id)) id = `${base}-${suffix++}`;
  return id;
}

function RowAction({
  icon: Icon,
  label,
  onClick,
  dimmed,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
        dimmed ? "text-gray-300" : "text-gray-400"
      }`}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

type FormState = { mode: "add" } | { mode: "edit"; user: User };

export function UsersView({ users }: { users: User[] }) {
  const [list, setList] = useState(users);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [viewing, setViewing] = useState<User | null>(null);
  const [resetting, setResetting] = useState<User | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return list.filter((user) => {
      if (role && user.role !== role) return false;
      if (status && user.status !== status) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.unit.toLowerCase().includes(term) ||
        user.tower.toLowerCase().includes(term)
      );
    });
  }, [list, query, role, status]);

  function handleSubmit(values: UserFormValues) {
    const name = values.name.trim();

    setList((current) => {
      if (form?.mode === "edit") {
        return current.map((user) =>
          user.id === form.user.id
            ? {
                ...user,
                name,
                email: values.email.trim(),
                phone: values.phone.trim(),
                role: values.role,
                unit: values.unit,
                tower: values.tower,
              }
            : user,
        );
      }

      const created: User = {
        id: slugify(name, current),
        name,
        email: values.email.trim(),
        phone: values.phone.trim(),
        role: values.role,
        unit: values.unit,
        tower: values.tower,
        status: "active",
        lastLogin: "—",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return [...current, created];
    });

    setForm(null);
  }

  function toggleDisabled(target: User) {
    setList((current) =>
      current.map((user) =>
        user.id === target.id
          ? { ...user, status: user.status === "disabled" ? "active" : "disabled" }
          : user,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage residents, tenants, and staff"
        action={
          <AddButton
            label="Add User"
            icon={UserRoundPlus}
            onClick={() => setForm({ mode: "add" })}
          />
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          label="Search users"
          placeholder="Search users..."
          value={query}
          onChange={setQuery}
        />
        <SelectFilter
          label="Filter by role"
          allLabel="All Roles"
          options={[...USER_ROLES]}
          value={role}
          onChange={setRole}
        />
        <SelectFilter
          label="Filter by status"
          allLabel="All Status"
          options={[...USER_STATUSES]}
          value={status}
          onChange={setStatus}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
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
              {visible.map((user) => {
                const off = user.status === "disabled";
                // Disabled accounts fade back, matching the design.
                const cell = `px-6 py-4 text-[13px] ${off ? "text-gray-400" : "text-gray-600"}`;

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    <th scope="row" className="px-6 py-4 text-left font-normal">
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8edf3] text-[13px] font-semibold ${
                            off ? "text-gray-400" : "text-[#1b3a5c]"
                          }`}
                        >
                          {initialOf(user.name)}
                        </span>
                        <span
                          className={`text-[13px] font-semibold ${off ? "text-gray-500" : "text-ink"}`}
                        >
                          {user.name}
                        </span>
                      </span>
                    </th>
                    <td className={cell}>{user.email}</td>
                    <td className={cell}>{user.role}</td>
                    <td className={cell}>{user.unit || "-"}</td>
                    <td className={cell}>{user.tower}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_PILL[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className={cell}>{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <RowAction
                          icon={Eye}
                          label={`View profile of ${user.name}`}
                          dimmed={off}
                          onClick={() => setViewing(user)}
                        />
                        <RowAction
                          icon={Pencil}
                          label={`Edit ${user.name}`}
                          dimmed={off}
                          onClick={() => setForm({ mode: "edit", user })}
                        />
                        <RowAction
                          icon={Lock}
                          label={`Reset password for ${user.name}`}
                          dimmed={off}
                          onClick={() => setResetting(user)}
                        />
                        <RowAction
                          icon={off ? Check : Ban}
                          label={`${off ? "Enable" : "Disable"} ${user.name}`}
                          dimmed={off}
                          onClick={() => toggleDisabled(user)}
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
            No users match your filters.
          </p>
        )}
      </Card>

      <UserProfileModal user={viewing} onClose={() => setViewing(null)} />
      <ResetPasswordModal user={resetting} onClose={() => setResetting(null)} />

      {form && (
        <UserFormModal
          key={form.mode === "edit" ? form.user.id : "new"}
          user={form.mode === "edit" ? form.user : null}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
