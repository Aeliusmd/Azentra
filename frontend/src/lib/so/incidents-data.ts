import { TODAY } from "@/lib/so/visitors-data";

/**
 * The incident register.
 *
 * A report is written once and then only moves forward: a guard records what
 * happened, and the status is the only thing that changes afterwards. Nothing
 * here edits the account of an event after the fact — an incident log that can
 * be rewritten is not a log.
 */

export const INCIDENT_SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;
export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

/**
 * Where a report stands.
 *
 * `Investigating` is the only open state — it is what the dashboard counts.
 * `Resolved` means the thing that happened has been put right; `Closed` means
 * the report is finished with, whether or not anything was fixed.
 */
export const INCIDENT_STATUSES = [
  "Investigating",
  "Resolved",
  "Closed",
] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type Incident = {
  id: string;
  propertyId: string;
  /** What kind of thing happened, in the reporting officer's words. */
  type: string;
  description: string;
  /** ISO day and 24-hour `HH:MM` the event happened — not when it was filed. */
  date: string;
  time: string;
  location: string;
  /** Names, as given. Empty where nobody was identified. */
  peopleInvolved: string;
  /** What the officer did about it at the time. */
  actionTaken: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  /**
   * When the report was signed off, and what was said at the time.
   *
   * Stored as the text to display rather than a timestamp: it is stamped once,
   * on the client, at the moment a guard closes the report — so there is
   * nothing for the server and the browser to format differently.
   */
  settledAt: string | null;
  settlementNotes: string;
};

export const incidents: Incident[] = [
  {
    id: "INC-001",
    propertyId: "sunrise",
    type: "Unauthorized Access",
    description:
      "Individual attempted to follow a resident through the main gate without presenting a pass. Escorted off the property; description circulated to the night shift.",
    date: "2026-08-06",
    time: "23:45",
    location: "Tower A - Main Gate",
    peopleInvolved: "Unidentified male, approx. 30s",
    actionTaken: "Escorted off site and gate footage retained.",
    severity: "High",
    status: "Investigating",
    reportedBy: "Michael Brown",
    settledAt: null,
    settlementNotes: "",
  },
  {
    id: "INC-002",
    propertyId: "sunrise",
    type: "Noise Complaint",
    description:
      "Multiple residents reported loud music and party noise from Unit B-607 after quiet hours (11 PM).",
    date: "2026-08-07",
    time: "01:30",
    location: "Tower B - Unit 607",
    peopleInvolved: "Residents from Units B-605, B-608, B-610",
    actionTaken:
      "Security visited the unit and issued a warning. Noise stopped after warning.",
    severity: "Medium",
    status: "Resolved",
    reportedBy: "Michael Brown",
    settledAt: "8/7/2026, 2:00:00 AM",
    settlementNotes: "Warning issued. No further complaints received.",
  },
  {
    id: "INC-003",
    propertyId: "sunrise",
    type: "Theft",
    description:
      "Resident reported that their bicycle was taken from the gym rack between 12:00 and 14:00. Rack is outside camera coverage.",
    date: "2026-08-05",
    time: "14:00",
    location: "Common Area - Gym",
    peopleInvolved: "Resident of A-1103",
    actionTaken: "Statement taken; adjacent camera footage pulled for review.",
    severity: "High",
    status: "Investigating",
    reportedBy: "Michael Brown",
    settledAt: null,
    settlementNotes: "",
  },
  {
    id: "INC-004",
    propertyId: "sunrise",
    type: "Property Damage",
    description:
      "Vehicle scratched the pillar reversing out of bay P-004. Driver reported it themselves at the barrier.",
    date: "2026-08-04",
    time: "09:15",
    location: "Parking Level G1 - Slot P-004",
    peopleInvolved: "Visitor driver, plate TX-2GH-6678",
    actionTaken: "Details recorded and passed to the Property Manager.",
    severity: "Low",
    status: "Resolved",
    reportedBy: "Michael Brown",
    settledAt: "8/4/2026, 10:30:00 AM",
    settlementNotes:
      "Driver details passed to the Property Manager for the pillar repair.",
  },
  {
    id: "INC-005",
    propertyId: "sunrise",
    type: "Emergency - Medical",
    description:
      "Elderly resident fell in the lobby and could not get up. Paramedics called and attended within twelve minutes.",
    date: "2026-08-03",
    time: "11:45",
    location: "Tower C - Lobby",
    peopleInvolved: "Resident of C-1202",
    actionTaken: "Ambulance called; ramp kept clear and lift held.",
    severity: "Critical",
    status: "Closed",
    reportedBy: "Michael Brown",
    settledAt: "8/3/2026, 12:20:00 PM",
    settlementNotes:
      "Resident taken to hospital by ambulance. Family notified by the Property Manager.",
  },
  {
    id: "INC-006",
    propertyId: "sunrise",
    type: "Fire Alarm",
    description:
      "Fire alarm triggered in unit 804 by burnt cooking. Floor checked and panel reset by the duty engineer.",
    date: "2026-08-02",
    time: "19:20",
    location: "Tower A - Floor 8",
    peopleInvolved: "Occupant of A-804",
    actionTaken: "Floor swept, no fire found, panel reset.",
    severity: "Medium",
    status: "Closed",
    reportedBy: "Michael Brown",
    settledAt: "8/2/2026, 8:05:00 PM",
    settlementNotes: "No fire found. Panel reset by the duty engineer.",
  },
  {
    id: "INC-007",
    propertyId: "green-valley",
    type: "Noise Disturbance",
    description:
      "Gathering on the Block 1 roof terrace running past the 22:00 curfew. Group dispersed without incident.",
    date: "2026-08-06",
    time: "22:40",
    location: "Block 1 - Roof Terrace",
    peopleInvolved: "Approx. eight residents and guests",
    actionTaken: "Group asked to move indoors; terrace locked for the night.",
    severity: "Low",
    status: "Investigating",
    reportedBy: "Michael Brown",
    settledAt: null,
    settlementNotes: "",
  },
  {
    id: "INC-008",
    propertyId: "green-valley",
    type: "Fire Alarm Fault",
    description:
      "Stairwell 3 detector reporting a fault on the panel. Silenced and logged for the engineer.",
    date: "2026-08-04",
    time: "11:48",
    location: "Block 2 - Stairwell 3",
    peopleInvolved: "",
    actionTaken: "Panel silenced; call-out raised with the fire contractor.",
    severity: "Medium",
    status: "Resolved",
    reportedBy: "Michael Brown",
    settledAt: "8/4/2026, 1:15:00 PM",
    settlementNotes:
      "Detector replaced by the fire contractor on the same day.",
  },
];

export function incidentsAt(propertyId: string, list: Incident[]) {
  return list.filter((incident) => incident.propertyId === propertyId);
}

/** Still being worked — the figure the dashboard shows as "Open Incidents". */
export function openIncidents(list: Incident[]) {
  return list.filter((incident) => incident.status === "Investigating");
}

/** Free-text match across the fields a guard would type into the box. */
export function matchesIncidentQuery(incident: Incident, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [
    incident.id,
    incident.type,
    incident.description,
    incident.location,
    incident.peopleInvolved,
  ].some((field) => field.toLowerCase().includes(needle));
}

/** The day a new report defaults to — the portal's own today, not the browser's. */
export const INCIDENT_DEFAULT_DATE = TODAY;
