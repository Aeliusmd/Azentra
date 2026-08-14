"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { techniciansAt } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";
import {
  WORK_TYPES,
  WO_PRIORITIES,
  type FsWorkOrderPriority,
  type FsWorkType,
} from "@/lib/fs/work-orders-data";
import { createWorkOrder } from "@/lib/fs/work-orders-store";

/** Placeholder entry so the technician dropdown can mean "nobody yet". */
const NO_TECHNICIAN = "Select technician";

/** `14:30` from a native time input → `02:30 PM`, the format the data uses. */
function toDisplayTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/**
 * Raises and books a job in one pass, technician included — the dashboard's
 * quick route. Raising one from the work-order list uses its own form, which
 * asks for a source and leaves assignment to the detail dialog.
 */
export function ScheduleWorkModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const roster = techniciansAt(propertyId);

  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState<FsWorkType>("Repair");
  const [priority, setPriority] = useState<FsWorkOrderPriority>("Low");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState(NO_TECHNICIAN);
  const [checklist, setChecklist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // The options carry an availability suffix; the record only wants the name.
  const assignee =
    technician === NO_TECHNICIAN ? "" : technician.split(" — ")[0];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    const id = createWorkOrder({
      propertyId,
      title: title.trim(),
      workType,
      priority,
      location: location.trim(),
      description: description.trim(),
      technician: assignee,
      checklist: checklist
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      date,
      time: toDisplayTime(time),
    });

    showFsToast(`${id} created`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Schedule Work" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <InputField
            id="sw-title"
            label="Job Title"
            required
            placeholder="e.g. Tower B Water Pump Inspection"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="sw-type"
              label="Work Type"
              value={workType}
              onChange={(value) => setWorkType(value as FsWorkType)}
              options={WORK_TYPES}
            />
            <SelectField
              id="sw-priority"
              label="Priority"
              value={priority}
              onChange={(value) => setPriority(value as FsWorkOrderPriority)}
              options={WO_PRIORITIES}
            />
          </div>

          <InputField
            id="sw-location"
            label="Location"
            placeholder="e.g. Tower B, Basement"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <TextareaField
            id="sw-description"
            label="Description"
            rows={3}
            placeholder="Describe the work..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="sw-technician"
              label="Technician"
              value={technician}
              onChange={setTechnician}
              options={[
                NO_TECHNICIAN,
                ...roster.map(
                  (item) => `${item.name} — ${item.availability}`,
                ),
              ]}
            />
            <InputField
              id="sw-checklist"
              label="Checklist (comma separated)"
              placeholder="Item 1, Item 2, Item 3"
              value={checklist}
              onChange={(event) => setChecklist(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="sw-date"
              label="Date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="sw-time"
              label="Time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <FsModalFooter
          onCancel={onClose}
          tone="navy"
          label="Schedule Job"
          disabled={!title.trim()}
        />
      </form>
    </Modal>
  );
}
