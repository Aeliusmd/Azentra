"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import {
  pmInitial,
  updatePmProfile,
  usePmProfile,
} from "@/lib/pm/profile-store";

const NOTIFICATION_PREFS = [
  { id: "maintenance", label: "New Maintenance Requests", on: true },
  { id: "technician", label: "Technician Updates", on: true },
  { id: "booking", label: "Facility Booking Requests", on: true },
  { id: "complaints", label: "Resident Complaints", on: true },
  { id: "inspection", label: "Inspection Reminders", on: true },
  { id: "asset", label: "Asset Service Alerts", on: true },
  { id: "vendor", label: "Vendor Appointments", on: false },
  { id: "system", label: "System Notifications", on: true },
];

const PASSWORD_FIELDS = [
  {
    id: "current-password",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    id: "new-password",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    id: "confirm-password",
    label: "Confirm New Password",
    placeholder: "Confirm new password",
  },
];

const CONTROL =
  "w-full rounded-lg border border-hairline bg-white px-4 py-3 text-[17px] text-ink placeholder:text-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-semibold tracking-wide text-gray-400 uppercase">
      {children}
    </span>
  );
}

/** Read-only detail — role, property, and joined date are not self-editable. */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mt-1.5 text-[17px] text-ink">{value}</p>
    </div>
  );
}

function EditableField({
  id,
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  if (!editing) return <ReadOnlyField label={label} value={value} />;

  return (
    <div>
      <label htmlFor={id}>
        <FieldLabel>{label}</FieldLabel>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} mt-1.5`}
      />
    </div>
  );
}

export function PmProfileView() {
  const profile = usePmProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(NOTIFICATION_PREFS.map((item) => [item.id, item.on])),
  );

  function startEditing() {
    setDraft({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
    setEditing(true);
  }

  function save() {
    updatePmProfile({
      name: draft.name.trim() || profile.name,
      email: draft.email.trim() || profile.email,
      phone: draft.phone.trim(),
    });
    setEditing(false);
  }

  return (
    <div className="max-w-[940px] space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">Profile</h1>
        <p className="mt-1 text-[15px] text-muted">
          Manage your account details
        </p>
      </div>

      <section className="rounded-xl border border-hairline bg-white px-8 py-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-green-100 text-[30px] font-bold text-green-800"
            >
              {pmInitial(profile.name)}
            </span>
            <div>
              <h2 className="text-[24px] leading-tight font-bold text-ink">
                {profile.name}
              </h2>
              <p className="mt-1 text-[17px] text-muted">
                {profile.role} at {profile.property}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => (editing ? setEditing(false) : startEditing())}
            className="flex items-center gap-2 rounded-lg border border-hairline px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            {editing ? (
              <X aria-hidden="true" className="h-[18px] w-[18px]" />
            ) : (
              <Pencil aria-hidden="true" className="h-[18px] w-[18px]" />
            )}
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          <EditableField
            id="profile-name"
            label="Full Name"
            value={editing ? draft.name : profile.name}
            editing={editing}
            onChange={(value) =>
              setDraft((current) => ({ ...current, name: value }))
            }
          />
          <EditableField
            id="profile-email"
            label="Email"
            type="email"
            value={editing ? draft.email : profile.email}
            editing={editing}
            onChange={(value) =>
              setDraft((current) => ({ ...current, email: value }))
            }
          />
          <EditableField
            id="profile-phone"
            label="Phone"
            type="tel"
            value={editing ? draft.phone : profile.phone}
            editing={editing}
            onChange={(value) =>
              setDraft((current) => ({ ...current, phone: value }))
            }
          />
          <ReadOnlyField label="Role" value={profile.role} />
          <ReadOnlyField label="Assigned Property" value={profile.property} />
          <ReadOnlyField label="Joined" value={profile.joined} />
        </div>

        {editing && (
          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-hairline pt-6">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-hairline px-6 py-3 text-[17px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-brand px-6 py-3 text-[17px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Save Changes
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-hairline bg-white px-8 py-7">
        <h2 className="text-[19px] font-bold text-ink">Change Password</h2>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-5 max-w-[535px] space-y-5"
        >
          {PASSWORD_FIELDS.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-2 block text-[15px] font-medium text-ink"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type="password"
                placeholder={field.placeholder}
                className={`${CONTROL} text-[15px]`}
              />
            </div>
          ))}

          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Update Password
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-hairline bg-white px-8 py-7">
        <h2 className="text-[19px] font-bold text-ink">
          Notification Preferences
        </h2>

        <ul className="mt-5 space-y-4">
          {NOTIFICATION_PREFS.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <input
                id={`pref-${item.id}`}
                type="checkbox"
                checked={prefs[item.id]}
                onChange={(event) =>
                  setPrefs((current) => ({
                    ...current,
                    [item.id]: event.target.checked,
                  }))
                }
                className="h-[18px] w-[18px] rounded border-gray-300"
              />
              <label
                htmlFor={`pref-${item.id}`}
                className="text-[17px] text-ink select-none"
              >
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
