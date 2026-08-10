import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Mock maintenance requests. Swap for a `src/lib/api.ts` call when the backend
 * lands — the shapes below mirror what the request endpoint would return.
 */

export const REQUEST_STATUSES = [
  "Pending",
  "Assigned",
  "In Progress",
  "Waiting Material",
  "Completed",
  "Rejected",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_TONE: Record<RequestStatus, PillTone> = {
  Pending: "amber",
  Assigned: "green",
  "In Progress": "navy",
  "Waiting Material": "purple",
  Completed: "green",
  Rejected: "red",
};

export const PRIORITIES = ["Emergency", "High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_TONE: Record<Priority, PillTone> = {
  Emergency: "red",
  High: "orange",
  Medium: "amber",
  Low: "slate",
};

/** Text colour for the option rows in the Change Priority dialog. */
export const PRIORITY_TEXT: Record<Priority, string> = {
  Emergency: "text-rose-600",
  High: "text-orange-600",
  Medium: "text-amber-600",
  Low: "text-ink",
};

export const BUILDINGS = ["Tower A", "Tower B", "Tower C"] as const;

export const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Security System",
  "Common Area",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type TimelineEntry = {
  label: string;
  /** Rendered in normal weight after the bold label, e.g. "by John Doe". */
  by: string;
  at: string;
};

export type MaintenanceRequest = {
  id: string;
  title: string;
  priority: Priority;
  status: RequestStatus;
  unit: string;
  building: string;
  resident: string;
  residentContact: string;
  technician: string;
  supervisor: string;
  createdAt: string;
  category: Category;
  locationDetail: string;
  images: number;
  description: string;
  timeline: TimelineEntry[];
  notes: string[];
};

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "MR-001",
    title: "Water leakage in bathroom ceiling",
    priority: "Emergency",
    status: "Assigned",
    unit: "A-101",
    building: "Tower A",
    resident: "John Doe",
    residentContact: "+1 555 1001",
    technician: "Mike Torres",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 08:15",
    category: "Plumbing",
    locationDetail: "Tower A, Ground, Unit A-101",
    images: 3,
    description:
      "Water dripping from bathroom ceiling since yesterday evening. The ceiling paint is peeling and there is a small puddle on the floor every morning.",
    timeline: [
      { label: "Created", by: "by John Doe", at: "2026-08-06 08:15" },
      { label: "Reviewed", by: "by Admin", at: "2026-08-06 09:00" },
      {
        label: "Assigned to Mike Torres",
        by: "by Admin",
        at: "2026-08-06 10:30",
      },
    ],
    notes: [],
  },
  {
    id: "MR-002",
    title: "AC not cooling properly",
    priority: "High",
    status: "In Progress",
    unit: "A-102",
    building: "Tower A",
    resident: "Sarah Johnson",
    residentContact: "+1 555 1002",
    technician: "David Kim",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-05 14:20",
    category: "HVAC",
    locationDetail: "Tower A, Floor 1, Unit A-102",
    images: 2,
    description:
      "Living room air conditioner runs but the air stays warm. Filter was cleaned last month.",
    timeline: [
      { label: "Created", by: "by Sarah Johnson", at: "2026-08-05 14:20" },
      { label: "Assigned to David Kim", by: "by Admin", at: "2026-08-05 16:00" },
      { label: "Work started", by: "by David Kim", at: "2026-08-06 09:10" },
    ],
    notes: [],
  },
  {
    id: "MR-003",
    title: "Kitchen sink drain clogged",
    priority: "Medium",
    status: "Pending",
    unit: "A-103",
    building: "Tower A",
    resident: "Michael Brown",
    residentContact: "+1 555 1003",
    technician: "",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 11:00",
    category: "Plumbing",
    locationDetail: "Tower A, Floor 1, Unit A-103",
    images: 1,
    description:
      "Sink drains very slowly and water backs up when the dishwasher runs.",
    timeline: [
      { label: "Created", by: "by Michael Brown", at: "2026-08-06 11:00" },
    ],
    notes: [],
  },
  {
    id: "MR-004",
    title: "Balcony door not locking",
    priority: "High",
    status: "Pending",
    unit: "B-101",
    building: "Tower B",
    resident: "Robert Taylor",
    residentContact: "+1 555 1004",
    technician: "",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 09:45",
    category: "Structural",
    locationDetail: "Tower B, Ground, Unit B-101",
    images: 2,
    description:
      "The sliding balcony door latch does not engage. Security concern for a ground floor unit.",
    timeline: [
      { label: "Created", by: "by Robert Taylor", at: "2026-08-06 09:45" },
    ],
    notes: [],
  },
  {
    id: "MR-005",
    title: "Power outlet not working in bedroom",
    priority: "Medium",
    status: "Assigned",
    unit: "B-102",
    building: "Tower B",
    resident: "Amanda Clark",
    residentContact: "+1 555 1005",
    technician: "Luis Fernandez",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-04 16:30",
    category: "Electrical",
    locationDetail: "Tower B, Ground, Unit B-102",
    images: 1,
    description:
      "Both bedroom outlets are dead. The breaker has been reset with no change.",
    timeline: [
      { label: "Created", by: "by Amanda Clark", at: "2026-08-04 16:30" },
      {
        label: "Assigned to Luis Fernandez",
        by: "by Admin",
        at: "2026-08-05 08:00",
      },
    ],
    notes: [],
  },
  {
    id: "MR-006",
    title: "Wall crack in living room",
    priority: "Low",
    status: "Completed",
    unit: "C-101",
    building: "Tower C",
    resident: "Laura Martinez",
    residentContact: "+1 555 1006",
    technician: "Mike Torres",
    supervisor: "Carlos Rivera",
    createdAt: "2026-07-28 10:00",
    category: "Structural",
    locationDetail: "Tower C, Ground, Unit C-101",
    images: 4,
    description:
      "Hairline crack running along the living room wall near the window frame.",
    timeline: [
      { label: "Created", by: "by Laura Martinez", at: "2026-07-28 10:00" },
      {
        label: "Assigned to Mike Torres",
        by: "by Admin",
        at: "2026-07-29 09:00",
      },
      { label: "Completed", by: "by Mike Torres", at: "2026-08-04 15:30" },
    ],
    notes: ["Crack filled and repainted; monitor for re-appearance next quarter."],
  },
  {
    id: "MR-007",
    title: "Water heater malfunction",
    priority: "Emergency",
    status: "In Progress",
    unit: "C-102",
    building: "Tower C",
    resident: "Kevin Anderson",
    residentContact: "+1 555 1007",
    technician: "Mike Torres",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 06:30",
    category: "Plumbing",
    locationDetail: "Tower C, Ground, Unit C-102",
    images: 2,
    description:
      "No hot water and a burning smell from the heater unit. Unit has been switched off at the isolator.",
    timeline: [
      { label: "Created", by: "by Kevin Anderson", at: "2026-08-06 06:30" },
      {
        label: "Assigned to Mike Torres",
        by: "by Admin",
        at: "2026-08-06 07:00",
      },
      { label: "Work started", by: "by Mike Torres", at: "2026-08-06 07:40" },
    ],
    notes: [],
  },
  {
    id: "MR-008",
    title: "Intercom not working",
    priority: "Medium",
    status: "Waiting Material",
    unit: "A-201",
    building: "Tower A",
    resident: "Emily Davis",
    residentContact: "+1 555 1008",
    technician: "Luis Fernandez",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-03 12:00",
    category: "Security System",
    locationDetail: "Tower A, Floor 2, Unit A-201",
    images: 1,
    description:
      "Door intercom handset is silent; visitors cannot be buzzed in from the unit.",
    timeline: [
      { label: "Created", by: "by Emily Davis", at: "2026-08-03 12:00" },
      {
        label: "Assigned to Luis Fernandez",
        by: "by Admin",
        at: "2026-08-03 14:00",
      },
      {
        label: "Waiting on replacement handset",
        by: "by Luis Fernandez",
        at: "2026-08-04 10:15",
      },
    ],
    notes: ["Replacement handset ordered from SecureView Tech, ETA 3 days."],
  },
  {
    id: "MR-009",
    title: "Window glass cracked",
    priority: "High",
    status: "Pending",
    unit: "B-201",
    building: "Tower B",
    resident: "James Wilson",
    residentContact: "+1 555 1009",
    technician: "",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 07:00",
    category: "Structural",
    locationDetail: "Tower B, Floor 2, Unit B-201",
    images: 3,
    description:
      "Bedroom window pane cracked across the corner, likely from the storm two nights ago.",
    timeline: [
      { label: "Created", by: "by James Wilson", at: "2026-08-06 07:00" },
    ],
    notes: [],
  },
  {
    id: "MR-010",
    title: "Smoke detector beeping",
    priority: "Medium",
    status: "Completed",
    unit: "C-301",
    building: "Tower C",
    resident: "Sophia Thomas",
    residentContact: "+1 555 1010",
    technician: "Luis Fernandez",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-01 09:00",
    category: "Security System",
    locationDetail: "Tower C, Floor 3, Unit C-301",
    images: 1,
    description: "Detector chirps every few minutes through the night.",
    timeline: [
      { label: "Created", by: "by Sophia Thomas", at: "2026-08-01 09:00" },
      {
        label: "Assigned to Luis Fernandez",
        by: "by Admin",
        at: "2026-08-01 11:00",
      },
      { label: "Completed", by: "by Luis Fernandez", at: "2026-08-02 13:20" },
    ],
    notes: ["Unit replaced; battery type logged for the next preventive cycle."],
  },
  {
    id: "MR-011",
    title: "Pest control needed in kitchen",
    priority: "High",
    status: "Rejected",
    unit: "A-301",
    building: "Tower A",
    resident: "Olivia Taylor",
    residentContact: "+1 555 1011",
    technician: "",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-05 15:00",
    category: "Pest Control",
    locationDetail: "Tower A, Floor 3, Unit A-301",
    images: 2,
    description: "Ants around the kitchen counter and under the sink cabinet.",
    timeline: [
      { label: "Created", by: "by Olivia Taylor", at: "2026-08-05 15:00" },
      {
        label: "Rejected — covered by scheduled treatment",
        by: "by Admin",
        at: "2026-08-05 17:30",
      },
    ],
    notes: ["Building-wide pest treatment already scheduled for 2026-08-12."],
  },
  {
    id: "MR-012",
    title: "Gym AC unit loud noise",
    priority: "Medium",
    status: "Pending",
    unit: "Common",
    building: "Tower A",
    resident: "Building Staff",
    residentContact: "+1 555 1000",
    technician: "",
    supervisor: "Carlos Rivera",
    createdAt: "2026-08-06 10:30",
    category: "Common Area",
    locationDetail: "Tower A, Level 2, Gym",
    images: 1,
    description:
      "Rattling noise from the gym air conditioner whenever the compressor starts.",
    timeline: [
      { label: "Created", by: "by Building Staff", at: "2026-08-06 10:30" },
    ],
    notes: [],
  },
];

/* -------------------------------- Technicians ------------------------------- */

export type Technician = {
  id: string;
  name: string;
  skills: string;
  rating: number;
  available: boolean;
};

export const technicians: Technician[] = [
  {
    id: "t1",
    name: "Mike Torres",
    skills: "Plumbing, Carpentry, Structural",
    rating: 4.8,
    available: false,
  },
  {
    id: "t2",
    name: "David Kim",
    skills: "HVAC, Electrical, Appliance Repair",
    rating: 4.6,
    available: false,
  },
  {
    id: "t3",
    name: "Luis Fernandez",
    skills: "Electrical, Electronics, Security Systems",
    rating: 4.9,
    available: false,
  },
  {
    id: "t4",
    name: "Ravi Patel",
    skills: "Plumbing, Welding, General Repair",
    rating: 4.5,
    available: true,
  },
  {
    id: "t5",
    name: "Tom Harrison",
    skills: "Carpentry, Painting, Drywall",
    rating: 4.7,
    available: true,
  },
];
