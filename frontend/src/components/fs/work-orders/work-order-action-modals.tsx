"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import { techniciansAt } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";
import type { FsWorkOrder } from "@/lib/fs/work-orders-data";
import {
  addSupervisorNote,
  assignTechnician,
  putOnHold,
  reassignTechnician,
  scheduleJob,
  useFsWorkOrders,
} from "@/lib/fs/work-orders-store";

/** The four dialogs the detail modal's footer opens. */
export type WorkOrderAction = "reassign" | "reschedule" | "note" | "hold";

const CANCEL =
  "rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";
const SUBMIT =
  "rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300";

function Footer({
  onCancel,
  label,
  disabled,
}: {
  onCancel: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
      <button type="button" onClick={onCancel} className={CANCEL}>
        Cancel
      </button>
      <button type="submit" disabled={disabled} className={SUBMIT}>
        {label}
      </button>
    </div>
  );
}

/** `14:30` from a native time input → `02:30 PM`, the format the mock data uses. */
function toDisplayTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/** `02:30 PM` back to `14:30`, so the field opens on the current slot. */
function toInputTime(value: string | null) {
  if (!value) return "";
  const [clock, meridiem] = value.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);
  const hour24 = (hours % 12) + (meridiem === "PM" ? 12 : 0);
  return `${String(hour24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/* -------------------------------- Reassign -------------------------------- */

function ReassignModal({
  order,
  onClose,
}: {
  order: FsWorkOrder;
  onClose: () => void;
}) {
  const roster = techniciansAt(order.propertyId);
  const options = roster.map(
    (technician) =>
      `${technician.name} — ${technician.availability}, ${technician.skills.join(", ")}`,
  );

  const current = options.find((option) =>
    option.startsWith(`${order.technician} —`),
  );

  const [choice, setChoice] = useState(current ?? options[0] ?? "");
  const [reason, setReason] = useState("");

  const picked = choice.split(" — ")[0];
  const first = order.technician === null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!picked) return;

    if (first) assignTechnician(order.id, picked);
    else reassignTechnician(order.id, picked, reason.trim());

    showFsToast(first ? `Assigned to ${picked}` : `Reassigned to ${picked}`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={first ? "Assign Technician" : "Reassign Technician"}
      subtitle={`${order.id} · ${order.title}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          {!first && (
            <p className="rounded-lg bg-gray-50 px-4 py-3 text-[13px] text-muted">
              Currently with{" "}
              <span className="font-semibold text-ink">{order.technician}</span>
              . Progress and notes already logged stay on the job.
            </p>
          )}

          <SelectField
            id="wo-reassign-technician"
            label="Technician"
            required
            value={choice}
            onChange={setChoice}
            options={options}
          />

          {!first && (
            <TextareaField
              id="wo-reassign-reason"
              label="Reason"
              rows={3}
              placeholder="Why is this job moving? (optional)"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          )}
        </div>

        <Footer
          onCancel={onClose}
          disabled={!picked}
          label={first ? "Assign Technician" : "Reassign"}
        />
      </form>
    </Modal>
  );
}

/* ------------------------------- Reschedule ------------------------------- */

function RescheduleModal({
  order,
  onClose,
}: {
  order: FsWorkOrder;
  onClose: () => void;
}) {
  const [date, setDate] = useState(order.scheduledDate ?? "");
  const [time, setTime] = useState(toInputTime(order.scheduledTime));
  const [duration, setDuration] = useState(String(order.durationHours ?? 2));
  const [dueDate, setDueDate] = useState(order.dueDate);

  const orders = useFsWorkOrders();
  const scheduled = order.scheduledDate !== null;
  const ready = date !== "" && time !== "";

  /** The same technician already booked at that moment — warned, not blocked. */
  const clash =
    ready && order.technician
      ? orders.find(
          (other) =>
            other.id !== order.id &&
            other.technician === order.technician &&
            other.status !== "Completed" &&
            other.scheduledDate === date &&
            other.scheduledTime === toDisplayTime(time),
        )
      : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    scheduleJob(order.id, {
      date,
      time: toDisplayTime(time),
      durationHours: Number(duration) || 1,
      dueDate: dueDate || date,
    });

    showFsToast(scheduled ? "Job rescheduled" : "Job scheduled");
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={scheduled ? "Reschedule Job" : "Schedule Job"}
      subtitle={`${order.id} · ${order.title}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          {scheduled && (
            <p className="rounded-lg bg-gray-50 px-4 py-3 text-[13px] text-muted">
              Currently booked for{" "}
              <span className="font-semibold text-ink">
                {order.scheduledDate} at {order.scheduledTime}
              </span>
              .
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="wo-schedule-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="wo-schedule-time"
              label="Start Time"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="wo-schedule-duration"
              label="Expected Duration (hours)"
              type="number"
              min={0.5}
              step={0.5}
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
            <InputField
              id="wo-schedule-due"
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          {clash && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
              <span className="font-semibold">Schedule conflict:</span>{" "}
              {order.technician} is already booked at that time for {clash.id} —{" "}
              {clash.title}. You can still save this slot.
            </p>
          )}
        </div>

        <Footer
          onCancel={onClose}
          disabled={!ready}
          label={scheduled ? "Reschedule" : "Schedule"}
        />
      </form>
    </Modal>
  );
}

/* -------------------------------- Add note -------------------------------- */

function AddNoteModal({
  order,
  onClose,
}: {
  order: FsWorkOrder;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;

    addSupervisorNote(order.id, text.trim());
    showFsToast("Note added");
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Add Note"
      subtitle={`${order.id} · ${order.title}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="px-8 py-7">
          <TextareaField
            id="wo-note-text"
            label="Note"
            required
            rows={5}
            placeholder="Anything the technician or the next shift should know..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        <Footer onCancel={onClose} disabled={!text.trim()} label="Add Note" />
      </form>
    </Modal>
  );
}

/* ---------------------------------- Hold ---------------------------------- */

const HOLD_REASONS = [
  "Waiting on parts",
  "Access to the unit not available",
  "Needs a specialist contractor",
  "Weather stopped work",
  "Resident requested a delay",
  "Other",
] as const;

function HoldModal({
  order,
  onClose,
}: {
  order: FsWorkOrder;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string>(HOLD_REASONS[0]);
  const [detail, setDetail] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const text = detail.trim() ? `${reason} — ${detail.trim()}` : reason;
    putOnHold(order.id, text);
    showFsToast("Job put on hold");
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Put Job On Hold"
      subtitle={`${order.id} · ${order.title}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
            The job stays with {order.technician ?? "the queue"} and keeps its
            progress — it just stops counting as active work.
          </p>

          <SelectField
            id="wo-hold-reason"
            label="Reason"
            required
            value={reason}
            onChange={setReason}
            options={HOLD_REASONS}
          />

          <TextareaField
            id="wo-hold-detail"
            label="Detail"
            rows={3}
            placeholder="Add context for the record (optional)"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
        </div>

        <Footer onCancel={onClose} label="Put On Hold" />
      </form>
    </Modal>
  );
}

/** Routes the footer's choice to the matching dialog. */
export function WorkOrderActionModal({
  action,
  order,
  onClose,
}: {
  action: WorkOrderAction;
  order: FsWorkOrder;
  onClose: () => void;
}) {
  if (action === "reassign")
    return <ReassignModal order={order} onClose={onClose} />;
  if (action === "reschedule")
    return <RescheduleModal order={order} onClose={onClose} />;
  if (action === "note") return <AddNoteModal order={order} onClose={onClose} />;
  return <HoldModal order={order} onClose={onClose} />;
}
