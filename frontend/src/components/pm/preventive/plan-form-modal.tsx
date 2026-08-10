"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError, FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  FREQUENCIES,
  NO_ASSET,
  PLAN_ASSETS,
  type Frequency,
} from "@/lib/pm/preventive-data";

export type PlanFormValues = {
  asset: string;
  frequency: Frequency;
  isVendor: boolean;
  assignedTo: string;
};

const EMPTY: PlanFormValues = {
  asset: NO_ASSET,
  frequency: "Monthly",
  isVendor: false,
  assignedTo: "",
};

export function PlanFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PlanFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof PlanFormValues>(
    key: K,
    value: PlanFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (values.asset === NO_ASSET) {
      setError("Select the asset this plan covers.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Preventive Plan">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <div>
            <SelectField
              id="plan-asset"
              label="Asset"
              required
              value={values.asset}
              onChange={(value) => set("asset", value)}
              options={[NO_ASSET, ...PLAN_ASSETS]}
            />
            <FieldError id="plan-asset-error" message={error} />
          </div>

          <SelectField
            id="plan-frequency"
            label="Frequency"
            value={values.frequency}
            onChange={(value) => set("frequency", value as Frequency)}
            options={FREQUENCIES}
          />

          <Checkbox
            id="plan-vendor"
            label="Assign to external vendor"
            checked={values.isVendor}
            onChange={(event) => set("isVendor", event.target.checked)}
          />

          <div>
            <FieldLabel htmlFor="plan-assignee">Assigned To</FieldLabel>
            <input
              id="plan-assignee"
              value={values.assignedTo}
              onChange={(event) => set("assignedTo", event.target.value)}
              placeholder="Technician or vendor name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Create Plan
          </button>
        </div>
      </form>
    </Modal>
  );
}
