import type { PillTone } from "@/components/pm/ui/pill";

import { TODAY } from "@/lib/fs/dashboard-data";
import type { FsWorkOrderCategory } from "@/lib/fs/work-orders-data";

/**
 * Recurring servicing the supervisor plans around. Mock data — swap for a
 * `src/lib/api.ts` call when the backend lands.
 *
 * The checklist is what makes a round verifiable: the supervisor signs a service
 * off item by item, and the round is only closed once every item is ticked.
 */

export const PM_FREQUENCIES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-yearly",
  "Annual",
] as const;
export type PmFrequency = (typeof PM_FREQUENCIES)[number];

/** Days a frequency runs for — how far ahead a closed round is booked again. */
const CYCLE_DAYS: Record<PmFrequency, number> = {
  Weekly: 7,
  Monthly: 30,
  Quarterly: 91,
  "Half-yearly": 182,
  Annual: 365,
};

export const PM_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Overdue",
] as const;
export type PmStatus = (typeof PM_STATUSES)[number];

export const PM_STATUS_TONE: Record<PmStatus, PillTone> = {
  Scheduled: "navy",
  "In Progress": "amber",
  Completed: "green",
  Overdue: "red",
};

export type PmChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type PreventiveTask = {
  id: string;
  title: string;
  /** The plant this round services — what the card leads with. */
  asset: string;
  propertyId: string;
  building: string;
  location: string;
  category: FsWorkOrderCategory;
  frequency: PmFrequency;
  /** ISO `YYYY-MM-DD` the next round is due. */
  nextDate: string;
  /** 12h `HH:MM AM`. */
  time: string;
  technician: string | null;
  lastDone: string;
  checklist: PmChecklistItem[];
};

/** Checklist entries start unticked unless the round has already been signed off. */
const items = (
  prefix: string,
  labels: string[],
  done = false,
): PmChecklistItem[] =>
  labels.map((label, index) => ({
    id: `${prefix}-c${index + 1}`,
    label,
    done,
  }));

export const preventiveTasks: PreventiveTask[] = [
  {
    id: "PM-401",
    title: "Generator PM - Monthly",
    asset: "Generator G-01",
    propertyId: "sunrise",
    building: "Common Area",
    location: "Generator Room",
    category: "Electrical",
    frequency: "Monthly",
    nextDate: "2026-08-20",
    time: "08:00 AM",
    technician: "Ravi Patel",
    lastDone: "2026-07-20",
    checklist: items("pm401", [
      "Check engine oil level and top up",
      "Inspect coolant level and hoses",
      "Test battery voltage under load",
      "Run on load for 30 minutes",
      "Check fuel level and filter",
      "Inspect exhaust for leaks",
      "Log readings in the plant record",
    ]),
  },
  {
    id: "PM-402",
    title: "Chiller Filter Service",
    asset: "Chiller CH-01",
    propertyId: "sunrise",
    building: "Common Area",
    location: "Plant Room",
    category: "HVAC",
    frequency: "Monthly",
    nextDate: "2026-09-08",
    time: "02:00 PM",
    technician: "Ahmed Khan",
    lastDone: "2026-08-08",
    // Signed off on 8 Aug — the round the work-order list closed as WO-1039.
    checklist: items(
      "pm402",
      [
        "Isolate the unit and lock off",
        "Wash all six filters",
        "Check pressure drop across the coil",
        "Inspect condensate tray and drain",
        "Refit filters and restart",
      ],
      true,
    ),
  },
  {
    id: "PM-403",
    title: "Fire Extinguisher Round - Tower B",
    asset: "Fire Extinguishers - Tower B",
    propertyId: "sunrise",
    building: "Tower B",
    location: "All Floors",
    category: "Safety",
    frequency: "Quarterly",
    nextDate: "2026-08-26",
    time: "09:00 AM",
    technician: "Samuel Oduya",
    lastDone: "2026-05-26",
    checklist: items("pm403", [
      "Check pressure gauge on every unit",
      "Confirm seals and pins intact",
      "Inspect hoses and nozzles",
      "Verify mounting and signage",
      "Update the service tags",
    ]),
  },
  {
    id: "PM-404",
    title: "Water Tank Cleaning",
    asset: "Water Tank WT-01",
    propertyId: "sunrise",
    building: "Tower A",
    location: "Roof Level",
    category: "Plumbing",
    frequency: "Half-yearly",
    nextDate: "2026-09-15",
    time: "08:30 AM",
    technician: null,
    lastDone: "2026-03-15",
    checklist: items("pm404", [
      "Drain and isolate the tank",
      "Scrub walls and base",
      "Disinfect and rinse",
      "Inspect the inlet valve and float",
      "Refill and sample the water",
    ]),
  },
  {
    id: "PM-405",
    title: "Lift Service Visit - Tower A",
    asset: "Elevator E-01",
    propertyId: "sunrise",
    building: "Tower A",
    location: "Elevator 1",
    category: "Elevator",
    frequency: "Monthly",
    nextDate: "2026-08-28",
    time: "10:00 AM",
    technician: "Michael Torres",
    lastDone: "2026-07-28",
    checklist: items("pm405", [
      "Inspect hoist ropes for wear",
      "Test door interlocks on every floor",
      "Check levelling accuracy",
      "Test the emergency alarm and intercom",
      "Grease guide rails",
    ]),
  },
  {
    id: "PM-501",
    title: "Pump Room Inspection - Block 2",
    asset: "Booster Pump BP-02",
    propertyId: "green-valley",
    building: "Block 2",
    location: "Pump Room",
    category: "Plumbing",
    frequency: "Monthly",
    nextDate: "2026-08-21",
    time: "09:00 AM",
    technician: "Kevin Silva",
    lastDone: "2026-07-21",
    checklist: items("pm501", [
      "Check suction and delivery pressure",
      "Inspect mechanical seals for weeping",
      "Test the pressure switch cut-in",
      "Check panel indicators and alarms",
      "Log running hours",
    ]),
  },
];

export function preventiveAt(propertyId: string) {
  return preventiveTasks.filter((task) => task.propertyId === propertyId);
}

/** Items ticked out of the whole round. */
export function checklistProgress(task: PreventiveTask) {
  const done = task.checklist.filter((item) => item.done).length;
  return { done, total: task.checklist.length };
}

/**
 * Where the round stands. Derived rather than stored so ticking the last item
 * closes the round out on every screen at once.
 */
export function pmStatus(task: PreventiveTask): PmStatus {
  const { done, total } = checklistProgress(task);

  if (total > 0 && done === total) return "Completed";
  if (task.nextDate < TODAY) return "Overdue";
  return done > 0 ? "In Progress" : "Scheduled";
}

/** Soonest due first. */
export function byNextDate(a: PreventiveTask, b: PreventiveTask) {
  return a.nextDate.localeCompare(b.nextDate);
}

/** One cycle on from a date — where a closed round lands next. */
export function nextServiceDate(from: string, frequency: PmFrequency) {
  const [year, month, day] = from.split("-").map(Number);
  const moved = new Date(year, month - 1, day + CYCLE_DAYS[frequency]);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${moved.getFullYear()}-${pad(moved.getMonth() + 1)}-${pad(moved.getDate())}`;
}
