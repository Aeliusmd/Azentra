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
  /** Shift the technician is rostered on today. */
  shift: string;
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
    shift: "08:00 - 17:00",
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
    shift: "07:00 - 16:00",
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
    shift: "08:00 - 17:00",
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
    shift: "09:00 - 18:00",
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
    shift: "08:00 - 17:00",
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
    shift: "08:00 - 17:00",
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
    shift: "07:00 - 16:00",
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
    shift: "09:00 - 18:00",
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
    shift: "08:00 - 17:00",
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
    shift: "08:00 - 17:00",
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
    shift: "10:00 - 19:00",
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
    shift: "09:00 - 18:00",
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
    shift: "On leave until 15 Aug",
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
    shift: "08:00 - 17:00",
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
    shift: "08:00 - 17:00",
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
    shift: "07:00 - 16:00",
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
    shift: "08:00 - 17:00",
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
    shift: "09:00 - 18:00",
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
    shift: "09:00 - 18:00",
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
