"use client";

import { useState } from "react";

import { PhotoSlots } from "@/components/tech/my-work/photo-upload";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  JOB_RESULTS,
  type Job,
  type JobCompletion,
  type JobResult,
} from "@/lib/tech/jobs-data";

export function CompleteJobModal({
  job,
  onClose,
  onConfirm,
}: {
  job: Job;
  onClose: () => void;
  onConfirm: (completion: JobCompletion) => void;
}) {
  const [workPerformed, setWorkPerformed] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<JobResult>(JOB_RESULTS[0]);

  return (
    <Modal
      open
      onClose={onClose}
      title="Complete Job"
      subtitle={`${job.id} - ${job.title}`}
      size="lg"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!workPerformed.trim()) return;
          onConfirm({
            workPerformed: workPerformed.trim(),
            rootCause: rootCause.trim(),
            notes: notes.trim(),
            result,
          });
        }}
      >
        <div className="max-h-[62vh] space-y-5 overflow-y-auto px-8 py-6">
          <div>
            <FieldLabel htmlFor="complete-work" required>
              Work Performed
            </FieldLabel>
            <textarea
              id="complete-work"
              rows={4}
              value={workPerformed}
              onChange={(event) => setWorkPerformed(event.target.value)}
              placeholder="Describe the work performed..."
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="complete-cause">Root Cause</FieldLabel>
            <input
              id="complete-cause"
              value={rootCause}
              onChange={(event) => setRootCause(event.target.value)}
              placeholder="What caused the issue?"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="complete-notes">Additional Notes</FieldLabel>
            <textarea
              id="complete-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Any additional notes..."
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold text-ink">
              Job Result
            </legend>
            <div className="space-y-2.5">
              {JOB_RESULTS.map((option) => (
                <div key={option} className="flex items-center gap-2.5">
                  <input
                    id={`result-${option}`}
                    type="radio"
                    name="job-result"
                    value={option}
                    checked={result === option}
                    onChange={() => setResult(option)}
                    className="h-4 w-4 accent-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                  />
                  <label
                    htmlFor={`result-${option}`}
                    className="text-[15px] text-ink select-none"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Photos</p>
            <PhotoSlots job={job} />
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
            disabled={!workPerformed.trim()}
            className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Submit Completion
          </button>
        </div>
      </form>
    </Modal>
  );
}
