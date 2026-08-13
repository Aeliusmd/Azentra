import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Site visits the supervisor makes in person — safety walks, damage
 * assessments, sign-off rounds. Mock data — swap for a `src/lib/api.ts` call
 * when the backend lands.
 */

export const VISIT_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Follow-up Required",
  "Cancelled",
] as const;
export type SiteVisitStatus = (typeof VISIT_STATUSES)[number];

export const VISIT_STATUS_TONE: Record<SiteVisitStatus, PillTone> = {
  Scheduled: "navy",
  "In Progress": "amber",
  Completed: "green",
  "Follow-up Required": "orange",
  Cancelled: "slate",
};

export const VISIT_PURPOSES = [
  "Safety Inspection",
  "Damage Assessment",
  "Work Verification",
  "Routine Round",
  "Resident Complaint",
] as const;
export type SiteVisitPurpose = (typeof VISIT_PURPOSES)[number];

export type VisitCheck = {
  id: string;
  label: string;
  done: boolean;
};

/**
 * What a round of each kind covers. The list belongs to the purpose rather than
 * the visit — a safety inspection checks the same six things every time — so a
 * visit booked from the form arrives with its checklist already on it.
 */
export const VISIT_CHECKLISTS: Record<SiteVisitPurpose, string[]> = {
  "Safety Inspection": [
    "Fire exit doors operational",
    "Emergency lighting functional",
    "Stairwell clear of obstruction",
    "Handrails secure on all floors",
    "Fire extinguishers in place",
    "Exit signs illuminated",
  ],
  "Damage Assessment": [
    "Extent of damage recorded",
    "Photos taken of the affected areas",
    "Moisture and structural checks done",
    "Repair scope agreed",
    "Materials estimated",
  ],
  "Work Verification": [
    "Work matches the agreed scope",
    "Workmanship and finish checked",
    "Area left clean and safe",
    "Resident or requester informed",
    "Sign-off recorded",
  ],
  "Routine Round": [
    "Common areas walked",
    "Plant rooms checked",
    "Lighting and signage checked",
    "Waste and bin areas clear",
    "Issues logged for follow-up",
  ],
  "Resident Complaint": [
    "Resident account taken",
    "Issue reproduced on site",
    "Previous repairs reviewed",
    "Next steps agreed with the resident",
    "Follow-up job raised if needed",
  ],
};

/** A fresh, unticked checklist for a visit of this kind. */
export function checksFor(purpose: SiteVisitPurpose, visitId: string): VisitCheck[] {
  return VISIT_CHECKLISTS[purpose].map((label, index) => ({
    id: `${visitId.toLowerCase()}-c${index + 1}`,
    label,
    done: false,
  }));
}

export type SiteVisit = {
  id: string;
  propertyId: string;
  property: string;
  building: string;
  location: string;
  /** Level within the building, e.g. `3` or `All`. */
  floor?: string;
  /** Who else is expected to attend. */
  participants?: string[];
  /** The job that prompted the visit, if any. */
  workOrderId: string | null;
  /** Technician expected to meet the supervisor on site. */
  technician: string | null;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 12h `HH:MM AM`. */
  time: string;
  purpose: SiteVisitPurpose;
  /** One line on why the visit is happening — shown on the dashboard. */
  summary: string;
  status: SiteVisitStatus;
  /** Ticked off on site — what the round actually covered. */
  checklist: VisitCheck[];
  observations: string;
  notes: string;
  /** Mock evidence — captions only, nothing is uploaded. */
  photos: { id: string; caption: string }[];
  followUp: string | null;
};

export const siteVisits: SiteVisit[] = [
  {
    id: "SV-1012",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "All Floors",
    workOrderId: null,
    technician: "Samuel Oduya",
    date: "2026-08-12",
    time: "02:00 PM",
    purpose: "Safety Inspection",
    summary: "Quarterly building safety inspection for Tower A",
    status: "Scheduled",
    checklist: checksFor("Safety Inspection", "SV-1012"),
    observations: "",
    notes: "Fire panel log and stairwell signage to be checked this round.",
    photos: [],
    followUp: null,
  },
  {
    id: "SV-1013",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    location: "Unit B-207",
    workOrderId: "WO-1043",
    technician: "Ahmed Khan",
    date: "2026-08-12",
    time: "04:30 PM",
    purpose: "Damage Assessment",
    summary: "Assess water damage from pipe burst yesterday",
    status: "Scheduled",
    checklist: checksFor("Damage Assessment", "SV-1013"),
    observations: "",
    notes: "Resident will be home after 4 PM.",
    photos: [],
    followUp: null,
  },
  {
    id: "SV-1011",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "Elevator 1",
    workOrderId: "WO-1042",
    technician: "Michael Torres",
    date: "2026-08-12",
    time: "11:30 AM",
    purpose: "Work Verification",
    summary: "Check elevator repair progress with the lift contractor",
    status: "In Progress",
    checklist: checksFor("Work Verification", "SV-1011"),
    observations: "Interlock swapped, car being run empty through all floors.",
    notes: "",
    photos: [{ id: "sp1", caption: "Controller panel after swap" }],
    followUp: null,
  },
  {
    id: "SV-1010",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Common Area",
    location: "Pool Deck",
    workOrderId: "WO-1044",
    technician: "Sarah Wilson",
    date: "2026-08-11",
    time: "09:30 AM",
    purpose: "Routine Round",
    summary: "Weekly pool plant and deck walkthrough",
    status: "Completed",
    checklist: checksFor("Routine Round", "SV-1010"),
    observations:
      "Pump housing reassembled. Deck drains clear, no standing water.",
    notes: "Filtration back online at 11:20.",
    photos: [{ id: "sp2", caption: "Plant room after service" }],
    followUp: null,
  },
  {
    id: "SV-1009",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "Roof Level",
    workOrderId: "WO-1035",
    technician: "Michael Torres",
    date: "2026-08-10",
    time: "01:00 PM",
    purpose: "Work Verification",
    summary: "Verify roof drain clearing before the rain forecast",
    status: "Follow-up Required",
    checklist: checksFor("Work Verification", "SV-1009"),
    observations:
      "Only two of six drains cleared. Standing water still present on the east side.",
    notes: "Rain stopped access. Needs a second visit once the roof is dry.",
    photos: [{ id: "sp3", caption: "Standing water, east roof" }],
    followUp: "Re-inspect after WO-1035 is rescheduled.",
  },
  {
    id: "SV-1008",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower B",
    location: "Unit B-505",
    workOrderId: "WO-1036",
    technician: "Sarah Wilson",
    date: "2026-08-09",
    time: "12:00 PM",
    purpose: "Resident Complaint",
    summary: "Follow up on repeated intercom complaints from B-505",
    status: "Completed",
    checklist: checksFor("Resident Complaint", "SV-1008"),
    observations: "Handset replaced, resident satisfied with the audio.",
    notes: "",
    photos: [],
    followUp: null,
  },
  {
    id: "SV-2005",
    propertyId: "green-valley",
    property: "Green Valley Towers",
    building: "Block 2",
    location: "Side Gate",
    workOrderId: "WO-2014",
    technician: "Grace Lee",
    date: "2026-08-12",
    time: "03:00 PM",
    purpose: "Work Verification",
    summary: "Review the overdue gate motor repair on site",
    status: "Scheduled",
    checklist: checksFor("Work Verification", "SV-2005"),
    observations: "",
    notes: "Bring the spare capacitor from the Sunrise store.",
    photos: [],
    followUp: null,
  },
  {
    id: "SV-2004",
    propertyId: "green-valley",
    property: "Green Valley Towers",
    building: "Block 1",
    location: "All Floors",
    workOrderId: null,
    technician: "Bilal Aziz",
    date: "2026-08-07",
    time: "10:00 AM",
    purpose: "Safety Inspection",
    summary: "Monthly emergency lighting and extinguisher check",
    status: "Cancelled",
    checklist: checksFor("Safety Inspection", "SV-2004"),
    observations: "",
    notes: "Cancelled — contractor access was not arranged in time.",
    photos: [],
    followUp: null,
  },
];

export function visitsAt(propertyId: string) {
  return siteVisits.filter((visit) => visit.propertyId === propertyId);
}

/** `SV-1014` after `SV-1013`. */
export function nextSiteVisitId(visits: SiteVisit[]) {
  const highest = visits.reduce((max, visit) => {
    const value = Number(visit.id.replace("SV-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 1000);
  return `SV-${highest + 1}`;
}
