"use client";

import {
  CalendarDays,
  CheckCheck,
  CircleAlert,
  ClipboardList,
  Hourglass,
  House,
  UserRoundCheck,
  UserRoundPlus,
  Wrench,
} from "lucide-react";

import { ActivityTimeline } from "@/components/pm/dashboard/activity-timeline";
import {
  PmQuickActions,
  TodaysSchedule,
  UpcomingEvents,
} from "@/components/pm/dashboard/side-rail";
import { HighlightCard, StatTile } from "@/components/pm/dashboard/tiles";
import { PropertySelector } from "@/components/pm/property-selector";
import { dashboardFor } from "@/lib/pm/dashboard-data";
import { useSelectedPropertyId } from "@/lib/pm/properties";

export function PmDashboardView() {
  const propertyId = useSelectedPropertyId();
  const { summary, highlights, timeline, schedule, upcoming } =
    dashboardFor(propertyId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Property Manager Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            Operational overview of your property
          </p>
        </div>
        <PropertySelector className="w-full sm:w-[240px]" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatTile
          icon={House}
          tone="gray"
          value={summary.totalUnits}
          label="Total Units"
        />
        <StatTile
          icon={UserRoundCheck}
          tone="green"
          value={summary.occupied}
          label="Occupied"
        />
        <StatTile
          icon={House}
          tone="slate"
          value={summary.vacant}
          label="Vacant"
        />
        <StatTile
          icon={Wrench}
          tone="amber"
          value={summary.inMaintenance}
          label="In Maint."
        />
        <StatTile
          icon={ClipboardList}
          tone="navy"
          value={summary.workOrders}
          label="Work Orders"
        />
        <StatTile
          icon={CalendarDays}
          tone="cyan"
          value={summary.bookings}
          label="Bookings"
        />
        <StatTile
          icon={CircleAlert}
          tone="red"
          value={summary.issues}
          label="Issues"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HighlightCard
          icon={Hourglass}
          tone="amber"
          label="Pending Requests"
          value={highlights.pendingRequests}
        />
        <HighlightCard
          icon={CircleAlert}
          tone="red"
          label="Urgent Requests"
          value={highlights.urgentRequests}
        />
        <HighlightCard
          icon={UserRoundPlus}
          tone="green"
          label="Assigned Jobs"
          value={highlights.assignedJobs}
        />
        <HighlightCard
          icon={CheckCheck}
          tone="blue"
          label="Completed Jobs"
          value={highlights.completedJobs}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityTimeline items={timeline} />
        </div>

        <div className="space-y-5">
          <TodaysSchedule items={schedule} />
          <UpcomingEvents items={upcoming} />
          <PmQuickActions />
        </div>
      </div>
    </div>
  );
}
