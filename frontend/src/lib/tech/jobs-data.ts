import type { PillTone } from "@/components/pm/ui/pill";

/**
 * The jobs assigned to the signed-in technician. Mock data — swap for a
 * `src/lib/api.ts` call when the backend lands.
 *
 * A technician only ever sees their own work, so there is no assignee field and
 * nothing here can reassign a job.
 */

export const JOB_STATUSES = [
  "Assigned",
  "Accepted",
  "In Progress",
  "Waiting Material",
  "On Hold",
  "Completed",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_TONE: Record<JobStatus, PillTone> = {
  Assigned: "navy",
  Accepted: "green",
  "In Progress": "amber",
  "Waiting Material": "purple",
  "On Hold": "slate",
  Completed: "green",
};

export const JOB_PRIORITIES = ["Low", "Medium", "High", "Emergency"] as const;
export type JobPriority = (typeof JOB_PRIORITIES)[number];

export const JOB_PRIORITY_TONE: Record<JobPriority, PillTone> = {
  Low: "slate",
  Medium: "navy",
  High: "amber",
  Emergency: "red",
};

/** Trailing dot on a job row — priority at a glance. */
export const JOB_PRIORITY_DOT: Record<JobPriority, string> = {
  Low: "bg-[#2e6cad]",
  Medium: "bg-[#e8a33d]",
  High: "bg-[#e07b39]",
  Emergency: "bg-[#e0554d]",
};

export const JOB_CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Carpentry",
  "Equipment",
  "Safety",
] as const;
export type JobCategory = (typeof JOB_CATEGORIES)[number];

/** Reasons offered when a technician cannot take a job. */
export const REJECT_REASONS = [
  "Already assigned to another job",
  "Missing tools or parts",
  "Needs a specialist",
  "Outside my working hours",
  "Safety concern",
  "Other",
] as const;

/** Units a material can be recorded in. */
export const MATERIAL_UNITS = [
  "unit",
  "pcs",
  "canister",
  "litre",
  "metre",
  "box",
  "kg",
  "roll",
] as const;
export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

export type JobNote = {
  id: string;
  /** `HH:MM` on the day it was written. */
  time: string;
  text: string;
};

export type JobMaterial = {
  id: string;
  name: string;
  quantity: number;
  unit: MaterialUnit;
  note?: string;
};

export type JobLabour = {
  id: string;
  /** 24h `HH:MM`. */
  start: string;
  end: string;
  /** Total worked, in minutes. */
  minutes: number;
};

/** The three evidence slots a technician fills as work progresses. */
export const PHOTO_SLOTS = ["Before", "During", "After"] as const;
export type PhotoSlot = (typeof PHOTO_SLOTS)[number];

export type JobPhoto = {
  /** Object URL for the picked file — frontend only, no upload happens. */
  url: string;
  name: string;
  caption: string;
};

/** How the job stood when the technician closed it out. */
export const JOB_RESULTS = [
  "Fully Resolved",
  "Temporarily Resolved",
  "Further Work Required",
] as const;
export type JobResult = (typeof JOB_RESULTS)[number];

export type JobCompletion = {
  workPerformed: string;
  rootCause: string;
  notes: string;
  result: JobResult;
};

/** One entry in a job's history — raised, prioritised, assigned, worked. */
export type JobEvent = {
  /** `YYYY-MM-DD HH:MM`. */
  time: string;
  label: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  /** Unit, common area or plant room, e.g. "Unit A-304". */
  unit: string;
  floor: string;
  building: string;
  category: JobCategory;
  priority: JobPriority;
  status: JobStatus;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** Display time, e.g. "10:30 AM". */
  time: string;
  /** 0–100, only meaningful once work has started. */
  progress: number;
  requester: string;
  /** "Resident", "Building Staff" — who raised the job. */
  requesterRole: string;
  /** The supervisor who put this job on the technician's list. */
  assignedBy: string;
  timeline: JobEvent[];
  notes: JobNote[];
  materials: JobMaterial[];
  labour: JobLabour[];
  photos: Partial<Record<PhotoSlot, JobPhoto>>;
  /** Anything the manager wants done a particular way. */
  instructions?: string;
  /** Filled in by the completion form. */
  completion?: JobCompletion;
  /** Set when the technician tells the supervisor they can't take the job. */
  declineReason?: string;
  /** Set when the technician flags the job for supervisor attention. */
  escalation?: string;
};

/** "Unit A-304, Tower A" — the one-line place a job happens. */
export function jobLocation(job: Job) {
  return `${job.unit}, ${job.building}`;
}

/** "Tower A / 3rd Floor / A-304" — the full path, for the detail view. */
export function jobLocationPath(job: Job) {
  return `${job.building} / ${job.floor} / ${job.unit.replace(/^Unit /, "")}`;
}

/** "09:00" -> "09:00 AM". */
export function formatClock(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/** Minutes between two 24h `HH:MM` values; negative spans wrap past midnight. */
export function minutesBetween(start: string, end: string) {
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const span = toMinutes(end) - toMinutes(start);
  return span < 0 ? span + 24 * 60 : span;
}

/** 120 -> "2h 0m". */
export function durationLabel(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** Total labour logged against a job. */
export function totalLabourMinutes(job: Job) {
  return job.labour.reduce((sum, entry) => sum + entry.minutes, 0);
}

const SUPERVISOR = "Carlos Rivera";

/** The work log starts empty on jobs that have not been touched yet. */
type JobSeed = Omit<Job, "notes" | "materials" | "labour" | "photos"> &
  Partial<Pick<Job, "notes" | "materials" | "labour" | "photos">>;

const seed: JobSeed[] = [
  {
    id: "MT-1045",
    title: "Water Leakage",
    description:
      "Water dripping from bathroom ceiling since yesterday evening. The ceiling paint is peeling and there is a small puddle on the floor every morning. Please inspect the pipe above the bathroom ceiling.",
    unit: "Unit A-304",
    floor: "3rd Floor",
    building: "Tower A",
    category: "Plumbing",
    priority: "Emergency",
    status: "Assigned",
    date: "2026-08-11",
    time: "10:30 AM",
    progress: 0,
    requester: "John Doe",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    instructions:
      "Shut off the riser before opening the ceiling panel. Notify the unit below before starting.",
    timeline: [
      { time: "2026-08-06 08:15", label: "Request created by John Doe" },
      {
        time: "2026-08-10 16:40",
        label: "Priority raised to Emergency by James Wilson",
      },
      { time: "2026-08-11 08:00", label: `Assigned to you by ${SUPERVISOR}` },
    ],
  },
  {
    id: "MT-1044",
    title: "AC Not Cooling",
    description:
      "The air conditioning unit in the living room is blowing warm air. Temperature stays around 28C despite setting to 22C. Possible refrigerant leak or compressor issue.",
    unit: "Unit B-204",
    floor: "2nd Floor",
    building: "Tower B",
    category: "HVAC",
    priority: "High",
    status: "In Progress",
    date: "2026-08-11",
    time: "09:00 AM",
    progress: 45,
    requester: "Sarah Johnson",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    instructions: "Check gas pressure before replacing any parts.",
    timeline: [
      { time: "2026-08-05 14:20", label: "Request created by Sarah Johnson" },
      { time: "2026-08-05 15:00", label: "Reviewed by Property Manager" },
      { time: "2026-08-05 15:30", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-06 09:00", label: "Job started" },
    ],
    notes: [
      {
        id: "MT-1044-n1",
        time: "09:00",
        text: "Arrived at location and began inspection",
      },
      {
        id: "MT-1044-n2",
        time: "09:30",
        text: "Found low refrigerant level, possible leak detected",
      },
      {
        id: "MT-1044-n3",
        time: "10:15",
        text: "Recharged refrigerant and monitoring pressure",
      },
    ],
    materials: [
      {
        id: "MT-1044-m1",
        name: "R-410A Refrigerant",
        quantity: 1,
        unit: "canister",
      },
      { id: "MT-1044-m2", name: "AC Filter", quantity: 1, unit: "unit" },
    ],
    labour: [{ id: "MT-1044-l1", start: "09:00", end: "11:00", minutes: 120 }],
  },
  {
    id: "MT-1042",
    title: "Water Heater Malfunction",
    description:
      "Water heater has stopped producing hot water. Thermostat resets after a few minutes of operation.",
    unit: "Unit C-102",
    floor: "1st Floor",
    building: "Tower C",
    category: "Plumbing",
    priority: "Emergency",
    status: "In Progress",
    date: "2026-08-11",
    time: "07:30 AM",
    progress: 60,
    requester: "Kevin Anderson",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    instructions: "Isolate power at the unit board before opening the casing.",
    timeline: [
      { time: "2026-08-10 18:30", label: "Request created by Kevin Anderson" },
      { time: "2026-08-10 19:00", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-11 07:35", label: "Job started" },
    ],
    notes: [
      {
        id: "MT-1042-n1",
        time: "08:10",
        text: "Thermostat replaced. Running a full heat cycle to confirm.",
      },
    ],
    materials: [
      {
        id: "MT-1042-m1",
        name: "Immersion Thermostat 240V",
        quantity: 1,
        unit: "unit",
      },
    ],
    labour: [{ id: "MT-1042-l1", start: "07:30", end: "09:30", minutes: 120 }],
  },
  {
    id: "MT-1040",
    title: "Bedroom Power Outlets Not Working",
    description:
      "Both bedroom outlets are dead. The rest of the unit has power, so likely a tripped spur or loose connection.",
    unit: "Unit B-102",
    floor: "1st Floor",
    building: "Tower B",
    category: "Electrical",
    priority: "Medium",
    status: "Accepted",
    date: "2026-08-11",
    time: "02:00 PM",
    progress: 0,
    requester: "Amanda Clark",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    timeline: [
      { time: "2026-08-09 14:05", label: "Request created by Amanda Clark" },
      { time: "2026-08-10 08:45", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-10 17:20", label: "Accepted by you" },
    ],
  },
  {
    id: "MT-1039",
    title: "Intercom System Repair",
    description:
      "Door intercom does not ring through to the unit. Handset replacement ordered from the supplier.",
    unit: "Unit A-201",
    floor: "2nd Floor",
    building: "Tower A",
    category: "Electrical",
    priority: "Medium",
    status: "Waiting Material",
    date: "2026-08-08",
    time: "10:00 AM",
    progress: 30,
    requester: "Emily Davis",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    instructions: "Handset model IC-220 is on order — ETA Aug 13.",
    timeline: [
      { time: "2026-08-07 11:30", label: "Request created by Emily Davis" },
      { time: "2026-08-07 15:00", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-08 10:05", label: "Job started" },
      { time: "2026-08-08 12:40", label: "Paused — handset IC-220 ordered" },
    ],
    notes: [
      {
        id: "MT-1039-n1",
        time: "12:35",
        text: "Wiring tested good. Handset itself is faulty — replacement ordered.",
      },
    ],
    materials: [
      {
        id: "MT-1039-m1",
        name: "Intercom Handset X200",
        quantity: 1,
        unit: "unit",
      },
      { id: "MT-1039-m2", name: "RJ45 Connectors", quantity: 4, unit: "unit" },
    ],
  },
  {
    id: "MT-1038",
    title: "Lobby Chandelier Bulb Replacement",
    description:
      "Four bulbs out on the main lobby chandelier. Scissor lift booked for the early slot.",
    unit: "Main Lobby",
    floor: "Ground Floor",
    building: "Tower A",
    category: "Electrical",
    priority: "Low",
    status: "Completed",
    date: "2026-08-09",
    time: "06:00 AM",
    progress: 100,
    requester: "Building Staff",
    requesterRole: "Staff",
    assignedBy: SUPERVISOR,
    timeline: [
      { time: "2026-08-05 09:00", label: "Request created by Building Staff" },
      { time: "2026-08-06 08:30", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-09 06:05", label: "Job started" },
      { time: "2026-08-09 07:40", label: "Marked complete by you" },
      { time: "2026-08-09 17:45", label: "Approved by James Wilson" },
    ],
  },
  {
    id: "MT-1035",
    title: "Smoke Detector Replacement",
    description:
      "Smoke detector beeping intermittently and failed the last test. Unit replaced with the same model.",
    unit: "Unit C-301",
    floor: "3rd Floor",
    building: "Tower C",
    category: "Safety",
    priority: "Medium",
    status: "Completed",
    date: "2026-08-02",
    time: "09:00 AM",
    progress: 100,
    requester: "Sophia Thomas",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    timeline: [
      { time: "2026-07-31 13:10", label: "Request created by Sophia Thomas" },
      { time: "2026-08-01 09:00", label: `Assigned to you by ${SUPERVISOR}` },
      { time: "2026-08-02 09:10", label: "Job started" },
      { time: "2026-08-02 10:25", label: "Marked complete by you" },
    ],
  },
  {
    id: "MT-1032",
    title: "Kitchen Sink Drain Clogged",
    description:
      "Slow draining kitchen sink. Mechanical snake plus enzymatic treatment needed.",
    unit: "Unit A-103",
    floor: "1st Floor",
    building: "Tower A",
    category: "Plumbing",
    priority: "Medium",
    status: "Assigned",
    date: "2026-08-12",
    time: "11:00 AM",
    progress: 0,
    requester: "Michael Brown",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    timeline: [
      { time: "2026-08-08 19:20", label: "Request created by Michael Brown" },
      { time: "2026-08-11 08:10", label: `Assigned to you by ${SUPERVISOR}` },
    ],
  },
  {
    id: "MT-1046",
    title: "Balcony Door Lock Repair",
    description:
      "Balcony sliding door lock does not engage. Latch alignment needs adjusting.",
    unit: "Unit B-101",
    floor: "1st Floor",
    building: "Tower B",
    category: "Carpentry",
    priority: "Low",
    status: "Assigned",
    date: "2026-08-12",
    time: "03:00 PM",
    progress: 0,
    requester: "Daniel Okafor",
    requesterRole: "Resident",
    assignedBy: SUPERVISOR,
    timeline: [
      { time: "2026-08-10 12:00", label: "Request created by Daniel Okafor" },
      { time: "2026-08-11 08:20", label: `Assigned to you by ${SUPERVISOR}` },
    ],
  },
];

export const assignedJobs: Job[] = seed.map((job) => ({
  notes: [],
  materials: [],
  labour: [],
  photos: {},
  ...job,
}));
