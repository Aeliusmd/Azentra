/**
 * Maintenance the resident has asked for, on their own unit.
 *
 * A resident sees their own requests and nothing else — there is no property
 * filter here because there is nothing else to filter to. What the technician
 * portal calls a work order appears here only as a status, a date and the name
 * of the person coming round.
 */

export const REQUEST_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "AC / HVAC",
  "Appliance",
  "Water Leak",
  "Door / Lock",
  "Internet / Network",
  "General Repair",
] as const;
export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

/**
 * The lifecycle a request walks, in order. Position in this list is what drives
 * the progress bar, so a status can never disagree with how far along it looks.
 */
export const REQUEST_STATUSES = [
  "Submitted",
  "Under Review",
  "Work Order Created",
  "Technician Assigned",
  "Scheduled",
  "In Progress",
  "Awaiting Confirmation",
  "Completed",
  "Closed",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** How far through the job each status is, as a percentage. */
const STATUS_PROGRESS: Record<RequestStatus, number> = {
  Submitted: 10,
  "Under Review": 25,
  "Work Order Created": 40,
  "Technician Assigned": 55,
  Scheduled: 55,
  "In Progress": 65,
  "Awaiting Confirmation": 85,
  Completed: 100,
  Closed: 100,
};

export function requestProgress(status: RequestStatus) {
  return STATUS_PROGRESS[status];
}

/** Work still on the property's plate — the count the dashboard tile shows. */
export function isOpenRequest(request: MaintenanceRequest) {
  return request.status !== "Completed" && request.status !== "Closed";
}

/** Requests the resident considers finished, whichever way they were closed. */
export function isFinishedRequest(request: MaintenanceRequest) {
  return request.status === "Completed" || request.status === "Closed";
}

export const REQUEST_PRIORITIES = ["Low", "Medium", "High"] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

/** The dot beside a request — how loudly it is asking to be looked at. */
export const PRIORITY_DOT: Record<RequestPriority, string> = {
  Low: "bg-green-500",
  Medium: "bg-amber-400",
  High: "bg-rose-500",
};

/** Radio label colour on the new-request form, matching the dot. */
export const PRIORITY_TEXT: Record<RequestPriority, string> = {
  Low: "text-green-600",
  Medium: "text-amber-600",
  High: "text-rose-600",
};

export type RequestPhoto = {
  id: string;
  name: string;
  /** Object URL of the picked file — never uploaded anywhere. */
  url: string;
};

export type MaintenanceRequest = {
  id: string;
  description: string;
  category: RequestCategory;
  /** Where in the unit — the resident's own words. */
  location: string;
  /** ISO day the resident raised it. */
  submitted: string;
  /** ISO day of the booked visit, where one is set. */
  appointment: string | null;
  /** 24-hour `HH:MM` for the appointment, or when it was raised. */
  time: string;
  priority: RequestPriority;
  status: RequestStatus;
  /** Named only once someone has been assigned. */
  technician: string | null;
  photos: RequestPhoto[];
};

/**
 * The date a resident cares about: when someone is coming, and failing that,
 * when they asked. Stored as two fields so neither has to be overwritten.
 */
export function requestDate(request: MaintenanceRequest) {
  return request.appointment ?? request.submitted;
}

/**
 * Newest first, the way the list reads. Two are still open, which is what the
 * dashboard's maintenance tile counts.
 */
export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "MR-2026-0845",
    description:
      "Bathroom ceiling has continuous water leakage from the AC unit. Water is dripping onto the floor and causing damage to the ceiling paint.",
    category: "Plumbing",
    location: "Master Bathroom",
    submitted: "2026-08-09",
    appointment: "2026-08-11",
    time: "10:30",
    priority: "High",
    status: "In Progress",
    technician: "John Perera",
    photos: [],
  },
  {
    id: "MR-2026-0821",
    description:
      "Kitchen circuit breaker trips every time the microwave and toaster are used together. Need inspection of the electrical panel.",
    category: "Electrical",
    location: "Kitchen",
    submitted: "2026-08-05",
    appointment: "2026-08-14",
    time: "14:00",
    priority: "Medium",
    status: "Scheduled",
    technician: "Michael Chen",
    photos: [],
  },
  {
    id: "MR-2026-0790",
    description:
      "Living room AC is not cooling properly. Temperature stays around 28°C even when set to 22°C. Filter may need cleaning or gas refill.",
    category: "AC / HVAC",
    location: "Living Room",
    submitted: "2026-07-20",
    appointment: "2026-07-22",
    time: "09:00",
    priority: "Medium",
    status: "Completed",
    technician: "Sarah Lee",
    photos: [],
  },
  {
    id: "MR-2026-0755",
    description:
      "Master bedroom window handle is broken and window cannot be closed properly. Security risk as it is on the 3rd floor.",
    category: "General Repair",
    location: "Master Bedroom",
    submitted: "2026-07-08",
    appointment: "2026-07-10",
    time: "11:00",
    priority: "Low",
    status: "Completed",
    technician: "David Kumar",
    photos: [],
  },
];
