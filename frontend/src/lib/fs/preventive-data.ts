import type { FsWorkOrderCategory } from "@/lib/fs/work-orders-data";

/**
 * Recurring servicing the supervisor plans around. Mock data — swap for a
 * `src/lib/api.ts` call when the backend lands.
 */

export const PM_FREQUENCIES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-yearly",
  "Annual",
] as const;
export type PmFrequency = (typeof PM_FREQUENCIES)[number];

export type PreventiveTask = {
  id: string;
  title: string;
  propertyId: string;
  building: string;
  location: string;
  category: FsWorkOrderCategory;
  frequency: PmFrequency;
  /** ISO `YYYY-MM-DD` the next round is due. */
  nextDate: string;
  /** 12h `HH:MM AM`. */
  time: string;
  technician: string | null;
  lastDone: string;
};

export const preventiveTasks: PreventiveTask[] = [
  {
    id: "PM-401",
    title: "Generator PM - Monthly",
    propertyId: "sunrise",
    building: "Common Area",
    location: "Generator Room",
    category: "Electrical",
    frequency: "Monthly",
    nextDate: "2026-08-20",
    time: "08:00 AM",
    technician: "Ravi Patel",
    lastDone: "2026-07-20",
  },
  {
    id: "PM-402",
    title: "Chiller Filter Service",
    propertyId: "sunrise",
    building: "Common Area",
    location: "Plant Room",
    category: "HVAC",
    frequency: "Monthly",
    nextDate: "2026-09-08",
    time: "02:00 PM",
    technician: "Ahmed Khan",
    lastDone: "2026-08-08",
  },
  {
    id: "PM-403",
    title: "Fire Extinguisher Round - Tower B",
    propertyId: "sunrise",
    building: "Tower B",
    location: "All Floors",
    category: "Safety",
    frequency: "Quarterly",
    nextDate: "2026-08-26",
    time: "09:00 AM",
    technician: "Samuel Oduya",
    lastDone: "2026-05-26",
  },
  {
    id: "PM-404",
    title: "Water Tank Cleaning",
    propertyId: "sunrise",
    building: "Tower A",
    location: "Roof Level",
    category: "Plumbing",
    frequency: "Half-yearly",
    nextDate: "2026-09-15",
    time: "08:30 AM",
    technician: null,
    lastDone: "2026-03-15",
  },
  {
    id: "PM-405",
    title: "Lift Service Visit - Tower A",
    propertyId: "sunrise",
    building: "Tower A",
    location: "Elevator 1",
    category: "Elevator",
    frequency: "Monthly",
    nextDate: "2026-08-28",
    time: "10:00 AM",
    technician: "Michael Torres",
    lastDone: "2026-07-28",
  },
  {
    id: "PM-501",
    title: "Pump Room Inspection - Block 2",
    propertyId: "green-valley",
    building: "Block 2",
    location: "Pump Room",
    category: "Plumbing",
    frequency: "Monthly",
    nextDate: "2026-08-21",
    time: "09:00 AM",
    technician: "Kevin Silva",
    lastDone: "2026-07-21",
  },
];

export function preventiveAt(propertyId: string) {
  return preventiveTasks.filter((task) => task.propertyId === propertyId);
}
