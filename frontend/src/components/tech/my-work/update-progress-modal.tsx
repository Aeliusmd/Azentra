"use client";

import { useState } from "react";
import { Camera, Clock, NotebookPen, Package, X } from "lucide-react";

import { SelectField } from "@/components/pm/ui/select-field";
import { PhotoSlots } from "@/components/tech/my-work/photo-upload";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  MATERIAL_UNITS,
  durationLabel,
  formatClock,
  minutesBetween,
  totalLabourMinutes,
  type Job,
  type MaterialUnit,
} from "@/lib/tech/jobs-data";
import {
  addJobLabour,
  addJobMaterial,
  addJobNote,
  removeJobLabour,
  removeJobMaterial,
} from "@/lib/tech/jobs-store";

const SECTION_HEAD = "flex items-center gap-2 text-[15px] font-bold text-ink";

const GHOST_BUTTON =
  "rounded-lg border border-hairline px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/** Clock reading for a note the technician writes now. */
function nowClock() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/* ---------------------------------- Notes --------------------------------- */

function WorkNotes({ job }: { job: Job }) {
  const [draft, setDraft] = useState("");

  return (
    <section>
      <h3 className={SECTION_HEAD}>
        <NotebookPen aria-hidden="true" className="h-4 w-4 text-gray-500" />
        Work Notes
      </h3>

      {job.notes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {job.notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-hairline bg-gray-50 px-3.5 py-2.5"
            >
              <p className="text-[13px] text-gray-400">
                {formatClock(note.time)}
              </p>
              <p className="mt-0.5 text-[15px] text-ink">{note.text}</p>
            </li>
          ))}
        </ul>
      )}

      <textarea
        rows={3}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Add a progress note..."
        aria-label="Progress note"
        className={`${controlClasses()} mt-3 resize-none px-3.5 py-3`}
      />

      <button
        type="button"
        disabled={!draft.trim()}
        onClick={() => {
          addJobNote(job.id, draft.trim(), nowClock());
          setDraft("");
        }}
        className="mt-3 rounded-lg bg-[#4a7fb5] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#3f6d9d] focus-visible:ring-2 focus-visible:ring-[#4a7fb5]/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        Add Note
      </button>
    </section>
  );
}

/* -------------------------------- Materials ------------------------------- */

function Materials({ job }: { job: Job }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<MaterialUnit>("unit");
  const [note, setNote] = useState("");

  function reset() {
    setName("");
    setQuantity("1");
    setUnit("unit");
    setNote("");
    setAdding(false);
  }

  function save() {
    if (!name.trim()) return;
    addJobMaterial(job.id, {
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit,
      note: note.trim() || undefined,
    });
    reset();
  }

  return (
    <section>
      <h3 className={SECTION_HEAD}>
        <Package aria-hidden="true" className="h-4 w-4 text-gray-500" />
        Materials Used
      </h3>

      {job.materials.length === 0 ? (
        <p className="mt-3 text-[13px] text-muted">
          No materials recorded yet.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-hairline">
          {job.materials.map((material) => (
            <li
              key={material.id}
              className="flex items-center gap-3 py-3 text-[15px]"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-ink">{material.name}</span>
                {material.note && (
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {material.note}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-gray-500">
                {material.quantity} {material.unit}
              </span>
              <button
                type="button"
                onClick={() => removeJobMaterial(job.id, material.id)}
                aria-label={`Remove ${material.name}`}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="mt-3 space-y-4 rounded-lg border border-hairline p-4">
          <div>
            <FieldLabel htmlFor="material-name" required>
              Material
            </FieldLabel>
            <input
              id="material-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Copper pipe 15mm"
              className={`${controlClasses()} px-3.5 py-2.5`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="material-qty">Quantity</FieldLabel>
              <input
                id="material-qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className={`${controlClasses()} px-3.5 py-2.5`}
              />
            </div>
            <SelectField
              id="material-unit"
              label="Unit"
              value={unit}
              onChange={(value) => setUnit(value as MaterialUnit)}
              options={MATERIAL_UNITS}
            />
          </div>

          <div>
            <FieldLabel htmlFor="material-note">Notes</FieldLabel>
            <input
              id="material-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional"
              className={`${controlClasses()} px-3.5 py-2.5`}
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={save}
              disabled={!name.trim()}
              className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              Add Material
            </button>
            <button type="button" onClick={reset} className={GHOST_BUTTON}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={`mt-3 ${GHOST_BUTTON}`}
        >
          + Add Material
        </button>
      )}
    </section>
  );
}

/* --------------------------------- Labour --------------------------------- */

function Labour({ job }: { job: Job }) {
  const [adding, setAdding] = useState(false);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("11:00");

  const minutes = minutesBetween(start, end);
  const total = totalLabourMinutes(job);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h3 className={SECTION_HEAD}>
          <Clock aria-hidden="true" className="h-4 w-4 text-gray-500" />
          Labour Time
        </h3>
        {job.labour.length > 1 && (
          <span className="text-[13px] font-semibold text-ink">
            {durationLabel(total)} total
          </span>
        )}
      </div>

      {job.labour.length === 0 ? (
        <p className="mt-3 text-[13px] text-muted">No labour logged yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-hairline">
          {job.labour.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 py-3 text-[15px]"
            >
              <span className="min-w-0 flex-1 text-ink">
                {formatClock(entry.start)} - {formatClock(entry.end)}
              </span>
              <span className="shrink-0 text-gray-500">
                {durationLabel(entry.minutes)}
              </span>
              <button
                type="button"
                onClick={() => removeJobLabour(job.id, entry.id)}
                aria-label="Remove labour entry"
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="mt-3 space-y-4 rounded-lg border border-hairline p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="labour-start">Start time</FieldLabel>
              <input
                id="labour-start"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className={`${controlClasses()} px-3.5 py-2.5`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="labour-end">End time</FieldLabel>
              <input
                id="labour-end"
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className={`${controlClasses()} px-3.5 py-2.5`}
              />
            </div>
          </div>

          <p className="text-[13px] text-muted">
            Total worked:{" "}
            <span className="font-semibold text-ink">
              {durationLabel(minutes)}
            </span>
          </p>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                addJobLabour(job.id, { start, end, minutes });
                setAdding(false);
              }}
              className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Log Labour
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className={GHOST_BUTTON}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={`mt-3 ${GHOST_BUTTON}`}
        >
          + Log Labour
        </button>
      )}
    </section>
  );
}

/* --------------------------------- Modal ---------------------------------- */

/**
 * The job's work log. With `onSave` it is the Update Progress dialog — the
 * progress bar plus a Save button. Without it, it is the read-and-record view a
 * parked job opens through Check Status.
 */
export function WorkLogModal({
  job,
  onClose,
  onSave,
}: {
  job: Job;
  onClose: () => void;
  onSave?: (progress: number) => void;
}) {
  const [progress, setProgress] = useState(job.progress);

  return (
    <Modal
      open
      onClose={onClose}
      title={job.title}
      subtitle={`${job.id} | ${job.status}`}
      size="lg"
    >
      <div className="max-h-[62vh] space-y-7 overflow-y-auto px-8 py-6">
        {onSave && (
          <section>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="job-progress"
                className="text-[15px] font-bold text-ink"
              >
                Progress
              </label>
              <span className="text-[15px] font-bold text-amber-600">
                {progress}%
              </span>
            </div>

            <input
              id="job-progress"
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="progress-range mt-2 w-full"
              style={{ ["--fill" as string]: `${progress}%` }}
            />
            <p className="mt-2 text-[13px] text-muted">
              Drag to set how far the job is. Closing it out happens in
              Complete.
            </p>
          </section>
        )}

        <WorkNotes job={job} />

        <section>
          <h3 className={SECTION_HEAD}>
            <Camera aria-hidden="true" className="h-4 w-4 text-gray-500" />
            Photos
          </h3>
          <div className="mt-3">
            <PhotoSlots job={job} />
          </div>
        </section>

        <Materials job={job} />
        <Labour job={job} />
      </div>

      <div className="flex gap-3 border-t border-hairline px-8 py-5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Close
        </button>
        {onSave && (
          <button
            type="button"
            onClick={() => onSave(progress)}
            className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Save Progress
          </button>
        )}
      </div>
    </Modal>
  );
}
