import Link from "next/link";
import { CalendarClock, CirclePlay, Package } from "lucide-react";

import { Card } from "@/components/ui/card";
import { weekSummary } from "@/lib/tech/dashboard-data";
import { jobLocation, type Job } from "@/lib/tech/jobs-data";
import { TECH_BASE } from "@/lib/tech/nav";

const RAIL_HEAD = "text-xs font-semibold tracking-wide text-gray-500 uppercase";

const SECONDARY_ACTION =
  "flex items-center gap-2.5 rounded-md border border-hairline px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/** Start the next job, then the two things a technician reaches for mid-shift. */
export function QuickActions({ nextJob }: { nextJob: Job | null }) {
  return (
    <Card className="p-5">
      <h2 className={RAIL_HEAD}>Quick Actions</h2>

      <div className="mt-4 space-y-2.5">
        <Link
          href={
            nextJob
              ? `${TECH_BASE}/my-work?job=${nextJob.id}`
              : `${TECH_BASE}/my-work`
          }
          className="flex items-center gap-2.5 rounded-md bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <CirclePlay aria-hidden="true" className="h-4 w-4" />
          Start Next Job
        </Link>

        <Link href={`${TECH_BASE}/availability`} className={SECONDARY_ACTION}>
          <CalendarClock aria-hidden="true" className="h-4 w-4 text-gray-500" />
          Update Availability
        </Link>

        <Link href={`${TECH_BASE}/materials`} className={SECONDARY_ACTION}>
          <Package aria-hidden="true" className="h-4 w-4 text-gray-500" />
          Request Material
        </Link>
      </div>
    </Card>
  );
}

/** What lands on the technician after today. */
export function UpcomingJobs({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="p-5">
      <h2 className={RAIL_HEAD}>Upcoming</h2>

      {jobs.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">Nothing scheduled yet.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`${TECH_BASE}/my-work?job=${job.id}`}
                className="block rounded-lg border border-hairline px-4 py-3 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="block text-[11px] font-medium text-gray-400">
                  Tomorrow
                </span>
                <span className="mt-1 block text-[13px] font-bold text-ink">
                  {job.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {jobLocation(job)}
                </span>
                <span className="mt-1 block text-[13px] text-gray-500">
                  {job.time}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

const WEEK_ROWS = [
  { label: "Total Jobs", value: weekSummary.totalJobs, className: "text-ink" },
  {
    label: "Completed",
    value: weekSummary.completed,
    className: "text-green-600",
  },
  {
    label: "In Progress",
    value: weekSummary.inProgress,
    className: "text-amber-600",
  },
  {
    label: "Hours Logged",
    value: weekSummary.hoursLogged,
    className: "text-ink",
  },
];

export function ThisWeek() {
  return (
    <Card className="p-5">
      <h2 className={RAIL_HEAD}>This Week</h2>

      <dl className="mt-4 space-y-3">
        {WEEK_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-[13px] text-muted">{row.label}</dt>
            <dd className={`text-[13px] font-bold ${row.className}`}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
