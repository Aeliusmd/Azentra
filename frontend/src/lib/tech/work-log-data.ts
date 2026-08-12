import type { Job, JobLabour } from "@/lib/tech/jobs-data";

/**
 * The work log is a view over the labour recorded against the technician's own
 * jobs, so time logged on a job and time shown here can never disagree.
 */

export type LogEntry = JobLabour & {
  jobId: string;
  jobTitle: string;
};

/** Newest first — the technician checks what they just logged. */
const byRecent = (a: LogEntry, b: LogEntry) =>
  b.date.localeCompare(a.date) || b.start.localeCompare(a.start);

export function logEntriesFrom(jobs: Job[]): LogEntry[] {
  return jobs
    .flatMap((job) =>
      job.labour.map((entry) => ({
        ...entry,
        jobId: job.id,
        jobTitle: job.title,
      })),
    )
    .sort(byRecent);
}

/** "11.5h" — total logged across the given entries. */
export function hoursLabel(entries: LogEntry[]) {
  const minutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}
