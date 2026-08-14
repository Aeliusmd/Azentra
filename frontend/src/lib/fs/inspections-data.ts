import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Inspections the supervisor signs off — completed work, equipment, safety and
 * the follow-up rounds they trigger. Mock data — swap for a `src/lib/api.ts`
 * call when the backend lands.
 */

export const INSPECTION_TYPES = [
  "Completed Work",
  "Equipment",
  "Repair Quality",
  "Safety",
  "Follow-up",
] as const;
export type InspectionType = (typeof INSPECTION_TYPES)[number];

/**
 * Where the round stands. The verdicts live on the checks themselves — a round
 * is booked, walked, and then closed out by the supervisor, whatever mix of
 * passes and fails it turned up.
 */
export const INSPECTION_STATUSES = ["Scheduled", "Completed"] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];

export const INSPECTION_STATUS_TONE: Record<InspectionStatus, PillTone> = {
  Scheduled: "green",
  Completed: "green",
};

export type InspectionCheck = {
  id: string;
  label: string;
  /** Left null while the inspection is still pending. */
  passed: boolean | null;
  note?: string;
};

/**
 * What each kind of inspection covers. The seeded rounds carry hand-written
 * lists; this is what a round raised from the form starts with, so a new
 * inspection is never an empty checklist.
 */
export const INSPECTION_CHECKLISTS: Record<InspectionType, string[]> = {
  "Completed Work": [
    "Work matches the agreed scope",
    "Finish and workmanship acceptable",
    "Area left clean and safe",
    "Resident or requester signed off",
  ],
  Equipment: [
    "Runs through a full cycle",
    "No abnormal noise or vibration",
    "Guards and isolators in place",
    "Service label updated",
  ],
  "Repair Quality": [
    "Fault no longer reproducible",
    "Fixings tight and sealed",
    "No collateral damage",
    "Materials used match the job",
  ],
  Safety: [
    "Escape routes clear",
    "Emergency lighting functional",
    "Fire equipment in date",
    "Signage legible and lit",
  ],
  "Follow-up": [
    "Original finding addressed",
    "No new defects on site",
    "Evidence recorded",
  ],
};

/** A fresh, unjudged checklist for an inspection of this kind. */
export function inspectionChecksFor(
  type: InspectionType,
  inspectionId: string,
): InspectionCheck[] {
  return INSPECTION_CHECKLISTS[type].map((label, index) => ({
    id: `${inspectionId.toLowerCase()}-c${index + 1}`,
    label,
    passed: null,
  }));
}

export type FsInspection = {
  id: string;
  title: string;
  type: InspectionType;
  propertyId: string;
  property: string;
  building: string;
  location: string;
  /** The job being signed off, when the inspection follows one. */
  workOrderId: string | null;
  /** Who did the work; the supervisor is always the inspector. */
  technician: string | null;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 12h `HH:MM AM`. */
  time: string;
  status: InspectionStatus;
  checklist: InspectionCheck[];
  findings: string;
  notes: string;
  recommendations: string;
  photos: { id: string; caption: string }[];
};

export const inspections: FsInspection[] = [
  {
    id: "INS-2041",
    title: "Building Safety Inspection - Tower A",
    type: "Safety",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "All Floors",
    workOrderId: null,
    technician: "Samuel Oduya",
    date: "2026-08-12",
    time: "09:00 AM",
    status: "Scheduled",
    checklist: [
      { id: "c1", label: "Fire extinguishers in date", passed: null },
      { id: "c2", label: "Stairwell signage lit", passed: null },
      { id: "c3", label: "Escape routes clear", passed: null },
      { id: "c4", label: "Alarm panel fault-free", passed: null },
    ],
    findings: "",
    notes: "Quarterly round — panel log to be checked against the fault list.",
    recommendations: "",
    photos: [],
  },
  {
    id: "INS-2042",
    title: "Gym Equipment Inspection",
    type: "Equipment",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Common Area",
    location: "Gym",
    workOrderId: "WO-1051",
    technician: "Sarah Wilson",
    date: "2026-08-12",
    time: "02:00 PM",
    status: "Scheduled",
    checklist: [
      { id: "c5", label: "Treadmill 1 belt tension", passed: null },
      { id: "c6", label: "Treadmill 2 out of service tagged", passed: null },
      { id: "c7", label: "Emergency stop cords intact", passed: null },
    ],
    findings: "",
    notes: "Treadmill 2 stays tagged out until the belt arrives.",
    recommendations: "",
    photos: [],
  },
  {
    id: "INS-2043",
    title: "Pool Safety Inspection",
    type: "Safety",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Common Area",
    location: "Pool Deck",
    workOrderId: "WO-1044",
    technician: "Sarah Wilson",
    date: "2026-08-14",
    time: "10:00 AM",
    status: "Scheduled",
    checklist: [
      { id: "c8", label: "Water clarity and chemistry", passed: null },
      { id: "c9", label: "Depth markings legible", passed: null },
      { id: "c10", label: "Rescue equipment present", passed: null },
      { id: "c11", label: "Gate self-closing", passed: null },
    ],
    findings: "",
    notes: "Booked after the pump repair so filtration is running.",
    recommendations: "",
    photos: [],
  },
  {
    id: "INS-2040",
    title: "Kitchen Tap Replacement Sign-off - A-207",
    type: "Repair Quality",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "Unit A-207",
    workOrderId: "WO-1052",
    technician: "Ravi Patel",
    date: "2026-08-12",
    time: "05:30 PM",
    status: "Scheduled",
    checklist: [
      { id: "c12", label: "No drip under pressure", passed: null },
      { id: "c13", label: "Fixings tight and sealed", passed: null },
      { id: "c14", label: "Work area left clean", passed: null },
    ],
    findings: "",
    notes: "",
    recommendations: "",
    photos: [],
  },
  {
    id: "INS-2038",
    title: "Extractor Replacement Sign-off - A-410",
    type: "Completed Work",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "Unit A-410",
    workOrderId: "WO-1030",
    technician: "Ahmed Khan",
    date: "2026-08-11",
    time: "11:30 AM",
    status: "Completed",
    checklist: [
      { id: "c15", label: "Airflow measured at outlet", passed: true },
      { id: "c16", label: "Unit mounted square and sealed", passed: true },
      { id: "c17", label: "Isolator switch labelled", passed: true },
    ],
    findings: "Airflow within spec, no rattle at full speed.",
    notes: "Resident present and satisfied.",
    recommendations: "Add to the annual filter-clean round.",
    photos: [{ id: "ip1", caption: "New extractor in place" }],
  },
  {
    id: "INS-2037",
    title: "Roof Drain Clearing Check - Tower A",
    type: "Follow-up",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Tower A",
    location: "Roof Level",
    workOrderId: "WO-1035",
    technician: "Michael Torres",
    date: "2026-08-10",
    time: "03:00 PM",
    status: "Completed",
    checklist: [
      { id: "c18", label: "All six drains flowing", passed: false },
      { id: "c19", label: "No standing water", passed: false },
      { id: "c20", label: "Debris removed from roof", passed: true },
    ],
    findings:
      "Four drains still blocked. Water pooling on the east side after rain.",
    notes: "Roof access closed once the rain started.",
    recommendations:
      "Reschedule WO-1035 and re-inspect within 48 hours of completion.",
    photos: [{ id: "ip2", caption: "Pooling, east roof" }],
  },
  {
    id: "INS-2039",
    title: "Generator Load Test Verification",
    type: "Equipment",
    propertyId: "sunrise",
    property: "Sunrise Residence",
    building: "Common Area",
    location: "Generator Room",
    workOrderId: "WO-1033",
    technician: "Ravi Patel",
    date: "2026-08-10",
    time: "09:30 AM",
    status: "Completed",
    checklist: [
      { id: "c21", label: "Ran on load 30 minutes", passed: true },
      { id: "c22", label: "Fuel level above 80%", passed: true },
      { id: "c23", label: "No fault codes logged", passed: true },
    ],
    findings: "Clean run, no alarms.",
    notes: "",
    recommendations: "",
    photos: [],
  },
  {
    id: "INS-3011",
    title: "Emergency Lighting Check - Block 1",
    type: "Safety",
    propertyId: "green-valley",
    property: "Green Valley Towers",
    building: "Block 1",
    location: "All Floors",
    workOrderId: "WO-2013",
    technician: null,
    date: "2026-08-17",
    time: "10:00 AM",
    status: "Scheduled",
    checklist: [
      { id: "c24", label: "All fittings discharge 90 minutes", passed: null },
      { id: "c25", label: "Exit signs illuminated", passed: null },
    ],
    findings: "",
    notes: "Needs a technician assigned to WO-2013 first.",
    recommendations: "",
    photos: [],
  },
];

export function inspectionsAt(propertyId: string) {
  return inspections.filter(
    (inspection) => inspection.propertyId === propertyId,
  );
}

/** A round the supervisor still has to walk and close out. */
export function isScheduled(inspection: FsInspection) {
  return inspection.status === "Scheduled";
}

/** Passes and fails marked so far — the summary a closed round carries. */
export function checkTally(checklist: InspectionCheck[]) {
  return {
    passed: checklist.filter((item) => item.passed === true).length,
    failed: checklist.filter((item) => item.passed === false).length,
    unmarked: checklist.filter((item) => item.passed === null).length,
  };
}

/** `INS-2044` after `INS-2043`, per property range. */
export function nextInspectionId(list: FsInspection[]) {
  const highest = list.reduce((max, inspection) => {
    const value = Number(inspection.id.replace("INS-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 2000);
  return `INS-${highest + 1}`;
}
