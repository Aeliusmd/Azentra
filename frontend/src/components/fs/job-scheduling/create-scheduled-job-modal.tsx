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
 * Plans a job straight onto the board. Unlike the work-order form, which can
 * leave a job open for later, a scheduled job has to name its slot — a row with
 * no date would sit in the unscheduled bucket the moment it was created.
 */
export function CreateScheduledJobModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const roster = techniciansAt(propertyId);

  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState<FsWorkType>("Repair");
  const [priority, setPriority] = useState<FsWorkOrderPriority>("Medium");
  const [location, setLocation] = useState("");
  const [asset, setAsset] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState(NO_TECHNICIAN);
  const [checklist, setChecklist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // The options carry an availability suffix; the record only wants the name.
  const assignee =
    technician === NO_TECHNICIAN ? "" : technician.split(" — ")[0];

  const ready = title.trim() !== "" && date !== "" && time !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const slot = toDisplayTime(time);

    const id = createWorkOrder({
      propertyId,
      title: title.trim(),
      workType,
      priority,
      location: location.trim(),
      asset: asset.trim(),
      description: description.trim(),
      technician: assignee,
      checklist: checklist
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      date,
      time: slot,
    });

    showFsToast(`${id} scheduled for ${date} at ${slot}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Scheduled Job" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <InputField
            id="csj-title"
            label="Job Title"
            required
            placeholder="e.g. Tower B water pump inspection"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="csj-type"
              label="Work Type"
              value={workType}
              onChange={(value) => setWorkType(value as FsWorkType)}
              options={WORK_TYPES}
            />
            <SelectField
              id="csj-priority"
              label="Priority"
              value={priority}
              onChange={(value) => setPriority(value as FsWorkOrderPriority)}
              options={WO_PRIORITIES}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="csj-location"
              label="Location"
              placeholder="e.g. Tower B, Basement"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <InputField
              id="csj-asset"
              label="Asset (optional)"
              placeholder="e.g. Water Pump WP-01"
              value={asset}
              onChange={(event) => setAsset(event.target.value)}
            />
          </div>

          <TextareaField
            id="csj-description"
            label="Description"
            rows={3}
            placeholder="Details about the job..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="csj-technician"
              label="Technician"
              value={technician}
              onChange={setTechnician}
              options={[
                NO_TECHNICIAN,
                ...roster.map((item) => `${item.name} — ${item.availability}`),
              ]}
            />
            <InputField
              id="csj-checklist"
              label="Checklist (comma separated)"
              placeholder="Item 1, Item 2, Item 3"
              value={checklist}
              onChange={(event) => setChecklist(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="csj-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="csj-time"
              label="Time"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <FsModalFooter
          onCancel={onClose}
          tone="navy"
          label="Schedule Job"
          disabled={!ready}
        />
      </form>
    </Modal>
  );
}
