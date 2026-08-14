"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  supervisedProperties,
  useSelectedFsProperty,
} from "@/lib/fs/properties";
import { showFsToast } from "@/lib/fs/toast-store";
import {
  WO_PRIORITIES,
  WO_SOURCES,
  type FsWorkOrderPriority,
  type FsWorkOrderSource,
} from "@/lib/fs/work-orders-data";
import { createWorkOrder } from "@/lib/fs/work-orders-store";

/** Placeholder entry so the tower dropdown can mean "not stated". */
const NO_TOWER = "-";

/**
 * `A-304` reads as `Unit A-304` alongside the rest of the list, but a named
 * space like `Lobby` or `Pool Plant Room` is left exactly as typed.
 */
function unitLabel(value: string) {
  const unit = value.trim();
  return /^[A-Za-z]{0,2}-?\d{1,4}$/.test(unit) ? `Unit ${unit}` : unit;
}

/** `14:30` from a native time input → `02:30 PM`, the format the data uses. */
function toDisplayTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/**
 * Raises a work order from the list page. It deliberately asks for no
 * technician: a new job lands in the unassigned queue and is assigned from the
 * detail dialog, which is where reassignment lives too.
 */
export function CreateWorkOrderModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const towers =
    supervisedProperties.find((property) => property.id === propertyId)
      ?.buildings ?? [];

  const [title, setTitle] = useState("");
  const [tower, setTower] = useState(NO_TOWER);
  const [floor, setFloor] = useState("");
  const [unit, setUnit] = useState("");
  const [source, setSource] = useState<FsWorkOrderSource>("Direct");
  const [priority, setPriority] = useState<FsWorkOrderPriority>("Medium");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    const id = createWorkOrder({
      propertyId,
      title: title.trim(),
      building: tower === NO_TOWER ? "" : tower,
      location: [floor.trim() && `Floor ${floor.trim()}`, unitLabel(unit)]
        .filter(Boolean)
        .join(" · "),
      source,
      priority,
      description: description.trim(),
      date,
      time: toDisplayTime(time),
    });

    showFsToast(`${id} created`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Work Order" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <InputField
            id="cw-title"
            label="Title"
            required
            placeholder="e.g. Water pipe burst in bathroom"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <SelectField
              id="cw-tower"
              label="Tower"
              value={tower}
              onChange={setTower}
              options={[NO_TOWER, ...towers]}
            />
            <InputField
              id="cw-floor"
              label="Floor"
              placeholder="e.g. 3"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
            />
            <InputField
              id="cw-unit"
              label="Unit"
              placeholder="e.g. A-304"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="cw-source"
              label="Source"
              value={source}
              onChange={(value) => setSource(value as FsWorkOrderSource)}
              options={WO_SOURCES}
            />
            <SelectField
              id="cw-priority"
              label="Priority"
              value={priority}
              onChange={(value) => setPriority(value as FsWorkOrderPriority)}
              options={WO_PRIORITIES}
            />
          </div>

          <TextareaField
            id="cw-description"
            label="Description"
            rows={3}
            placeholder="Describe the work..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="cw-date"
              label="Scheduled Date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="cw-time"
              label="Scheduled Time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <FsModalFooter
          onCancel={onClose}
          label="Create Work Order"
          disabled={!title.trim()}
        />
      </form>
    </Modal>
  );
}
