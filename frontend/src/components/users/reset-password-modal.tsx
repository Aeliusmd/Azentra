"use client";

import { useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { recordAudit } from "@/lib/audit-store";
import type { User } from "@/lib/users-data";

const ALPHABET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 12-character temporary password from the browser's CSPRNG. */
function generatePassword() {
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function ResetPasswordModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleClose() {
    setGenerated(null);
    setCopied(false);
    onClose();
  }

  async function copyPassword() {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (permissions, insecure origin) — the value
      // stays selectable in the field either way.
    }
  }

  return (
    <Modal open={user !== null} onClose={handleClose} title="Reset Password">
      {user && generated === null && (
        <>
          <div className="px-8 py-7">
            <div className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600"
              >
                <TriangleAlert className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[15px] text-ink">
                  You are about to reset the password for
                </p>
                <p className="mt-0.5 text-[15px] font-semibold text-ink">
                  {user.name}
                </p>
                <p className="text-[13px] text-muted">{user.email}</p>
              </div>
            </div>

            <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
              This will invalidate their current password. A new temporary
              password will be generated immediately.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setGenerated(generatePassword());
                // The password itself is never logged.
                recordAudit({
                  action: "Password Reset",
                  module: "Security",
                  details: `Temporary password issued for ${user.name} (${user.email})`,
                });
              }}
              className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Reset Password
            </button>
          </div>
        </>
      )}

      {user && generated !== null && (
        <>
          <div className="px-8 py-7">
            <div className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                <Check className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">
                  Password Reset Successful
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  A new temporary password has been generated for
                </p>
                <p className="text-[13px] font-semibold text-ink">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-md bg-gray-50 px-4 py-4">
              <label
                htmlFor="temp-password"
                className="block text-[13px] text-gray-500"
              >
                New Temporary Password
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="temp-password"
                  readOnly
                  value={generated}
                  onFocus={(event) => event.target.select()}
                  className="w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 font-mono text-sm text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={copyPassword}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-hairline text-gray-500 transition-colors hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  {copied ? (
                    <Check aria-hidden="true" className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy aria-hidden="true" className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {copied ? "Password copied" : "Copy password"}
                  </span>
                </button>
              </div>
              <p aria-live="polite" className="sr-only">
                {copied ? "Password copied to clipboard" : ""}
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-hairline px-8 py-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Done
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
