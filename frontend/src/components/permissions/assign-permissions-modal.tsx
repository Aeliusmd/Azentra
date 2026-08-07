"use client";

import { useEffect, useRef, useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  ASSIGNABLE_ROLES,
  PERMISSION_MODULES,
} from "@/lib/permissions-data";

/** Checkbox that also renders the mixed state, which HTML can't express. */
function TriStateCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="h-3.5 w-3.5 accent-brand"
    />
  );
}

export function AssignPermissionsModal({
  open,
  assignments,
  initialRole,
  onClose,
  onSave,
}: {
  open: boolean;
  assignments: Record<string, string[]>;
  initialRole?: string;
  onClose: () => void;
  onSave: (role: string, permissionIds: string[]) => void;
}) {
  const [role, setRole] = useState(initialRole ?? ASSIGNABLE_ROLES[0]);
  const [selected, setSelected] = useState<string[]>(
    () => assignments[initialRole ?? ASSIGNABLE_ROLES[0]] ?? [],
  );

  function switchRole(nextRole: string) {
    setRole(nextRole);
    // Unsaved edits belong to the previous role, so start from what's stored.
    setSelected(assignments[nextRole] ?? []);
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleModule(ids: string[], allChecked: boolean) {
    setSelected((current) =>
      allChecked
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])],
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign Permissions">
      <div className="px-8 py-6">
        <label
          htmlFor="assign-role"
          className="mb-1.5 block text-[13px] text-ink"
        >
          Select Role
        </label>
        <select
          id="assign-role"
          value={role}
          onChange={(event) => switchRole(event.target.value)}
          className="w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {ASSIGNABLE_ROLES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <p className="mt-5 mb-2 text-[13px] text-ink">Permissions</p>
        <div className="divide-y divide-hairline rounded-lg border border-hairline">
          {PERMISSION_MODULES.map((module) => {
            const ids = module.actions.map(
              ({ action }) => `${module.key}:${action}`,
            );
            const checkedCount = ids.filter((id) =>
              selected.includes(id),
            ).length;
            const allChecked = checkedCount === ids.length;

            return (
              <div key={module.key} className="px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <TriStateCheckbox
                    checked={allChecked}
                    indeterminate={checkedCount > 0 && !allChecked}
                    onChange={() => toggleModule(ids, allChecked)}
                    label={`Select all ${module.label} permissions`}
                  />
                  <span className="text-[13px] font-semibold text-ink">
                    {module.label}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  {module.actions.map(({ action }) => {
                    const id = `${module.key}:${action}`;
                    return (
                      <label
                        key={id}
                        className="flex cursor-pointer items-center gap-2 text-[13px] text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(id)}
                          onChange={() => toggle(id)}
                          className="h-3.5 w-3.5 accent-brand"
                        />
                        {action}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
          type="button"
          onClick={() => onSave(role, selected)}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Save Permissions
        </button>
      </div>
    </Modal>
  );
}
