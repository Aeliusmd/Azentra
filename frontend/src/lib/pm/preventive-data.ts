import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Mock preventive maintenance plans. Swap for a `src/lib/api.ts` call when the
 * backend lands.
 */

export const FREQUENCIES = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export const FREQUENCY_TONE: Record<Frequency, PillTone> = {
  Weekly: "navy",
  "Bi-weekly": "green",
  Monthly: "amber",
  Quarterly: "purple",
  Yearly: "orange",
};

export const PLAN_STATUSES = ["Scheduled", "Overdue"] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const PLAN_STATUS_TONE: Record<PlanStatus, PillTone> = {
  Scheduled: "green",
  Overdue: "red",
};

/** Assets a plan can be attached to. */
export const PLAN_ASSETS = [
  "Elevator - Tower A",
  "Elevator - Tower B",
  "Generator - 500kVA",
  "Swimming Pool Pump",
  "Gym Treadmill x4",
  "CCTV DVR System",
  "Fire Alarm Panel",
  "Water Treatment Plant",
  "Gym AC Unit",
  "Tennis Court Floodlights",
] as const;

/** Placeholder entry for the asset dropdown. */
export const NO_ASSET = "Select asset";

export type PreventivePlan = {
  id: string;
  asset: string;
  status: PlanStatus;
  frequency: Frequency;
  assignedTo: string;
  /** Renders the green "(Vendor)" suffix after the assignee. */
  isVendor: boolean;
  lastService: string;
  nextService: string;
};

export const preventivePlans: PreventivePlan[] = [
  {
    id: "PP-001",
    asset: "Elevator - Tower A",
    status: "Scheduled",
    frequency: "Monthly",
    assignedTo: "ElevatorPro Services",
    isVendor: true,
    lastService: "2026-07-15",
    nextService: "2026-08-15",
  },
  {
    id: "PP-002",
    asset: "Elevator - Tower B",
    status: "Scheduled",
    frequency: "Monthly",
    assignedTo: "ElevatorPro Services",
    isVendor: true,
    lastService: "2026-07-20",
    nextService: "2026-08-20",
  },
  {
    id: "PP-003",
    asset: "Generator - Main",
    status: "Scheduled",
    frequency: "Bi-weekly",
    assignedTo: "Ravi Patel",
    isVendor: false,
    lastService: "2026-08-01",
    nextService: "2026-08-15",
  },
  {
    id: "PP-004",
    asset: "Swimming Pool",
    status: "Scheduled",
    frequency: "Weekly",
    assignedTo: "AquaClean Services",
    isVendor: true,
    lastService: "2026-08-04",
    nextService: "2026-08-11",
  },
  {
    id: "PP-005",
    asset: "Gym HVAC",
    status: "Overdue",
    frequency: "Quarterly",
    assignedTo: "David Kim",
    isVendor: false,
    lastService: "2026-05-10",
    nextService: "2026-08-10",
  },
  {
    id: "PP-006",
    asset: "Fire Systems",
    status: "Scheduled",
    frequency: "Monthly",
    assignedTo: "FireSafe Inc",
    isVendor: true,
    lastService: "2026-07-25",
    nextService: "2026-08-25",
  },
  {
    id: "PP-007",
    asset: "CCTV System",
    status: "Scheduled",
    frequency: "Quarterly",
    assignedTo: "Luis Fernandez",
    isVendor: false,
    lastService: "2026-06-01",
    nextService: "2026-09-01",
  },
  {
    id: "PP-008",
    asset: "Water Treatment Plant",
    status: "Scheduled",
    frequency: "Bi-weekly",
    assignedTo: "HydroTech Services",
    isVendor: true,
    lastService: "2026-08-03",
    nextService: "2026-08-17",
  },
];

export function nextPlanId(list: PreventivePlan[]) {
  const highest = list.reduce((max, plan) => {
    const value = Number(plan.id.replace("PP-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `PP-${String(highest + 1).padStart(3, "0")}`;
}
