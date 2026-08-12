"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { controlClasses } from "@/components/ui/field";
import {
  techInitial,
  updateTechProfile,
  useTechProfile,
} from "@/lib/tech/profile-store";
import { showToast } from "@/lib/tech/toast-store";

const RULE = "my-6 border-t border-hairline";

function Label({
  children,
  editing,
}: {
  children: React.ReactNode;
  editing: boolean;
}) {
  return (
    <p
      className={`text-[13px] text-muted ${editing ? "font-semibold tracking-wide uppercase" : ""}`}
    >
      {children}
    </p>
  );
}

/** A field the office owns — shown, never edited here. */
function ReadOnlyField({
  label,
  value,
  editing,
}: {
  label: string;
  value: string;
  editing: boolean;
}) {
  return (
    <div>
      <Label editing={editing}>{label}</Label>
      <p className="mt-1 text-[15px] text-ink">{value}</p>
    </div>
  );
}

const STAT_TONE = [
  "text-ink",
  "text-green-600",
  "text-orange-500",
  "text-[#2e6cad]",
];

export function TechProfileView() {
  const profile = useTechProfile();

  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [emergency, setEmergency] = useState(profile.emergencyContact);

  function startEditing() {
    setEmail(profile.email);
    setPhone(profile.phone);
    setEmergency(profile.emergencyContact);
    setEditing(true);
  }

  const stats = [
    { value: profile.stats.totalJobs, label: "Total Jobs" },
    { value: profile.stats.completed, label: "Completed" },
    { value: profile.stats.emergencyJobs, label: "Emergency Jobs" },
    { value: profile.stats.preventiveJobs, label: "Preventive Jobs" },
  ];

  return (
    <div className="max-w-[880px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Profile</h1>
          <p className="mt-1 text-[13px] text-muted">
            Your personal information and settings
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-md bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateTechProfile({
            email: email.trim(),
            phone: phone.trim(),
            emergencyContact: emergency.trim(),
          });
          showToast("Profile updated");
          setEditing(false);
        }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[30px] font-semibold text-[#1b3a5c]"
            >
              {techInitial(profile.name)}
            </span>
            <div className="min-w-0">
              <h2 className="text-[22px] font-bold text-ink">{profile.name}</h2>
              <p className="mt-0.5 text-[15px] text-muted">{profile.role}</p>
              <p className="mt-0.5 text-[13px] text-gray-400">
                {profile.employeeId}
              </p>
            </div>
          </div>

          <div className={RULE} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label editing={editing}>Email</Label>
              {editing ? (
                <input
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={`${controlClasses()} mt-1.5 px-3.5 py-2.5`}
                />
              ) : (
                <p className="mt-1 text-[15px] text-ink">{profile.email}</p>
              )}
            </div>

            <div>
              <Label editing={editing}>Phone</Label>
              {editing ? (
                <input
                  aria-label="Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={`${controlClasses()} mt-1.5 px-3.5 py-2.5`}
                />
              ) : (
                <p className="mt-1 text-[15px] text-ink">{profile.phone}</p>
              )}
            </div>

            <ReadOnlyField
              label="Employee ID"
              value={profile.employeeId}
              editing={editing}
            />
            <ReadOnlyField
              label="Assigned Property"
              value={profile.property}
              editing={editing}
            />

            <div>
              <Label editing={editing}>Emergency Contact</Label>
              {editing ? (
                <input
                  aria-label="Emergency contact"
                  value={emergency}
                  onChange={(event) => setEmergency(event.target.value)}
                  className={`${controlClasses()} mt-1.5 px-3.5 py-2.5`}
                />
              ) : (
                <p className="mt-1 text-[15px] text-ink">
                  {profile.emergencyContact}
                </p>
              )}
            </div>

            <div>
              <Label editing={editing}>Status</Label>
              {editing ? (
                <p className="mt-1.5 inline-flex rounded-full bg-green-50 px-3 py-1.5 text-[13px] font-semibold text-green-700">
                  {profile.status}
                </p>
              ) : (
                <p className="mt-1 text-[15px] font-medium text-green-600">
                  {profile.status}
                </p>
              )}
            </div>
          </div>

          <div className={RULE} />

          <div>
            <Label editing={editing}>Specializations</Label>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {profile.specializations.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-[#e8eef5] px-3.5 py-1.5 text-[13px] font-medium text-[#1b3a5c]"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className={RULE} />

          <div>
            <Label editing={editing}>Work Stats</Label>
            <dl className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <dd
                    className={`text-[26px] leading-none font-bold ${STAT_TONE[index]}`}
                  >
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-[13px] text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        {editing && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-hairline bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
