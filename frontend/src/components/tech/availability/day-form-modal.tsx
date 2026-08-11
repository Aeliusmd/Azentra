"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  DAY_STATUSES,
  dayLabel,
  type AvailabilityDay,
  type DayStatus,
} from "@/lib/tech/availability-data";

export function DayFormModal({
  day,
  onClose,
  onSave,
}: {
  day: AvailabilityDay;
  onClose: () => void;
  onSave: (patch: Partial<AvailabilityDay>) => void;
}) {
  const [status, setStatus] = useState<DayStatus>(day.status);
  const [start, setStart] = useState(day.start);
  const [end, setEnd] = useState(day.end);
  const [note, setNote] = useState(day.note ?? "");

  const working = status === "Available";

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Availability"
      subtitle={dayLabel(day.date)}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            status,
            start,
            end,
            note: note.trim() || undefined,
          });
        }}
      >
        <div className="space-y-5 px-8 py-7">
          <SelectField
            id="day-status"
            label="Status"
            value={status}
            onChange={(value) => setStatus(value as DayStatus)}
            options={DAY_STATUSES}
          />

          {working ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="day-start">Start time</FieldLabel>
                <input
                  id="day-start"
                  type="time"
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                  className={`${controlClasses()} px-3.5 py-3`}
                />
              </div>
              <div>
                <FieldLabel htmlFor="day-end">End time</FieldLabel>
                <input
                  id="day-end"
                  type="time"
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                  className={`${controlClasses()} px-3.5 py-3`}
                />
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-muted">
              Your supervisor sees this day as {status.toLowerCase()} and will
              not schedule work on it.
            </p>
          )}

          <div>
            <FieldLabel htmlFor="day-note">
              {working ? "Note (optional)" : "Reason"}
            </FieldLabel>
            <input
              id="day-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                working
                  ? "e.g. Available for emergencies only"
                  : "e.g. Annual leave - family event"
              }
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Save Day
          </button>
        </div>
      </form>
    </Modal>
  );
}
