import type { PillTone } from "@/components/pm/ui/pill";
import type { JobPhoto, PhotoSlot } from "@/lib/tech/jobs-data";

/**
 * Preventive maintenance tasks assigned to the signed-in technician. Mock data —
 * swap for a `src/lib/api.ts` call when the backend lands.
 */

export const PM_STATUSES = [
  "Scheduled",
  "Due Today",
  "In Progress",
  "Completed",
  "Overdue",
] as const;
export type PmStatus = (typeof PM_STATUSES)[number];

export const PM_STATUS_TONE: Record<PmStatus, PillTone> = {
  Scheduled: "navy",
  "Due Today": "amber",
  "In Progress": "amber",
  Completed: "green",
  Overdue: "red",
};

export const PM_FREQUENCIES = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const;
export type PmFrequency = (typeof PM_FREQUENCIES)[number];

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type PreventiveTask = {
  id: string;
  asset: string;
  /** Asset class, e.g. "Elevator", "Pool Equipment". */
  category: string;
  frequency: PmFrequency;
  location: string;
  status: PmStatus;
  /** 24h `HH:MM` the visit is booked for. */
  time: string;
  /** ISO `YYYY-MM-DD`. */
  lastService: string;
  nextService: string;
  checklist: ChecklistItem[];
  notes: string;
  photos: Partial<Record<PhotoSlot, JobPhoto>>;
};

/** Checklist entries start unticked. */
const items = (labels: string[], prefix: string): ChecklistItem[] =>
  labels.map((label, index) => ({
    id: `${prefix}-c${index + 1}`,
    label,
    done: false,
  }));

export const preventiveTasks: PreventiveTask[] = [
  {
    id: "PT-001",
    asset: "Elevator - Tower A",
    time: "08:00",
    category: "Elevator",
    frequency: "Monthly",
    location: "Tower A / Machine Room",
    status: "Scheduled",
    lastService: "2026-07-15",
    nextService: "2026-08-15",
    checklist: items(
      [
        "Inspect hoist ropes for wear",
        "Test emergency stop and alarm",
        "Check door sensors and interlocks",
        "Lubricate guide rails",
        "Verify levelling accuracy at each floor",
        "Inspect controller panel for faults",
        "Test emergency lighting and intercom",
      ],
      "PT-001",
    ),
    notes: "",
    photos: {},
  },
  {
    id: "PT-002",
    asset: "Generator - 500kVA",
    time: "10:00",
    category: "Generator",
    frequency: "Bi-weekly",
    location: "Basement / Plant Room",
    status: "Scheduled",
    lastService: "2026-08-01",
    nextService: "2026-08-15",
    checklist: items(
      [
        "Check fuel level and top up",
        "Inspect oil level and condition",
        "Check coolant level",
        "Run 30 minute load test",
        "Inspect battery terminals",
        "Record run hours",
      ],
      "PT-002",
    ),
    notes: "",
    photos: {},
  },
  {
    id: "PT-003",
    asset: "Fire Systems",
    time: "09:00",
    category: "Safety",
    frequency: "Monthly",
    location: "All Towers",
    status: "Scheduled",
    lastService: "2026-07-25",
    nextService: "2026-08-25",
    checklist: items(
      [
        "Test fire alarm panel",
        "Check extinguisher pressure gauges",
        "Inspect emergency exit signage",
        "Test sprinkler control valves",
        "Verify smoke detector operation",
      ],
      "PT-003",
    ),
    notes: "",
    photos: {},
  },
  {
    id: "PT-004",
    asset: "Swimming Pool Pump",
    time: "07:00",
    category: "Pool Equipment",
    frequency: "Weekly",
    location: "Pool Deck / Pump Room",
    status: "Overdue",
    lastService: "2026-08-04",
    nextService: "2026-08-11",
    checklist: items(
      [
        "Backwash filter",
        "Clean pump strainer basket",
        "Check pressure gauge reading",
        "Inspect seals for leaks",
      ],
      "PT-004",
    ),
    notes: "",
    photos: {},
  },
  {
    id: "PT-005",
    asset: "Gym HVAC",
    time: "11:00",
    category: "HVAC",
    frequency: "Quarterly",
    location: "Tower B / Gym",
    status: "Overdue",
    lastService: "2026-05-10",
    nextService: "2026-08-10",
    checklist: items(
      [
        "Replace air filters",
        "Clean condenser coils",
        "Check refrigerant pressure",
        "Inspect duct connections",
        "Test thermostat calibration",
      ],
      "PT-005",
    ),
    notes: "",
    photos: {},
  },
];

/** "3 / 7 completed" — how far through the checklist the technician is. */
export function checklistProgress(task: PreventiveTask) {
  return {
    done: task.checklist.filter((item) => item.done).length,
    total: task.checklist.length,
  };
}
