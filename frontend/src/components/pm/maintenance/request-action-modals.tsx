"use client";

import { useState } from "react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  PRIORITIES,
  PRIORITY_TEXT,
  technicians,
  type MaintenanceRequest,
  type Priority,
} from "@/lib/pm/maintenance-data";

const CANCEL =
  "rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";
const CONFIRM =
  "rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none";

/* ------------------------------ Change priority ----------------------------- */

export function ChangePriorityModal({
  request,
  onClose,
  onSubmit,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
  onSubmit: (priority: Priority) => void;
}) {
  const [choice, setChoice] = useState<Priority>(request.priority);

  return (
    <Modal open onClose={onClose} title="Change Priority">
      <div className="px-8 py-7">
        <p className="text-[15px] text-gray-600">
          Update priority for {request.id}
        </p>

        <div
          role="radiogroup"
          aria-label="Priority"
          className="mt-5 space-y-3"
        >
          {PRIORITIES.map((priority) => {
            const selected = priority === choice;
            return (
              <button
                key={priority}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(priority)}
                className={`flex w-full items-center rounded-xl border px-5 py-4 text-left text-[17px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  selected
                    ? "border-brand bg-green-50/60"
                    : "border-hairline hover:bg-gray-50"
                } ${PRIORITY_TEXT[priority]}`}
              >
                {priority}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
        <button type="button" onClick={onClose} className={CANCEL}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(choice)}
          className={CONFIRM}
        >
          Update Priority
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------- Assign technician ----------------------------- */

export function AssignTechnicianModal({
  request,
  onClose,
  onSubmit,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
  onSubmit: (technician: string) => void;
}) {
  const [choice, setChoice] = useState("");

  return (
    <Modal open onClose={onClose} title="Assign Technician">
      <div className="px-8 py-7">
        <p className="text-[15px] text-gray-600">
          Select a technician for {request.id}: {request.title}
        </p>

        <div
          role="radiogroup"
          aria-label="Technician"
          className="mt-5 space-y-3"
        >
          {technicians.map((technician) => {
            const selected = technician.name === choice;
            return (
              <button
                key={technician.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(technician.name)}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  selected
                    ? "border-brand bg-green-50/60"
                    : "border-hairline hover:bg-gray-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold text-ink">
                    {technician.name}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-muted">
                    {technician.skills} | Rating: {technician.rating.toFixed(1)}
                  </span>
                </span>
                <Pill tone={technician.available ? "green" : "amber"}>
                  {technician.available ? "Available" : "Busy"}
                </Pill>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
        <button type="button" onClick={onClose} className={CANCEL}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!choice}
          onClick={() => onSubmit(choice)}
          className={CONFIRM}
        >
          Assign
        </button>
      </div>
    </Modal>
  );
}

/* --------------------------------- Add note --------------------------------- */

export function AddNoteModal({
  request,
  onClose,
  onSubmit,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");

  return (
    <Modal open onClose={onClose} title="Add Note">
      <div className="px-8 py-7">
        <label htmlFor="request-note" className="text-[15px] text-gray-600">
          Add an internal note to {request.id}
        </label>
        <textarea
          id="request-note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Enter your note here..."
          className="mt-4 w-full resize-none rounded-xl border border-hairline bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
        <button type="button" onClick={onClose} className={CANCEL}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!note.trim()}
          onClick={() => onSubmit(note.trim())}
          className={CONFIRM}
        >
          Save Note
        </button>
      </div>
    </Modal>
  );
}
