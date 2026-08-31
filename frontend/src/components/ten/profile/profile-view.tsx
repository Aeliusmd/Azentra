"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

import { PasswordCard } from "@/components/ten/profile/password-card";
import { TenStatusPill } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { showTenToast } from "@/components/ten/ui/toaster";
import {
  NOTIFICATION_PREFS,
  setTenNotificationPref,
  tenFullName,
  tenInitials,
  updateTenProfile,
  useTenProfile,
  type TenantProfile,
} from "@/lib/ten/profile-store";
import { tenantUnit } from "@/lib/ten/tenant";

type Tab = "Personal Info" | "Contact" | "Emergency" | "Notifications";

const TABS: Tab[] = ["Personal Info", "Contact", "Emergency", "Notifications"];

const CONTROL = `${controlClasses()} px-3.5 py-3`;
/** Read-only fields look like fields, but plainly cannot be typed into. */
const READONLY = `${CONTROL} cursor-not-allowed bg-gray-50 text-muted`;

function SaveButton({ children = "Save Changes" }: { children?: string }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

/* -------------------------------- Identity -------------------------------- */

function IdentityCard({ profile }: { profile: TenantProfile }) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URLs are a handle on memory; release the one this card created.
  const held = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (held.current) URL.revokeObjectURL(held.current);
    };
  }, []);

  function pick(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (held.current) URL.revokeObjectURL(held.current);
    const url = URL.createObjectURL(file);
    held.current = url;

    updateTenProfile({ avatar: url });
    showTenToast("Profile photo updated");
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative shrink-0">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt=""
              width={72}
              height={72}
              unoptimized
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand/15 text-[22px] font-bold text-brand-dark"
            >
              {tenInitials(profile)}
            </span>
          )}

          <input
            ref={inputRef}
            id="profile-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              pick(event.target.files);
              // Lets the same file be picked again after a change.
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Change profile photo"
            className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow ring-1 ring-hairline transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            <Camera aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0">
          <h2 className="text-[20px] leading-tight font-bold text-ink">
            {tenFullName(profile)}
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Tenant · Unit {tenantUnit.number} · {tenantUnit.property}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------ Personal Info ----------------------------- */

function PersonalTab({ profile }: { profile: TenantProfile }) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
  const [nationalId, setNationalId] = useState(profile.nationalId);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateTenProfile({ firstName, lastName, dateOfBirth, nationalId });
    showTenToast("Personal details saved");
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pf-first" required>
                First Name
              </FieldLabel>
              <input
                id="pf-first"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={CONTROL}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pf-last" required>
                Last Name
              </FieldLabel>
              <input
                id="pf-last"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={CONTROL}
              />
            </div>
          </div>

          <div className="mt-5 max-w-[420px]">
            <FieldLabel htmlFor="pf-dob">Date of Birth</FieldLabel>
            <input
              id="pf-dob"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className={CONTROL}
            />
          </div>

          <div className="mt-5 max-w-[420px]">
            <FieldLabel htmlFor="pf-nic">National ID / Passport</FieldLabel>
            <input
              id="pf-nic"
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              className={CONTROL}
            />
          </div>

          <div className="mt-6 border-t border-hairline pt-5">
            <SaveButton />
          </div>
        </form>
      </Card>

      <PasswordCard />
    </div>
  );
}

/* --------------------------------- Contact -------------------------------- */

function ContactTab({ profile }: { profile: TenantProfile }) {
  const [phone, setPhone] = useState(profile.phone);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateTenProfile({ phone });
    showTenToast("Contact details saved");
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pf-phone" required>
                Phone
              </FieldLabel>
              <input
                id="pf-phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={CONTROL}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pf-email">Email</FieldLabel>
              <input
                id="pf-email"
                readOnly
                value={profile.email}
                aria-describedby="pf-email-note"
                className={READONLY}
              />
              {/* The address the lease was signed against, so not ours to change. */}
              <p id="pf-email-note" className="mt-1.5 text-[13px] text-muted">
                Contact your property manager to change this.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-hairline pt-5">
            <SaveButton />
          </div>
        </form>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-[15px] font-bold text-ink">Residence</h2>
        <p className="mt-1 text-[13px] text-muted">
          Held by the property. These cannot be changed here.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="pf-property">Property</FieldLabel>
            <input
              id="pf-property"
              readOnly
              value={tenantUnit.property}
              className={READONLY}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pf-building">Building</FieldLabel>
            <input
              id="pf-building"
              readOnly
              value={tenantUnit.building}
              className={READONLY}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pf-unit">Unit</FieldLabel>
            <input
              id="pf-unit"
              readOnly
              value={tenantUnit.number}
              className={READONLY}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pf-status">Tenant Status</FieldLabel>
            <div id="pf-status" className="pt-2.5">
              <TenStatusPill tone="green">Active</TenStatusPill>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------- Emergency ------------------------------- */

function EmergencyTab({ profile }: { profile: TenantProfile }) {
  const [name, setName] = useState(profile.emergencyName);
  const [relation, setRelation] = useState(profile.emergencyRelation);
  const [phone, setPhone] = useState(profile.emergencyPhone);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateTenProfile({
      emergencyName: name,
      emergencyRelation: relation,
      emergencyPhone: phone,
    });
    showTenToast("Emergency contact saved");
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">Emergency Contact</h2>
      <p className="mt-1 text-[13px] text-muted">
        Who the property should call if they cannot reach you.
      </p>

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="pf-em-name" required>
              Full Name
            </FieldLabel>
            <input
              id="pf-em-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={CONTROL}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pf-em-rel" required>
              Relationship
            </FieldLabel>
            <input
              id="pf-em-rel"
              required
              value={relation}
              onChange={(event) => setRelation(event.target.value)}
              placeholder="e.g. Spouse"
              className={CONTROL}
            />
          </div>
        </div>

        <div className="mt-5 max-w-[420px]">
          <FieldLabel htmlFor="pf-em-phone" required>
            Phone
          </FieldLabel>
          <input
            id="pf-em-phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={CONTROL}
          />
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <SaveButton />
        </div>
      </form>
    </Card>
  );
}

/* ------------------------------ Notifications ----------------------------- */

function NotificationsTab({ profile }: { profile: TenantProfile }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">
        Notification Preferences
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        Choose what reaches you. Changes save as you make them.
      </p>

      <ul className="mt-5 divide-y divide-hairline">
        {NOTIFICATION_PREFS.map((pref) => (
          <li
            key={pref.key}
            className="flex items-start justify-between gap-4 py-4"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink">{pref.label}</p>
              <p className="mt-0.5 text-[13px] text-muted">{pref.detail}</p>
            </div>
            <Toggle
              label={pref.label}
              checked={profile.prefs[pref.key]}
              onChange={(value) => setTenNotificationPref(pref.key, value)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------------------------------- View ---------------------------------- */

/**
 * The tenant's own account.
 *
 * Personal details, how to reach them, who to call, and which notices they
 * want — all theirs to change. The unit, building and property are the
 * property's records: they appear here so the tenant can read them, in controls
 * that are visibly not editable, and no writer in this portal touches them.
 */
export function TenProfileView() {
  const profile = useTenProfile();
  const [tab, setTab] = useState<Tab>("Personal Info");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Profile
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage your personal information and preferences
        </p>
      </div>

      <IdentityCard profile={profile} />

      <TenTabBar
        label="Profile sections"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {/* Keyed so switching tabs re-seeds each form from the saved profile. */}
      {tab === "Personal Info" && <PersonalTab profile={profile} />}
      {tab === "Contact" && <ContactTab profile={profile} />}
      {tab === "Emergency" && <EmergencyTab profile={profile} />}
      {tab === "Notifications" && <NotificationsTab profile={profile} />}
    </div>
  );
}
