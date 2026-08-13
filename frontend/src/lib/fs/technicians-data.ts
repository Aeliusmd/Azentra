import type { PillTone } from "@/components/pm/ui/pill";

import type { FsWorkOrder, FsWorkOrderCategory } from "@/lib/fs/work-orders-data";

/**
 * The technician roster the supervisor coordinates. Mock data — swap for a
 * `src/lib/api.ts` call when the backend lands.
 *
 * Active job counts are never stored here: they are counted off the work-order
 * store so a reassignment on any page immediately moves the workload bars.
 */

export const TECH_AVAILABILITY = [
  "Available",
  "Working",
  "On Break",
  "Unavailable",
] as const;
export type TechAvailability = (typeof TECH_AVAILABILITY)[number];

export const AVAILABILITY_TONE: Record<TechAvailability, PillTone> = {
  Available: "green",
  Working: "green",
  "On Break": "amber",
  Unavailable: "red",
};

/** Leading dot on a roster card — availability read before the label is. */
export const AVAILABILITY_DOT: Record<TechAvailability, string> = {
  Available: "bg-[#3f9e63]",
  Working: "bg-[#3f9e63]",
  "On Break": "bg-[#e8a33d]",
  Unavailable: "bg-[#e0554d]",
};

/** Tinted count tiles on the dashboard's technician status panel. */
export const AVAILABILITY_TILE: Record<
  TechAvailability,
  { box: string; value: string }
> = {
  Available: { box: "border-green-200 bg-green-50/70", value: "text-green-700" },
  Working: { box: "border-green-200 bg-green-50/70", value: "text-green-700" },
  "On Break": { box: "border-amber-200 bg-amber-50/70", value: "text-amber-700" },
  Unavailable: { box: "border-rose-200 bg-rose-50/70", value: "text-rose-700" },
};

export type FsTechnician = {
  id: string;
  name: string;
  title: string;
  propertyId: string;
  skills: FsWorkOrderCategory[];
  availability: TechAvailability;
  /** Jobs this technician can hold at once — drives the workload bar. */
  capacity: number;
  completedJobs: number;
  /** Percentage of jobs closed on or before the due date. */
  onTimeRate: number;
  /** Average hours from assignment to completion. */
  avgResolutionHours: number;
  /** 0–5, one decimal. */
  rating: number;
  phone: string;
  email: string;
  /**
   * Shifts from today onwards, one entry per day: hours like `08:00 - 17:00`,
   * or `Off` / `Leave`. Five days is as far ahead as the roster is published.
   */
  roster: string[];
  /** Career totals alongside `completedJobs` — the record, not today's load. */
  emergencyJobs: number;
  /** Jobs that came back after being closed. */
  reopenedJobs: number;
  /** Median minutes from an emergency being raised to being on site. */
  emergencyResponseMins: number;
  /** Material lines drawn from stores. */
  materialsUsed: number;
};

/**
 * Roster order matches the order the supervisor reads it in — the technicians
 * carrying today's work first, then the bench.
 */
export const technicians: FsTechnician[] = [
  {
    id: "T-01",
    name: "John Perera",
    title: "Senior Plumbing Technician",
    propertyId: "sunrise",
    skills: ["Plumbing", "General"],
    availability: "Working",
    capacity: 4,
    completedJobs: 186,
    onTimeRate: 94,
    avgResolutionHours: 3.2,
    rating: 4.8,
    phone: "+1 555 0211",
    email: "john.perera@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 14,
    reopenedJobs: 3,
    emergencyResponseMins: 16,
    materialsUsed: 62,
  },
  {
    id: "T-02",
    name: "Michael Torres",
    title: "Elevator & Mechanical Technician",
    propertyId: "sunrise",
    skills: ["Elevator", "General", "Plumbing"],
    availability: "Working",
    capacity: 4,
    completedJobs: 164,
    onTimeRate: 88,
    avgResolutionHours: 4.6,
    rating: 4.6,
    phone: "+1 555 0212",
    email: "michael.torres@azentra.com",
    roster: [
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "Off",
    ],
    emergencyJobs: 18,
    reopenedJobs: 6,
    emergencyResponseMins: 22,
    materialsUsed: 54,
  },
  {
    id: "T-03",
    name: "David Chen",
    title: "Electrical Technician",
    propertyId: "sunrise",
    skills: ["Electrical", "Safety"],
    availability: "Available",
    capacity: 4,
    completedJobs: 142,
    onTimeRate: 91,
    avgResolutionHours: 2.8,
    rating: 4.7,
    phone: "+1 555 0213",
    email: "david.chen@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 9,
    reopenedJobs: 4,
    emergencyResponseMins: 14,
    materialsUsed: 47,
  },
  {
    id: "T-04",
    name: "Luis Fernandez",
    title: "HVAC Technician",
    propertyId: "sunrise",
    skills: ["HVAC", "Appliance"],
    availability: "On Break",
    capacity: 4,
    completedJobs: 131,
    onTimeRate: 86,
    avgResolutionHours: 3.9,
    rating: 4.4,
    phone: "+1 555 0214",
    email: "luis.fernandez@azentra.com",
    roster: [
      "09:00 - 18:00",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "Leave",
      "Off",
    ],
    emergencyJobs: 7,
    reopenedJobs: 7,
    emergencyResponseMins: 19,
    materialsUsed: 51,
  },
  {
    id: "T-05",
    name: "Ahmed Khan",
    title: "HVAC & Appliance Technician",
    propertyId: "sunrise",
    skills: ["HVAC", "Appliance", "Electrical"],
    availability: "Working",
    capacity: 4,
    completedJobs: 158,
    onTimeRate: 92,
    avgResolutionHours: 3.1,
    rating: 4.7,
    phone: "+1 555 0215",
    email: "ahmed.khan@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 11,
    reopenedJobs: 4,
    emergencyResponseMins: 17,
    materialsUsed: 58,
  },
  {
    id: "T-06",
    name: "Sarah Wilson",
    title: "General Maintenance Technician",
    propertyId: "sunrise",
    skills: ["General", "Appliance", "Carpentry"],
    availability: "Working",
    capacity: 4,
    completedJobs: 149,
    onTimeRate: 90,
    avgResolutionHours: 3.5,
    rating: 4.6,
    phone: "+1 555 0216",
    email: "sarah.wilson@azentra.com",
    roster: [
      "08:00 - 17:00",
      "Off",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
    ],
    emergencyJobs: 8,
    reopenedJobs: 5,
    emergencyResponseMins: 21,
    materialsUsed: 44,
  },
  {
    id: "T-07",
    name: "Ravi Patel",
    title: "Electrical Technician",
    propertyId: "sunrise",
    skills: ["Electrical", "Plumbing"],
    availability: "Working",
    capacity: 4,
    completedJobs: 137,
    onTimeRate: 89,
    avgResolutionHours: 3.4,
    rating: 4.5,
    phone: "+1 555 0217",
    email: "ravi.patel@azentra.com",
    roster: [
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "Off",
    ],
    emergencyJobs: 12,
    reopenedJobs: 5,
    emergencyResponseMins: 15,
    materialsUsed: 39,
  },
  {
    id: "T-08",
    name: "Tom Harrison",
    title: "General Maintenance Technician",
    propertyId: "sunrise",
    skills: ["General", "Carpentry", "Electrical"],
    availability: "Working",
    capacity: 4,
    completedJobs: 121,
    onTimeRate: 82,
    avgResolutionHours: 4.8,
    rating: 4.2,
    phone: "+1 555 0218",
    email: "tom.harrison@azentra.com",
    roster: [
      "09:00 - 18:00",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "Off",
    ],
    emergencyJobs: 6,
    reopenedJobs: 9,
    emergencyResponseMins: 26,
    materialsUsed: 36,
  },
  {
    id: "T-09",
    name: "Priya Nair",
    title: "Carpentry Technician",
    propertyId: "sunrise",
    skills: ["Carpentry", "General"],
    availability: "Available",
    capacity: 4,
    completedJobs: 96,
    onTimeRate: 93,
    avgResolutionHours: 2.9,
    rating: 4.6,
    phone: "+1 555 0219",
    email: "priya.nair@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Leave",
      "Leave",
      "Off",
    ],
    emergencyJobs: 4,
    reopenedJobs: 2,
    emergencyResponseMins: 13,
    materialsUsed: 28,
  },
  {
    id: "T-10",
    name: "Samuel Oduya",
    title: "Safety & Fire Systems Technician",
    propertyId: "sunrise",
    skills: ["Safety", "Electrical"],
    availability: "Available",
    capacity: 3,
    completedJobs: 88,
    onTimeRate: 95,
    avgResolutionHours: 2.6,
    rating: 4.9,
    phone: "+1 555 0220",
    email: "samuel.oduya@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 12:00",
    ],
    emergencyJobs: 15,
    reopenedJobs: 1,
    emergencyResponseMins: 11,
    materialsUsed: 22,
  },
  {
    id: "T-11",
    name: "Hannah Berg",
    title: "Plumbing Technician",
    propertyId: "sunrise",
    skills: ["Plumbing", "General"],
    availability: "Available",
    capacity: 4,
    completedJobs: 74,
    onTimeRate: 87,
    avgResolutionHours: 3.6,
    rating: 4.3,
    phone: "+1 555 0221",
    email: "hannah.berg@azentra.com",
    roster: [
      "10:00 - 19:00",
      "10:00 - 19:00",
      "10:00 - 19:00",
      "10:00 - 19:00",
      "Off",
    ],
    emergencyJobs: 3,
    reopenedJobs: 4,
    emergencyResponseMins: 24,
    materialsUsed: 26,
  },
  {
    id: "T-12",
    name: "Diego Alvarez",
    title: "Appliance Technician",
    propertyId: "sunrise",
    skills: ["Appliance", "Electrical"],
    availability: "On Break",
    capacity: 3,
    completedJobs: 69,
    onTimeRate: 84,
    avgResolutionHours: 3.8,
    rating: 4.1,
    phone: "+1 555 0222",
    email: "diego.alvarez@azentra.com",
    roster: [
      "09:00 - 18:00",
      "Off",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "Off",
    ],
    emergencyJobs: 2,
    reopenedJobs: 6,
    emergencyResponseMins: 28,
    materialsUsed: 31,
  },
  {
    id: "T-13",
    name: "Omar Haddad",
    title: "HVAC Technician",
    propertyId: "sunrise",
    skills: ["HVAC"],
    availability: "Unavailable",
    capacity: 4,
    completedJobs: 112,
    onTimeRate: 85,
    avgResolutionHours: 4.1,
    rating: 4.3,
    phone: "+1 555 0223",
    email: "omar.haddad@azentra.com",
    roster: [
      "Leave",
      "Leave",
      "Leave",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 9,
    reopenedJobs: 6,
    emergencyResponseMins: 20,
    materialsUsed: 41,
  },

  /* --------------------------- Green Valley Towers ------------------------ */
  {
    id: "T-21",
    name: "Nadia Rahman",
    title: "HVAC Technician",
    propertyId: "green-valley",
    skills: ["HVAC", "Appliance"],
    availability: "Working",
    capacity: 4,
    completedJobs: 128,
    onTimeRate: 90,
    avgResolutionHours: 3.3,
    rating: 4.6,
    phone: "+1 555 0231",
    email: "nadia.rahman@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 10,
    reopenedJobs: 4,
    emergencyResponseMins: 18,
    materialsUsed: 43,
  },
  {
    id: "T-22",
    name: "Kevin Silva",
    title: "Plumbing Technician",
    propertyId: "green-valley",
    skills: ["Plumbing", "General"],
    availability: "Working",
    capacity: 4,
    completedJobs: 104,
    onTimeRate: 88,
    avgResolutionHours: 3.7,
    rating: 4.4,
    phone: "+1 555 0232",
    email: "kevin.silva@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Off",
    ],
    emergencyJobs: 7,
    reopenedJobs: 5,
    emergencyResponseMins: 21,
    materialsUsed: 37,
  },
  {
    id: "T-23",
    name: "Grace Lee",
    title: "Electrical Technician",
    propertyId: "green-valley",
    skills: ["Electrical", "Safety"],
    availability: "Working",
    capacity: 4,
    completedJobs: 117,
    onTimeRate: 83,
    avgResolutionHours: 4.4,
    rating: 4.2,
    phone: "+1 555 0233",
    email: "grace.lee@azentra.com",
    roster: [
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "07:00 - 16:00",
      "Off",
    ],
    emergencyJobs: 11,
    reopenedJobs: 8,
    emergencyResponseMins: 25,
    materialsUsed: 40,
  },
  {
    id: "T-24",
    name: "Marco Rossi",
    title: "General Maintenance Technician",
    propertyId: "green-valley",
    skills: ["General", "Carpentry"],
    availability: "Available",
    capacity: 4,
    completedJobs: 93,
    onTimeRate: 91,
    avgResolutionHours: 3.0,
    rating: 4.5,
    phone: "+1 555 0234",
    email: "marco.rossi@azentra.com",
    roster: [
      "08:00 - 17:00",
      "08:00 - 17:00",
      "08:00 - 17:00",
      "Leave",
      "Off",
    ],
    emergencyJobs: 5,
    reopenedJobs: 3,
    emergencyResponseMins: 16,
    materialsUsed: 29,
  },
  {
    id: "T-25",
    name: "Elena Popescu",
    title: "Carpentry Technician",
    propertyId: "green-valley",
    skills: ["Carpentry", "General"],
    availability: "Available",
    capacity: 3,
    completedJobs: 61,
    onTimeRate: 92,
    avgResolutionHours: 2.7,
    rating: 4.6,
    phone: "+1 555 0235",
    email: "elena.popescu@azentra.com",
    roster: [
      "09:00 - 18:00",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "Off",
    ],
    emergencyJobs: 2,
    reopenedJobs: 2,
    emergencyResponseMins: 14,
    materialsUsed: 19,
  },
  {
    id: "T-26",
    name: "Bilal Aziz",
    title: "Safety Technician",
    propertyId: "green-valley",
    skills: ["Safety", "General"],
    availability: "On Break",
    capacity: 3,
    completedJobs: 57,
    onTimeRate: 86,
    avgResolutionHours: 3.4,
    rating: 4.3,
    phone: "+1 555 0236",
    email: "bilal.aziz@azentra.com",
    roster: [
      "09:00 - 18:00",
      "Off",
      "09:00 - 18:00",
      "09:00 - 18:00",
      "Off",
    ],
    emergencyJobs: 6,
    reopenedJobs: 3,
    emergencyResponseMins: 19,
    materialsUsed: 17,
  },
];

export function techniciansAt(propertyId: string) {
  return technicians.filter(
    (technician) => technician.propertyId === propertyId,
  );
}

/** Avatar letters, e.g. "JP" for John Perera. */
export function technicianInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** How many open jobs a technician is carrying right now. */
export function activeJobCount(orders: FsWorkOrder[], name: string) {
  return orders.filter(
    (order) => order.technician === name && order.status !== "Completed",
  ).length;
}

/** Days of roster published ahead — today plus the four that follow. */
export const ROSTER_DAYS = 5;

/** The two entries that mean "not on site" rather than a set of hours. */
export const OFF = "Off";
export const ON_LEAVE = "Leave";

/** A rostered day is one with hours against it. */
export function isOnDuty(day: string) {
  return day !== OFF && day !== ON_LEAVE;
}

/**
 * Hours a technician has booked on a given day, read off the labour lines on
 * every job rather than stored — a logged hour belongs to the work order.
 */
export function hoursLoggedOn(
  orders: FsWorkOrder[],
  name: string,
  date: string,
) {
  return orders.reduce(
    (total, order) =>
      total +
      order.labour
        .filter((line) => line.technician === name && line.date === date)
        .reduce((sum, line) => sum + line.hours, 0),
    0,
  );
}

/** `3.2` → `3h 12m`. */
export function durationLabel(hours: number) {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes === 0 ? `${whole}h` : `${whole}h ${minutes}m`;
}

/** Bar colour follows load, not availability — a full plate always reads red. */
export function workloadTone(active: number, capacity: number) {
  const ratio = capacity === 0 ? 1 : active / capacity;
  if (ratio >= 1) return "bg-[#e0554d]";
  if (ratio >= 0.75) return "bg-[#e8a33d]";
  return "bg-brand";
}

export function availabilityCounts(roster: FsTechnician[]) {
  return TECH_AVAILABILITY.map((status) => ({
    status,
    count: roster.filter((technician) => technician.availability === status)
      .length,
  }));
}
