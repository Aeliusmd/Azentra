import {
  Clock,
  LogIn,
  LogOut,
  Siren,
  SquareParking,
  Hourglass,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";

import {
  incidentsAt,
  openIncidents,
  type Incident,
} from "@/lib/so/incidents-data";
import { countSlots, slotsAt, type ParkingSlot } from "@/lib/so/parking-data";
import {
  awaitingApproval,
  checkedOut,
  expectedLater,
  insideProperty,
  visitsAt,
  visitsOn,
  type SoVisit,
} from "@/lib/so/visitors-data";

/**
 * What the gate looks like right now.
 *
 * Nothing here is hand-counted: every tile is derived from the visit log and
 * the bay map, so a figure can never disagree with the rows underneath it.
 * Swapping the property in the header re-runs the same derivations against
 * that site's records.
 */

/* -------------------------------------------------------------------------- */
/* Emergency alerts                                                            */
/* -------------------------------------------------------------------------- */

export const ALERT_STATUSES = ["active", "responding", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export type EmergencyAlert = {
  id: string;
  propertyId: string;
  /** What kind of emergency, as the notice board names it. */
  type: string;
  detail: string;
  /** Where, in the words the officer would radio in. */
  location: string;
  status: AlertStatus;
  /** How the card is tinted — the seriousness, not the age. */
  tone: "amber" | "rose" | "blue";
  raisedAt: string;
};

export const emergencyAlerts: EmergencyAlert[] = [
  {
    id: "EA-2026-0071",
    propertyId: "sunrise",
    type: "Security Threat",
    detail:
      "Suspicious individual observed loitering near Tower B entrance for over 2 hours. Not a resident or registered visitor.",
    location: "Tower B - Main Entrance",
    status: "active",
    tone: "amber",
    raisedAt: "15:40",
  },
  {
    id: "EA-2026-0070",
    propertyId: "sunrise",
    type: "Medical Emergency",
    detail:
      "Resident in Tower C reported chest pain. Immediate medical attention required.",
    location: "Tower C - Unit 1202",
    status: "responding",
    tone: "rose",
    raisedAt: "15:12",
  },
  {
    id: "EA-2026-0069",
    propertyId: "sunrise",
    type: "Severe Weather",
    detail:
      "Severe thunderstorm warning issued by local authorities. High winds and heavy rain expected.",
    location: "Entire Property",
    status: "active",
    tone: "blue",
    raisedAt: "13:05",
  },
  {
    id: "EA-2026-0068",
    propertyId: "green-valley",
    type: "Fire Alarm Fault",
    detail:
      "Block 2 stairwell detector reporting a fault. Panel silenced, engineer called out.",
    location: "Block 2 - Stairwell 3",
    status: "responding",
    tone: "amber",
    raisedAt: "11:48",
  },
];

export function alertsAt(
  propertyId: string,
  alerts: EmergencyAlert[] = emergencyAlerts,
) {
  return alerts.filter((alert) => alert.propertyId === propertyId);
}

/* -------------------------------------------------------------------------- */
/* Tiles                                                                       */
/* -------------------------------------------------------------------------- */

export type SoStatTone = "blue" | "slate" | "green" | "amber" | "teal" | "rose";

export type SoStat = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: SoStatTone;
};

/**
 * The seven figures across the top.
 *
 * `Today's Visitors` is every visit falling on the current day whatever became
 * of it, and `Expected` is what is cleared for the days after — so the two
 * count different visits and a caller is never in both.
 */
export function dashboardStats(
  propertyId: string,
  visits: SoVisit[],
  slots: ParkingSlot[],
  incidents: Incident[],
): SoStat[] {
  const mine = visitsAt(propertyId, visits);
  const bays = slotsAt(propertyId, slots);
  const reports = incidentsAt(propertyId, incidents);

  return [
    {
      label: "Today's Visitors",
      value: visitsOn(mine).length,
      icon: UserRoundSearch,
      tone: "blue",
    },
    {
      label: "Expected",
      value: expectedLater(mine).length,
      icon: Clock,
      tone: "slate",
    },
    {
      label: "Checked In",
      value: insideProperty(mine).length,
      icon: LogIn,
      tone: "green",
    },
    {
      label: "Checked Out",
      value: checkedOut(mine).length,
      icon: LogOut,
      tone: "slate",
    },
    {
      label: "Pending",
      value: awaitingApproval(mine).length,
      icon: Hourglass,
      tone: "amber",
    },
    {
      label: "Active Parking",
      value: countSlots(bays, "Occupied"),
      icon: SquareParking,
      tone: "teal",
    },
    {
      label: "Open Incidents",
      value: openIncidents(reports).length,
      icon: Siren,
      tone: "rose",
    },
  ];
}
