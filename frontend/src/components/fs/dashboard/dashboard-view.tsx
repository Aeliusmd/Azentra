"use client";

import {
  CircleCheck,
  ClipboardList,
  Hourglass,
  RefreshCw,
  Siren,
  UserRoundCheck,
} from "lucide-react";

import {
  QuickActions,
  SiteVisitsToday,
  TodaysSchedule,
} from "@/components/fs/dashboard/side-rail";
import {
  TechnicianStatus,
  TechnicianWorkload,
} from "@/components/fs/dashboard/technician-panels";
import { UrgentJobs } from "@/components/fs/dashboard/urgent-jobs";
import { FsPropertySelector } from "@/components/fs/ui/property-selector";
import { StatTile } from "@/components/pm/dashboard/tiles";
import { dashboardFor } from "@/lib/fs/dashboard-data";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { useFsSiteVisits } from "@/lib/fs/site-visits-store";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

export function FsDashboardView() {
  const orders = useFsWorkOrders();
  const visits = useFsSiteVisits();
  const propertyId = useSelectedFsProperty();

  const { summary, urgent, schedule, roster, scheduledVisitsToday } =
    dashboardFor(orders, visits, propertyId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Field Supervisor Dashboard
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Field operations at a glance
          </p>
        </div>

        <FsPropertySelector className="w-full sm:w-[220px]" />
      </div>

      <section>
        <h2 className="text-[13px] font-semibold text-muted">
          Today&rsquo;s Overview
        </h2>

        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <StatTile
            icon={ClipboardList}
            tone="gray"
            value={summary.total}
            label="Total Work Orders"
          />
          <StatTile
            icon={UserRoundCheck}
            tone="green"
            value={summary.assigned}
            label="Assigned Jobs"
          />
          <StatTile
            icon={RefreshCw}
            tone="navy"
            value={summary.inProgress}
            label="In Progress"
          />
          <StatTile
            icon={Hourglass}
            tone="amber"
            value={summary.pending}
            label="Pending"
          />
          <StatTile
            icon={Siren}
            tone="red"
            value={summary.emergency}
            label="Emergency"
          />
          <StatTile
            icon={CircleCheck}
            tone="green"
            value={summary.completed}
            label="Completed"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <TechnicianStatus roster={roster} />
          <UrgentJobs jobs={urgent} />
          <TechnicianWorkload roster={roster} />
        </div>

        <div className="space-y-5">
          <TodaysSchedule jobs={schedule} />
          <SiteVisitsToday scheduled={scheduledVisitsToday} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
