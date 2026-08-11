"use client";

import { CalendarDays, Clock, UserRound } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  JOB_PRIORITY_TONE,
  JOB_STATUS_TONE,
  jobLocation,
  type Job,
} from "@/lib/tech/jobs-data";

export type JobAction =
  "accept" | "decline" | "start" | "progress" | "complete" | "details";

const BUTTON =
  "w-full rounded-md px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-[150px]";

const VARIANT = {
  primary: `${BUTTON} bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand/40`,
  success: `${BUTTON} bg-[#5cb87f] text-white hover:bg-brand focus-visible:ring-brand/40`,
  purple: `${BUTTON} bg-[#7f56d9] text-white hover:bg-[#6c46c0] focus-visible:ring-purple-300`,
  outline: `${BUTTON} border border-hairline bg-white text-ink hover:bg-gray-50 focus-visible:ring-brand/30 focus-visible:ring-offset-0`,
} as const;

type ActionSpec = {
  label: string;
  action: JobAction;
  variant: keyof typeof VARIANT;
};

/** Which buttons a job offers depends on where it is in its lifecycle. */
function actionsFor(job: Job): ActionSpec[] {
  switch (job.status) {
    case "Assigned":
      return [
        { label: "View & Accept", action: "accept", variant: "primary" },
        { label: "Unable to Accept", action: "decline", variant: "outline" },
      ];
    case "Accepted":
      return [
        { label: "Start Job", action: "start", variant: "primary" },
        { label: "Details", action: "details", variant: "outline" },
      ];
    case "In Progress":
      return [
        { label: "Update Progress", action: "progress", variant: "primary" },
        { label: "Complete", action: "complete", variant: "success" },
        { label: "Details", action: "details", variant: "outline" },
      ];
    case "Waiting Material":
      return [{ label: "Check Status", action: "progress", variant: "purple" }];
    case "On Hold":
      return [{ label: "Details", action: "details", variant: "outline" }];
    case "Completed":
      return [{ label: "View Details", action: "details", variant: "outline" }];
  }
}

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] whitespace-nowrap text-muted">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
      {children}
    </span>
  );
}

export function JobCard({
  job,
  onAction,
}: {
  job: Job;
  onAction: (action: JobAction, job: Job) => void;
}) {
  const showProgress = job.progress > 0 && job.status !== "Completed";

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[13px] text-gray-500">
              {job.id}
            </span>
            <Pill tone={JOB_PRIORITY_TONE[job.priority]}>{job.priority}</Pill>
            <Pill tone={JOB_STATUS_TONE[job.status]}>{job.status}</Pill>
          </div>

          <h3 className="mt-2 text-[15px] font-bold text-ink">{job.title}</h3>
          <p className="mt-0.5 text-[13px] text-muted">{jobLocation(job)}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Meta icon={CalendarDays}>{job.date}</Meta>
            <Meta icon={Clock}>{job.time}</Meta>
            <Meta icon={UserRound}>
              {job.requester} ({job.requesterRole})
            </Meta>

            {showProgress && (
              <span className="flex items-center gap-2">
                <span
                  role="img"
                  aria-label={`${job.progress}% complete`}
                  className="block h-1.5 w-[60px] overflow-hidden rounded-full bg-gray-200"
                >
                  <span
                    className="block h-full rounded-full bg-[#e8a33d]"
                    style={{ width: `${job.progress}%` }}
                  />
                </span>
                <span className="text-[13px] font-semibold text-amber-600">
                  {job.progress}%
                </span>
              </span>
            )}
          </div>

          {job.declineReason && (
            <p className="mt-2.5 text-[13px] text-rose-600">
              Sent back to supervisor: {job.declineReason}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {actionsFor(job).map((spec) => (
            <button
              key={spec.action}
              type="button"
              onClick={() => onAction(spec.action, job)}
              className={VARIANT[spec.variant]}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
