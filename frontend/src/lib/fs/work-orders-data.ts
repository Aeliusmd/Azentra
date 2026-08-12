import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Every work order across the properties this supervisor covers. Mock data —
 * swap for a `src/lib/api.ts` call when the backend lands.
 *
 * Unlike the technician portal, which only ever holds one person's own jobs,
 * this list spans all technicians: assigning, scheduling and reassigning are the
 * supervisor's job, so the assignee is a first-class field that can be empty.
 */

export const WO_STATUSES = [
  "Unassigned",
  "Assigned",
  "Accepted",
  "In Progress",
  "Waiting for Parts",
  "Awaiting Inspection",
  "On Hold",
  "Completed",
  "Overdue",
] as const;
export type FsWorkOrderStatus = (typeof WO_STATUSES)[number];

export const WO_STATUS_TONE: Record<FsWorkOrderStatus, PillTone> = {
  Unassigned: "slate",
  Assigned: "navy",
  Accepted: "green",
  "In Progress": "navy",
  "Waiting for Parts": "purple",
  "Awaiting Inspection": "orange",
  "On Hold": "slate",
  Completed: "green",
  Overdue: "red",
};

/** Statuses reached only after the technician has picked the job up. */
const STARTED_STATUSES: FsWorkOrderStatus[] = [
  "Accepted",
  "In Progress",
  "Waiting for Parts",
  "Awaiting Inspection",
  "On Hold",
  "Completed",
  "Overdue",
];

/** Statuses a job can hold while it is still the supervisor's problem. */
export const ACTIVE_STATUSES = WO_STATUSES.filter(
  (status) => status !== "Completed",
);

export const WO_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type FsWorkOrderPriority = (typeof WO_PRIORITIES)[number];

export const WO_PRIORITY_TONE: Record<FsWorkOrderPriority, PillTone> = {
  Low: "slate",
  Medium: "navy",
  High: "amber",
  Critical: "red",
};

/** Leading dot on a schedule row — priority at a glance. */
export const WO_PRIORITY_DOT: Record<FsWorkOrderPriority, string> = {
  Low: "bg-[#7c8794]",
  Medium: "bg-[#2e6cad]",
  High: "bg-[#e8a33d]",
  Critical: "bg-[#e0554d]",
};

/** The two priorities that surface on the dashboard's urgent panel. */
export const URGENT_PRIORITIES: FsWorkOrderPriority[] = ["Critical", "High"];

/** Where a job came from, asked for when the supervisor raises one by hand. */
export const WO_SOURCES = [
  "Direct",
  "Maintenance Request",
  "Resident Complaint",
  "Inspection Finding",
  "Preventive Schedule",
  "Manager Request",
] as const;
export type FsWorkOrderSource = (typeof WO_SOURCES)[number];

/** What kind of work it is, asked for when the supervisor raises a job. */
export const WORK_TYPES = [
  "Repair",
  "Inspection",
  "Installation",
  "Preventive",
  "Cleaning",
  "Emergency",
] as const;
export type FsWorkType = (typeof WORK_TYPES)[number];

export const WO_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Elevator",
  "Carpentry",
  "Appliance",
  "Safety",
  "General",
] as const;
export type FsWorkOrderCategory = (typeof WO_CATEGORIES)[number];

export type WorkOrderNote = {
  id: string;
  author: string;
  /** `YYYY-MM-DD HH:MM`. */
  time: string;
  text: string;
};

/** Seeded evidence. No file ever leaves the browser — the tile is drawn, not loaded. */
export type WorkOrderPhoto = {
  id: string;
  kind: "Issue" | "Before" | "During" | "After";
  caption: string;
};

export type WorkOrderMaterial = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export type WorkOrderLabour = {
  id: string;
  technician: string;
  date: string;
  hours: number;
};

/** One step in the job's history, as shown on the detail modal. */
export type WorkOrderEvent = {
  label: string;
  /** `YYYY-MM-DD HH:MM`. */
  time: string;
};

export type WorkOrderCompletion = {
  completedAt: string;
  result: "Resolved" | "Partially Resolved" | "Needs Follow-up";
  summary: string;
};

export type FsWorkOrder = {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  property: string;
  /** Tower / block the job sits in. */
  building: string;
  /** Unit or space within the building. */
  location: string;
  category: FsWorkOrderCategory;
  /** Set on jobs the supervisor raises; seeded jobs carry a category instead. */
  workType?: FsWorkType;
  /** Steps the technician has to tick off, when the job was raised with any. */
  checklist?: string[];
  priority: FsWorkOrderPriority;
  status: FsWorkOrderStatus;
  /** Empty until the supervisor assigns someone. */
  technician: string | null;
  requestedBy: string;
  /** Stated on jobs the supervisor raises; inferred for the rest. */
  source?: FsWorkOrderSource;
  /** `YYYY-MM-DD HH:MM`. */
  requestedAt: string;
  /**
   * Lifecycle stamps. Left off most records on purpose — `timelineFor` derives
   * a plausible time from the request instead, so a mock job still reads as a
   * history without 30 hand-written timelines.
   */
  reviewedAt?: string;
  assignedAt?: string;
  acceptedAt?: string;
  materialRequestedAt?: string;
  /** ISO date, or null while the job is still unscheduled. */
  scheduledDate: string | null;
  /** 12h `HH:MM AM`. */
  scheduledTime: string | null;
  /** Expected time on site, in hours. */
  durationHours: number | null;
  dueDate: string;
  /** 0–100. */
  progress: number;
  startedAt?: string;
  expectedCompletion?: string;
  /** Why a job has stalled — shown on the progress monitor. */
  delayReason?: string;
  notes: WorkOrderNote[];
  photos: WorkOrderPhoto[];
  materials: WorkOrderMaterial[];
  labour: WorkOrderLabour[];
  completion?: WorkOrderCompletion;
  /** Extra history the supervisor's own actions append. */
  events?: WorkOrderEvent[];
};

const SUNRISE = { propertyId: "sunrise", property: "Sunrise Residence" };
const VALLEY = { propertyId: "green-valley", property: "Green Valley Towers" };

export const workOrders: FsWorkOrder[] = [
  /* ----------------------------- In progress ----------------------------- */
  {
    ...SUNRISE,
    id: "WO-1041",
    title: "Water Leakage - Bathroom Ceiling",
    description:
      "Continuous water leakage from bathroom ceiling. Tenant reports water dripping onto floor tiles. Suspect pipe joint failure above ceiling panel.",
    building: "Tower A",
    location: "Unit A-304",
    category: "Plumbing",
    priority: "High",
    status: "In Progress",
    technician: "John Perera",
    requestedBy: "Anita Silva (A-304)",
    requestedAt: "2026-08-10 14:22",
    reviewedAt: "2026-08-10 15:00",
    assignedAt: "2026-08-11 08:15",
    acceptedAt: "2026-08-11 08:30",
    materialRequestedAt: "2026-08-12 11:15",
    scheduledDate: "2026-08-12",
    scheduledTime: "10:30 AM",
    durationHours: 3,
    dueDate: "2026-08-12",
    progress: 70,
    startedAt: "2026-08-12 10:42",
    expectedCompletion: "2026-08-12 13:30",
    notes: [
      {
        id: "n1",
        author: "John Perera",
        time: "2026-08-12 10:55",
        text: "Opened the ceiling access panel. Leak traced to the riser joint feeding A-404.",
      },
      {
        id: "n2",
        author: "John Perera",
        time: "2026-08-12 11:25",
        text: "Water shut off to the stack. Replacing the coupling now.",
      },
    ],
    photos: [
      { id: "p1", kind: "Issue", caption: "Stained ceiling panel" },
      { id: "p2", kind: "Before", caption: "Riser joint exposed" },
      { id: "p3", kind: "During", caption: "Coupling removed" },
    ],
    materials: [
      { id: "m1", name: 'PVC Pipe 2"', quantity: 2, unit: "pcs" },
      { id: "m2", name: "Pipe Joint", quantity: 2, unit: "pcs" },
      { id: "m3a", name: "Sealant", quantity: 1, unit: "unit" },
    ],
    labour: [
      {
        id: "l1",
        technician: "John Perera",
        date: "2026-08-12",
        hours: 1.5,
      },
    ],
  },
  {
    ...SUNRISE,
    id: "WO-1042",
    title: "Elevator Malfunction - Tower A",
    description:
      "Passenger lift stopping between floors 4 and 5. Taken out of service pending repair.",
    building: "Tower A",
    location: "Elevator 1",
    category: "Elevator",
    workType: "Emergency",
    priority: "Critical",
    status: "In Progress",
    technician: "Michael Torres",
    requestedBy: "Front Desk",
    requestedAt: "2026-08-12 06:55",
    scheduledDate: "2026-08-12",
    scheduledTime: "09:00 AM",
    durationHours: 4,
    dueDate: "2026-08-12",
    progress: 45,
    startedAt: "2026-08-12 09:05",
    expectedCompletion: "2026-08-12 14:00",
    notes: [
      {
        id: "n3",
        author: "Michael Torres",
        time: "2026-08-12 09:20",
        text: "Car parked at ground floor and locked out. Door interlock on level 4 reads intermittent.",
      },
      {
        id: "n4",
        author: "Carlos Rivera",
        time: "2026-08-12 09:45",
        text: "Lift contractor notified — on standby if the interlock needs replacing.",
      },
    ],
    photos: [
      { id: "p4", kind: "Issue", caption: "Level 4 door interlock" },
      { id: "p5", kind: "During", caption: "Controller panel open" },
    ],
    materials: [
      { id: "m3", name: "Door interlock switch", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l2", technician: "Michael Torres", date: "2026-08-12", hours: 2 },
    ],
  },
  {
    ...SUNRISE,
    id: "WO-1043",
    title: "AC Unit Not Cooling - Unit B-202",
    description:
      "Split unit runs but blows warm air. Resident reports the problem started after the weekend.",
    building: "Tower B",
    location: "Unit B-202",
    category: "HVAC",
    priority: "Medium",
    status: "In Progress",
    technician: "Ahmed Khan",
    requestedBy: "Daniel Cruz (B-202)",
    requestedAt: "2026-08-11 18:20",
    scheduledDate: "2026-08-12",
    scheduledTime: "01:00 PM",
    durationHours: 2,
    dueDate: "2026-08-13",
    progress: 30,
    startedAt: "2026-08-12 13:05",
    expectedCompletion: "2026-08-12 15:00",
    notes: [
      {
        id: "n5",
        author: "Ahmed Khan",
        time: "2026-08-12 13:15",
        text: "Gas pressure low. Checking the line for a leak before recharging.",
      },
    ],
    photos: [{ id: "p6", kind: "Before", caption: "Outdoor condenser unit" }],
    materials: [
      { id: "m4", name: "R-32 refrigerant", quantity: 1, unit: "canister" },
    ],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1044",
    title: "Pool Pump Repair - Common Area",
    description:
      "Pool circulation pump tripping on start. Filtration is offline until it is fixed.",
    building: "Common Area",
    location: "Pool Plant Room",
    category: "General",
    priority: "Medium",
    status: "In Progress",
    technician: "Sarah Wilson",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-11 16:05",
    scheduledDate: "2026-08-12",
    scheduledTime: "08:30 AM",
    durationHours: 3,
    dueDate: "2026-08-13",
    progress: 70,
    startedAt: "2026-08-12 08:32",
    expectedCompletion: "2026-08-12 12:00",
    notes: [
      {
        id: "n6",
        author: "Sarah Wilson",
        time: "2026-08-12 09:10",
        text: "Motor bearing seized. Replacement bearing fitted, reassembling the housing.",
      },
    ],
    photos: [{ id: "p7", kind: "During", caption: "Pump housing stripped" }],
    materials: [
      { id: "m5", name: "Pump bearing kit", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l3", technician: "Sarah Wilson", date: "2026-08-12", hours: 2.5 },
    ],
  },
  {
    ...SUNRISE,
    id: "WO-1045",
    title: "Parking Gate Sensor Repair - Main Gate",
    description:
      "Barrier arm closes on vehicles — the loop sensor is not detecting reliably.",
    building: "Common Area",
    location: "Main Gate",
    category: "Electrical",
    priority: "High",
    status: "In Progress",
    technician: "Ravi Patel",
    requestedBy: "Security Desk",
    requestedAt: "2026-08-12 07:10",
    scheduledDate: "2026-08-12",
    scheduledTime: "11:00 AM",
    durationHours: 2,
    dueDate: "2026-08-12",
    progress: 25,
    startedAt: "2026-08-12 11:08",
    expectedCompletion: "2026-08-12 13:30",
    notes: [
      {
        id: "n7",
        author: "Ravi Patel",
        time: "2026-08-12 11:30",
        text: "Loop detector reads open circuit. Tracing the cable back to the controller.",
      },
    ],
    photos: [{ id: "p8", kind: "Issue", caption: "Barrier controller box" }],
    materials: [],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1046",
    title: "Corridor Lighting Flickering - Level 6",
    description:
      "Six corridor fittings flickering on the east wing. Suspected failing drivers.",
    building: "Tower A",
    location: "Level 6 Corridor",
    category: "Electrical",
    priority: "Low",
    status: "In Progress",
    technician: "Tom Harrison",
    requestedBy: "Housekeeping",
    requestedAt: "2026-08-11 14:30",
    scheduledDate: "2026-08-12",
    scheduledTime: "02:30 PM",
    durationHours: 2,
    dueDate: "2026-08-14",
    progress: 20,
    startedAt: "2026-08-12 14:35",
    expectedCompletion: "2026-08-12 16:30",
    notes: [],
    photos: [],
    materials: [{ id: "m6", name: "LED driver 18W", quantity: 6, unit: "pcs" }],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1047",
    title: "Garbage Chute Blockage - Tower B",
    description:
      "Chute blocked between levels 3 and 2. Residents asked to use the ground-floor bins meanwhile.",
    building: "Tower B",
    location: "Chute Level 3",
    category: "General",
    priority: "Medium",
    status: "In Progress",
    technician: "Michael Torres",
    requestedBy: "Housekeeping",
    requestedAt: "2026-08-12 08:05",
    scheduledDate: "2026-08-12",
    scheduledTime: "03:30 PM",
    durationHours: 1.5,
    dueDate: "2026-08-13",
    progress: 15,
    startedAt: "2026-08-12 15:32",
    expectedCompletion: "2026-08-12 17:00",
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },

  /* ------------------------------- Assigned ------------------------------ */
  {
    ...SUNRISE,
    id: "WO-1048",
    title: "Water Heater Replacement - Unit A-501",
    description:
      "Storage heater leaking from the base. Unit is 11 years old and due for replacement.",
    building: "Tower A",
    location: "Unit A-501",
    category: "Plumbing",
    priority: "High",
    status: "Accepted",
    technician: "John Perera",
    requestedBy: "Meera Joshi (A-501)",
    requestedAt: "2026-08-12 08:50",
    scheduledDate: "2026-08-13",
    scheduledTime: "09:00 AM",
    durationHours: 4,
    dueDate: "2026-08-14",
    progress: 0,
    notes: [
      {
        id: "n8",
        author: "John Perera",
        time: "2026-08-12 09:15",
        text: "Accepted. Will collect the replacement heater from stores first thing.",
      },
    ],
    photos: [{ id: "p9", kind: "Issue", caption: "Corroded heater base" }],
    materials: [
      { id: "m7", name: "Storage heater 50L", quantity: 1, unit: "unit" },
    ],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1049",
    title: "Balcony Door Lock Jammed - Unit B-408",
    description: "Sliding door lock will not engage. Security concern overnight.",
    building: "Tower B",
    location: "Unit B-408",
    category: "Carpentry",
    priority: "Medium",
    status: "Assigned",
    technician: "Michael Torres",
    requestedBy: "Leo Fernando (B-408)",
    requestedAt: "2026-08-12 09:35",
    scheduledDate: "2026-08-13",
    scheduledTime: "11:00 AM",
    durationHours: 1.5,
    dueDate: "2026-08-14",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1050",
    title: "Exhaust Fan Noise - Unit B-115",
    description: "Bathroom exhaust fan rattling loudly. Bearing likely worn.",
    building: "Tower B",
    location: "Unit B-115",
    category: "HVAC",
    priority: "Low",
    status: "Assigned",
    technician: "Ahmed Khan",
    requestedBy: "Sana Iqbal (B-115)",
    requestedAt: "2026-08-11 20:10",
    scheduledDate: "2026-08-14",
    scheduledTime: "10:00 AM",
    durationHours: 1,
    dueDate: "2026-08-15",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },

  /* --------------------------- Waiting / review -------------------------- */
  {
    ...SUNRISE,
    id: "WO-1051",
    title: "Gym Treadmill Belt Replacement",
    description:
      "Treadmill 2 belt slipping under load. Machine tagged out of service.",
    building: "Common Area",
    location: "Gym",
    category: "Appliance",
    priority: "Low",
    status: "Waiting for Parts",
    technician: "Sarah Wilson",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-10 11:00",
    scheduledDate: "2026-08-13",
    scheduledTime: "02:00 PM",
    durationHours: 2,
    dueDate: "2026-08-17",
    progress: 40,
    startedAt: "2026-08-11 14:10",
    expectedCompletion: "2026-08-15 12:00",
    delayReason: "Replacement belt on back order — supplier ETA 15 Aug.",
    notes: [
      {
        id: "n9",
        author: "Sarah Wilson",
        time: "2026-08-11 15:00",
        text: "Belt removed and deck cleaned. Waiting on the new belt to refit.",
      },
    ],
    photos: [{ id: "p10", kind: "During", caption: "Deck with belt removed" }],
    materials: [
      { id: "m8", name: "Treadmill belt 3-ply", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l4", technician: "Sarah Wilson", date: "2026-08-11", hours: 1.5 },
    ],
  },
  {
    ...SUNRISE,
    id: "WO-1052",
    title: "Kitchen Tap Replacement - Unit A-207",
    description: "Mixer tap replaced after persistent dripping.",
    building: "Tower A",
    location: "Unit A-207",
    category: "Plumbing",
    priority: "Low",
    status: "Awaiting Inspection",
    technician: "Ravi Patel",
    requestedBy: "Hasan Ali (A-207)",
    requestedAt: "2026-08-11 09:15",
    scheduledDate: "2026-08-11",
    scheduledTime: "03:00 PM",
    durationHours: 1,
    dueDate: "2026-08-13",
    progress: 100,
    startedAt: "2026-08-11 15:02",
    expectedCompletion: "2026-08-11 16:00",
    notes: [
      {
        id: "n10",
        author: "Ravi Patel",
        time: "2026-08-11 16:05",
        text: "New mixer fitted and pressure tested. Ready for sign-off.",
      },
    ],
    photos: [
      { id: "p11", kind: "Before", caption: "Old dripping mixer" },
      { id: "p12", kind: "After", caption: "New mixer installed" },
    ],
    materials: [
      { id: "m9", name: "Kitchen mixer tap", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l5", technician: "Ravi Patel", date: "2026-08-11", hours: 1 },
    ],
  },

  /* ------------------------------- Overdue ------------------------------- */
  {
    ...SUNRISE,
    id: "WO-1035",
    title: "Roof Drain Cleaning - Tower A",
    description:
      "Roof drains clogged with debris before the monsoon check. Pooling reported after last rain.",
    building: "Tower A",
    location: "Roof Level",
    category: "Plumbing",
    priority: "High",
    status: "Overdue",
    technician: "Michael Torres",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-07 10:20",
    scheduledDate: "2026-08-10",
    scheduledTime: "09:00 AM",
    durationHours: 3,
    dueDate: "2026-08-10",
    progress: 35,
    startedAt: "2026-08-10 09:15",
    expectedCompletion: "2026-08-13 12:00",
    delayReason: "Rain stopped roof access on 10 Aug; rescheduling needed.",
    notes: [
      {
        id: "n11",
        author: "Michael Torres",
        time: "2026-08-10 11:40",
        text: "Two of six drains cleared before the weather turned. Rest still blocked.",
      },
    ],
    photos: [{ id: "p13", kind: "Issue", caption: "Debris over roof drain" }],
    materials: [],
    labour: [
      { id: "l6", technician: "Michael Torres", date: "2026-08-10", hours: 2 },
    ],
  },
  {
    ...SUNRISE,
    id: "WO-1038",
    title: "Basement Sump Pump Service",
    description: "Quarterly sump pump service missed while parts were awaited.",
    building: "Common Area",
    location: "Basement Level 2",
    category: "General",
    priority: "Medium",
    status: "Overdue",
    technician: "Tom Harrison",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-05 08:00",
    scheduledDate: "2026-08-11",
    scheduledTime: "10:00 AM",
    durationHours: 2,
    dueDate: "2026-08-11",
    progress: 10,
    startedAt: "2026-08-11 10:05",
    expectedCompletion: "2026-08-13 15:00",
    delayReason: "Float switch out of stock — reorder placed 11 Aug.",
    notes: [],
    photos: [],
    materials: [
      { id: "m10", name: "Float switch", quantity: 1, unit: "unit" },
    ],
    labour: [],
  },

  /* ------------------------------ Unassigned ----------------------------- */
  {
    ...SUNRISE,
    id: "WO-1053",
    title: "Fire Alarm Panel Fault - Tower B",
    description:
      "Zone 3 shows a permanent fault on the alarm panel. Needs a safety technician today.",
    building: "Tower B",
    location: "Fire Panel Room",
    category: "Safety",
    workType: "Emergency",
    priority: "Critical",
    status: "Unassigned",
    technician: null,
    requestedBy: "Security Desk",
    requestedAt: "2026-08-12 09:55",
    scheduledDate: null,
    scheduledTime: null,
    durationHours: null,
    dueDate: "2026-08-12",
    progress: 0,
    notes: [],
    photos: [{ id: "p14", kind: "Issue", caption: "Panel showing zone 3 fault" }],
    materials: [],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1054",
    title: "Kitchen Sink Clogged - Unit A-102",
    description:
      "Sink draining very slowly, standing water after use. Resident tried a plunger with no effect.",
    building: "Tower A",
    location: "Unit A-102",
    category: "Plumbing",
    priority: "High",
    status: "Unassigned",
    technician: null,
    requestedBy: "Rita Gomez (A-102)",
    requestedAt: "2026-08-12 09:05",
    scheduledDate: null,
    scheduledTime: null,
    durationHours: null,
    dueDate: "2026-08-13",
    progress: 0,
    notes: [],
    photos: [{ id: "p15", kind: "Issue", caption: "Standing water in sink" }],
    materials: [],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1055",
    title: "Window Seal Leak - Unit B-610",
    description: "Rain seeping past the living-room window seal.",
    building: "Tower B",
    location: "Unit B-610",
    category: "Carpentry",
    priority: "Medium",
    status: "Unassigned",
    technician: null,
    requestedBy: "Ivan Petrov (B-610)",
    requestedAt: "2026-08-12 10:25",
    scheduledDate: null,
    scheduledTime: null,
    durationHours: null,
    dueDate: "2026-08-15",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...SUNRISE,
    id: "WO-1056",
    title: "Lobby Door Closer Adjustment",
    description: "Main lobby door slams shut. Closer needs adjusting.",
    building: "Common Area",
    location: "Main Lobby",
    category: "Carpentry",
    priority: "Low",
    status: "Unassigned",
    technician: null,
    requestedBy: "Front Desk",
    requestedAt: "2026-08-12 11:15",
    scheduledDate: null,
    scheduledTime: null,
    durationHours: null,
    dueDate: "2026-08-16",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },

  /* ------------------------------ Completed ------------------------------ */
  {
    ...SUNRISE,
    id: "WO-1030",
    title: "Bathroom Extractor Replacement - Unit A-410",
    description: "Extractor fan replaced after motor burnout.",
    building: "Tower A",
    location: "Unit A-410",
    category: "HVAC",
    priority: "Medium",
    status: "Completed",
    technician: "Ahmed Khan",
    requestedBy: "Nora Haddad (A-410)",
    requestedAt: "2026-08-10 09:00",
    scheduledDate: "2026-08-11",
    scheduledTime: "09:00 AM",
    durationHours: 2,
    dueDate: "2026-08-12",
    progress: 100,
    notes: [],
    photos: [{ id: "p16", kind: "After", caption: "New extractor fitted" }],
    materials: [
      { id: "m11", name: "Extractor fan 100mm", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l7", technician: "Ahmed Khan", date: "2026-08-11", hours: 1.5 },
    ],
    completion: {
      completedAt: "2026-08-11 10:35",
      result: "Resolved",
      summary: "Old unit removed, new fan fitted and airflow tested.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1031",
    title: "Corridor Light Fitting - Level 2",
    description: "Two failed fittings replaced on the west corridor.",
    building: "Tower A",
    location: "Level 2 Corridor",
    category: "Electrical",
    priority: "Low",
    status: "Completed",
    technician: "Tom Harrison",
    requestedBy: "Housekeeping",
    requestedAt: "2026-08-10 13:20",
    scheduledDate: "2026-08-11",
    scheduledTime: "01:00 PM",
    durationHours: 1,
    dueDate: "2026-08-13",
    progress: 100,
    notes: [],
    photos: [],
    materials: [
      { id: "m12", name: "LED panel 18W", quantity: 2, unit: "pcs" },
    ],
    labour: [
      { id: "l8", technician: "Tom Harrison", date: "2026-08-11", hours: 1 },
    ],
    completion: {
      completedAt: "2026-08-11 14:05",
      result: "Resolved",
      summary: "Both fittings replaced and tested.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1032",
    title: "Leaking Shower Mixer - Unit B-303",
    description: "Shower mixer cartridge replaced.",
    building: "Tower B",
    location: "Unit B-303",
    category: "Plumbing",
    priority: "Medium",
    status: "Completed",
    technician: "John Perera",
    requestedBy: "Peter Wong (B-303)",
    requestedAt: "2026-08-09 15:40",
    scheduledDate: "2026-08-10",
    scheduledTime: "10:00 AM",
    durationHours: 2,
    dueDate: "2026-08-12",
    progress: 100,
    notes: [],
    photos: [],
    materials: [
      { id: "m13", name: "Mixer cartridge", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l9", technician: "John Perera", date: "2026-08-10", hours: 1.5 },
    ],
    completion: {
      completedAt: "2026-08-10 11:30",
      result: "Resolved",
      summary: "Cartridge replaced, no further drip after testing.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1033",
    title: "Generator Weekly Test",
    description: "Scheduled generator load test and log entry.",
    building: "Common Area",
    location: "Generator Room",
    category: "Electrical",
    priority: "Low",
    status: "Completed",
    technician: "Ravi Patel",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-09 08:00",
    scheduledDate: "2026-08-10",
    scheduledTime: "08:00 AM",
    durationHours: 1,
    dueDate: "2026-08-10",
    progress: 100,
    notes: [],
    photos: [],
    materials: [],
    labour: [
      { id: "l10", technician: "Ravi Patel", date: "2026-08-10", hours: 1 },
    ],
    completion: {
      completedAt: "2026-08-10 09:00",
      result: "Resolved",
      summary: "Ran on load for 30 minutes, no faults logged.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1034",
    title: "Blocked Toilet - Unit A-118",
    description: "Toilet cleared and traps flushed.",
    building: "Tower A",
    location: "Unit A-118",
    category: "Plumbing",
    priority: "High",
    status: "Completed",
    technician: "Michael Torres",
    requestedBy: "Tara Mendis (A-118)",
    requestedAt: "2026-08-09 19:10",
    scheduledDate: "2026-08-09",
    scheduledTime: "08:00 PM",
    durationHours: 1,
    dueDate: "2026-08-10",
    progress: 100,
    notes: [],
    photos: [],
    materials: [],
    labour: [
      { id: "l11", technician: "Michael Torres", date: "2026-08-09", hours: 1 },
    ],
    completion: {
      completedAt: "2026-08-09 21:00",
      result: "Resolved",
      summary: "Blockage cleared with a drain auger, flow normal.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1036",
    title: "Intercom Handset Fault - Unit B-505",
    description: "Handset replaced after no-audio fault.",
    building: "Tower B",
    location: "Unit B-505",
    category: "Electrical",
    priority: "Low",
    status: "Completed",
    technician: "Sarah Wilson",
    requestedBy: "Emma Clark (B-505)",
    requestedAt: "2026-08-08 12:00",
    scheduledDate: "2026-08-09",
    scheduledTime: "11:00 AM",
    durationHours: 1,
    dueDate: "2026-08-11",
    progress: 100,
    notes: [],
    photos: [],
    materials: [
      { id: "m14", name: "Intercom handset", quantity: 1, unit: "unit" },
    ],
    labour: [
      { id: "l12", technician: "Sarah Wilson", date: "2026-08-09", hours: 0.5 },
    ],
    completion: {
      completedAt: "2026-08-09 11:40",
      result: "Resolved",
      summary: "Handset swapped, two-way audio confirmed with the front desk.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1037",
    title: "Car Park Line Marking Touch-up",
    description: "Faded bay markings repainted on level B1.",
    building: "Common Area",
    location: "Basement Level 1",
    category: "General",
    priority: "Low",
    status: "Completed",
    technician: "Tom Harrison",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-07 09:00",
    scheduledDate: "2026-08-08",
    scheduledTime: "09:00 AM",
    durationHours: 4,
    dueDate: "2026-08-10",
    progress: 100,
    notes: [],
    photos: [],
    materials: [{ id: "m15", name: "Line paint", quantity: 4, unit: "litre" }],
    labour: [
      { id: "l13", technician: "Tom Harrison", date: "2026-08-08", hours: 4 },
    ],
    completion: {
      completedAt: "2026-08-08 13:20",
      result: "Resolved",
      summary: "18 bays remarked and cordoned overnight to dry.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1039",
    title: "Chiller Filter Cleaning",
    description: "Monthly chiller filter clean completed.",
    building: "Common Area",
    location: "Plant Room",
    category: "HVAC",
    priority: "Medium",
    status: "Completed",
    technician: "Ahmed Khan",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-06 08:30",
    scheduledDate: "2026-08-08",
    scheduledTime: "02:00 PM",
    durationHours: 3,
    dueDate: "2026-08-09",
    progress: 100,
    notes: [],
    photos: [],
    materials: [],
    labour: [
      { id: "l14", technician: "Ahmed Khan", date: "2026-08-08", hours: 3 },
    ],
    completion: {
      completedAt: "2026-08-08 17:10",
      result: "Resolved",
      summary: "All six filters washed and refitted, pressure drop normal.",
    },
  },
  {
    ...SUNRISE,
    id: "WO-1040",
    title: "Playground Swing Bolt Tightening",
    description: "Safety check and bolt tightening on the play frame.",
    building: "Common Area",
    location: "Playground",
    category: "Safety",
    priority: "Medium",
    status: "Completed",
    technician: "John Perera",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-06 10:00",
    scheduledDate: "2026-08-07",
    scheduledTime: "10:00 AM",
    durationHours: 1,
    dueDate: "2026-08-09",
    progress: 100,
    notes: [],
    photos: [],
    materials: [],
    labour: [
      { id: "l15", technician: "John Perera", date: "2026-08-07", hours: 1 },
    ],
    completion: {
      completedAt: "2026-08-07 11:05",
      result: "Resolved",
      summary: "All fixings torqued and frame checked for movement.",
    },
  },

  /* --------------------------- Green Valley Towers ------------------------ */
  {
    ...VALLEY,
    id: "WO-2011",
    title: "Lobby AC Not Cooling - Block 1",
    description: "Lobby cassette unit blowing warm air since Monday.",
    building: "Block 1",
    location: "Lobby",
    category: "HVAC",
    priority: "High",
    status: "In Progress",
    technician: "Nadia Rahman",
    requestedBy: "Front Desk",
    requestedAt: "2026-08-12 08:15",
    scheduledDate: "2026-08-12",
    scheduledTime: "10:00 AM",
    durationHours: 3,
    dueDate: "2026-08-13",
    progress: 50,
    startedAt: "2026-08-12 10:05",
    expectedCompletion: "2026-08-12 13:00",
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...VALLEY,
    id: "WO-2012",
    title: "Water Pressure Low - Block 2 Upper Floors",
    description: "Residents on levels 8-10 report weak supply in the mornings.",
    building: "Block 2",
    location: "Levels 8-10",
    category: "Plumbing",
    priority: "Medium",
    status: "Assigned",
    technician: "Kevin Silva",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-12 07:50",
    scheduledDate: "2026-08-13",
    scheduledTime: "09:30 AM",
    durationHours: 3,
    dueDate: "2026-08-15",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...VALLEY,
    id: "WO-2013",
    title: "Emergency Light Test - Block 1",
    description: "Monthly emergency lighting discharge test.",
    building: "Block 1",
    location: "All Floors",
    category: "Safety",
    priority: "Low",
    status: "Unassigned",
    technician: null,
    requestedBy: "Property Manager",
    requestedAt: "2026-08-12 09:00",
    scheduledDate: null,
    scheduledTime: null,
    durationHours: null,
    dueDate: "2026-08-16",
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...VALLEY,
    id: "WO-2014",
    title: "Gate Motor Overheating - Block 2",
    description: "Sliding gate motor cutting out after repeated cycles.",
    building: "Block 2",
    location: "Side Gate",
    category: "Electrical",
    priority: "High",
    status: "Overdue",
    technician: "Grace Lee",
    requestedBy: "Security Desk",
    requestedAt: "2026-08-08 16:40",
    scheduledDate: "2026-08-11",
    scheduledTime: "02:00 PM",
    durationHours: 2,
    dueDate: "2026-08-11",
    progress: 20,
    startedAt: "2026-08-11 14:10",
    expectedCompletion: "2026-08-13 12:00",
    delayReason: "Motor capacitor not in stock on site.",
    notes: [],
    photos: [],
    materials: [],
    labour: [],
  },
  {
    ...VALLEY,
    id: "WO-2015",
    title: "Corridor Repaint - Block 1 Level 4",
    description: "Scuffed corridor walls repainted after a move-out.",
    building: "Block 1",
    location: "Level 4 Corridor",
    category: "General",
    priority: "Low",
    status: "Completed",
    technician: "Marco Rossi",
    requestedBy: "Property Manager",
    requestedAt: "2026-08-06 09:30",
    scheduledDate: "2026-08-08",
    scheduledTime: "09:00 AM",
    durationHours: 5,
    dueDate: "2026-08-10",
    progress: 100,
    notes: [],
    photos: [],
    materials: [{ id: "m16", name: "Wall paint", quantity: 10, unit: "litre" }],
    labour: [
      { id: "l16", technician: "Marco Rossi", date: "2026-08-08", hours: 5 },
    ],
    completion: {
      completedAt: "2026-08-08 15:00",
      result: "Resolved",
      summary: "Two coats applied, corridor reopened the same evening.",
    },
  },
  {
    ...VALLEY,
    id: "WO-2016",
    title: "Fridge Repair - Staff Room",
    description: "Staff room fridge not holding temperature.",
    building: "Block 1",
    location: "Staff Room",
    category: "Appliance",
    priority: "Low",
    status: "Completed",
    technician: "Nadia Rahman",
    requestedBy: "Housekeeping",
    requestedAt: "2026-08-05 11:00",
    scheduledDate: "2026-08-07",
    scheduledTime: "11:00 AM",
    durationHours: 2,
    dueDate: "2026-08-09",
    progress: 100,
    notes: [],
    photos: [],
    materials: [],
    labour: [
      { id: "l17", technician: "Nadia Rahman", date: "2026-08-07", hours: 1.5 },
    ],
    completion: {
      completedAt: "2026-08-07 12:40",
      result: "Resolved",
      summary: "Thermostat replaced, temperature stable at 4°C.",
    },
  },
];

/** A job that still needs the supervisor's attention. */
export function isActive(order: FsWorkOrder) {
  return order.status !== "Completed";
}

/**
 * Jobs the supervisor counts as "covered": someone owns them and they are
 * moving. Overdue is deliberately excluded — it is tracked on its own tile.
 */
export function isAssignedBucket(order: FsWorkOrder) {
  return (
    order.technician !== null &&
    order.status !== "Completed" &&
    order.status !== "Overdue"
  );
}

export function byProperty(orders: FsWorkOrder[], propertyId: string) {
  return orders.filter((order) => order.propertyId === propertyId);
}

/** Minutes since midnight for a `HH:MM AM` label — used to sort a day. */
export function minutesOf(time: string | null) {
  if (!time) return Number.MAX_SAFE_INTEGER;
  const [clock, meridiem] = time.split(" ");
  const [hours, mins] = clock.split(":").map(Number);
  return ((hours % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + mins;
}

/** Earliest scheduled first. */
export function byScheduledTime(a: FsWorkOrder, b: FsWorkOrder) {
  return minutesOf(a.scheduledTime) - minutesOf(b.scheduledTime);
}

const PRIORITY_RANK: Record<FsWorkOrderPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

/** Most urgent first, then earliest on the clock. */
export function byUrgency(a: FsWorkOrder, b: FsWorkOrder) {
  const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  return rank !== 0 ? rank : byScheduledTime(a, b);
}

/* --------------------------------- History -------------------------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** `2026-08-10 14:22` → `Aug 10, 2:22 PM`. */
export function formatStamp(stamp: string) {
  const [date, clock] = stamp.split(" ");
  const [, month, day] = date.split("-").map(Number);
  const [hours, minutes] = clock.split(":").map(Number);

  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${MONTHS[month - 1]} ${day}, ${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/** `2026-08-10 14:22` plus N minutes, back in the same format. */
function shiftStamp(stamp: string, minutes: number) {
  const [date, clock] = stamp.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hours, mins] = clock.split(":").map(Number);

  const moved = new Date(year, month - 1, day, hours, mins + minutes);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${moved.getFullYear()}-${pad(moved.getMonth() + 1)}-${pad(moved.getDate())} ${pad(moved.getHours())}:${pad(moved.getMinutes())}`;
}

/** Minutes after the request each step lands on when it has no own stamp. */
const STEP_DELAY = {
  reviewed: 38,
  assigned: 95,
  accepted: 110,
  materialRequested: 33,
  waitingForParts: 60,
  readyForInspection: 90,
} as const;

/**
 * The job's history, newest step last. Authored stamps win; anything missing is
 * derived from the request time so every job reads as a sequence rather than a
 * single "created" line.
 */
export function timelineFor(order: FsWorkOrder): WorkOrderEvent[] {
  const events: WorkOrderEvent[] = [
    { label: "Request Created", time: order.requestedAt },
  ];

  if (order.status !== "Unassigned") {
    events.push({
      label: "Reviewed by PM",
      time: order.reviewedAt ?? shiftStamp(order.requestedAt, STEP_DELAY.reviewed),
    });
  }

  if (order.technician) {
    events.push({
      label: `Assigned to ${order.technician}`,
      time:
        order.assignedAt ?? shiftStamp(order.requestedAt, STEP_DELAY.assigned),
    });
  }

  if (STARTED_STATUSES.includes(order.status)) {
    events.push({
      label: "Technician Accepted",
      time:
        order.acceptedAt ?? shiftStamp(order.requestedAt, STEP_DELAY.accepted),
    });
  }

  if (order.startedAt) {
    events.push({ label: "Work Started", time: order.startedAt });

    if (order.materials.length > 0) {
      events.push({
        label: "Material Requested",
        time:
          order.materialRequestedAt ??
          shiftStamp(order.startedAt, STEP_DELAY.materialRequested),
      });
    }
  }

  if (order.status === "Waiting for Parts" && order.startedAt) {
    events.push({
      label: "Waiting for Parts",
      time: shiftStamp(order.startedAt, STEP_DELAY.waitingForParts),
    });
  }

  if (order.status === "Awaiting Inspection" && order.startedAt) {
    events.push({
      label: "Ready for Inspection",
      time: shiftStamp(order.startedAt, STEP_DELAY.readyForInspection),
    });
  }

  if (order.status === "Overdue") {
    events.push({ label: "Passed Due Date", time: `${order.dueDate} 17:00` });
  }

  if (order.completion) {
    events.push({
      label: "Work Completed",
      time: order.completion.completedAt,
    });
  }

  return [...events, ...(order.events ?? [])].sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}

/**
 * `Tower A · Unit A-304`. A job raised from the quick form may only carry one
 * half of that, so the empty side is dropped rather than rendered as a dash.
 */
export function locationLabel(
  order: Pick<FsWorkOrder, "building" | "location">,
  separator = " · ",
) {
  return [order.building, order.location].filter(Boolean).join(separator);
}

/** Splits a free-typed `Tower B, Basement` into its building and its space. */
export function splitLocation(text: string) {
  const match = text.split(/\s*[-,]\s*/);
  if (match.length < 2) return { building: "", location: text.trim() };

  return {
    building: match[0].trim(),
    location: match.slice(1).join(" - ").trim(),
  };
}

/** Where the job came from — stated if known, otherwise read off who raised it. */
export function sourceOf(order: FsWorkOrder) {
  if (order.source) return order.source;
  if (/\(.+\)$/.test(order.requestedBy)) return "Maintenance Request";
  if (order.requestedBy === "Property Manager") return "Manager Request";
  return "Staff Report";
}

/**
 * `WO-1057` after `WO-1056`. Numbering runs per property — each site keeps its
 * own thousand — so a new Sunrise job never lands in Green Valley's range.
 */
export function nextWorkOrderId(orders: FsWorkOrder[], propertyId?: string) {
  const scoped = propertyId
    ? orders.filter((order) => order.propertyId === propertyId)
    : orders;

  const floor = scoped.length > 0 ? 0 : 1000;
  const highest = scoped.reduce((max, order) => {
    const value = Number(order.id.replace("WO-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, floor);

  // Guard against a collision with another site's range.
  const taken = new Set(orders.map((order) => order.id));
  let next = highest + 1;
  while (taken.has(`WO-${next}`)) next += 1;

  return `WO-${next}`;
}
