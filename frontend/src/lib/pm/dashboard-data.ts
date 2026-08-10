import type { StatusTone } from "@/components/pm/status-badge";

/**
 * Mock dashboard data, keyed by property id so switching properties in the
 * header swaps every number on the page. Replace `dashboardFor` with a
 * `src/lib/api.ts` call when the backend exposes the endpoint.
 */

export type SummaryCounts = {
  totalUnits: number;
  occupied: number;
  vacant: number;
  inMaintenance: number;
  workOrders: number;
  bookings: number;
  issues: number;
};

export type Highlights = {
  pendingRequests: number;
  urgentRequests: number;
  assignedJobs: number;
  completedJobs: number;
};

export type TimelineKind =
  | "request"
  | "completed"
  | "resident"
  | "booking"
  | "emergency"
  | "verified";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  title: string;
  time: string;
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  tone: StatusTone;
};

export type UpcomingEvent = {
  id: string;
  date: string;
  title: string;
};

export type PmDashboard = {
  summary: SummaryCounts;
  highlights: Highlights;
  timeline: TimelineItem[];
  schedule: ScheduleItem[];
  upcoming: UpcomingEvent[];
};

const sunrise: PmDashboard = {
  summary: {
    totalUnits: 180,
    occupied: 133,
    vacant: 42,
    inMaintenance: 5,
    workOrders: 4,
    bookings: 3,
    issues: 6,
  },
  highlights: {
    pendingRequests: 4,
    urgentRequests: 2,
    assignedJobs: 2,
    completedJobs: 2,
  },
  timeline: [
    {
      id: "T1",
      kind: "request",
      title: "New maintenance request: Water leakage in A-101",
      time: "2 hours ago",
    },
    {
      id: "T2",
      kind: "completed",
      title: "Mike Torres completed wall crack repair in C-101",
      time: "6 days ago",
    },
    {
      id: "T3",
      kind: "resident",
      title: "New tenant registered in unit B-201",
      time: "1 day ago",
    },
    {
      id: "T4",
      kind: "booking",
      title: "Facility booking approved: Tennis Court for Robert Taylor",
      time: "3 days ago",
    },
    {
      id: "T5",
      kind: "emergency",
      title: "Emergency request: Water heater malfunction in C-102",
      time: "1 day ago",
    },
    {
      id: "T6",
      kind: "verified",
      title: "Luis Fernandez replaced smoke detector in C-301",
      time: "5 days ago",
    },
  ],
  schedule: [
    { id: "S1", time: "08:30", title: "Pool Safety Inspection", tone: "amber" },
    {
      id: "S2",
      time: "09:00",
      title: "MR-001: Bathroom leak repair",
      tone: "green",
    },
    {
      id: "S3",
      time: "14:00",
      title: "MR-005: Outlet replacement",
      tone: "green",
    },
  ],
  upcoming: [
    { id: "U1", date: "Aug 10", title: "Common Area Assessment" },
    { id: "U2", date: "Aug 12", title: "Pest Control Inspection" },
    { id: "U3", date: "Aug 15", title: "Annual Fire Drill" },
    { id: "U4", date: "Aug 15", title: "Elevator Safety Check" },
  ],
};

const greenValley: PmDashboard = {
  summary: {
    totalUnits: 96,
    occupied: 71,
    vacant: 22,
    inMaintenance: 3,
    workOrders: 2,
    bookings: 1,
    issues: 4,
  },
  highlights: {
    pendingRequests: 3,
    urgentRequests: 1,
    assignedJobs: 3,
    completedJobs: 5,
  },
  timeline: [
    {
      id: "T1",
      kind: "emergency",
      title: "Emergency request: Power trip on Block 1 floor 3",
      time: "40 minutes ago",
    },
    {
      id: "T2",
      kind: "request",
      title: "New maintenance request: CCTV offline in car park",
      time: "6 hours ago",
    },
    {
      id: "T3",
      kind: "completed",
      title: "Ravi Kumar completed water pump servicing",
      time: "2 days ago",
    },
    {
      id: "T4",
      kind: "resident",
      title: "New owner registered in unit 2-505",
      time: "4 days ago",
    },
  ],
  schedule: [
    { id: "S1", time: "10:00", title: "Block 2 roof leak survey", tone: "blue" },
    {
      id: "S2",
      time: "15:30",
      title: "WO-0442: CCTV camera swap",
      tone: "green",
    },
  ],
  upcoming: [
    { id: "U1", date: "Aug 11", title: "Fire Extinguisher Audit" },
    { id: "U2", date: "Aug 13", title: "Move-Out Inspection — 2-402" },
    { id: "U3", date: "Aug 16", title: "Water Pump Equipment Check" },
  ],
};

const BY_PROPERTY: Record<string, PmDashboard> = {
  sunrise,
  "green-valley": greenValley,
};

export function dashboardFor(propertyId: string): PmDashboard {
  return BY_PROPERTY[propertyId] ?? sunrise;
}
