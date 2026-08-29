"use client";

import { useState } from "react";
import { Bell, Phone, Siren, UserRound } from "lucide-react";

import { PasswordCard } from "@/components/res/profile/password-card";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { monthAndYear } from "@/lib/res/format";
import {
  ALERT_BLURB,
  ALERT_TOPICS,
  resFullName,
  resInitials,
  setResAlert,
  updateResProfile,
  useResProfile,
  type AlertTopic,
} from "@/lib/res/profile-store";
import { residentUnit, unitLine } from "@/lib/res/resident";
import { showResToast } from "@/lib/res/toast-store";

type Tab = "Personal Info" | "Contact" | "Emergency" | "Notifications";

const FIELD = `${controlClasses()} px-3.5 py-3`;

/** Save row shared by the three editable tabs. */
function SaveRow({ disabled }: { disabled?: boolean }) {
  return (
    <div className="border-t border-hairline px-4 py-4 sm:px-5">
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Save Changes
      </button>
    </div>
  );
}

/**
 * The resident's own account.
 *
 * Their name, their contacts and what they want to be told about are theirs to
 * change. Everything the property decides — the unit, the tower, when their
 * tenure began — is stated in the header and cannot be edited here.
 */
export function ResProfileView() {
  const profile = useResProfile();
  const [tab, setTab] = useState<Tab>("Personal Info");

  /* Each tab keeps its own draft so switching away does not half-save. */
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
  const [nationalId, setNationalId] = useState(profile.nationalId);

  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [altPhone, setAltPhone] = useState(profile.altPhone);

  const [contactName, setContactName] = useState(profile.emergency.name);
  const [relationship, setRelationship] = useState(
    profile.emergency.relationship,
  );
  const [contactPhone, setContactPhone] = useState(profile.emergency.phone);

  function savePersonal(event: React.FormEvent) {
    event.preventDefault();
    updateResProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      nationalId: nationalId.trim(),
    });
    showResToast("Profile updated");
  }

  function saveContact(event: React.FormEvent) {
    event.preventDefault();
    updateResProfile({
      email: email.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim(),
    });
    showResToast("Contact details updated");
  }

  function saveEmergency(event: React.FormEvent) {
    event.preventDefault();
    updateResProfile({
      emergency: {
        name: contactName.trim(),
        relationship: relationship.trim(),
        phone: contactPhone.trim(),
      },
    });
    showResToast("Emergency contact updated");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Profile
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage your personal information and settings
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[20px] font-bold text-[#1b3a5c] sm:h-20 sm:w-20 sm:text-[24px]"
          >
            {resInitials(profile)}
          </span>

          <div className="min-w-0">
            <p className="text-[19px] font-bold text-ink sm:text-[20px]">
              {resFullName(profile)}
            </p>
            <p className="mt-0.5 text-[15px] text-muted">
              Unit {unitLine()}
            </p>
            {/* Set by the property, so it is stated rather than offered. */}
            <p className="mt-0.5 text-[14px] text-gray-400">
              {profile.role} since {monthAndYear(residentUnit.since)}
            </p>
          </div>
        </div>
      </Card>

      <ResTabBar
        label="Profile sections"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Personal Info", label: "Personal Info", icon: UserRound },
          { id: "Contact", label: "Contact", icon: Phone },
          { id: "Emergency", label: "Emergency", icon: Siren },
          { id: "Notifications", label: "Notifications", icon: Bell },
        ]}
      />

      {tab === "Personal Info" && (
        <>
          <Card>
            <form onSubmit={savePersonal}>
              <div className="space-y-5 p-4 sm:p-5">
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
                      className={FIELD}
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
                      className={FIELD}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="pf-dob">Date of Birth</FieldLabel>
                  <input
                    id="pf-dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    className={FIELD}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="pf-nic">
                    National ID / Passport
                  </FieldLabel>
                  <input
                    id="pf-nic"
                    value={nationalId}
                    onChange={(event) => setNationalId(event.target.value)}
                    className={FIELD}
                  />
                </div>
              </div>

              <SaveRow
                disabled={firstName.trim() === "" || lastName.trim() === ""}
              />
            </form>
          </Card>

          <PasswordCard />
        </>
      )}

      {tab === "Contact" && (
        <Card>
          <form onSubmit={saveContact}>
            <div className="space-y-5 p-4 sm:p-5">
              <div>
                <FieldLabel htmlFor="pf-email" required>
                  Email
                </FieldLabel>
                <input
                  id="pf-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={FIELD}
                />
              </div>

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
                    className={FIELD}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pf-alt">Alternate Phone</FieldLabel>
                  <input
                    id="pf-alt"
                    type="tel"
                    value={altPhone}
                    onChange={(event) => setAltPhone(event.target.value)}
                    placeholder="Optional"
                    className={FIELD}
                  />
                </div>
              </div>
            </div>

            <SaveRow
              disabled={email.trim() === "" || phone.trim() === ""}
            />
          </form>
        </Card>
      )}

      {tab === "Emergency" && (
        <Card>
          <form onSubmit={saveEmergency}>
            <div className="space-y-5 p-4 sm:p-5">
              <p className="text-[14px] text-muted">
                Who the property should call if something happens at your unit
                and you cannot be reached.
              </p>

              <div>
                <FieldLabel htmlFor="pf-ec-name" required>
                  Contact Name
                </FieldLabel>
                <input
                  id="pf-ec-name"
                  required
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className={FIELD}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="pf-ec-rel">Relationship</FieldLabel>
                  <input
                    id="pf-ec-rel"
                    value={relationship}
                    onChange={(event) => setRelationship(event.target.value)}
                    placeholder="e.g. Spouse"
                    className={FIELD}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pf-ec-phone" required>
                    Phone
                  </FieldLabel>
                  <input
                    id="pf-ec-phone"
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    className={FIELD}
                  />
                </div>
              </div>
            </div>

            <SaveRow
              disabled={
                contactName.trim() === "" || contactPhone.trim() === ""
              }
            />
          </form>
        </Card>
      )}

      {tab === "Notifications" && (
        <Card>
          <div className="border-b border-hairline px-4 py-4 sm:px-5">
            <h2 className="text-[15px] font-bold text-ink">
              What we tell you about
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Switches take effect straight away.
            </p>
          </div>

          <ul className="divide-y divide-hairline">
            {ALERT_TOPICS.map((topic: AlertTopic) => (
              <li
                key={topic}
                className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-ink">{topic}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {ALERT_BLURB[topic]}
                  </p>
                </div>
                <Toggle
                  label={`${topic} notifications`}
                  checked={profile.alerts[topic]}
                  onChange={(on) => setResAlert(topic, on)}
                />
              </li>
            ))}

            {/* Deliberately not a choice — a fire drill is not opt-out. */}
            <li className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">
                  Emergency alerts
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  Fire, evacuation and safety notices
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[13px] font-medium text-gray-500">
                Always on
              </span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
