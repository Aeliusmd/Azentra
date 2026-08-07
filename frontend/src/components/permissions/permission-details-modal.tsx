"use client";

import { Modal } from "@/components/ui/modal";
import type { Permission } from "@/lib/permissions-data";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] text-gray-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function PermissionDetailsModal({
  permission,
  roles,
  onClose,
}: {
  permission: Permission | null;
  roles: string[];
  onClose: () => void;
}) {
  return (
    <Modal
      open={permission !== null}
      onClose={onClose}
      title="Permission Details"
    >
      {permission && (
        <div className="space-y-5 px-8 py-7">
          <Field label="Module">
            <p className="text-[15px] font-semibold text-ink">
              {permission.module}
            </p>
          </Field>

          <Field label="Action">
            <p className="text-[15px] font-semibold text-brand-dark">
              {permission.action}
            </p>
          </Field>

          <Field label="Description">
            <p className="text-[15px] text-ink">{permission.description}</p>
          </Field>

          <Field label="Assigned Roles">
            {roles.length === 0 ? (
              <p className="text-[13px] text-muted">No roles assigned.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <li
                    key={role}
                    className="rounded bg-green-50 px-2.5 py-1 text-[13px] text-green-700"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            )}
          </Field>
        </div>
      )}
    </Modal>
  );
}
