import type { Metadata } from "next";
import { Building2, House, UserRoundCheck } from "lucide-react";

import { OccupancyCard } from "@/components/dashboard/occupancy-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TowerStatus } from "@/components/dashboard/tower-status";
import { property, recentActivity, towers } from "@/lib/dashboard-data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>
        <p className="mt-1 text-[13px] text-muted">
          Overview of {property.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Units"
          value={property.totalUnits}
          icon={House}
          tone="navy"
          href="/admin/buildings/towers"
        />
        <StatCard
          label="Occupied"
          value={property.occupied}
          icon={UserRoundCheck}
          tone="green"
          href="/admin/buildings/units"
        />
        <StatCard
          label="Vacant"
          value={property.vacant}
          icon={House}
          tone="slate"
          href="/admin/buildings/units"
        />
        <StatCard
          label="Common Areas"
          value={property.commonAreas}
          icon={Building2}
          tone="amber"
          href="/admin/common-areas"
        />
      </div>

      <OccupancyCard
        totalUnits={property.totalUnits}
        occupied={property.occupied}
        vacant={property.vacant}
        maintenance={property.maintenance}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={recentActivity} />
        </div>
        <QuickActions />
      </div>

      <TowerStatus towers={towers} />
    </div>
  );
}
