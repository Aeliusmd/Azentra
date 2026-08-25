"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { inviteTenant } from "@/lib/res/apartment-store";
import { showResToast } from "@/lib/res/toast-store";

/**
 * Inviting someone onto the lease.
 *
 * The dates are checked against each other rather than left to the confirm
 * button, because a lease that ends before it starts is the kind of slip a form
 * should catch out loud.
 */
export function AddTenantModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rent, setRent] = useState("");

  const datesBackwards = start !== "" && end !== "" && end <= start;
  const rentNumber = Number(rent);
  const rentValid = rent !== "" && rentNumber > 0;

  const ready =
    name.trim() !== "" &&
    email.trim() !== "" &&
    start !== "" &&
    end !== "" &&
    !datesBackwards &&
    rentValid;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const tenant = inviteTenant({
      name,
      email,
      phone,
      leaseStart: start,
      leaseEnd: end,
      rent: rentNumber,
    });

    showResToast(`Invitation sent to ${tenant.name}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Tenant">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="ten-name" required>
              Full Name
            </FieldLabel>
            <input
              id="ten-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter tenant name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="ten-email" required>
              Email
            </FieldLabel>
            <input
              id="ten-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="ten-phone">Phone</FieldLabel>
            <input
              id="ten-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="ten-start" required>
                Lease Start
              </FieldLabel>
              <input
                id="ten-start"
                type="date"
                required
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="ten-end" required>
                Lease End
              </FieldLabel>
              <input
                id="ten-end"
                type="date"
                required
                min={start || undefined}
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="ten-rent" required>
              Monthly Rent (LKR)
            </FieldLabel>
            <input
              id="ten-rent"
              type="number"
              inputMode="numeric"
              required
              min={1}
              // Any rupee amount is valid; a coarser step would have the
              // browser silently refuse perfectly ordinary figures.
              step={1}
              value={rent}
              onChange={(event) => setRent(event.target.value)}
              placeholder="Enter rent amount"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          {datesBackwards && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700"
            >
              The lease has to end after it starts.
            </p>
          )}
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  );
}
