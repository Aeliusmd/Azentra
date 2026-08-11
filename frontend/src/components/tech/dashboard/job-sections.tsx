import Link from "next/link";
import {
  CircleAlert,
  Clock,
  Droplet,
  Hammer,
  LoaderCircle,
  Package,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  JOB_PRIORITY_DOT,
  JOB_STATUS_TONE,
  jobLocation,
  type Job,
} from "@/lib/tech/jobs-data";
import { TECH_BASE } from "@/lib/tech/nav";

/** Trade icon, so a job reads as plumbing or electrical before the text does. */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  Plumbing: Droplet,
  HVAC: Wind,
  Electrical: Zap,
  Carpentry: Hammer,
  Equipment: Package,
};

const iconFor = (category: string) => CATEGORY_ICON[category] ?? Wrench;

/** Opens the job on the My Work page. */
const jobHref = (job: Job) => `${TECH_BASE}/my-work?job=${job.id}`;

/** Small uppercase card heading with a leading icon. */
function SectionHead({
  icon: Icon,
  title,
  tone = "default",
}: {
  icon: LucideIcon;
  title: string;
  tone?: "default" | "urgent";
}) {
  const urgent = tone === "urgent";

  return (
    <div
      className={`flex items-center gap-2 border-b px-5 py-3.5 ${
        urgent ? "border-rose-200 bg-rose-50/70" : "border-hairline"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 ${urgent ? "text-rose-600" : "text-gray-400"}`}
      />
      <h2
        className={`text-xs font-semibold tracking-wide uppercase ${
          urgent ? "text-rose-600" : "text-gray-500"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/* --------------------------------- Urgent --------------------------------- */

export function UrgentJobs({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-rose-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <SectionHead icon={CircleAlert} title="Urgent Jobs" tone="urgent" />

      <ul className="space-y-3 p-4">
        {jobs.map((job) => {
          const Icon = iconFor(job.category);

          return (
            <li
              key={job.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-rose-100 bg-rose-50/40 px-4 py-3.5"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600"
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-ink">{job.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">
                  {jobLocation(job)}
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-rose-600">
                  Priority: {job.priority}
                </p>
              </div>

              <Link
                href={jobHref(job)}
                className="rounded-md bg-[#e0554d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#c9473f] focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                View Job
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* --------------------------------- Today ---------------------------------- */

export function TodaysJobs({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="overflow-hidden">
      <SectionHead icon={Clock} title="Today's Jobs" />

      {jobs.length === 0 ? (
        <p className="px-5 py-10 text-center text-[15px] text-muted">
          No jobs scheduled for today.
        </p>
      ) : (
        <ul className="divide-y divide-hairline">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={jobHref(job)}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none focus-visible:-outline-offset-2"
              >
                <span className="w-12 shrink-0 text-[13px] leading-tight font-bold text-ink">
                  {job.time.split(" ").map((part) => (
                    <span key={part} className="block">
                      {part}
                    </span>
                  ))}
                </span>

                <span className="min-w-0 flex-1 border-l border-hairline pl-4">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-bold text-ink">
                      {job.title}
                    </span>
                    <Pill tone={JOB_STATUS_TONE[job.status]}>{job.status}</Pill>
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {jobLocation(job)}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${JOB_PRIORITY_DOT[job.priority]}`}
                />
                <span className="sr-only">{job.priority} priority</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ------------------------------- In progress ------------------------------ */

export function InProgressJobs({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="overflow-hidden">
      <SectionHead icon={LoaderCircle} title="In Progress" />

      {jobs.length === 0 ? (
        <p className="px-5 py-10 text-center text-[15px] text-muted">
          Nothing in progress right now.
        </p>
      ) : (
        <ul className="space-y-3 p-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-lg border border-hairline px-4 py-3.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-ink">{job.title}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {jobLocation(job)}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-amber-600">
                  {job.progress}%
                </span>
              </div>

              <span
                role="img"
                aria-label={`${job.progress}% complete`}
                className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
              >
                <span
                  className="block h-full rounded-full bg-[#e8a33d] transition-[width]"
                  style={{ width: `${job.progress}%` }}
                />
              </span>

              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <Link
                  href={jobHref(job)}
                  className="rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Continue
                </Link>
                <Link
                  href={jobHref(job)}
                  className="rounded-md border border-hairline px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  Update Supervisor
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
