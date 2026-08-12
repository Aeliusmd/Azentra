import type { SiteVisit } from "@/lib/fs/site-visits-data";
import {
  activeJobCount,
  techniciansAt,
  type FsTechnician,
} from "@/lib/fs/technicians-data";
import {
  byProperty,
  byScheduledTime,
  byUrgency,
  isActive,
  isAssignedBucket,
  URGENT_PRIORITIES,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";

/**
 * Everything the supervisor dashboard shows, derived from the work-order store
 * so the counts follow whatever has been assigned or rescheduled.
 *
 * The day is a fixed string rather than `new Date()` so the page renders
 * identically on the server and the client.
 */

export const TODAY = "2026-08-12";
export const TODAY_LABEL = "Wednesday, August 12, 2026";

export type TechnicianLoad = {
  technician: FsTechnician;
  activeJobs: number;
};

export type FsDashboard = {
  summary: {
    /** Everything still open on this site. */
    total: number;
    /** Open jobs someone owns and that are not yet overdue. */
    assigned: number;
    inProgress: number;
    /** Open jobs still waiting for a technician. */
    pending: number;
    /** Open jobs at critical priority. */
    emergency: number;
    completed: number;
    overdue: number;
    awaitingInspection: number;
  };
  urgent: FsWorkOrder[];
  /** Jobs on today's clock, earliest first. */
  schedule: FsWorkOrder[];
  roster: TechnicianLoad[];
  visitsToday: SiteVisit[];
  scheduledVisitsToday: SiteVisit[];
};

export function dashboardFor(
  orders: FsWorkOrder[],
  siteVisits: SiteVisit[],
  propertyId: string,
): FsDashboard {
  const scoped = byProperty(orders, propertyId);
  const active = scoped.filter(isActive);
  const visits = siteVisits.filter(
    (visit) => visit.propertyId === propertyId && visit.date === TODAY,
  );

  return {
    summary: {
      total: active.length,
      assigned: active.filter(isAssignedBucket).length,
      inProgress: active.filter((order) => order.status === "In Progress")
        .length,
      pending: active.filter((order) => order.status === "Unassigned").length,
      emergency: active.filter((order) => order.priority === "Critical").length,
      completed: scoped.filter((order) => order.status === "Completed").length,
      overdue: active.filter((order) => order.status === "Overdue").length,
      awaitingInspection: active.filter(
        (order) => order.status === "Awaiting Inspection",
      ).length,
    },
    urgent: active
      .filter((order) => URGENT_PRIORITIES.includes(order.priority))
      .sort(byUrgency),
    schedule: active
      .filter((order) => order.scheduledDate === TODAY)
      .sort(byScheduledTime),
    roster: techniciansAt(propertyId).map((technician) => ({
      technician,
      activeJobs: activeJobCount(scoped, technician.name),
    })),
    visitsToday: visits,
    scheduledVisitsToday: visits.filter((visit) => visit.status === "Scheduled"),
  };
}
