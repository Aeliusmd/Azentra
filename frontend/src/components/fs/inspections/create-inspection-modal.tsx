"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import {
  INSPECTION_TYPES,
  type InspectionType,
} from "@/lib/fs/inspections-data";
import { addInspection } from "@/lib/fs/inspections-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { techniciansAt } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";

/** Placeholder entry — an inspection can be booked before anyone is named. */
const NO_TECHNICIAN = "Optional";

/** Books a round. Its checklist comes from the type, so it starts with one. */
export function CreateInspectionModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const roster = techniciansAt(propertyId);

  const [type, setType] = useState<InspectionType>(INSPECTION_TYPES[0]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [technician, setTechnician] = useState(NO_TECHNICIAN);

  const ready = location.trim() !== "" && date !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const id = addInspection({
      propertyId,
      type,
      location: location.trim(),
      technician: technician === NO_TECHNICIAN ? "" : technician,
      date,
    });

    showFsToast(`Inspection ${id} scheduled`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Inspection">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <SelectField
            id="ci-type"
            label="Type"
            value={type}
            onChange={(value) => setType(value as InspectionType)}
            options={INSPECTION_TYPES}
          />

          <InputField
            id="ci-location"
            label="Location"
            required
            placeholder="e.g. Tower A - Roof Level"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="ci-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <SelectField
              id="ci-technician"
              label="Technician"
              value={technician}
              onChange={setTechnician}
              options={[NO_TECHNICIAN, ...roster.map((item) => item.name)]}
            />
          </div>
        </div>

        <FsModalFooter onCancel={onClose} label="Create" disabled={!ready} />
      </form>
    </Modal>
  );
}
