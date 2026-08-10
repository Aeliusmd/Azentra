import type { PillTone } from "@/components/pm/ui/pill";

/** Mock resident complaints. Swap for a `src/lib/api.ts` call when the backend lands. */

export const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved"] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const COMPLAINT_STATUS_TONE: Record<ComplaintStatus, PillTone> = {
  Open: "red",
  "In Progress": "green",
  Resolved: "green",
};

export const COMPLAINT_PRIORITIES = ["High", "Medium", "Low"] as const;
export type ComplaintPriority = (typeof COMPLAINT_PRIORITIES)[number];

export const COMPLAINT_PRIORITY_TONE: Record<ComplaintPriority, PillTone> = {
  High: "red",
  Medium: "amber",
  Low: "slate",
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  category: string;
  filedBy: string;
  unit: string;
  department: string;
  filedAt: string;
  /** Set once the complaint is closed out. */
  resolution: string;
};

export const complaints: Complaint[] = [
  {
    id: "C-001",
    title: "Loud music from neighbor at night",
    description:
      "Unit A-202 has been playing loud music past midnight for the past 3 days. Multiple residents on the floor have been disturbed.",
    priority: "Medium",
    status: "In Progress",
    category: "Noise",
    filedBy: "John Doe",
    unit: "A-101",
    department: "Security",
    filedAt: "2026-08-04",
    resolution: "",
  },
  {
    id: "C-002",
    title: "Parking space occupied by unauthorized vehicle",
    description:
      "My assigned parking spot P-15 in Parking Lot A has been occupied by a red sedan with no parking sticker for two days.",
    priority: "High",
    status: "Open",
    category: "Parking",
    filedBy: "Michael Brown",
    unit: "A-103",
    department: "Security",
    filedAt: "2026-08-06",
    resolution: "",
  },
  {
    id: "C-003",
    title: "Garbage chute smell on 3rd floor",
    description:
      "Strong unpleasant odor coming from the garbage chute on the 3rd floor landing. The smell is spreading into the hallway.",
    priority: "Medium",
    status: "Resolved",
    category: "Cleanliness",
    filedBy: "Sophia Thomas",
    unit: "C-301",
    department: "Housekeeping",
    filedAt: "2026-08-02",
    resolution:
      "Chute deep-cleaned and deodorised; weekly cleaning added to the housekeeping schedule.",
  },
  {
    id: "C-004",
    title: "Pet waste in common garden area",
    description:
      "Dog waste not being picked up by pet owners in the garden area near Tower A. This is a health hazard for children playing there.",
    priority: "Medium",
    status: "Open",
    category: "Cleanliness",
    filedBy: "Emily Davis",
    unit: "A-201",
    department: "Housekeeping",
    filedAt: "2026-08-06",
    resolution: "",
  },
  {
    id: "C-005",
    title: "Elevator frequently out of service",
    description:
      "The Tower B elevator has been out of service 4 times in the past 2 weeks. This is very inconvenient for residents on higher floors.",
    priority: "High",
    status: "In Progress",
    category: "Facility",
    filedBy: "Robert Taylor",
    unit: "B-101",
    department: "Maintenance",
    filedAt: "2026-08-01",
    resolution: "",
  },
  {
    id: "C-006",
    title: "Water pressure too low in unit",
    description:
      "The water pressure in my bathroom shower has dropped significantly over the past week. Takes twice as long to shower.",
    priority: "Medium",
    status: "Open",
    category: "Facility",
    filedBy: "Kevin Anderson",
    unit: "C-102",
    department: "Maintenance",
    filedAt: "2026-08-05",
    resolution: "",
  },
  {
    id: "C-007",
    title: "Security guard rude behavior",
    description:
      "The night shift security guard was extremely rude and unprofessional when I asked about a delivery package last night.",
    priority: "Medium",
    status: "In Progress",
    category: "Staff",
    filedBy: "Amanda Clark",
    unit: "B-102",
    department: "Management",
    filedAt: "2026-08-03",
    resolution: "",
  },
  {
    id: "C-008",
    title: "Children playing in parking area",
    description:
      "Children are regularly playing cricket in the underground parking area. This is dangerous and could damage vehicles.",
    priority: "High",
    status: "Resolved",
    category: "Safety",
    filedBy: "James Wilson",
    unit: "B-201",
    department: "Security",
    filedAt: "2026-07-28",
    resolution:
      "Notice circulated to all residents and signage installed; play area reassigned to the garden court.",
  },
];
