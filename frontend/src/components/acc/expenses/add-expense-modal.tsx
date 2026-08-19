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
import { addExpense } from "@/lib/acc/expenses-store";
import { lkr } from "@/lib/acc/money";
import { showAccToast } from "@/lib/acc/toast-store";

/**
 * Logs a cost against the property. It lands Pending — recording that money
 * was spent is not the same as somebody having signed it off.
 */
export function AddExpenseModal({
  propertyId,
  period,
  onClose,
}: {
  propertyId: string;
  period: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<ExpenseCategory>("Maintenance");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const value = Number(amount);
  const valid = description.trim() !== "" && value > 0 && date !== "";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;

    const expense = addExpense({
      propertyId,
      period,
      category,
      description: description.trim(),
      vendor: vendor.trim(),
      amount: value,
      date,
    });

    showAccToast(`${expense.id} logged — ${lkr(expense.amount)}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Expense">
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          <SelectField
            id="expense-category"
            label="Category"
            value={category}
            onChange={(value) => setCategory(value as ExpenseCategory)}
            options={EXPENSE_CATEGORIES}
          />

          <div>
            <FieldLabel htmlFor="expense-description" required>
              Description
            </FieldLabel>
            <input
              id="expense-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Expense description"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="expense-vendor">Vendor</FieldLabel>
            <input
              id="expense-vendor"
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              placeholder="Vendor name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="expense-amount" required>
              Amount (LKR)
            </FieldLabel>
            <input
              id="expense-amount"
              type="number"
              min={1}
              // Whole rupees. A coarser step would fail constraint validation
              // on ordinary amounts and block submit silently.
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="expense-date" required>
              Date
            </FieldLabel>
            <input
              id="expense-date"
              type="date"
              max={TODAY}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>
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
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
}
