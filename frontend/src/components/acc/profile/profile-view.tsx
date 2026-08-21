"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import {
  accInitial,
  updateAccProfile,
  useAccProfile,
} from "@/lib/acc/profile-store";
import {
  accPropertyName,
  useSelectedAccProperty,
} from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";

/**
 * The accountant's own account.
 *
 * Name, email and phone are theirs to change; the role and the employee number
 * are the office's to set, so they are shown for reference and locked. Nothing
 * here touches the books — this is the person, not their permissions.
 */
export function AccProfileView() {
  const profile = useAccProfile();
  const propertyId = useSelectedAccProperty();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const ready = name.trim() !== "" && email.trim() !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    updateAccProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    showAccToast("Profile updated");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">Profile</h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage your personal information
        </p>
      </div>

      <Card className="max-w-[900px] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8eef4] text-[22px] font-bold text-[#1b3a5c]"
          >
            {accInitial(profile.name)}
          </span>

          <div className="min-w-0">
            <p className="text-[19px] font-bold text-ink">{profile.name}</p>
            {/* The property is whichever books are open, not a fixed posting. */}
            <p className="mt-0.5 text-[15px] text-muted">
              {profile.role} · {accPropertyName(propertyId)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <InputField
            id="acc-profile-name"
            label="Full Name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <InputField
            id="acc-profile-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputField
            id="acc-profile-phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="acc-profile-role"
              label="Role"
              value={profile.role}
              readOnly
            />
            <InputField
              id="acc-profile-employee"
              label="Employee ID"
              value={profile.employeeId}
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={!ready}
            className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Save Changes
          </button>
        </form>
      </Card>
    </div>
  );
}
