"use client";

import {
  CircleAlert,
  CircleCheck,
  ClipboardList,
  LoaderCircle,
} from "lucide-react";

import {
  InProgressJobs,
  TodaysJobs,
  UrgentJobs,
} from "@/components/tech/dashboard/job-sections";
import {
  QuickActions,
  ThisWeek,
  UpcomingJobs,
} from "@/components/tech/dashboard/side-rail";
import { TechStatCard } from "@/components/tech/dashboard/stat-card";
import {
  GREETING,
  TODAY_LABEL,
  dashboardFrom,
} from "@/lib/tech/dashboard-data";
import { useTechJobs } from "@/lib/tech/jobs-store";
import { techFirstName, useTechProfile } from "@/lib/tech/profile-store";

export function TechDashboardView() {
  const profile = useTechProfile();
  const jobs = useTechJobs();

  const { today, tomorrow, urgent, inProgress, nextJob, summary } =
    dashboardFrom(jobs);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">
          {GREETING}, {techFirstName(profile.name)}
        </h1>
        <p className="mt-1 text-[13px] text-muted">{TODAY_LABEL}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechStatCard
          icon={ClipboardList}
          tone="slate"
          value={summary.assigned}
          label="Assigned Jobs"
        />
        <TechStatCard
          icon={LoaderCircle}
          tone="amber"
          value={summary.inProgress}
          label="In Progress"
        />
        <TechStatCard
          icon={CircleAlert}
          tone="red"
          value={summary.emergency}
          label="Emergency"
        />
        <TechStatCard
          icon={CircleCheck}
          tone="green"
          value={summary.completed}
          label="Completed"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <UrgentJobs jobs={urgent} />
          <TodaysJobs jobs={today} />
          <InProgressJobs jobs={inProgress} />
        </div>

        <div className="space-y-5">
          <QuickActions nextJob={nextJob} />
          <UpcomingJobs jobs={tomorrow.slice(0, 2)} />
          <ThisWeek />
        </div>
      </div>
    </div>
  );
}
