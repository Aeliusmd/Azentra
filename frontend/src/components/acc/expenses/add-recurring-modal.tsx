"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TODAY } from "@/lib/acc/dashboard-data";
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/acc/expenses-data";
import { lkr } from "@/lib/acc/money";
import {
  RECURRING_FREQUENCIES,
  type RecurringFrequency,
} from "@/lib/acc/recurring-expenses-data";
import { addRecurringExpense } from "@/lib/acc/recurring-expenses-store";
import { showAccToast } from "@/lib/acc/toast-store";

/** The schedule starts on today's date, so it falls due on today's day each cycle. */
const DUE_DAY = Number(TODAY.split("-")[2]);

/** Sets up a standing cost — a contract or subscription the property pays on a cycle. */
export function AddRecurringModal({
  propertyId,
  onClose,
}: {
  propertyId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Maintenance");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("Monthly");

  const value = Number(amount);
  const valid = name.trim() !== "" && value > 0;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;

    const schedule = addRecurringExpense({
      propertyId,
      name: name.trim(),
      category,
      vendor: vendor.trim(),
      amount: value,
      frequency,
      dueDay: DUE_DAY,
    });

    showAccToast(`${schedule.name} scheduled — ${lkr(schedule.amount)}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Recurring Expense">
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <FieldLabel htmlFor="recurring-name" required>
              Name
            </FieldLabel>
            <input
              id="recurring-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Expense name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <SelectField
            id="recurring-category"
            label="Category"
            value={category}
            onChange={(value) => setCategory(value as ExpenseCategory)}
            options={EXPENSE_CATEGORIES}
          />

          <div>
            <FieldLabel htmlFor="recurring-vendor">Vendor</FieldLabel>
            <input
              id="recurring-vendor"
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              placeholder="Vendor name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="recurring-amount" required>
              Amount (LKR)
            </FieldLabel>
            <input
              id="recurring-amount"
              type="number"
              min={1}
              // Whole rupees. A coarser step would fail constraint validation
              // on ordinary amounts and block submit silently.
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Amount"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <SelectField
            id="recurring-frequency"
            label="Frequency"
            value={frequency}
            onChange={(value) => setFrequency(value as RecurringFrequency)}
            options={RECURRING_FREQUENCIES}
          />
        </div>

        {/* Two equal actions, as in the design. They stack on a phone, where
            side by side clips the submit label. */}
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
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
