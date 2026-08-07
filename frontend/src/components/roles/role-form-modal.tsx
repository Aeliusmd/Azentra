"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  PERMISSION_GROUPS,
  permissionId,
  type Role,
} from "@/lib/roles-data";

export type RoleFormValues = {
  name: string;
  description: string;
  permissions: string[];
};

type Errors = Partial<Record<"name", string>>;

const CONTROL =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink " +
  "placeholder:text-gray-400 outline-none transition-colors focus:ring-2";
const IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

export function RoleFormModal({
  role,
  onClose,
  onSubmit,
}: {
  role: Role | null;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
}) {
  const editing = role !== null;

  const [values, setValues] = useState<RoleFormValues>({
    name: role?.name ?? "",
    description: role?.description ?? "",
    permissions: role?.permissions ?? [],
  });
  const [errors, setErrors] = useState<Errors>({});

  function togglePermission(id: string) {
    setValues((current) => ({
      ...current,
      permissions: current.permissions.includes(id)
        ? current.permissions.filter((item) => item !== id)
        : [...current.permissions, id],
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim()) {
      setErrors({ name: "Role name is required." });
      return;
    }
    onSubmit(values);
  }

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={editing ? "Edit Role" : "Create New Role"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5 px-8 py-6">
          <div>
            <label
              htmlFor="role-name"
              className="mb-1.5 block text-[13px] text-ink"
            >
              Role Name
            </label>
            <input
              id="role-name"
              placeholder="e.g. Concierge Manager"
              value={values.name}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  name: event.target.value,
                }));
                setErrors({});
              }}
              className={`${CONTROL} ${errors.name ? INVALID : IDLE}`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="role-description"
              className="mb-1.5 block text-[13px] text-ink"
            >
              Description
            </label>
            <textarea
              id="role-description"
              rows={2}
              placeholder="Brief description of this role..."
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={`${CONTROL} ${IDLE} resize-none`}
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-[13px] text-ink">Permissions</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PERMISSION_GROUPS.map((group) => (
                <div
                  key={group.key}
                  className="rounded-lg border border-hairline p-3.5"
                >
                  <p className="text-[13px] font-semibold text-ink">
                    {group.label}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    {group.actions.map((action) => {
                      const id = permissionId(group.key, action);
                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-center gap-1.5 text-[13px] text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={values.permissions.includes(id)}
                            onChange={() => togglePermission(id)}
                            className="h-3.5 w-3.5 accent-brand"
                          />
                          {action}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {editing ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
