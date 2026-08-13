import type { PillTone } from "@/components/pm/ui/pill";

import type { FsWorkOrderCategory } from "@/lib/fs/work-orders-data";

/**
 * Resident requests as they look once they reach field operations. The
 * supervisor monitors them here — raising and closing them belongs to the
 * Property Manager's portal, so nothing on this page mutates a request.
 *
 * Mock data — swap for a `src/lib/api.ts` call when the backend lands.
 */

export const MR_STATUSES = [
  "New",
  "Assigned",
  "In Progress",
  "Waiting",
  "Completed",
  "Reopened",
] as const;
export type MaintenanceRequestStatus = (typeof MR_STATUSES)[number];

export const MR_STATUS_TONE: Record<MaintenanceRequestStatus, PillTone> = {
  New: "green",
  Assigned: "navy",
  "In Progress": "amber",
  Waiting: "purple",
  Completed: "green",
  Reopened: "orange",
};

/** Residents pick "Emergency"; the supervisor's own jobs use "Critical". */
export const MR_PRIORITIES = ["Low", "Medium", "High", "Emergency"] as const;
export type MaintenanceRequestPriority = (typeof MR_PRIORITIES)[number];

export const MR_PRIORITY_TONE: Record<MaintenanceRequestPriority, PillTone> = {
  Low: "slate",
  Medium: "amber",
  High: "orange",
  Emergency: "red",
};

export type MaintenanceRequest = {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  property: string;
  building: string;
  unit: string;
  resident: string;
  residentPhone: string;
  category: FsWorkOrderCategory;
  priority: MaintenanceRequestPriority;
  status: MaintenanceRequestStatus;
  /** Named once the supervisor puts someone on it. */
  technician: string | null;
  /** The job raised off this request, when one exists. */
  workOrderId: string | null;
  /** `YYYY-MM-DD HH:MM`. */
  submittedAt: string;
  dueDate: string;
  /** Resident-supplied evidence — captions only, nothing is uploaded. */
  photos: { id: string; caption: string }[];
};

/**
 * The clock the age column is measured against. Fixed rather than `Date.now()`
 * so the server and client render the same string.
 */
export const NOW = "2026-08-12 14:00";

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "MR-0012",
    title: "Water Leakage - Bathroom Ceiling",
    description:
      "Water dripping from the bathroom ceiling onto the floor tiles. Getting worse through the day.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    unit: "A-304",
    resident: "Sarah Johnson",
    residentPhone: "+1 555 0411",
    category: "Plumbing",
    priority: "High",
    status: "In Progress",
    technician: "John Perera",
    workOrderId: "WO-1041",
    submittedAt: "2026-08-10 14:00",
    dueDate: "2026-08-14",
    photos: [
      { id: "mrp1", caption: "Stained ceiling panel" },
      { id: "mrp2", caption: "Water pooling on tiles" },
    ],
  },
  {
    id: "MR-0013",
    title: "AC Not Cooling",
    description:
      "Split unit runs but only blows warm air. Started after the weekend.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-202",
    resident: "Mike Peterson",
    residentPhone: "+1 555 0412",
    category: "HVAC",
    priority: "Medium",
    status: "In Progress",
    technician: "Ahmed Khan",
    workOrderId: "WO-1043",
    submittedAt: "2026-08-11 12:00",
    dueDate: "2026-08-14",
    photos: [],
  },
  {
    id: "MR-0014",
    title: "Kitchen Sink Clogged",
    description:
      "Sink drains very slowly and leaves standing water. A plunger did not help.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    unit: "A-102",
    resident: "Emily Watson",
    residentPhone: "+1 555 0413",
    category: "Plumbing",
    priority: "High",
    status: "New",
    technician: null,
    workOrderId: "WO-1054",
    submittedAt: "2026-08-12 09:00",
    dueDate: "2026-08-13",
    photos: [{ id: "mrp3", caption: "Standing water in sink" }],
  },
  {
    id: "MR-0015",
    title: "Electrical Outlets Not Working",
    description:
      "Three outlets in the living room are dead. The breaker has not tripped.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-305",
    resident: "Robert Taylor",
    residentPhone: "+1 555 0414",
    category: "Electrical",
    priority: "Medium",
    status: "New",
    technician: null,
    workOrderId: null,
    submittedAt: "2026-08-12 11:00",
    dueDate: "2026-08-14",
    photos: [],
  },
  {
    id: "MR-0016",
    title: "Bathroom Tile Replacement",
    description:
      "Two floor tiles are cracked near the shower and one corner is lifting.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    unit: "A-205",
    resident: "Lisa Chen",
    residentPhone: "+1 555 0415",
    category: "Carpentry",
    priority: "Medium",
    status: "New",
    technician: null,
    workOrderId: null,
    submittedAt: "2026-08-12 12:00",
    dueDate: "2026-08-16",
    photos: [{ id: "mrp4", caption: "Cracked tiles by the shower" }],
  },
  {
    id: "MR-0011",
    title: "Window Seal Leaking",
    description: "Rain seeps past the living-room window seal in heavy weather.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-102",
    resident: "David Lee",
    residentPhone: "+1 555 0416",
    category: "Carpentry",
    priority: "Low",
    status: "Completed",
    technician: "David Chen",
    workOrderId: null,
    submittedAt: "2026-08-08 14:00",
    dueDate: "2026-08-10",
    photos: [],
  },
  {
    id: "MR-0010",
    title: "Ceiling Fan Installation",
    description: "Resident supplied a fan and asked for it to be fitted.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-503",
    resident: "Anna Martinez",
    residentPhone: "+1 555 0417",
    category: "Electrical",
    priority: "Low",
    status: "Completed",
    technician: "Michael Torres",
    workOrderId: null,
    submittedAt: "2026-08-06 14:00",
    dueDate: "2026-08-08",
    photos: [],
  },
  {
    id: "MR-0017",
    title: "Door Lock Jammed",
    description:
      "Front door lock will not turn. Resident is locked out of the unit.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-104",
    resident: "Tom Harris",
    residentPhone: "+1 555 0418",
    category: "Carpentry",
    priority: "Emergency",
    status: "New",
    technician: null,
    workOrderId: null,
    submittedAt: "2026-08-12 13:00",
    dueDate: "2026-08-12",
    photos: [],
  },
  {
    id: "MR-0018",
    title: "Water Pressure Low",
    description:
      "Weak flow at every tap in the unit, worst in the mornings.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    unit: "A-602",
    resident: "Nancy Green",
    residentPhone: "+1 555 0419",
    category: "Plumbing",
    priority: "High",
    status: "New",
    technician: null,
    workOrderId: null,
    submittedAt: "2026-08-10 13:00",
    dueDate: "2026-08-13",
    photos: [],
  },
  {
    id: "MR-0009",
    title: "Corridor Light Flickering",
    description: "Two fittings on the west corridor flicker at night.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    unit: "Level 6",
    resident: "Housekeeping",
    residentPhone: "+1 555 0420",
    category: "Electrical",
    priority: "Low",
    status: "Waiting",
    technician: "Tom Harrison",
    workOrderId: "WO-1046",
    submittedAt: "2026-08-11 14:30",
    dueDate: "2026-08-14",
    photos: [],
  },
  {
    id: "MR-0008",
    title: "Intercom Still Cutting Out",
    description:
      "Handset was replaced last week but the audio drops again on some calls.",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    unit: "B-505",
    resident: "Emma Clark",
    residentPhone: "+1 555 0421",
    category: "Electrical",
    priority: "Medium",
    status: "Reopened",
    technician: "Sarah Wilson",
    workOrderId: "WO-1036",
    submittedAt: "2026-08-11 09:30",
    dueDate: "2026-08-15",
    photos: [],
  },
  {
    id: "MR-2005",
    title: "Lobby Air Conditioning Warm",
    description: "The lobby cassette unit has been blowing warm since Monday.",
    propertyId: "green-valley",
    property: "Green Valley Towers",
    building: "Block 1",
    unit: "Lobby",
    resident: "Front Desk",
    residentPhone: "+1 555 0431",
    category: "HVAC",
    priority: "High",
    status: "In Progress",
    technician: "Nadia Rahman",
    workOrderId: "WO-2011",
    submittedAt: "2026-08-12 07:00",
    dueDate: "2026-08-13",
    photos: [],
  },
];

/** Hours between two `YYYY-MM-DD HH:MM` stamps. */
function hoursBetween(from: string, to: string) {
  const parse = (stamp: string) => {
    const [date, clock] = stamp.split(" ");
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = clock.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes).getTime();
  };

  return (parse(to) - parse(from)) / 3_600_000;
}

/** How long a request has been open — `5 hours`, `2 days`. */
export function ageLabel(submittedAt: string, now = NOW) {
  const hours = hoursBetween(submittedAt, now);
  const rounded = Math.max(1, Math.round(hours));

  // Rounding first keeps 23.5 hours from reading as "24 hours".
  if (rounded < 24) return `${rounded} hour${rounded === 1 ? "" : "s"}`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

/** Oldest first is wrong here — the newest request is the one to look at. */
export function byNewest(a: MaintenanceRequest, b: MaintenanceRequest) {
  return b.submittedAt.localeCompare(a.submittedAt);
}

export function requestsAt(propertyId: string) {
  return maintenanceRequests.filter(
    (request) => request.propertyId === propertyId,
  );
}
