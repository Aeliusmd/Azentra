"use client";

import { useSyncExternalStore } from "react";

import {
  incidents as seed,
  type Incident,
  type IncidentSeverity,
  type IncidentStatus,
} from "@/lib/so/incidents-data";
import { pushSoNotification } from "@/lib/so/notifications-store";
import { securityOfficer, soFullName } from "@/lib/so/officer";
import { showSoToast } from "@/lib/so/toast-store";

/**
 * The register, live.
 *
 * Two writes: filing a report and moving its status on. There is deliberately
 * no edit — the account of what happened is fixed at the moment it is written,
 * and a correction is a new report rather than a rewrite of the old one.
 */

let list: Incident[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 9;

export function createSoIncident({
  propertyId,
  type,
  date,
  time,
  location,
  description,
  peopleInvolved,
  actionTaken,
  severity,
}: {
  propertyId: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  peopleInvolved: string;
  actionTaken: string;
  severity: IncidentSeverity;
}): Incident {
  const incident: Incident = {
    id: `INC-${String(nextNumber++).padStart(3, "0")}`,
    propertyId,
    type: type.trim(),
    description: description.trim(),
    date,
    time,
    location: location.trim(),
    peopleInvolved: peopleInvolved.trim(),
    actionTaken: actionTaken.trim(),
    severity,
    // A report opens under investigation — filing one is not the end of it.
    status: "Investigating",
    reportedBy: soFullName(securityOfficer),
    settledAt: null,
    settlementNotes: "",
  };

  list = [incident, ...list];
  emit();

  pushSoNotification(
    "Incident",
    "Incident Reported",
    `${incident.id} · ${incident.type} at ${incident.location}.`,
  );
  showSoToast(`${incident.id} reported`);

  return incident;
}

/**
 * Signs a report off. Only an open one can move.
 *
 * The sign-off is stamped here rather than rendered, so the timestamp is
 * written once — on the client, at the moment the guard presses the button —
 * and never formatted twice into two different strings.
 */
export function setSoIncidentStatus(
  id: string,
  status: IncidentStatus,
  notes = "",
) {
  const incident = list.find((entry) => entry.id === id);
  if (!incident || incident.status !== "Investigating") return;

  const settledAt = new Date().toLocaleString();

  list = list.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          status,
          settledAt,
          settlementNotes:
            notes.trim() ||
            `${status} by ${soFullName(securityOfficer)} at the gate.`,
        }
      : entry,
  );
  emit();

  pushSoNotification(
    "Incident",
    `Incident ${status}`,
    `${incident.id} · ${incident.type} marked ${status.toLowerCase()}.`,
  );
  showSoToast(`${incident.id} ${status.toLowerCase()}`);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return list;
}

function getServerSnapshot() {
  return seed;
}

export function useSoIncidents() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
