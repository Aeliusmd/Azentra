"use client";

import { useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { FS_BASE } from "@/lib/fs/nav";
import { updateFsProfile, useFsProfile } from "@/lib/fs/profile-store";
import { propertyName, useSelectedFsProperty } from "@/lib/fs/properties";
import { technicianInitials } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";

/**
 * The supervisor's own account. Name, email and phone are theirs to change;
 * employee ID, role and the properties they cover are set by the office, so
 * they are shown but not editable.
 */
export function FsProfileView() {
  const profile = useFsProfile();
  const propertyId = useSelectedFsProperty();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const ready = name.trim() !== "" && email.trim() !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    updateFsProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    showFsToast("Profile updated");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">Profile</h1>
        <p className="mt-1 text-[15px] text-muted">Manage your account details</p>
      </div>

      <Card className="max-w-[760px] p-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[19px] font-semibold text-gray-600"
          >
            {technicianInitials(profile.name)}
          </span>

          <div className="min-w-0">
            <p className="text-[19px] font-bold text-ink">{profile.name}</p>
            <p className="mt-0.5 text-[15px] text-muted">
              {profile.role} · {propertyName(propertyId)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="fp-name"
              label="Full Name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <InputField
              id="fp-email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <InputField
              id="fp-phone"
              label="Phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <InputField
              id="fp-employee"
              label="Employee ID"
              value={profile.employeeId}
              readOnly
            />
            <InputField
              id="fp-role"
              label="Role"
              value={profile.role}
              readOnly
            />
            <InputField
              id="fp-properties"
              label="Properties"
              value={profile.properties.join(", ")}
              readOnly
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-hairline pt-5">
            <Link
              href={`${FS_BASE}/settings`}
              className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Settings
            </Link>
            <button
              type="submit"
              disabled={!ready}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
