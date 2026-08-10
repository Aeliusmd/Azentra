"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  UNIT_STATUS_TONE,
  formatRent,
  type Unit,
} from "@/lib/pm/units-data";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[17px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="font-semibold text-ink">{value}</span>
    </p>
  );
}

export function UnitDetailsModal({
  unit,
  onClose,
}: {
  unit: Unit | null;
  onClose: () => void;
}) {
  if (!unit) return null;

  return (
    <Modal open onClose={onClose} title={`Unit ${unit.id}`}>
      <div className="px-8 py-7">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={UNIT_STATUS_TONE[unit.status]}>{unit.status}</Pill>
          <Pill>{unit.type}</Pill>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <Field label="Unit" value={unit.id} />
          <Field label="Tower" value={unit.tower} />
          <Field label="Floor" value={unit.floor} />
          <Field label="Bedrooms" value={String(unit.bedrooms)} />
          <Field label="Area" value={`${unit.area} sqft`} />
          <Field label="Rent" value={formatRent(unit.rent)} />
          {unit.tenant && (
            <div className="sm:col-span-2">
              <Field label="Tenant" value={unit.tenant} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
