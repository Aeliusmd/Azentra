"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Lock,
  RotateCcwClock,
  SquarePen,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { initialsOf } from "@/lib/audit-data";
import { recordAudit, useAuditLog } from "@/lib/audit-store";
import { profileInitial, updateProfile, useProfile } from "@/lib/profile-store";

const TABS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "security", label: "Security", icon: Lock },
  { key: "activity", label: "Activity", icon: RotateCcwClock },
];

const CONTROL =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink " +
  "outline-none transition-colors focus:ring-2";
const IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-gray-500">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function SecurityPanel({ onChanged }: { onChanged: () => void }) {
  const [values, setValues] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (!values.current) next.current = "Enter your current password.";
    if (values.next.length < 8)
      next.next = "New password must be at least 8 characters.";
    if (values.confirm !== values.next)
      next.confirm = "Passwords do not match.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setValues({ current: "", next: "", confirm: "" });
    onChanged();
  }

  const fields = [
    { key: "current" as const, label: "Current Password" },
    { key: "next" as const, label: "New Password" },
    { key: "confirm" as const, label: "Confirm New Password" },
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-6 py-6">
          <h2 className="text-[15px] font-semibold text-ink">Change Password</h2>
          <p className="mt-1 text-[13px] text-muted">
            Use at least 8 characters. You will stay signed in on this device.
          </p>

          <div className="mt-5 max-w-[420px] space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label
                  htmlFor={`pw-${key}`}
                  className="mb-1.5 block text-[13px] text-ink"
                >
                  {label}
                </label>
                <input
                  id={`pw-${key}`}
                  type="password"
                  autoComplete={
                    key === "current" ? "current-password" : "new-password"
                  }
                  value={values[key]}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }));
                    setErrors((current) => ({ ...current, [key]: "" }));
                  }}
                  className={`${CONTROL} ${errors[key] ? INVALID : IDLE}`}
                />
                {errors[key] && (
                  <p className="mt-1.5 text-xs text-red-600">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-hairline px-6 py-5">
          <button
            type="submit"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Update Password
          </button>
        </div>
      </form>
    </Card>
  );
}

export function ProfileView() {
  const profile = useProfile();
  const entries = useAuditLog();
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  // The signed-in admin's own trail, newest first.
  const myActivity = useMemo(
    () => entries.filter((entry) => entry.performedBy === profile.name),
    [entries, profile.name],
  );

  function notify(message: string) {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 2500);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account details and preferences"
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#e8edf3] text-3xl font-semibold text-[#1b3a5c]"
            >
              {profileInitial(profile.name)}
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink">{profile.name}</h2>
              <p className="mt-0.5 text-[13px] text-muted">{profile.email}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
                  {profile.role}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-green-600"
                  />
                  {profile.status}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
                  {profile.property}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-md bg-[#4a6f96] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d5c7d] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <SquarePen aria-hidden="true" className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </Card>

      <Card className="p-2">
        <div role="tablist" aria-label="Profile section" className="flex gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                tab === key
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {flash && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-[13px] text-green-800"
        >
          {flash}
        </p>
      )}

      {tab === "profile" && (
        <Card className="px-6 py-6">
          <h2 className="text-[15px] font-semibold text-ink">
            Personal Information
          </h2>

          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Detail label="Full Name" value={profile.name} />
            <Detail label="Email Address" value={profile.email} />
            <Detail label="Phone Number" value={profile.phone || "—"} />
            <Detail label="Role" value={profile.role} />
            <Detail label="Status" value={profile.status} />
            <Detail label="Property" value={profile.property} />
            <Detail label="Account ID" value={profile.accountId} />
          </dl>
        </Card>
      )}

      {tab === "security" && (
        <SecurityPanel
          onChanged={() => {
            recordAudit({
              action: "Password Changed",
              module: "Security",
              performedBy: profile.name,
              details: `${profile.name} (${profile.email}) changed their own password`,
            });
            notify("Password updated.");
          }}
        />
      )}

      {tab === "activity" && (
        <Card>
          <h2 className="border-b border-hairline px-6 py-5 text-[15px] font-semibold text-ink">
            Recent Activity
          </h2>

          {myActivity.length === 0 ? (
            <p className="px-6 py-10 text-center text-[13px] text-muted">
              No recorded activity for this account yet.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {myActivity.slice(0, 20).map((entry) => (
                <li key={entry.id} className="flex gap-4 px-6 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500"
                  >
                    {initialsOf(entry.performedBy)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">
                      {entry.action}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {entry.details}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs whitespace-nowrap text-gray-400">
                    {entry.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(values) => {
            updateProfile({
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
            });
            recordAudit({
              action: "Profile Updated",
              module: "Users",
              performedBy: values.name.trim(),
              details: `${values.name.trim()} updated their own account details`,
            });
            setEditing(false);
            notify("Profile updated.");
          }}
        />
      )}
    </div>
  );
}
