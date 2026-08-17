"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import { rosterFor, type UnitBill } from "@/lib/acc/unit-bills-data";
import { generateUnitBill } from "@/lib/acc/unit-bills-store";

/** `2026-08` → `2026-08-31`, the default due date for the period. */
function lastDayOf(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${period}-${new Date(year, month, 0).getDate()}`;
}

/**
 * Raises one bill against a unit.
 *
 * Only units without a bill for this period are offered — billing the same unit
 * twice in a cycle is the mistake this dialog exists to prevent. It always
 * lands as a Draft, so nothing reaches a resident straight from here.
 */
export function GenerateBillModal({
  propertyId,
  period,
  existing,
  onClose,
}: {
  propertyId: string;
  period: string;
  /** Bills already raised for this property and period. */
  existing: UnitBill[];
  onClose: () => void;
}) {
  const billed = new Set(existing.map((bill) => bill.unit));
  const available = rosterFor(propertyId).filter(
    (entry) => !billed.has(entry.unit),
  );

  const [unit, setUnit] = useState(available[0]?.unit ?? "");
  const [total, setTotal] = useState("");
  const [dueDate, setDueDate] = useState(lastDayOf(period));

  const resident =
    available.find((entry) => entry.unit === unit)?.resident ?? "";
  const amount = Number(total);
  const valid = unit !== "" && amount > 0 && dueDate !== "";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;

    const bill = generateUnitBill({
      propertyId,
      period,
      unit,
      resident,
      total: amount,
      dueDate,
    });

    showAccToast(`${bill.id} generated as a draft`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Generate Bill"
      subtitle={`${accPropertyName(propertyId)} · ${periodLabel(period)}`}
    >
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          {available.length === 0 ? (
            <p className="py-6 text-center text-[15px] text-muted">
              Every unit on this property already has a bill for{" "}
              {periodLabel(period)}.
            </p>
          ) : (
            <>
              <SelectField
                id="bill-unit"
                label="Unit"
                required
                value={unit}
                onChange={setUnit}
                options={available.map((entry) => entry.unit)}
              />

              <div>
                <FieldLabel htmlFor="bill-resident">Resident</FieldLabel>
                <input
                  id="bill-resident"
                  readOnly
                  value={resident}
                  className={`${controlClasses()} px-3.5 py-3 text-gray-500`}
                />
              </div>

              <div>
                <FieldLabel htmlFor="bill-total" required>
                  Total Amount (LKR)
                </FieldLabel>
                <input
                  id="bill-total"
                  type="number"
                  min={1}
                  // Whole rupees. A coarser step would fail constraint
                  // validation on ordinary amounts and block submit silently.
                  step={1}
                  inputMode="numeric"
                  placeholder="25000"
                  value={total}
                  onChange={(event) => setTotal(event.target.value)}
                  className={`${controlClasses()} px-3.5 py-3`}
                />
              </div>

              <div>
                <FieldLabel htmlFor="bill-due" required>
                  Due Date
                </FieldLabel>
                <input
                  id="bill-due"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className={`${controlClasses()} px-3.5 py-3`}
                />
              </div>
            </>
          )}
        </div>

        <FsModalFooter
          onCancel={onClose}
          label="Generate Bill"
          disabled={!valid}
        />
      </form>
    </Modal>
  );
}
