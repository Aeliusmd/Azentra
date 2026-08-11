/**
 * Mock calendar events. Dates are fixed strings rather than derived from the
 * clock so the page renders identically on the server and the client.
 */

/** Types shown in the legend. `Task` and `Note` are the manager's own items. */
export const EVENT_TYPES = [
  "Maintenance",
  "Inspection",
  "Booking",
  "Announcement",
  "Task",
] as const;
export type EventType = (typeof EVENT_TYPES)[number] | "Note";

/** Legend caption — "Task" reads as "My Tasks" to the manager. */
export const EVENT_TYPE_LABEL: Record<(typeof EVENT_TYPES)[number], string> = {
  Maintenance: "Maintenance",
  Inspection: "Inspection",
  Booking: "Booking",
  Announcement: "Announcement",
  Task: "My Tasks",
};

/** Dot / marker colour per type. */
export const EVENT_COLOR: Record<EventType, string> = {
  Maintenance: "#22a35c",
  Inspection: "#e8a33d",
  Booking: "#2e6cad",
  Announcement: "#647a91",
  Task: "#8a93a0",
  Note: "#8a93a0",
};

/** Chip / card surface per type — green for work, amber for checks, slate for the rest. */
export const EVENT_SURFACE: Record<EventType, string> = {
  Maintenance: "border-green-200 bg-green-50/80 text-ink",
  Inspection: "border-amber-200 bg-amber-50/80 text-ink",
  Booking: "border-slate-200 bg-slate-50 text-ink",
  Announcement: "border-slate-200 bg-slate-50 text-ink",
  Task: "border-slate-200 bg-slate-50 text-ink",
  Note: "border-slate-200 bg-slate-50 text-ink",
};

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = (typeof PRIORITIES)[number];

/** Types the manager can pick when adding an item of their own. */
export const TASK_TYPES = [
  "Task",
  "Note",
  "Maintenance",
  "Inspection",
] as const;

export type CalendarEvent = {
  id: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 24h `HH:MM`. */
  time: string;
  title: string;
  type: EventType;
  description?: string;
  status?: string;
  priority?: Priority;
};

/** The day the calendar opens on. */
export const TODAY = "2026-08-11";

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    date: "2026-08-01",
    time: "09:00",
    title: "Generator 500kVA service",
    type: "Maintenance",
    description: "Quarterly load test, oil change, coolant top-up.",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e2",
    date: "2026-08-01",
    time: "14:00",
    title: "August fee reminder notice",
    type: "Announcement",
    description: "Maintenance fee reminder posted to all residents.",
    status: "Active",
  },

  {
    id: "e3",
    date: "2026-08-02",
    time: "08:00",
    title: "Garden irrigation check",
    type: "Maintenance",
    description: "Sprinkler zones 1-4, timer calibration.",
    status: "Scheduled",
    priority: "Low",
  },

  {
    id: "e4",
    date: "2026-08-03",
    time: "07:00",
    title: "Water treatment plant service",
    type: "Maintenance",
    description: "Filter media backwash and chemical dosing review.",
    status: "Scheduled",
    priority: "High",
  },
  {
    id: "e5",
    date: "2026-08-03",
    time: "10:00",
    title: "Common Area Condition Assessment",
    type: "Inspection",
    description: "Lobby, corridors and stairwells walk-through.",
    status: "Scheduled",
  },
  {
    id: "e6",
    date: "2026-08-03",
    time: "14:00",
    title: "MR-008: Intercom system repair",
    type: "Maintenance",
    description: "Tower B panel not calling units 3F-5F.",
    status: "Assigned",
    priority: "Medium",
  },

  {
    id: "e7",
    date: "2026-08-04",
    time: "06:00",
    title: "Swimming Pool weekly cleaning",
    type: "Maintenance",
    description: "AquaClean Services: chemical balance, filter backwash.",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e8",
    date: "2026-08-04",
    time: "09:00",
    title: "Staff weekly sync",
    type: "Task",
    description: "Open jobs, vendor schedule, escalations.",
    priority: "Medium",
  },
  {
    id: "e9",
    date: "2026-08-04",
    time: "16:30",
    title: "MR-005: Power outlet replacement B-204",
    type: "Maintenance",
    status: "Assigned",
    priority: "Medium",
  },

  {
    id: "e10",
    date: "2026-08-05",
    time: "08:00",
    title: "Fire Drill announcement",
    type: "Announcement",
    description: "Notice published ahead of the annual evacuation drill.",
    status: "Active",
  },
  {
    id: "e11",
    date: "2026-08-05",
    time: "11:00",
    title: "MR-002: AC diagnostics A-102",
    type: "Maintenance",
    description: "Cooling below setpoint, gas pressure check.",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "e12",
    date: "2026-08-05",
    time: "14:00",
    title: "Vendor meeting - AquaClean",
    type: "Task",
    description: "Renewal terms and monthly service window.",
    priority: "Medium",
  },

  {
    id: "e13",
    date: "2026-08-06",
    time: "06:30",
    title: "MR-007: Emergency light replacement",
    type: "Maintenance",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "e14",
    date: "2026-08-06",
    time: "08:00",
    title: "Gym equipment servicing",
    type: "Maintenance",
    description: "Treadmill belts and cable machine inspection.",
    status: "Scheduled",
    priority: "Low",
  },
  {
    id: "e15",
    date: "2026-08-06",
    time: "10:30",
    title: "MR-012: Gym AC compressor check",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e16",
    date: "2026-08-06",
    time: "15:00",
    title: "Rooftop terrace - private event",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e17",
    date: "2026-08-06",
    time: "18:00",
    title: "Community Hall: AGM setup",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e18",
    date: "2026-08-07",
    time: "08:30",
    title: "Pool Safety Inspection",
    type: "Inspection",
    description: "Depth markings, rescue equipment, water clarity.",
    status: "Scheduled",
  },
  {
    id: "e19",
    date: "2026-08-07",
    time: "09:00",
    title: "MR-001: Bathroom leak repair",
    type: "Maintenance",
    description: "Unit A-304 shower mixer leaking into ceiling below.",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "e20",
    date: "2026-08-07",
    time: "14:00",
    title: "MR-005: Bedroom socket rewiring",
    type: "Maintenance",
    status: "Assigned",
    priority: "Medium",
  },
  {
    id: "e21",
    date: "2026-08-07",
    time: "17:00",
    title: "Tennis Court: Robert Taylor",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e22",
    date: "2026-08-08",
    time: "07:00",
    title: "Tennis Court: Doubles Match",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e23",
    date: "2026-08-08",
    time: "10:00",
    title: "MR-008: Intercom follow-up",
    type: "Maintenance",
    status: "Assigned",
    priority: "Medium",
  },
  {
    id: "e24",
    date: "2026-08-08",
    time: "14:00",
    title: "Community yoga class",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e25",
    date: "2026-08-09",
    time: "06:00",
    title: "Lobby chandelier bulb replacement",
    type: "Maintenance",
    description: "Scissor lift booked, lobby cordoned 06:00-08:00.",
    status: "Started",
    priority: "Low",
  },
  {
    id: "e26",
    date: "2026-08-09",
    time: "07:00",
    title: "Community Yoga Class",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e27",
    date: "2026-08-09",
    time: "18:00",
    title: "Tennis Court: Doubles Match",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e28",
    date: "2026-08-10",
    time: "09:00",
    title: "Water supply interruption (9AM-3PM)",
    type: "Announcement",
    description: "Main line maintenance - storage tanks filled overnight.",
    status: "Active",
  },
  {
    id: "e29",
    date: "2026-08-10",
    time: "09:00",
    title: "Main water line maintenance",
    type: "Maintenance",
    description: "Valve replacement on the Tower A riser.",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "e30",
    date: "2026-08-10",
    time: "10:00",
    title: "Gym HVAC preventive maintenance",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e31",
    date: "2026-08-10",
    time: "18:00",
    title: "Community Hall: Birthday Party",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e32",
    date: "2026-08-10",
    time: "08:00",
    title: "Parking Lot A: Guest Parking",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e33",
    date: "2026-08-11",
    time: "08:00",
    title: "Swimming Pool weekly cleaning",
    type: "Maintenance",
    description:
      "AquaClean Services: chemical balance, filter backwash, water quality testing, drain inspection.",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "e34",
    date: "2026-08-11",
    time: "09:00",
    title: "Staff morning huddle",
    type: "Task",
    description:
      "Daily briefing: open jobs status, new maintenance requests, vendor arrivals today.",
    priority: "Medium",
  },
  {
    id: "e35",
    date: "2026-08-11",
    time: "13:00",
    title: "MR-003: Kitchen sink drain C-101",
    type: "Maintenance",
    description:
      "Slow draining kitchen sink. Mechanical snake + enzymatic treatment needed. Ravi Patel assigned.",
    status: "Assigned",
    priority: "Medium",
  },
  {
    id: "e36",
    date: "2026-08-11",
    time: "15:00",
    title: "MR-009: Window glass quote",
    type: "Task",
    description:
      "Living room window cracked. Get vendor quote for replacement glass panel. Urgent - safety risk.",
    status: "Pending",
    priority: "High",
  },

  {
    id: "e37",
    date: "2026-08-12",
    time: "08:00",
    title: "Parking Lot A closed - Day 1",
    type: "Announcement",
    description: "Resurfacing works, use visitor bays in Lot B.",
    status: "Active",
  },
  {
    id: "e38",
    date: "2026-08-12",
    time: "09:00",
    title: "Parking Lot A re-striping",
    type: "Maintenance",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "e39",
    date: "2026-08-12",
    time: "10:00",
    title: "Pest Control Inspection",
    type: "Inspection",
    description: "Tower A basement and refuse rooms.",
    status: "Scheduled",
  },
  {
    id: "e40",
    date: "2026-08-12",
    time: "10:00",
    title: "Pool: Kids Swimming Party",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e41",
    date: "2026-08-12",
    time: "14:00",
    title: "MR-004: Balcony door lock B-101",
    type: "Maintenance",
    status: "Assigned",
    priority: "Medium",
  },

  {
    id: "e42",
    date: "2026-08-13",
    time: "08:00",
    title: "Parking Lot A closed - Day 2",
    type: "Announcement",
    status: "Active",
  },
  {
    id: "e43",
    date: "2026-08-13",
    time: "10:00",
    title: "Facility walk-through with supervisor",
    type: "Inspection",
    description: "Monthly condition review of shared facilities.",
    status: "Scheduled",
  },
  {
    id: "e44",
    date: "2026-08-13",
    time: "14:00",
    title: "MR-012: Gym AC compressor check",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e45",
    date: "2026-08-13",
    time: "16:00",
    title: "Mid-month budget review",
    type: "Task",
    description: "Spend against maintenance budget, vendor invoices pending.",
    priority: "Medium",
  },

  {
    id: "e46",
    date: "2026-08-14",
    time: "06:00",
    title: "Pool: Morning Lap Swimming",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e47",
    date: "2026-08-14",
    time: "09:00",
    title: "Fire Drill prep - equipment check",
    type: "Inspection",
    description: "Extinguishers, alarms and exit signage verified.",
    status: "Scheduled",
  },
  {
    id: "e48",
    date: "2026-08-14",
    time: "11:00",
    title: "Vendor invoice processing",
    type: "Task",
    priority: "Low",
  },
  {
    id: "e49",
    date: "2026-08-14",
    time: "14:00",
    title: "Weekend event setup",
    type: "Task",
    priority: "Medium",
  },

  {
    id: "e50",
    date: "2026-08-15",
    time: "09:00",
    title: "Elevator Safety Check - Tower A",
    type: "Inspection",
    description: "Annual certification with the lift contractor.",
    status: "Scheduled",
  },
  {
    id: "e51",
    date: "2026-08-15",
    time: "09:00",
    title: "Generator 500kVA service",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e52",
    date: "2026-08-15",
    time: "10:00",
    title: "Annual Fire Evacuation Drill",
    type: "Announcement",
    description: "All towers, 10:00 assembly at the main car park.",
    status: "Active",
  },
  {
    id: "e53",
    date: "2026-08-15",
    time: "14:00",
    title: "Pest control - building-wide treatment",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },

  {
    id: "e54",
    date: "2026-08-16",
    time: "07:00",
    title: "Community Yoga Class",
    type: "Booking",
    status: "Confirmed",
  },
  {
    id: "e55",
    date: "2026-08-16",
    time: "10:00",
    title: "Garden maintenance - hedge trimming",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Low",
  },

  {
    id: "e56",
    date: "2026-08-17",
    time: "08:00",
    title: "Water Treatment plant service",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e57",
    date: "2026-08-17",
    time: "09:00",
    title: "Staff weekly sync",
    type: "Task",
    priority: "Medium",
  },
  {
    id: "e58",
    date: "2026-08-17",
    time: "14:00",
    title: "Tennis court floodlight inspection",
    type: "Inspection",
    status: "Scheduled",
  },

  {
    id: "e59",
    date: "2026-08-18",
    time: "07:00",
    title: "Gym closed - equipment install",
    type: "Announcement",
    status: "Active",
  },
  {
    id: "e60",
    date: "2026-08-18",
    time: "08:00",
    title: "Gym equipment installation",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e61",
    date: "2026-08-18",
    time: "10:00",
    title: "Security camera firmware update",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Low",
  },

  {
    id: "e62",
    date: "2026-08-19",
    time: "07:00",
    title: "Gym closed - equipment install",
    type: "Announcement",
    status: "Active",
  },
  {
    id: "e63",
    date: "2026-08-19",
    time: "09:00",
    title: "New gym equipment commissioning",
    type: "Inspection",
    status: "Scheduled",
  },
  {
    id: "e64",
    date: "2026-08-19",
    time: "11:00",
    title: "Vendor contract renewals",
    type: "Task",
    priority: "Medium",
  },
  {
    id: "e65",
    date: "2026-08-19",
    time: "15:00",
    title: "Community Hall: Workshop",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e66",
    date: "2026-08-20",
    time: "09:00",
    title: "Elevator Safety Check - Tower B",
    type: "Inspection",
    status: "Scheduled",
  },
  {
    id: "e67",
    date: "2026-08-20",
    time: "10:00",
    title: "MR-004: Balcony door adjustment",
    type: "Maintenance",
    status: "Assigned",
    priority: "Low",
  },
  {
    id: "e68",
    date: "2026-08-20",
    time: "14:00",
    title: "August compliance report",
    type: "Task",
    priority: "High",
  },
  {
    id: "e69",
    date: "2026-08-20",
    time: "16:00",
    title: "Rooftop terrace booking",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e70",
    date: "2026-08-21",
    time: "08:00",
    title: "AC system filter replacement",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e71",
    date: "2026-08-21",
    time: "11:00",
    title: "New resident orientation",
    type: "Task",
    priority: "Medium",
  },
  {
    id: "e72",
    date: "2026-08-21",
    time: "14:00",
    title: "Fire extinguisher servicing",
    type: "Inspection",
    status: "Scheduled",
  },

  {
    id: "e73",
    date: "2026-08-22",
    time: "07:00",
    title: "Garden maintenance - lawn care",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Low",
  },
  {
    id: "e74",
    date: "2026-08-22",
    time: "08:00",
    title: "Tennis court resurfacing prep",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    id: "e75",
    date: "2026-08-22",
    time: "09:00",
    title: "Community Yoga Class",
    type: "Booking",
    status: "Confirmed",
  },

  {
    id: "e76",
    date: "2026-08-25",
    time: "09:00",
    title: "Monthly Fire Safety Inspection",
    type: "Inspection",
    status: "Scheduled",
  },
  {
    id: "e77",
    date: "2026-08-25",
    time: "14:00",
    title: "HVAC filter replacement - Tower B",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
  },

  {
    id: "e78",
    date: "2026-08-27",
    time: "10:00",
    title: "Quarterly vendor performance review",
    type: "Task",
    priority: "Medium",
  },
  {
    id: "e79",
    date: "2026-08-28",
    time: "09:00",
    title: "Month-end meter readings",
    type: "Task",
    priority: "High",
  },
  {
    id: "e80",
    date: "2026-08-29",
    time: "10:00",
    title: "Community Hall: Residents' Meetup",
    type: "Booking",
    status: "Confirmed",
  },
];

const byTime = (a: CalendarEvent, b: CalendarEvent) =>
  a.time.localeCompare(b.time);

export function eventsOn(date: string, extra: CalendarEvent[] = []) {
  return [...calendarEvents, ...extra]
    .filter((event) => event.date === date)
    .sort(byTime);
}

/** `YYYY-MM-DD` for a year/month/day triple, without touching the clock. */
export function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Parses `YYYY-MM-DD` into a local Date at midnight. */
export function fromIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The seven ISO dates of the week (Sun-Sat) containing `iso`. */
export function weekOf(iso: string) {
  const date = fromIso(iso);
  date.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date);
    day.setDate(date.getDate() + index);
    return toIso(day.getFullYear(), day.getMonth(), day.getDate());
  });
}
