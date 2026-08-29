"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { showResToast } from "@/lib/res/toast-store";

/** Shortest password the portal will take. */
const MIN_LENGTH = 8;

/**
 * Changing the account password.
 *
 * Frontend only — nothing is checked against a real credential and no password
 * is stored. What it does do is catch the two mistakes a resident actually
 * makes: a new password too short to be worth having, and a confirmation that
 * does not match.
 */
export function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const tooShort = next !== "" && next.length < MIN_LENGTH;
  const mismatch = confirm !== "" && confirm !== next;
  const problem = tooShort
    ? `Use at least ${MIN_LENGTH} characters.`
    : mismatch
      ? "The two new passwords do not match."
      : "";

  const ready =
    current !== "" && next.length >= MIN_LENGTH && confirm === next;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    setCurrent("");
    setNext("");
    setConfirm("");
    showResToast("Password updated");
  }

  return (
    <Card>
      <div className="border-b border-hairline px-4 py-4 sm:px-5">
        <h2 className="text-[15px] font-bold text-ink">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        <div className="space-y-5">
          <div>
            <FieldLabel htmlFor="pw-current" required>
              Current Password
            </FieldLabel>
            <input
              id="pw-current"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              placeholder="Enter current password"
              className={`${controlClasses()} px-3.5 py-3`}
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
              required
              value={next}
              onChange={(event) => setNext(event.target.value)}
              placeholder="Enter new password"
              className={`${controlClasses()} px-3.5 py-3`}
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
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Confirm new password"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          {problem && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700"
            >
              {problem}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="mt-5 rounded-lg bg-[#111827] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1f2937] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Update Password
        </button>
      </form>
    </Card>
  );
}
