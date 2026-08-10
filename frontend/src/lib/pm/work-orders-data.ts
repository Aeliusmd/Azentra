import type { PillTone } from "@/components/pm/ui/pill";

/** Mock work orders. Swap for a `src/lib/api.ts` call when the backend lands. */

export const WO_STATUSES = [
  "Open",
  "Accepted",
  "Started",
  "Paused",
  "Completed",
] as const;
export type WorkOrderStatus = (typeof WO_STATUSES)[number];

export const WO_STATUS_TONE: Record<WorkOrderStatus, PillTone> = {
  Open: "slate",
  Accepted: "green",
  Started: "navy",
  Paused: "amber",
  Completed: "green",
};

export const WO_PRIORITIES = ["Low", "Medium", "High", "Emergency"] as const;
export type WorkOrderPriority = (typeof WO_PRIORITIES)[number];

export const WO_PRIORITY_TONE: Record<WorkOrderPriority, PillTone> = {
  Low: "slate",
  Medium: "amber",
  High: "orange",
  Emergency: "red",
};

/** Field Supervisor owns assignment — the manager picks from the known pool. */
export const TECHNICIANS = [
  "Mike Torres",
  "David Kim",
  "Luis Fernandez",
  "Ravi Patel",
  "Tom Harrison",
] as const;

/** Placeholder entry for the technician dropdown. */
export const NO_TECHNICIAN = "Select technician";

export type WorkOrder = {
  id: string;
  title: string;
  location: string;
  technician: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  /** 0–100. */
  progress: number;
  scheduled: string;
};

export const workOrders: WorkOrder[] = [
  {
    id: "WO-001",
    title: "Fix bathroom ceiling water leakage",
    location: "A-101, Tower A",
    technician: "Mike Torres",
    priority: "Emergency",
    status: "Accepted",
    progress: 0,
    scheduled: "2026-08-07",
  },
  {
    id: "WO-002",
    title: "AC repair - Living room unit",
    location: "A-102, Tower A",
    technician: "David Kim",
    priority: "High",
    status: "Started",
    progress: 30,
    scheduled: "2026-08-06",
  },
  {
    id: "WO-003",
    title: "Replace bedroom power outlets",
    location: "B-102, Tower B",
    technician: "Luis Fernandez",
    priority: "Medium",
    status: "Accepted",
    progress: 0,
    scheduled: "2026-08-07",
  },
  {
    id: "WO-004",
    title: "Water heater repair/replacement",
    location: "C-102, Tower C",
    technician: "Mike Torres",
    priority: "Emergency",
    status: "Started",
    progress: 60,
    scheduled: "2026-08-06",
  },
  {
    id: "WO-005",
    title: "Wall crack assessment and repair",
    location: "C-101, Tower C",
    technician: "Mike Torres",
    priority: "Low",
    status: "Completed",
    progress: 100,
    scheduled: "2026-07-30",
  },
  {
    id: "WO-006",
    title: "Intercom system repair",
    location: "A-201, Tower A",
    technician: "Luis Fernandez",
    priority: "Medium",
    status: "Open",
    progress: 0,
    scheduled: "2026-08-08",
  },
  {
    id: "WO-007",
    title: "Replace smoke detector unit",
    location: "C-301, Tower C",
    technician: "Luis Fernandez",
    priority: "Medium",
    status: "Completed",
    progress: 100,
    scheduled: "2026-08-02",
  },
  {
    id: "WO-008",
    title: "Lobby chandelier bulb replacement",
    location: "Main Lobby, Tower A",
    technician: "David Kim",
    priority: "Low",
    status: "Open",
    progress: 0,
    scheduled: "2026-08-09",
  },
];

/** Next id in sequence, for orders created in the browser. */
export function nextWorkOrderId(list: WorkOrder[]) {
  const highest = list.reduce((max, order) => {
    const value = Number(order.id.replace("WO-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `WO-${String(highest + 1).padStart(3, "0")}`;
}
