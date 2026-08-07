import type { Metadata } from "next";
import { Building, ChartPie, House, Layers } from "lucide-react";

import { FeatureCard } from "@/components/buildings/feature-card";
import { MiniStat } from "@/components/buildings/mini-stat";
import { buildingSummary } from "@/lib/buildings-data";

export const metadata: Metadata = {
  title: "Building Management",
};

export default function BuildingsPage() {
  const { towers, floors, units, occupancyRate } = buildingSummary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Building Management</h1>
        <p className="mt-1 text-[13px] text-muted">
          Manage towers, floors, and units across your property
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <FeatureCard
          title="Tower Management"
          description="Manage residential towers & buildings"
          value={`${towers} Towers`}
          caption="Active Properties"
          icon={Building}
          href="/admin/buildings/towers"
          gradient="from-[#f3a751] to-[#e2553d]"
        />
        <FeatureCard
          title="Floor Management"
          description="Manage floors across all towers"
          value={`${floors} Floors`}
          caption="Total Floors"
          icon={Layers}
          href="/admin/buildings/floors"
          gradient="from-[#38b5a6] to-[#5ec177]"
        />
        <FeatureCard
          title="Unit Management"
          description="Manage individual residential units"
          value={`${units} Units`}
          caption="Total Units"
          icon={House}
          href="/admin/buildings/units"
          gradient="from-[#9a58ef] to-[#cf42d6]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat
          label="Total Towers"
          value={String(towers)}
          icon={Building}
          tone="amber"
        />
        <MiniStat
          label="Total Floors"
          value={String(floors)}
          icon={Layers}
          tone="green"
        />
        <MiniStat
          label="Total Units"
          value={String(units)}
          icon={House}
          tone="purple"
        />
        <MiniStat
          label="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={ChartPie}
          tone="teal"
        />
      </div>
    </div>
  );
}
