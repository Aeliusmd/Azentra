"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import {
  EVENT_TYPES,
  type CalendarEventType,
} from "@/lib/fs/calendar-data";
import { addCalendarEvent } from "@/lib/fs/calendar-store";
import { technicians } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";
import {
  WO_PRIORITIES,
  type FsWorkOrderPriority,
} from "@/lib/fs/work-orders-data";

const NO_TECHNICIAN = "None";

/** `14:30` from a native time input → `02:30 PM`, the format the data uses. */
function toDisplayTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/**
 * A calendar-only entry — a standup, a contractor walkthrough, a reminder.
 * Raising actual work is what Schedule Work and the emergency form are for, so
 * nothing here creates a work order.
 */
export function AddEventModal({
  date: initialDate,
  onClose,
}: {
  /** The day the calendar is sitting on. */
  date: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState<CalendarEventType>("Maintenance");
  const [priority, setPriority] = useState<FsWorkOrderPriority>("Medium");
  const [technician, setTechnician] = useState(NO_TECHNICIAN);

  const ready = title.trim() !== "" && date !== "" && time !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    addCalendarEvent({
      title: title.trim(),
      date,
      time: toDisplayTime(time),
      type,
      technician: technician === NO_TECHNICIAN ? null : technician,
      place: "",
      // Meetings and rounds are not prioritised work, so the pill is dropped.
      priority: type === "Meeting" ? null : priority,
    });

    showFsToast("Event added");
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Event">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <InputField
            id="ce-title"
            label="Title"
            required
            placeholder="Event title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="ce-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="ce-time"
              label="Time"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="ce-type"
              label="Type"
              value={type}
              onChange={(value) => setType(value as CalendarEventType)}
              options={EVENT_TYPES}
            />
            <SelectField
              id="ce-priority"
              label="Priority"
              value={priority}
              onChange={(value) => setPriority(value as FsWorkOrderPriority)}
              options={WO_PRIORITIES}
            />
          </div>

          <SelectField
            id="ce-technician"
            label="Technician"
            value={technician}
            onChange={setTechnician}
            options={[
              NO_TECHNICIAN,
              ...technicians.map((item) => item.name),
            ]}
          />
        </div>

        <FsModalFooter onCancel={onClose} label="Add Event" disabled={!ready} />
      </form>
    </Modal>
  );
}
