"use client";

import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  MapPin,
  NotebookPen,
  Package,
  TriangleAlert,
  UserCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  JOB_PRIORITY_TONE,
  JOB_STATUS_TONE,
  REJECT_REASONS,
  durationLabel,
  formatClock,
  jobLocationPath,
  type Job,
} from "@/lib/tech/jobs-data";

const PRIMARY =
  "rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400";

const SECONDARY =
  "rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

const WARN_OUTLINE =
  "rounded-lg border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:outline-none";

const DANGER_OUTLINE =
  "rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:outline-none";

const DANGER =
  "rounded-lg bg-[#e0554d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9473f] focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400";

/* ------------------------------ Job details ------------------------------- */

/** Icon-led section: small uppercase caption with its value beneath. */
function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="mt-1.5 pl-[22px] text-[15px] text-ink">{children}</div>
    </div>
  );
}

export type DetailAction =
  | "accept"
  | "reject"
  | "start"
  | "progress"
  | "complete"
  | "pause"
  | "escalate"
  | "resume";

type FooterButton = {
  label: string;
  action: DetailAction;
  className: string;
  /** The lead action takes the extra width. */
  lead?: boolean;
};

function footerFor(job: Job): FooterButton[] {
  switch (job.status) {
    case "Assigned":
      return [
        {
          label: "Accept Job",
          action: "accept",
          className: PRIMARY,
          lead: true,
        },
        { label: "Reject", action: "reject", className: SECONDARY },
      ];
    case "Accepted":
      return [
        { label: "Start Job", action: "start", className: PRIMARY, lead: true },
        { label: "Reject", action: "reject", className: SECONDARY },
      ];
    case "In Progress":
      return [
        {
          label: "Update Progress",
          action: "progress",
          className: PRIMARY,
          lead: true,
        },
        { label: "Pause", action: "pause", className: WARN_OUTLINE },
        { label: "Escalate", action: "escalate", className: DANGER_OUTLINE },
      ];
    case "Waiting Material":
      return [
        {
          label: "Resume Work",
          action: "resume",
          className: PRIMARY,
          lead: true,
        },
      ];
    case "On Hold":
      // A job sent back to the supervisor is theirs to move, not the technician's.
      return job.declineReason
        ? []
        : [
            {
              label: "Resume Work",
              action: "resume",
              className: PRIMARY,
              lead: true,
            },
          ];
    default:
      return [];
  }
}

export function JobDetailsModal({
  job,
  onClose,
  onAction,
}: {
  job: Job;
  onClose: () => void;
  onAction: (action: DetailAction) => void;
}) {
  const buttons = footerFor(job);

  return (
    <Modal
      open
      onClose={onClose}
      title={`Maintenance ${job.id}`}
      subtitle={job.title}
    >
      <div className="max-h-[58vh] space-y-5 overflow-y-auto px-8 py-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone={JOB_PRIORITY_TONE[job.priority]}>{job.priority}</Pill>
          <Pill tone={JOB_STATUS_TONE[job.status]}>{job.status}</Pill>
          <Pill>{job.category}</Pill>
        </div>

        <Section icon={MapPin} label="Location">
          {jobLocationPath(job)}
        </Section>

        <Section icon={UserRound} label="Requested by">
          {job.requester} ({job.requesterRole})
        </Section>

        <Section icon={FileText} label="Issue">
          <p className="text-gray-600">{job.description}</p>
        </Section>

        {job.instructions && (
          <Section icon={ClipboardList} label="Instructions">
            <p className="text-gray-600">{job.instructions}</p>
          </Section>
        )}

        <Section icon={UserCheck} label="Assigned by">
          {job.assignedBy}
        </Section>

        <Section icon={CalendarDays} label="Schedule">
          {job.date} at {job.time}
        </Section>

        {job.status === "Waiting Material" && (
          <div className="flex items-start gap-2.5 rounded-lg border border-purple-200 bg-purple-50/60 px-4 py-3.5 text-[15px] text-ink">
            <Package
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-purple-500"
            />
            Work is paused until the ordered material arrives.
          </div>
        )}

        {job.completion && (
          <div className="rounded-lg border border-green-200 bg-green-50/60 px-4 py-3.5">
            <p className="text-[11px] font-semibold tracking-wide text-green-700 uppercase">
              Completion — {job.completion.result}
            </p>
            <p className="mt-1 text-[15px] text-ink">
              {job.completion.workPerformed}
            </p>
            {job.completion.rootCause && (
              <p className="mt-1.5 text-[13px] text-muted">
                Root cause: {job.completion.rootCause}
              </p>
            )}
            {job.completion.notes && (
              <p className="mt-1 text-[13px] text-muted">
                {job.completion.notes}
              </p>
            )}
          </div>
        )}

        {job.escalation && (
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3.5">
            <TriangleAlert
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
            />
            <span>
              <span className="block text-[11px] font-semibold tracking-wide text-amber-600 uppercase">
                Escalated to supervisor
              </span>
              <span className="mt-1 block text-[15px] text-ink">
                {job.escalation}
              </span>
            </span>
          </div>
        )}

        {job.declineReason && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/60 px-4 py-3.5">
            <p className="text-[11px] font-semibold tracking-wide text-rose-500 uppercase">
              Sent back to supervisor
            </p>
            <p className="mt-1 text-[15px] text-ink">{job.declineReason}</p>
          </div>
        )}

        {job.progress > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                Progress
              </p>
              <span className="text-[13px] font-semibold text-amber-600">
                {job.progress}%
              </span>
            </div>
            <span
              role="img"
              aria-label={`${job.progress}% complete`}
              className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
            >
              <span
                className="block h-full rounded-full bg-[#e8a33d]"
                style={{ width: `${job.progress}%` }}
              />
            </span>
          </div>
        )}

        <Section icon={Clock} label="Timeline">
          <ol className="space-y-3">
            {job.timeline.map((event) => (
              <li key={event.time} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2e6cad]"
                />
                <span className="min-w-0">
                  <span className="block text-[13px] text-gray-400">
                    {event.time}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-ink">
                    {event.label}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {job.notes.length > 0 && (
          <Section icon={NotebookPen} label="Work Notes">
            <ul className="space-y-3">
              {job.notes.map((note) => (
                <li key={note.id}>
                  <p className="text-[13px] text-gray-400">
                    {formatClock(note.time)}
                  </p>
                  <p className="mt-0.5 text-[15px] text-ink">{note.text}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.materials.length > 0 && (
          <Section icon={Package} label="Materials">
            <ul className="space-y-3">
              {job.materials.map((material) => (
                <li key={material.id} className="flex items-baseline gap-4">
                  <span className="min-w-0 flex-1 text-ink">
                    {material.name}
                  </span>
                  <span className="shrink-0 text-gray-500">
                    {material.quantity} {material.unit}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.labour.length > 0 && (
          <Section icon={Clock} label="Labour">
            <ul className="space-y-3">
              {job.labour.map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-4">
                  <span className="min-w-0 flex-1 text-ink">
                    {formatClock(entry.start)} - {formatClock(entry.end)}
                  </span>
                  <span className="shrink-0 text-gray-500">
                    {durationLabel(entry.minutes)}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="flex gap-3 border-t border-hairline px-8 py-5">
        {buttons.length === 0 ? (
          <button
            type="button"
            onClick={onClose}
            className={`${SECONDARY} ml-auto`}
          >
            Close
          </button>
        ) : (
          buttons.map((button) => (
            <button
              key={button.action}
              type="button"
              onClick={() => onAction(button.action)}
              className={`${button.lead ? "flex-[2]" : "flex-1"} ${button.className}`}
            >
              {button.label}
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}

/* --------------------------------- Reject --------------------------------- */

export function DeclineJobModal({
  job,
  onClose,
  onConfirm,
}: {
  job: Job;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState<string>(REJECT_REASONS[0]);
  const [comment, setComment] = useState("");

  return (
    <Modal
      open
      onClose={onClose}
      title="Unable to Accept"
      subtitle={`${job.id} · ${job.title}`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const note = comment.trim();
          onConfirm(note ? `${reason} — ${note}` : reason);
        }}
      >
        <div className="space-y-5 px-8 py-7">
          <SelectField
            id="reject-reason"
            label="Reason"
            value={reason}
            onChange={setReason}
            options={REJECT_REASONS}
          />

          <div>
            <FieldLabel htmlFor="reject-comment">Comment</FieldLabel>
            <textarea
              id="reject-comment"
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add notes for supervisor..."
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>

          <p className="text-[13px] text-muted">
            The job goes back to your supervisor and stays On Hold on your list
            until they reassign it.
          </p>
        </div>

        <div className="flex gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 ${SECONDARY}`}
          >
            Cancel
          </button>
          <button type="submit" className={`flex-1 ${DANGER}`}>
            Submit Rejection
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------- Escalate -------------------------------- */

/** Flags the job for the supervisor without handing it over. */
export function EscalateJobModal({
  job,
  onClose,
  onConfirm,
}: {
  job: Job;
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");

  return (
    <Modal
      open
      onClose={onClose}
      title="Escalate Job"
      subtitle={`${job.id} - ${job.title}`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (note.trim()) onConfirm(note.trim());
        }}
      >
        <div className="space-y-4 px-8 py-7">
          <p className="text-[15px] text-gray-600">
            Your supervisor is notified and the job stays with you.
          </p>

          <div>
            <FieldLabel htmlFor="escalate-note" required>
              What needs attention?
            </FieldLabel>
            <textarea
              id="escalate-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Bigger job than scoped, needs a specialist, access blocked..."
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 ${SECONDARY}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!note.trim()}
            className={`flex-1 ${DANGER}`}
          >
            Escalate
          </button>
        </div>
      </form>
    </Modal>
  );
}
