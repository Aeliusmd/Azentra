"use client";

import { ShieldUser } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import type { Role } from "@/lib/roles-data";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-[13px] text-muted">{label}</p>
    </div>
  );
}

export function RoleDetailsModal({
  role,
  onClose,
}: {
  role: Role | null;
  onClose: () => void;
}) {
  return (
    <Modal open={role !== null} onClose={onClose} title="Role Details">
      {role && (
        <div className="px-8 py-7">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600"
            >
              <ShieldUser className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-ink">{role.name}</h3>
              <p className="mt-0.5 text-[13px] text-muted">
                {role.description}
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4">
            <Stat value={role.users} label="Users" />
            <Stat value={role.permissions.length} label="Permissions" />
            <Stat value={role.createdAt.slice(0, 4)} label="Created" />
          </div>
        </div>
      )}
    </Modal>
  );
}
