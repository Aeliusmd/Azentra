import type { PillTone } from "@/components/pm/ui/pill";

/** Mock inspections. Swap for a `src/lib/api.ts` call when the backend lands. */

export const INSPECTION_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];

export const INSPECTION_STATUS_TONE: Record<InspectionStatus, PillTone> = {
  Scheduled: "green",
  "In Progress": "navy",
  Completed: "green",
};

export const INSPECTION_TYPES = [
  "Safety",
  "General",
  "Structural",
  "Equipment",
  "Move-In",
  "Move-Out",
] as const;
export type InspectionType = (typeof INSPECTION_TYPES)[number];

export type Inspection = {
  id: string;
  title: string;
  status: InspectionStatus;
  type: InspectionType;
  location: string;
  inspector: string;
  date: string;
  /** Findings raised during the inspection; 0 hides the badge. */
  issues: number;
  checklist: { label: string; done: boolean }[];
  notes: string;
};

export const inspections: Inspection[] = [
  {
    id: "IN-001",
    title: "Monthly Fire Safety Inspection",
    status: "Scheduled",
    type: "Safety",
    location: "All Towers",
    inspector: "James O'Brien (FireSafe)",
    date: "2026-08-25",
    issues: 0,
    checklist: [
      { label: "Fire extinguisher pressure check", done: false },
      { label: "Smoke detector battery test", done: false },
      { label: "Emergency exit signage", done: false },
      { label: "Sprinkler head inspection", done: false },
    ],
    notes: "Monthly statutory check across all three towers.",
  },
  {
    id: "IN-002",
    title: "Elevator Safety Check - Tower A",
    status: "Scheduled",
    type: "Safety",
    location: "Tower A",
    inspector: "Richard Blake (ElevatorPro)",
    date: "2026-08-15",
    issues: 0,
    checklist: [
      { label: "Cable tension and wear", done: false },
      { label: "Emergency brake test", done: false },
      { label: "Door sensor calibration", done: false },
      { label: "Alarm and intercom test", done: false },
    ],
    notes: "Annual certification renewal due after this visit.",
  },
  {
    id: "IN-003",
    title: "Common Area Condition Assessment",
    status: "Scheduled",
    type: "General",
    location: "All Common Areas",
    inspector: "Property Manager",
    date: "2026-08-10",
    issues: 0,
    checklist: [
      { label: "Lobby and corridor condition", done: false },
      { label: "Lighting fixtures", done: false },
      { label: "Gym and pool deck", done: false },
      { label: "Car park cleanliness", done: false },
    ],
    notes: "Walkthrough ahead of the quarterly owners' report.",
  },
  {
    id: "IN-004",
    title: "Pool Safety Inspection",
    status: "In Progress",
    type: "Safety",
    location: "Swimming Pool, Tower B",
    inspector: "Maria Santos (AquaClean)",
    date: "2026-08-07",
    issues: 2,
    checklist: [
      { label: "Water chemistry balance", done: true },
      { label: "Pool fence and gate latch", done: true },
      { label: "Depth markings legible", done: false },
      { label: "Rescue equipment present", done: false },
    ],
    notes: "Gate latch sticking; depth markings faded on the shallow end.",
  },
  {
    id: "IN-005",
    title: "Structural Assessment - Tower C",
    status: "Completed",
    type: "Structural",
    location: "Tower C",
    inspector: "Engineering Consultant",
    date: "2026-07-20",
    issues: 3,
    checklist: [
      { label: "External wall crack survey", done: true },
      { label: "Roof waterproofing", done: true },
      { label: "Basement seepage check", done: true },
      { label: "Balcony railing integrity", done: true },
    ],
    notes:
      "Three hairline cracks logged on floors 4–6; work orders raised for repair.",
  },
  {
    id: "IN-006",
    title: "Fire Extinguisher Audit",
    status: "Completed",
    type: "Safety",
    location: "All Towers",
    inspector: "James O'Brien (FireSafe)",
    date: "2026-07-15",
    issues: 0,
    checklist: [
      { label: "Unit count per floor", done: true },
      { label: "Service tag validity", done: true },
      { label: "Mounting bracket condition", done: true },
    ],
    notes: "All units in service; next audit due October.",
  },
  {
    id: "IN-007",
    title: "Move-Out Inspection - B-201",
    status: "Completed",
    type: "Move-Out",
    location: "B-201, Tower B",
    inspector: "Property Manager",
    date: "2026-07-05",
    issues: 1,
    checklist: [
      { label: "Wall and paint condition", done: true },
      { label: "Appliance handover", done: true },
      { label: "Key and access card return", done: true },
      { label: "Meter readings recorded", done: true },
    ],
    notes: "Minor kitchen cabinet damage noted for deposit deduction.",
  },
];

export function nextInspectionId(list: Inspection[]) {
  const highest = list.reduce((max, item) => {
    const value = Number(item.id.replace("IN-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `IN-${String(highest + 1).padStart(3, "0")}`;
}
