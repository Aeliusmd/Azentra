"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/acc/payments-data";
import { recordPayment } from "@/lib/acc/payments-store";
import { showAccToast } from "@/lib/acc/toast-store";

/**
 * Logs a payment that arrived outside the gateway — a transfer the bank
 * confirmed, or cash taken at the desk. It lands Pending, so recording one is
 * not the same as saying the money is in.
 */
export function RecordPaymentModal({
  propertyId,
  period,
  onClose,
}: {
  propertyId: string;
  period: string;
  onClose: () => void;
}) {
  const [resident, setResident] = useState("");
  const [unit, setUnit] = useState("");
  const [bill, setBill] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Bank Transfer");
  const [reference, setReference] = useState("");

  const value = Number(amount);
  const valid =
    resident.trim() !== "" &&
    unit.trim() !== "" &&
    bill.trim() !== "" &&
    value > 0;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;

    const payment = recordPayment({
      propertyId,
      period,
      resident: resident.trim(),
      unit: unit.trim(),
      bill: bill.trim(),
      amount: value,
      method,
      reference: reference.trim(),
    });

    showAccToast(`${payment.id} recorded — ${lkr(payment.amount)}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Record Manual Payment">
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <FieldLabel htmlFor="pay-resident" required>
              Resident Name
            </FieldLabel>
            <input
              id="pay-resident"
              value={resident}
              onChange={(event) => setResident(event.target.value)}
              placeholder="Enter resident name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="pay-unit" required>
              Unit
            </FieldLabel>
            <input
              id="pay-unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="e.g. A-101"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="pay-bill" required>
              Bill Reference
            </FieldLabel>
            <input
              id="pay-bill"
              value={bill}
              onChange={(event) => setBill(event.target.value)}
              placeholder="BIL-2026-XXXXX"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="pay-amount" required>
              Amount (LKR)
            </FieldLabel>
            <input
              id="pay-amount"
              type="number"
              min={1}
              // Whole rupees. A coarser step would fail constraint validation
              // on ordinary amounts and block submit with no visible reason.
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <SelectField
            id="pay-method"
            label="Payment Method"
            value={method}
            onChange={(value) => setMethod(value as PaymentMethod)}
            options={PAYMENT_METHODS}
          />

          <div>
            <FieldLabel htmlFor="pay-reference">
              Transaction Reference
            </FieldLabel>
            <input
              id="pay-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="TXN-XXXXX"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>
        </div>

        {/* Two equal actions, as in the design — neither is a throwaway. They
            stack on a phone, where side by side clips the submit label. */}
        <div className="grid grid-cols-1 gap-3 px-5 pb-6 sm:grid-cols-2 sm:gap-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
}
