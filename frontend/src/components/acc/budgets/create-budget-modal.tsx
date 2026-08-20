"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { Modal } from "@/components/ui/modal";
import { BUDGET_YEARS } from "@/lib/acc/budgets-data";
import { budgetExists, createBudget } from "@/lib/acc/budgets-store";
import { accPropertyName, assignedProperties } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";

const YEARS = BUDGET_YEARS.map(String);
const PROPERTY_NAMES = assignedProperties.map((property) => property.name);

/**
 * Draws up a spending plan for a year. It is created empty — the allocations
 * come afterwards, on the categories screen.
 */
export function CreateBudgetModal({
  propertyId,
  onClose,
}: {
  propertyId: string;
  onClose: () => void;
}) {
  const [year, setYear] = useState("2026");
  const [property, setProperty] = useState(accPropertyName(propertyId));

  const targetId =
    assignedProperties.find((entry) => entry.name === property)?.id ??
    propertyId;
  const duplicate = budgetExists(targetId, Number(year));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (duplicate) return;

    createBudget(targetId, Number(year));
    showAccToast(`${year} budget created for ${property}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Budget">
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          <SelectField
            id="budget-year"
            label="Year"
            value={year}
            onChange={setYear}
            options={YEARS}
          />

          <SelectField
            id="budget-property"
            label="Property"
            value={property}
            onChange={setProperty}
            options={PROPERTY_NAMES}
          />

          <p className="text-[14px] text-muted">
            {duplicate
              ? `${property} already has a ${year} budget.`
              : "You will add categories after creating the budget."}
          </p>
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
            disabled={duplicate}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
