"use client";

import { Modal } from "@/components/ui/modal";
import { initialOf, type User, type UserStatus } from "@/lib/users-data";

export const STATUS_PILL: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  disabled: "bg-rose-100 text-rose-700",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-gray-500">{label}</dt>
      <dd className="mt-1 text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export function UserProfileModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  return (
    <Modal open={user !== null} onClose={onClose} title="User Profile">
      {user && (
        <div className="px-8 py-7">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8edf3] text-2xl font-semibold text-[#1b3a5c]"
            >
              {initialOf(user.name)}
            </span>
            <div>
              <h3 className="text-xl font-bold text-ink">{user.name}</h3>
              <span
                className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[13px] font-medium ${STATUS_PILL[user.status]}`}
              >
                {user.status}
              </span>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Detail label="Email" value={user.email} />
            <Detail label="Phone" value={user.phone || "—"} />
            <Detail label="Role" value={user.role} />
            <Detail label="Unit" value={user.unit || "—"} />
            <Detail label="Tower" value={user.tower} />
            <Detail label="Last Login" value={user.lastLogin} />
            <Detail label="Created" value={user.createdAt} />
          </dl>
        </div>
      )}
    </Modal>
  );
}
