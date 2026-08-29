import {
  DoorClosed,
  Droplet,
  Refrigerator,
  Waves,
  Wifi,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { TenUpload } from "@/lib/ten/uploads";

/**
 * Maintenance the tenant has asked for, on the unit they rent.
 *
 * A tenant sees their own requests and nothing else — there is no property
 * filter here because there is nothing else to filter to. What the technician
 * and supervisor portals call a work order surfaces here only as a status, a
 * visit date and the name of the person coming round: a tenant may report a
 * fault, say when suits them, and confirm it was fixed. Assigning or scheduling
 * the technician is not theirs to do, and has no control anywhere in here.
 */

export const REQUEST_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Air Conditioning",
  "Appliance",
  "Water Leak",
  "Door / Lock",
  "Internet / Network",
  "Other",
] as const;
export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

/** The glyph on a request row — recognisable before the text is read. */
export const CATEGORY_ICON: Record<RequestCategory, LucideIcon> = {
  Plumbing: Droplet,
  Electrical: Zap,
  "Air Conditioning": Wind,
  Appliance: Refrigerator,
  "Water Leak": Waves,
  "Door / Lock": DoorClosed,
  "Internet / Network": Wifi,
  Other: Wrench,
};

export const CATEGORY_CHIP: Record<RequestCategory, string> = {
  Plumbing: "bg-[#eef3f9] text-[#2e6cad]",
  Electrical: "bg-amber-50 text-amber-500",
  "Air Conditioning": "bg-cyan-50 text-cyan-600",
  Appliance: "bg-violet-50 text-violet-500",
  "Water Leak": "bg-sky-50 text-sky-600",
  "Door / Lock": "bg-gray-100 text-gray-500",
  "Internet / Network": "bg-indigo-50 text-indigo-500",
  Other: "bg-gray-100 text-gray-500",
};

/**
 * The lifecycle a request walks, in order. Position in this list drives the
 * progress bar and the timeline, so a status can never disagree with how far
 * along it looks.
 */
export const REQUEST_STATUSES = [
  "Submitted",
  "Under Review",
  "Work Order Created",
  "Technician Assigned",
  "In Progress",
  "Completed",
  "Closed",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

const STATUS_PROGRESS: Record<RequestStatus, number> = {
  Submitted: 10,
  "Under Review": 25,
  "Work Order Created": 45,
  "Technician Assigned": 60,
  "In Progress": 75,
  Completed: 100,
  Closed: 100,
};

export function requestProgress(status: RequestStatus) {
  return STATUS_PROGRESS[status];
}

/** How far through `REQUEST_STATUSES` a request has walked. */
export function statusIndex(status: RequestStatus) {
  return REQUEST_STATUSES.indexOf(status);
}

/** Work still on the property's plate — the count the dashboard tile shows. */
export function isOpenRequest(request: TenMaintenanceRequest) {
  return request.status !== "Completed" && request.status !== "Closed";
}

export function isFinishedRequest(request: TenMaintenanceRequest) {
  return request.status === "Completed" || request.status === "Closed";
}

/** Someone is booked in and has not been yet. */
export function isScheduledRequest(request: TenMaintenanceRequest) {
  return isOpenRequest(request) && request.appointment !== null;
}

/**
 * A finished job the tenant has not yet signed off.
 *
 * This is the only point in the flow a tenant may move a request forward
 * themselves — everything before it is the property's to advance.
 */
export function awaitsConfirmation(request: TenMaintenanceRequest) {
  return request.status === "Completed";
}

export const REQUEST_PRIORITIES = ["Low", "Medium", "High"] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

/** The dot beside a request — how loudly it is asking to be looked at. */
export const PRIORITY_DOT: Record<RequestPriority, string> = {
  Low: "bg-green-500",
  Medium: "bg-amber-400",
  High: "bg-rose-500",
};

export const PRIORITY_TEXT: Record<RequestPriority, string> = {
  Low: "text-green-600",
  Medium: "text-amber-600",
  High: "text-rose-600",
};

/**
 * A part the technician fitted. Quantity is free text because a job uses
 * "2 meters" of pipe and "1" valve, and forcing both into a number would lose
 * the unit that makes the first one mean anything.
 */
export type RequestMaterial = {
  name: string;
  quantity: string;
};

/**
 * One thing that happened to the request, as the property recorded it.
 *
 * Kept as a log rather than derived from the status: a status says where a job
 * is now, and a tenant reading "what happened to my leak" wants the steps and
 * the times, including the ones that leave the status where it was.
 */
export type TimelineEvent = {
  label: string;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`. */
  time: string;
};

/** Who the property is sending. Named only once someone is assigned. */
export type Technician = {
  name: string;
  trade: string;
  phone: string;
};

export type TenMaintenanceRequest = {
  id: string;
  description: string;
  category: RequestCategory;
  /** Where in the unit. */
  location: string;
  /** ISO day the tenant raised it. */
  submitted: string;

  /** When the tenant said would suit — an ask, not a booking. */
  preferredDate: string | null;
  /** 24-hour `HH:MM`. */
  preferredTime: string | null;

  /** The visit the property actually booked, where one is booked. */
  appointment: string | null;
  appointmentTime: string | null;

  priority: RequestPriority;
  status: RequestStatus;
  technician: Technician | null;

  /** Filled in when the work was signed off. */
  completedOn: string | null;
  completionNote: string | null;

  /** Parts fitted so far — empty until a technician has been on site. */
  materials: RequestMaterial[];
  /** Oldest first, the way the log reads. */
  timeline: TimelineEvent[];

  photos: TenUpload[];
};

/**
 * The date a tenant cares about: when someone is coming, failing that when
 * they asked for, and failing that when they raised it.
 */
export function requestDate(request: TenMaintenanceRequest) {
  return request.appointment ?? request.preferredDate ?? request.submitted;
}

/**
 * Newest first, the way the list reads. Two are still open, which is what the
 * dashboard's maintenance card counts.
 */
export const tenMaintenanceRequests: TenMaintenanceRequest[] = [
  {
    id: "MR-2026-0845",
    description:
      "The kitchen sink has been draining slowly for about a week and now backs up when the tap runs. Water sits in the basin for several minutes before clearing.",
    category: "Plumbing",
    location: "Kitchen",
    submitted: "2026-08-10",
    preferredDate: "2026-08-11",
    preferredTime: "10:00",
    appointment: "2026-08-11",
    appointmentTime: "10:30",
    priority: "High",
    status: "In Progress",
    technician: {
      name: "John Perera",
      trade: "Plumbing",
      phone: "+94 77 601 2244",
    },
    materials: [
      { name: "PVC Pipe", quantity: "2 meters" },
      { name: "Shut-off Valve", quantity: "1" },
    ],
    timeline: [
      { label: "Request Created", date: "2026-08-10", time: "09:15" },
      { label: "Reviewed by Field Supervisor", date: "2026-08-10", time: "10:00" },
      { label: "Assigned to John Perera", date: "2026-08-10", time: "10:30" },
      { label: "Technician Started Work", date: "2026-08-11", time: "10:42" },
      {
        label: "Pipe partially replaced, testing for leakage",
        date: "2026-08-11",
        time: "12:15",
      },
    ],
    completedOn: null,
    completionNote: null,
    photos: [],
  },
  {
    id: "MR-2026-0821",
    description:
      "The socket beside the bed in the master bedroom has no power. The other sockets in the room are fine and the breaker has not tripped.",
    category: "Electrical",
    location: "Master Bedroom",
    submitted: "2026-08-06",
    preferredDate: "2026-08-14",
    preferredTime: "14:00",
    appointment: "2026-08-14",
    appointmentTime: "14:30",
    priority: "Medium",
    status: "Technician Assigned",
    technician: {
      name: "Nimal Fernando",
      trade: "Electrical",
      phone: "+94 71 344 8890",
    },
    materials: [],
    timeline: [
      { label: "Request Created", date: "2026-08-06", time: "16:20" },
      { label: "Reviewed by Field Supervisor", date: "2026-08-07", time: "09:10" },
      { label: "Work Order Created", date: "2026-08-07", time: "11:45" },
      { label: "Assigned to Nimal Fernando", date: "2026-08-08", time: "09:30" },
    ],
    completedOn: null,
    completionNote: null,
    photos: [],
  },
  {
    id: "MR-2026-0790",
    description:
      "The living room AC runs but does not cool. Temperature stays around 28 C even when set to 22 C. The filter was cleaned with no change.",
    category: "Air Conditioning",
    location: "Living Room",
    submitted: "2026-07-22",
    preferredDate: "2026-07-24",
    preferredTime: "09:00",
    appointment: "2026-07-24",
    appointmentTime: "09:00",
    priority: "Medium",
    status: "Completed",
    technician: {
      name: "Ravi Silva",
      trade: "HVAC",
      phone: "+94 76 220 1187",
    },
    completedOn: "2026-07-24",
    completionNote:
      "Recharged refrigerant and replaced a failed capacitor. Cooling tested down to 18 C over 30 minutes.",
    materials: [
      { name: "Refrigerant R-32", quantity: "450 g" },
      { name: "Capacitor 35uF", quantity: "1" },
    ],
    timeline: [
      { label: "Request Created", date: "2026-07-22", time: "08:05" },
      { label: "Reviewed by Field Supervisor", date: "2026-07-22", time: "10:20" },
      { label: "Assigned to Ravi Silva", date: "2026-07-22", time: "14:00" },
      { label: "Technician Started Work", date: "2026-07-24", time: "09:05" },
      { label: "Work Completed", date: "2026-07-24", time: "11:40" },
    ],
    photos: [],
  },
  {
    id: "MR-2026-0755",
    description:
      "The guest bathroom door latch sticks and has to be forced to open. It has caught twice with someone inside.",
    category: "Door / Lock",
    location: "Guest Bathroom",
    submitted: "2026-06-28",
    preferredDate: "2026-06-30",
    preferredTime: "11:00",
    appointment: "2026-06-30",
    appointmentTime: "11:00",
    priority: "Low",
    status: "Closed",
    technician: {
      name: "Ravi Silva",
      trade: "General Repair",
      phone: "+94 76 220 1187",
    },
    completedOn: "2026-06-30",
    materials: [
      { name: "Door Latch Assembly", quantity: "1" },
      { name: "Lubricant Spray", quantity: "1" },
    ],
    timeline: [
      { label: "Request Created", date: "2026-06-28", time: "18:40" },
      { label: "Assigned to Ravi Silva", date: "2026-06-29", time: "09:15" },
      { label: "Technician Started Work", date: "2026-06-30", time: "11:00" },
      { label: "Work Completed", date: "2026-06-30", time: "11:35" },
      { label: "Confirmed by Tenant", date: "2026-06-30", time: "19:02" },
    ],
    completionNote: "Latch realigned and lubricated. Confirmed by tenant.",
    photos: [],
  },
];
