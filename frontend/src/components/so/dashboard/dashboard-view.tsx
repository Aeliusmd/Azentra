"use client";

import { SoCurrentShift } from "@/components/so/dashboard/current-shift";
import { SoEmergencyAlerts } from "@/components/so/dashboard/emergency-alerts";
import { SoParkingOverview } from "@/components/so/dashboard/parking-overview";
import { SoQuickActions } from "@/components/so/dashboard/quick-actions";
import { SoStatTiles } from "@/components/so/dashboard/stat-tiles";
import { SoVisitorActivity } from "@/components/so/dashboard/visitor-activity";
import { SoPropertySelector } from "@/components/so/ui/property-selector";
import { alertsAt, dashboardStats } from "@/lib/so/dashboard-data";
import { useSoIncidents } from "@/lib/so/incidents-store";
import { slotsAt } from "@/lib/so/parking-data";
import { useSoParkingSlots } from "@/lib/so/parking-store";
import { useSelectedSoProperty } from "@/lib/so/properties";
import { visitsAt } from "@/lib/so/visitors-data";
import { useSoVisits } from "@/lib/so/visitors-store";

/**
 * The gate, as it stands right now.
 *
 * Everything below reads from the same day's records, scoped to whichever
 * property the header is showing — so the tiles, the movement columns and the
 * bay map can never disagree with each other.
 */
export function SoDashboardView() {
  const propertyId = useSelectedSoProperty();
  const allVisits = useSoVisits();
  const allSlots = useSoParkingSlots();
  const allIncidents = useSoIncidents();

  const visits = visitsAt(propertyId, allVisits);
  const slots = slotsAt(propertyId, allSlots);
  const alerts = alertsAt(propertyId);
  const stats = dashboardStats(propertyId, allVisits, allSlots, allIncidents);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[26px]">
            Security Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Real-time security overview
          </p>
        </div>

        <SoPropertySelector className="w-full sm:w-[260px]" />
      </div>

      <SoStatTiles stats={stats} />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <SoVisitorActivity visits={visits} />
          <SoParkingOverview slots={slots} />
        </div>

        <div className="space-y-5">
          <SoQuickActions />
          <SoEmergencyAlerts alerts={alerts} />
          <SoCurrentShift />
        </div>
      </div>
    </div>
  );
}
