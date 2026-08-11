"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { CompleteJobModal } from "@/components/tech/my-work/complete-job-modal";
import {
  DeclineJobModal,
  EscalateJobModal,
  JobDetailsModal,
  type DetailAction,
} from "@/components/tech/my-work/job-action-modals";
import { WorkLogModal } from "@/components/tech/my-work/update-progress-modal";
import { JobCard, type JobAction } from "@/components/tech/my-work/job-card";
import { SegmentedFilter } from "@/components/tech/ui/segmented-filter";
import { Card } from "@/components/ui/card";
import type { Job, JobStatus } from "@/lib/tech/jobs-data";
import {
  acceptJob,
  completeJob,
  declineJob,
  escalateJob,
  pauseJob,
  resumeJob,
  setJobProgress,
  startJob,
  useTechJobs,
} from "@/lib/tech/jobs-store";
import { showToast } from "@/lib/tech/toast-store";

const FILTERS = [
  "All",
  "New",
  "Accepted",
  "In Progress",
  "Waiting",
  "Completed",
] as const;
type Filter = (typeof FILTERS)[number];

/** Filter chips read in technician language; these are the statuses behind them. */
const FILTER_STATUSES: Record<Exclude<Filter, "All">, JobStatus[]> = {
  New: ["Assigned"],
  Accepted: ["Accepted"],
  "In Progress": ["In Progress"],
  Waiting: ["Waiting Material", "On Hold"],
  Completed: ["Completed"],
};

/** Newest work first; the id carries the order jobs were raised in. */
const byNewest = (a: Job, b: Job) => b.id.localeCompare(a.id);

type Dialog = "details" | "progress" | "complete" | "decline" | "escalate";

export function MyWorkView() {
  const jobs = useTechJobs();
  // `?job=MT-1045` — how the dashboard hands a specific job over.
  const requestedId = useSearchParams().get("job");

  const [filter, setFilter] = useState<Filter>("All");
  const [dialog, setDialog] = useState<Dialog | null>(
    requestedId ? "details" : null,
  );
  const [activeId, setActiveId] = useState<string | null>(requestedId);

  const visible = useMemo(() => {
    const list =
      filter === "All"
        ? jobs
        : jobs.filter((job) => FILTER_STATUSES[filter].includes(job.status));
    return [...list].sort(byNewest);
  }, [jobs, filter]);

  const active = jobs.find((job) => job.id === activeId) ?? null;

  function close() {
    setDialog(null);
    setActiveId(null);
  }

  function handleAction(action: JobAction, job: Job) {
    // Starting is a one-tap action; everything else opens a dialog.
    if (action === "start") {
      startJob(job.id);
      showToast("Work started");
      return;
    }

    setActiveId(job.id);
    // "View & Accept" opens the job first — accepting happens in the dialog.
    setDialog(action === "accept" ? "details" : action);
  }

  /** Footer actions inside the details dialog. */
  function handleDetailAction(action: DetailAction, job: Job) {
    switch (action) {
      case "accept":
        acceptJob(job.id);
        showToast("Job accepted");
        close();
        break;
      case "start":
        startJob(job.id);
        showToast("Work started");
        close();
        break;
      case "resume":
        resumeJob(job.id);
        showToast("Work resumed");
        close();
        break;
      case "pause":
        pauseJob(job.id);
        showToast("Job paused");
        close();
        break;
      case "escalate":
        setDialog("escalate");
        break;
      case "reject":
        setDialog("decline");
        break;
      case "progress":
        setDialog("progress");
        break;
      case "complete":
        setDialog("complete");
        break;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Work</h1>
          <p className="mt-1 text-[13px] text-muted">Jobs assigned to you</p>
        </div>

        <SegmentedFilter
          label="Filter jobs by status"
          options={FILTERS}
          value={filter}
          onChange={(value) => setFilter(value as Filter)}
        />
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <ClipboardList
            aria-hidden="true"
            className="mx-auto h-8 w-8 text-gray-300"
          />
          <p className="mt-3 text-[15px] font-semibold text-ink">
            No jobs in this list
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Nothing assigned to you with that status right now.
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {visible.map((job) => (
            <li key={job.id}>
              <JobCard job={job} onAction={handleAction} />
            </li>
          ))}
        </ul>
      )}

      {active && dialog === "details" && (
        <JobDetailsModal
          job={active}
          onClose={close}
          onAction={(action) => handleDetailAction(action, active)}
        />
      )}

      {active && dialog === "decline" && (
        <DeclineJobModal
          job={active}
          onClose={close}
          onConfirm={(reason) => {
            declineJob(active.id, reason);
            showToast("Rejection sent to supervisor");
            close();
          }}
        />
      )}

      {active && dialog === "escalate" && (
        <EscalateJobModal
          job={active}
          onClose={close}
          onConfirm={(note) => {
            escalateJob(active.id, note);
            showToast("Escalated to supervisor");
            close();
          }}
        />
      )}

      {active && dialog === "progress" && (
        <WorkLogModal
          job={active}
          onClose={close}
          // A parked job opens the same log read-only apart from its entries.
          onSave={
            active.status === "In Progress"
              ? (progress) => {
                  setJobProgress(active.id, progress);
                  showToast("Progress updated");
                  close();
                }
              : undefined
          }
        />
      )}

      {active && dialog === "complete" && (
        <CompleteJobModal
          job={active}
          onClose={close}
          onConfirm={(completion) => {
            completeJob(active.id, completion);
            showToast("Job marked complete");
            close();
          }}
        />
      )}
    </div>
  );
}
