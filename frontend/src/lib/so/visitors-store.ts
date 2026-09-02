"use client";

import { useSyncExternalStore } from "react";

import { pushSoNotification } from "@/lib/so/notifications-store";
import { showSoToast } from "@/lib/so/toast-store";
import {
  soVisits,
  TODAY,
  type SoIdType,
  type SoVehicle,
  type SoVisit,
} from "@/lib/so/visitors-data";

/**
 * The gate's copy of the visit log.
 *
 * Four writes, and they are the four things a guard is actually allowed to do:
 * clear a request, turn one away, admit somebody, and see them off. Everything
 * else about a visit — who raised it, which unit it is for — was decided before
 * it reached this desk and is read-only here.
 */

let visits: SoVisit[] = soVisits;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * The wall clock, as `HH:MM`.
 *
 * Read at the moment of the action rather than rendered, so no stamp is ever
 * produced on the server and there is nothing for hydration to disagree about.
 */
function now() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function update(id: string, patch: Partial<SoVisit>) {
  visits = visits.map((visit) =>
    visit.id === id ? { ...visit, ...patch } : visit,
  );
  emit();
}

function find(id: string) {
  return visits.find((visit) => visit.id === id) ?? null;
}

/** Clears a pending request for entry. */
export function approveSoVisit(id: string) {
  const visit = find(id);
  if (!visit || visit.status !== "Pending") return;

  update(id, { status: "Approved" });
  pushSoNotification(
    "Expected Visitor",
    "Entry Approved",
    `${visit.name} is cleared for unit ${visit.unit} at ${visit.expectedAt}.`,
  );
  showSoToast(`${visit.name} approved`);
}

/** Turns a pending request away. The record stays — a refusal is a log entry. */
export function rejectSoVisit(id: string) {
  const visit = find(id);
  if (!visit || visit.status !== "Pending") return;

  update(id, { status: "Rejected" });
  pushSoNotification(
    "Incident",
    "Entry Rejected",
    `${visit.name} was refused entry to unit ${visit.unit}.`,
  );
  showSoToast(`${visit.name} rejected`);
}

/** Admits a cleared visitor and stamps the arrival. */
export function checkInSoVisit(id: string) {
  const visit = find(id);
  if (!visit || visit.status !== "Approved") return;

  const at = now();
  update(id, { status: "Checked In", checkedInAt: at });
  pushSoNotification(
    "Expected Visitor",
    "Visitor Checked In",
    `${visit.name} entered at ${at} · pass ${visit.passCode}.`,
  );
  showSoToast(`${visit.name} checked in · ${at}`);
}

/** Sees an admitted visitor off and stamps the departure. */
export function checkOutSoVisit(id: string) {
  const visit = find(id);
  if (!visit || visit.status !== "Checked In") return;

  const at = now();
  update(id, { status: "Checked Out", checkedOutAt: at });
  pushSoNotification(
    "Expected Visitor",
    "Visitor Checked Out",
    `${visit.name} left at ${at} · pass ${visit.passCode}.`,
  );
  showSoToast(`${visit.name} checked out · ${at}`);
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 211;

/**
 * Registers a caller who turned up without a pass.
 *
 * Lands `Approved` rather than `Checked In`: the guard has taken their details,
 * not yet opened the barrier, so the visit still passes through the check-in
 * queue like any other.
 */
export function registerSoVisitor({
  propertyId,
  name,
  phone,
  idType,
  idNumber,
  resident,
  unit,
  purpose,
  vehicle,
}: {
  propertyId: string;
  name: string;
  phone: string;
  idType: SoIdType;
  idNumber: string;
  resident: string;
  unit: string;
  purpose: string;
  vehicle: SoVehicle | null;
}): SoVisit {
  const sequence = nextNumber++;

  const visit: SoVisit = {
    id: `V-2026-0${sequence}`,
    propertyId,
    name: name.trim(),
    phone: phone.trim(),
    idType,
    idNumber: idNumber.trim(),
    resident: resident.trim(),
    unit: unit.trim(),
    date: TODAY,
    expectedAt: now(),
    purpose: purpose.trim() || "Personal Visit",
    vehicle,
    passCode: `VP-${String(sequence).padStart(3, "0")}-W${sequence % 10}`,
    checkedInAt: null,
    checkedOutAt: null,
    status: "Approved",
  };

  visits = [...visits, visit];
  emit();

  pushSoNotification(
    "Expected Visitor",
    "Visitor Registered",
    `${visit.name} registered at the gate for unit ${visit.unit}.`,
  );
  showSoToast(`${visit.name} registered · pass ${visit.passCode}`);

  return visit;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return visits;
}

function getServerSnapshot() {
  return soVisits;
}

export function useSoVisits() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
