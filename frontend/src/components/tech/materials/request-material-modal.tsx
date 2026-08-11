"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { inventory, type MaterialRequest } from "@/lib/tech/materials-data";

/** "PVC Pipe 2" (12 meter in stock)" — what the dropdown shows. */
const optionFor = (name: string) => {
  const material = inventory.find((item) => item.name === name);
  return material
    ? `${material.name} (${material.quantity} ${material.unit} in stock)`
    : name;
};

const OPTIONS = inventory.map((material) => optionFor(material.name));

export function RequestMaterialModal({
  jobRef: initialJobRef = "",
  onClose,
  onSubmit,
}: {
  /** Prefilled when the request starts from a job. */
  jobRef?: string;
  onClose: () => void;
  onSubmit: (request: Omit<MaterialRequest, "id" | "status">) => void;
}) {
  const [option, setOption] = useState(OPTIONS[0]);
  const [quantity, setQuantity] = useState("1");
  const [jobRef, setJobRef] = useState(initialJobRef);
  const [reason, setReason] = useState("");

  const material = inventory[OPTIONS.indexOf(option)] ?? inventory[0];

  return (
    <Modal open onClose={onClose} title="Request Material">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            material: material.name,
            quantity: Number(quantity) || 1,
            unit: material.unit,
            date: "2026-08-11",
            jobRef: jobRef.trim() || undefined,
            reason: reason.trim() || undefined,
          });
        }}
      >
        <div className="space-y-5 px-8 py-7">
          <SelectField
            id="request-material"
            label="Material"
            value={option}
            onChange={setOption}
            options={OPTIONS}
          />

          <div>
            <FieldLabel htmlFor="request-qty">Quantity</FieldLabel>
            <input
              id="request-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="request-job">Job Reference</FieldLabel>
            <input
              id="request-job"
              value={jobRef}
              onChange={(event) => setJobRef(event.target.value)}
              placeholder="e.g. MT-1045"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="request-reason">Reason</FieldLabel>
            <textarea
              id="request-reason"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why is this material needed?"
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
