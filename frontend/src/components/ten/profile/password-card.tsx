"use client";

import { useState } from "react";

import { showTenToast } from "@/components/ten/ui/toaster";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Card } from "@/components/ui/card";

const CONTROL = `${controlClasses()} px-3.5 py-3`;

/** Long enough to be worth setting, short enough not to be a lecture. */
const MIN_LENGTH = 8;

/**
 * Changing the account password.
 *
 * A demonstration: nothing is sent anywhere and no password is stored. The
 * checks are still real, because a form that accepts a mismatched confirmation
 * teaches the wrong thing about the form.
 */
export function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (next.length < MIN_LENGTH) {
      setError(`Your new password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (next !== confirm) {
      setError("The two new passwords do not match.");
      return;
    }
    if (next === current) {
      setError("Your new password must differ from the current one.");
      return;
    }

    setError("");
    setCurrent("");
    setNext("");
    setConfirm("");
    showTenToast("Password updated");
  }

  const ready = current !== "" && next !== "" && confirm !== "";

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">Change Password</h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <FieldLabel htmlFor="pw-current" required>
            Current Password
          </FieldLabel>
          <input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className={CONTROL}
          />
        </div>

        <div>
          <FieldLabel htmlFor="pw-new" required>
            New Password
          </FieldLabel>
          <input
            id="pw-new"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            className={CONTROL}
          />
        </div>

        <div>
          <FieldLabel htmlFor="pw-confirm" required>
            Confirm New Password
          </FieldLabel>
          <input
            id="pw-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className={CONTROL}
          />
        </div>

        {error && (
          <p role="alert" className="text-[13px] text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!ready}
          className="rounded-lg bg-[#4a6f9c] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#3d5d85] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Update Password
        </button>
      </form>
    </Card>
  );
}
