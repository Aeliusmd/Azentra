"use client";

import { useState } from "react";
import { Siren } from "lucide-react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { techniciansAt } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";
import { createEmergencyWorkOrder } from "@/lib/fs/work-orders-store";

const NO_TECHNICIAN = "Select available technician";

/**
 * The one form that assigns as it creates: an emergency has to land on a named
 * technician, so the dropdown leads with whoever is free right now.
 */
export function EmergencyWorkOrderModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();

  // Free technicians first — an emergency should not wait behind a full plate.
  const roster = [...techniciansAt(propertyId)].sort((a, b) => {
    const rank = (status: string) =>
      status === "Available" ? 0 : status === "On Break" ? 1 : 2;
    return rank(a.availability) - rank(b.availability);
  });

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState(NO_TECHNICIAN);

  const assignee =
    technician === NO_TECHNICIAN ? "" : technician.split(" — ")[0];
  const ready = title.trim() !== "" && location.trim() !== "" && assignee !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const id = createEmergencyWorkOrder({
      propertyId,
      title: title.trim(),
      location: location.trim(),
      description: description.trim(),
      technician: assignee,
    });

    showFsToast(`Emergency ${id} assigned to ${assignee}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Emergency Work Order" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <p className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3.5 text-[13px] text-rose-700">
            <Siren aria-hidden="true" className="mt-px h-4 w-4 shrink-0" />
            <span>
              Emergency work orders are set to{" "}
              <span className="font-semibold">Critical</span> priority and
              trigger immediate notifications to assigned technicians.
            </span>
          </p>

          <InputField
            id="ew-title"
            label="Title"
            required
            placeholder="e.g. Elevator stopped with residents inside"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <InputField
            id="ew-location"
            label="Location"
            required
            placeholder="e.g. Tower A - Elevator 1"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <TextareaField
            id="ew-description"
            label="Description"
            rows={3}
            placeholder="Describe the emergency..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <SelectField
            id="ew-technician"
            label="Assign Technician"
            required
            value={technician}
            onChange={setTechnician}
            options={[
              NO_TECHNICIAN,
              ...roster.map((item) => `${item.name} — ${item.availability}`),
            ]}
          />
        </div>

        <FsModalFooter
          onCancel={onClose}
          tone="red"
          label="Create Emergency WO"
          disabled={!ready}
        />
      </form>
    </Modal>
  );
}
