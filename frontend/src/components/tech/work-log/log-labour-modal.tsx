"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  durationLabel,
  minutesBetween,
  type Job,
  type JobLabour,
} from "@/lib/tech/jobs-data";

export function LogLabourModal({
  jobs,
  date,
  onClose,
  onSubmit,
}: {
  /** The technician's own open jobs — the only ones they can log against. */
  jobs: Job[];
  /** The day being logged, ISO. */
  date: string;
  onClose: () => void;
  onSubmit: (jobId: string, entry: Omit<JobLabour, "id">) => void;
}) {
  const options = jobs.map((job) => `${job.id} - ${job.title}`);

  const [option, setOption] = useState(options[0] ?? "");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");

  const job = jobs[options.indexOf(option)] ?? jobs[0];
  const ready = Boolean(job && start && end);
  const minutes = ready ? minutesBetween(start, end) : 0;

  return (
    <Modal open onClose={onClose} title="Log Labour Time">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          onSubmit(job.id, {
            date,
            start,
            end,
            minutes,
            note: note.trim() || undefined,
          });
        }}
      >
        <div className="space-y-5 px-8 py-7">
          <SelectField
            id="labour-job"
            label="Job"
            value={option}
            onChange={setOption}
            options={options}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="labour-start">Start Time</FieldLabel>
              <input
                id="labour-start"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="labour-end">End Time</FieldLabel>
              <input
                id="labour-end"
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          {ready && (
            <p className="text-[13px] text-muted">
              Total worked:{" "}
              <span className="font-semibold text-ink">
                {durationLabel(minutes)}
              </span>
            </p>
          )}

          <div>
            <FieldLabel htmlFor="labour-note">Notes</FieldLabel>
            <textarea
              id="labour-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What work was done?"
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Log Time
          </button>
        </div>
      </form>
    </Modal>
  );
}
