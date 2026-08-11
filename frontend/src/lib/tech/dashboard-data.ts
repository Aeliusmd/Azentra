import type { Job } from "@/lib/tech/jobs-data";

/**
 * Everything the technician dashboard shows, derived from the technician's own
 * jobs so the counts follow whatever the store currently holds.
 *
 * The day is a fixed string rather than `new Date()` so the page renders
 * identically on the server and the client.
 */

export const TODAY = "2026-08-11";
export const TODAY_LABEL = "Tuesday, August 11, 2026";
export const TOMORROW = "2026-08-12";

/** Fixed rather than clock-derived, for the same hydration reason. */
export const GREETING = "Good Morning";

/** Earliest first — the technician works down the list. */
function byTime(a: Job, b: Job) {
  const minutes = (time: string) => {
    const [clock, meridiem] = time.split(" ");
    const [hours, mins] = clock.split(":").map(Number);
    return ((hours % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + mins;
  };
  return minutes(a.time) - minutes(b.time);
}

const on = (jobs: Job[], date: string) =>
  jobs.filter((job) => job.date === date).sort(byTime);

export function dashboardFrom(jobs: Job[]) {
  const today = on(jobs, TODAY);
  const tomorrow = on(jobs, TOMORROW);

  const urgent = today.filter(
    (job) => job.priority === "Emergency" && job.status !== "Completed",
  );
  const inProgress = today.filter((job) => job.status === "In Progress");

  return {
    today,
    tomorrow,
    urgent,
    inProgress,
    /** The next job to pick up — earliest one not yet started. */
    nextJob:
      today.find(
        (job) => job.status === "Assigned" || job.status === "Accepted",
      ) ?? null,
    summary: {
      /** Waiting on the technician to start — assigned plus already accepted. */
      assigned: today.filter(
        (job) => job.status === "Assigned" || job.status === "Accepted",
      ).length,
      inProgress: inProgress.length,
      emergency: urgent.length,
      completed: today.filter((job) => job.status === "Completed").length,
    },
  };
}

export const weekSummary = {
  totalJobs: 8,
  completed: 2,
  inProgress: 2,
  hoursLogged: "18.5h",
};
