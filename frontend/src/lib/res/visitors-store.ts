"use client";

import { useSyncExternalStore } from "react";

import { longDate } from "@/lib/res/format";
import { pushResNotification } from "@/lib/res/notifications-store";
import {
  freeBay,
  visitorPasses,
  windowEnd,
  type VisitorPass,
} from "@/lib/res/visitors-data";

/**
 * The household's visitor passes.
 *
 * The resident raises and cancels; the gate does the rest. There is deliberately
 * no check-in or check-out here — that is the security officer's job, and a
 * resident marking their own guest as arrived would defeat the point of a gate.
 */

let passes: VisitorPass[] = visitorPasses;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 1185;

export function registerVisitor({
  name,
  phone,
  date,
  arriving,
  purpose,
  vehicle,
  parking,
}: {
  name: string;
  phone: string;
  date: string;
  arriving: string;
  purpose: string;
  vehicle: string | null;
  parking: boolean;
}): VisitorPass {
  // Only held when one is actually asked for, and only if the day has one left.
  const bay = parking ? freeBay(date, passes) : null;

  const pass: VisitorPass = {
    id: `VP-2026-${nextNumber++}`,
    name: name.trim(),
    phone: phone.trim(),
    date,
    arriving,
    leaving: windowEnd(arriving),
    purpose,
    vehicle: vehicle?.trim() ? vehicle.trim() : null,
    bay,
    status: "Approved",
  };

  passes = [pass, ...passes];
  emit();

  pushResNotification(
    "Visitor",
    "Visitor Pass Created",
    `${pass.name} · ${longDate(date)} · pass ${pass.id}.`,
  );

  return pass;
}

export function cancelVisitorPass(id: string) {
  const pass = passes.find((entry) => entry.id === id);
  if (!pass) return;

  passes = passes.map((entry) =>
    entry.id === id ? { ...entry, status: "Cancelled", bay: null } : entry,
  );
  emit();

  pushResNotification(
    "Visitor",
    "Visitor Pass Cancelled",
    `${pass.name} · ${longDate(pass.date)} · pass ${pass.id} withdrawn.`,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return passes;
}

function getServerSnapshot() {
  return visitorPasses;
}

export function useResVisitors() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
