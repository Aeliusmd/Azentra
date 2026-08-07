"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { towerNames, units } from "@/lib/buildings-data";
import {
  DEFAULT_INITIAL_PASSWORD,
  USER_ROLES,
  type User,
  type UserRole,
} from "@/lib/users-data";

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  unit: string;
  tower: string;
  password: string;
};

type Errors = Partial<Record<"name" | "email" | "password", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CONTROL =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink " +
  "placeholder:text-gray-400 outline-none transition-colors focus:ring-2";
const IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

function control(hasError?: boolean) {
  return `${CONTROL} ${hasError ? INVALID : IDLE}`;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] text-ink">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

export function UserFormModal({
  user,
  onClose,
  onSubmit,
}: {
  user: User | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}) {
  const editing = user !== null;

  const [values, setValues] = useState<UserFormValues>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "Resident",
    unit: user?.unit ?? "",
    tower: user?.tower ?? towerNames[0],
    // Only new users get an initial password.
    password: user ? "" : DEFAULT_INITIAL_PASSWORD,
  });
  const [errors, setErrors] = useState<Errors>({});

  function update<K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Full name is required.";

    if (!values.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "Enter a valid email address.";

    if (!editing && values.password.trim().length < 8)
      next.password = "Initial password must be at least 8 characters.";

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(values);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? "Edit User" : "Add New User"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5 px-8 py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="user-name">Full Name</Label>
              <input
                id="user-name"
                placeholder="e.g. John Smith"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                className={control(!!errors.name)}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="user-email">Email</Label>
              <input
                id="user-email"
                type="email"
                placeholder="john@email.com"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className={control(!!errors.email)}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="user-phone">Phone</Label>
              <input
                id="user-phone"
                type="tel"
                placeholder="+1 555 0000"
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={control()}
              />
            </div>

            <div>
              <Label htmlFor="user-role">Role</Label>
              <select
                id="user-role"
                value={values.role}
                onChange={(event) =>
                  update("role", event.target.value as UserRole)
                }
                className={control()}
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="user-unit">Unit</Label>
              <select
                id="user-unit"
                value={values.unit}
                onChange={(event) => update("unit", event.target.value)}
                className={control()}
              >
                <option value="">— No Unit —</option>
                {units.map((unit) => (
                  <option key={unit.code} value={unit.code}>
                    {unit.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="user-tower">Tower</Label>
              <select
                id="user-tower"
                value={values.tower}
                onChange={(event) => update("tower", event.target.value)}
                className={control()}
              >
                {towerNames.map((tower) => (
                  <option key={tower} value={tower}>
                    {tower}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!editing && (
            <div>
              <Label htmlFor="user-password">Initial Password</Label>
              <input
                id="user-password"
                value={values.password}
                onChange={(event) => update("password", event.target.value)}
                className={control(!!errors.password)}
              />
              <FieldError message={errors.password} />
            </div>
          )}
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
            {editing ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
