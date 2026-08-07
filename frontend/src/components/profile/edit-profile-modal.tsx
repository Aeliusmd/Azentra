"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import type { Profile } from "@/lib/profile-store";

const CONTROL =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink " +
  "outline-none transition-colors focus:ring-2";
const IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ProfileFormValues = Pick<Profile, "name" | "email" | "phone">;

export function EditProfileModal({
  profile,
  onClose,
  onSave,
}: {
  profile: Profile;
  onClose: () => void;
  onSave: (values: ProfileFormValues) => void;
}) {
  const [values, setValues] = useState<ProfileFormValues>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  const [errors, setErrors] = useState<Partial<ProfileFormValues>>({});

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Partial<ProfileFormValues> = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "Enter a valid email address.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(values);
  }

  return (
    <Modal open onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5 px-8 py-6">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1.5 block text-[13px] text-ink"
            >
              Full Name
            </label>
            <input
              id="profile-name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              className={`${CONTROL} ${errors.name ? INVALID : IDLE}`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-[13px] text-ink"
            >
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              className={`${CONTROL} ${errors.email ? INVALID : IDLE}`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="mb-1.5 block text-[13px] text-ink"
            >
              Phone Number
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={`${CONTROL} ${IDLE}`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
